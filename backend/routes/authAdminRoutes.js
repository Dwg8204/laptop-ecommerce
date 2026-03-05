const express = require('express');
const router = express.Router();
const authAdminController = require('../controllers/authAdminController');

/**
 * @route GET /api/auth/admin/users
 * @description Lấy danh sách người dùng hệ thống (admin, support, sales, warehouse)
 */
router.get('/users', authAdminController.getSystemUsers);

/**
 * @route POST /api/auth/admin/users
 * @description Tạo tài khoản nhân viên mới
 * @body { name, email, phone, password, role }
 * @role admin chỉ
 */
router.post('/users', authAdminController.createStaff);

module.exports = router;
