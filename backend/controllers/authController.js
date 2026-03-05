const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
    // API Đăng ký tài khoản mới
    register: async (req, res) => {
        try {
            const { email, password, full_name, phone_number } = req.body;

            console.log('📝 Register request:', { email, full_name, phone_number });

            // 1. Validate input
            if (!email || !password || !full_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc: email, password, full_name'
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email không hợp lệ'
                });
            }

            // Validate password length
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                });
            }

            // 2. Kiểm tra email đã tồn tại chưa
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email đã được đăng ký'
                });
            }

            // 3. Hash password
            console.log('🔐 Hashing password...');
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // 4. Tạo user mới
            console.log('👤 Creating user...');
            const userId = await User.create({
                email,
                password_hash,
                full_name,
                phone_number
            });
            console.log('✅ User created with ID:', userId);

            // 5. Gán role mặc định (customer = role_id 3)
            console.log('🎭 Assigning role...');
            try {
                await User.assignRole(userId, 3);
                console.log('✅ Role assigned');
            } catch (roleError) {
                console.error('❌ Role assignment error:', roleError.message);
                // Tiếp tục vì user đã được tạo, không cần rollback
                console.warn('⚠️ Continuing without role assignment');
            }

            // 6. Tạo JWT token
            console.log('🔑 Creating JWT token...');
            const token = jwt.sign(
                { user_id: userId, email },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );
            console.log('✅ Token created');

            // 7. Lấy thông tin user vừa tạo
            console.log('📋 Fetching user info...');
            const newUser = await User.findById(userId);
            
            if (!newUser) {
                console.error('❌ User not found after creation');
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi khi lấy thông tin user'
                });
            }
            console.log('✅ User info fetched');

            console.log('🎉 Registration successful');
            res.status(201).json({
                success: true,
                message: 'Đăng ký tài khoản thành công',
                data: {
                    user: newUser,
                    token
                }
            });
        } catch (error) {
            console.error('❌ Register error:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi đăng ký tài khoản',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // API Đăng nhập
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // 1. Validate input
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu email hoặc password'
                });
            }

            // 2. Tìm user theo email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            // 3. Kiểm tra status
            if (user.status !== 'ACTIVE') {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa'
                });
            }

            // 4. Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            // 5. Tạo JWT token
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            // 6. Lấy roles của user
            const roles = await User.getUserRoles(user.user_id);

            // 7. Loại bỏ password_hash khỏi response
            delete user.password_hash;

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user: {
                        ...user,
                        roles
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi đăng nhập'
            });
        }
    },
    getAllUserAdmin: async (req, res) => {
        try {
            const users = await User.getAllUserAdmin();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Error fetching admin users:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách người dùng hệ thống'
            });
        }
    }
};

module.exports = authController;
