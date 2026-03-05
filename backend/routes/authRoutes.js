const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [Authentication]
 *     description: Tạo tài khoản mới cho người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đăng nhập
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu (tối thiểu 6 ký tự)
 *                 example: "password123"
 *               full_name:
 *                 type: string
 *                 description: Họ và tên đầy đủ
 *                 example: "Nguyễn Văn A"
 *               phone_number:
 *                 type: string
 *                 description: Số điện thoại
 *                 example: "0901234567"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng ký tài khoản thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT token để authentication
 *       400:
 *         description: Thiếu thông tin hoặc dữ liệu không hợp lệ
 *       409:
 *         description: Email đã được đăng ký
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Authentication]
 *     description: Đăng nhập bằng email và password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đăng nhập
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT token
 *       400:
 *         description: Thiếu email hoặc password
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *       403:
 *         description: Tài khoản bị khóa
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/login', authController.login);

module.exports = router;
