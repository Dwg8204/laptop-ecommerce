const express = require('express');
const router = express.Router();
const authAdminController = require('../controllers/authAdminController');

/**
 * @route GET /api/auth/admin/users
 * @description Lấy danh sách người dùng hệ thống (admin, staff)
 * @role admin only
 */
router.get('/users', authAdminController.getSystemUsers);

/**
 * @route POST /api/auth/admin/users
 * @description Tạo tài khoản nhân viên mới
 * @body { name, email, phone, password, role }
 * @role admin chỉ
 */
router.post('/users', authAdminController.createStaff);

router.get('/customers', authAdminController.getCustomers);
router.patch('/customers/:id/status', authAdminController.updateCustomerStatus);

router.get('/reviews', authAdminController.getProductReviews);
router.delete('/reviews/:id', authAdminController.deleteProductReview);

module.exports = router;
