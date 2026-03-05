const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');

/**
 * @swagger
 * /api/sliders:
 *   get:
 *     summary: Lấy danh sách tất cả sliders
 *     tags: [Sliders]
 *     description: API lấy tất cả các slider đang có trong hệ thống
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
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
 *                   example: Lấy dữ liệu thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Slider'
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', sliderController.getAllSliders);

/**
 * @swagger
 * /api/sliders:
 *   post:
 *     summary: Tạo mới một slider
 *     tags: [Sliders]
 *     description: API thêm slider mới vào hệ thống
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image_url
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của slider
 *                 example: "Khuyến mãi mùa hè 2024"
 *               image_url:
 *                 type: string
 *                 description: URL hình ảnh
 *                 example: "https://example.com/banner.jpg"
 *               link_url:
 *                 type: string
 *                 description: URL liên kết
 *                 example: "https://example.com/sale"
 *               display_order:
 *                 type: integer
 *                 description: Thứ tự hiển thị
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *                 example: true
 *     responses:
 *       201:
 *         description: Thêm slider thành công
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
 *                   example: Thêm Slider mới thành công!
 *                 data:
 *                   $ref: '#/components/schemas/Slider'
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Thiếu thông tin bắt buộc title hoặc image_url
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', sliderController.createSlider);


module.exports = router;