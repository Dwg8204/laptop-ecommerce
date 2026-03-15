const User = require('../models/userModel');
const AuthAdmin = require('../models/authAdmin');
const Product = require('../models/productModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Ánh xạ role name sang role_id
const ROLE_MAP = {
	'admin': 1,
	'staff': 2
};

const getBearerToken = (authorizationHeader = '') => {
	if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) return null;
	return authorizationHeader.slice(7);
};

const ensureAdminAccess = async (req, res) => {
	const token = getBearerToken(req.headers.authorization);
	if (!token) {
		res.status(401).json({ success: false, message: 'Thiếu token xác thực' });
		return null;
	}

	let payload;
	try {
		payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
	} catch (error) {
		res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
		return null;
	}

	const roles = await User.getUserRoles(payload.user_id);
	const isAdmin = roles.some((role) => String(role.role_name || '').toLowerCase() === 'admin');
	if (!isAdmin) {
		res.status(403).json({ success: false, message: 'Nhân viên không có quyền sử dụng chức năng Người dùng hệ thống' });
		return null;
	}

	return payload;
};

const authAdminController = {
	// Lấy danh sách người dùng hệ thống
	getSystemUsers: async (req, res) => {
		try {
			const authUser = await ensureAdminAccess(req, res);
			if (!authUser) return;

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
			const authUser = await ensureAdminAccess(req, res);
			if (!authUser) return;

			const { name, email, phone, password, role } = req.body;
			const normalizedEmail = String(email || '').trim().toLowerCase();

			// Kiểm tra dữ liệu đầu vào
			if (!name || !normalizedEmail || !phone || !password || !role) {
				return res.status(400).json({
					success: false,
					message: 'Vui lòng cung cấp đầy đủ thông tin: name, email, phone, password, role'
				});
			}

			// Kiểm tra định dạng email hợp lệ (bắt buộc có phần miền như .com, .vn...)
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(normalizedEmail)) {
				return res.status(400).json({
					success: false,
					message: 'Email không hợp lệ'
				});
			}

			// Kiểm tra role hợp lệ
			const roleId = ROLE_MAP[role];
			if (!roleId) {
				return res.status(400).json({
					success: false,
					message: 'Role không hợp lệ. Chỉ chấp nhận: admin, staff'
				});
			}

			// Kiểm tra email đã tồn tại
			const existingUser = await User.findByEmail(normalizedEmail);
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
				email: normalizedEmail,
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
	},

	getCustomers: async (req, res) => {
		try {
			const authUser = await ensureAdminAccess(req, res);
			if (!authUser) return;

			const customers = await User.getAllCustomersWithStats();
			res.status(200).json({
				success: true,
				message: 'Lấy danh sách khách hàng thành công',
				data: customers
			});
		} catch (error) {
			console.error('Error getCustomers:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi khi lấy danh sách khách hàng'
			});
		}
	},

	updateCustomerStatus: async (req, res) => {
		try {
			const authUser = await ensureAdminAccess(req, res);
			if (!authUser) return;

			const userId = Number(req.params.id);
			const status = String(req.body.status || '').toUpperCase();

			if (!userId || userId <= 0) {
				return res.status(400).json({ success: false, message: 'ID khách hàng không hợp lệ' });
			}
			if (!['ACTIVE', 'LOCKED'].includes(status)) {
				return res.status(400).json({ success: false, message: 'Trạng thái chỉ chấp nhận ACTIVE hoặc LOCKED' });
			}

			const affectedRows = await User.updateUserStatus(userId, status);
			if (!affectedRows) {
				return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để cập nhật' });
			}

			res.status(200).json({
				success: true,
				message: 'Cập nhật trạng thái khách hàng thành công',
				data: { user_id: userId, status }
			});
		} catch (error) {
			console.error('Error updateCustomerStatus:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi khi cập nhật trạng thái khách hàng'
			});
		}
	},

	getProductReviews: async (req, res) => {
		try {
			const authUser = await ensureAdminAccess(req, res);
			if (!authUser) return;

			const reviews = await Product.getAllReviews();
			res.status(200).json({
				success: true,
				message: 'Lấy danh sách đánh giá thành công',
				data: reviews
			});
		} catch (error) {
			console.error('Error getProductReviews:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi khi lấy danh sách đánh giá'
			});
		}
	},

	deleteProductReview: async (req, res) => {
		try {
			const authUser = await ensureAdminAccess(req, res);
			if (!authUser) return;

			const reviewId = Number(req.params.id);
			if (!reviewId || reviewId <= 0) {
				return res.status(400).json({ success: false, message: 'ID đánh giá không hợp lệ' });
			}

			const affectedRows = await Product.deleteReviewById(reviewId);
			if (!affectedRows) {
				return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá để xóa' });
			}

			res.status(200).json({
				success: true,
				message: 'Đã xóa đánh giá thành công',
				data: { review_id: reviewId }
			});
		} catch (error) {
			console.error('Error deleteProductReview:', error);
			res.status(500).json({
				success: false,
				message: 'Lỗi khi xóa đánh giá'
			});
		}
	}
};

module.exports = authAdminController;
