const User = require('../models/userModel');
const AuthAdmin = require('../models/authAdmin');
const bcrypt = require('bcrypt');

// Ánh xạ role name sang role_id
const ROLE_MAP = {
	'admin': 1,
	'support': 2,
	'sales': 4,
	'warehouse': 5
};

const authAdminController = {
	// Lấy danh sách người dùng hệ thống
	getSystemUsers: async (req, res) => {
		try {
			const users = await User.getAllUserAdmin();

			res.status(200).json({
				success: true,
				message: 'Lấy danh sách người dùng hệ thống thành công',
				data: users
			});
		} catch (error) {
			console.error('Error getSystemUsers:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi khi lấy danh sách người dùng hệ thống'
			});
		}
	},

	// Tạo staff account mới
	createStaff: async (req, res) => {
		try {
			const { name, email, phone, password, role } = req.body;

			// Kiểm tra dữ liệu đầu vào
			if (!name || !email || !phone || !password || !role) {
				return res.status(400).json({
					success: false,
					message: 'Vui lòng cung cấp đầy đủ thông tin: name, email, phone, password, role'
				});
			}

			// Kiểm tra role hợp lệ
			const roleId = ROLE_MAP[role];
			if (!roleId) {
				return res.status(400).json({
					success: false,
					message: 'Role không hợp lệ. Chỉ chấp nhận: admin, support, sales, warehouse'
				});
			}

			// Kiểm tra email đã tồn tại
			const existingUser = await User.findByEmail(email);
			if (existingUser) {
				return res.status(409).json({
					success: false,
					message: 'Email đã được sử dụng'
				});
			}

			// Hash password
			const passwordHash = await bcrypt.hash(password, 10);

			// Tạo user mới
			const userId = await AuthAdmin.createStaff({
				email,
				password_hash: passwordHash,
				full_name: name,
				phone_number: phone
			});

			// Gán role cho user
			await AuthAdmin.assignRole(userId, roleId);

			// Lấy thông tin user vừa tạo
			const newUser = await AuthAdmin.getStaffById(userId);

			res.status(201).json({
				success: true,
				message: 'Tạo tài khoản nhân viên thành công',
				data: {
					id: userId,
					name: newUser.full_name,
					email: newUser.email,
					phone: newUser.phone_number,
					role: newUser.role_name
				}
			});
		} catch (error) {
			console.error('Error createStaff:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi khi tạo tài khoản nhân viên'
			});
		}
	}
};

module.exports = authAdminController;
