const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadProduct = require('../middlewares/uploadProductImageMiddleware'); // Import middleware upload ảnh sản phẩm

// GET tất cả sản phẩm (có thể kèm theo lọc, tìm kiếm, sắp xếp, phân trang)
router.get('/', productController.getAllProducts);

// GET chi tiết sản phẩm theo ID
router.get('/:id', productController.getProductById);

// POST tạo mới sản phẩm (cho phép upload tối đa 10 ảnh)
// 'images' là tên trường (field name) mà frontend sẽ gửi ảnh lên
router.post('/', uploadProduct.array('images', 10), productController.createProduct);

// PUT cập nhật sản phẩm theo ID (cho phép upload thêm/thay thế ảnh)
// 'images' là tên trường (field name) mà frontend sẽ gửi ảnh lên
router.put('/:id', uploadProduct.array('images', 10), productController.updateProduct);

// DELETE sản phẩm theo ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;