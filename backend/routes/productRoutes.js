const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadProduct = require('../middlewares/uploadProductImageMiddleware'); // Import middleware upload ảnh sản phẩm

// Cấu hình Multer để chấp nhận nhiều trường file.
// Đây là một cấu hình mẫu, có thể điều chỉnh số lượng và tên trường tùy theo giao diện frontend.
// Frontend sẽ gửi các file ảnh với các trường tên này.
const productImagesUploadFields = uploadProduct.fields([
    { name: 'productImages', maxCount: 5 }, // Ảnh chính cấp sản phẩm (tối đa 5 ảnh)
    { name: 'variant_0_images', maxCount: 5 }, // Ảnh cho variant đầu tiên
    { name: 'variant_1_images', maxCount: 5 }, // Ảnh cho variant thứ hai
    { name: 'variant_2_images', maxCount: 5 },
    { name: 'variant_3_images', maxCount: 5 },
    { name: 'variant_4_images', maxCount: 5 },
    { name: 'variant_5_images', maxCount: 5 },
    // Thêm các trường tương tự cho update nếu bạn muốn phân biệt file mới giữa create và update
    { name: 'newProductImages', maxCount: 5 },
    { name: 'newVariant_0_images_update', maxCount: 5 },
    { name: 'newVariant_1_images_update', maxCount: 5 },
    { name: 'newVariant_2_images_update', maxCount: 5 },
    { name: 'newVariant_3_images_update', maxCount: 5 },
    { name: 'newVariant_4_images_update', maxCount: 5 },
    { name: 'newVariant_5_images_update', maxCount: 5 },
    { name: 'newVariant_0_images_create', maxCount: 5 }, // Cho variants được tạo mới trong update
    { name: 'newVariant_1_images_create', maxCount: 5 },
    { name: 'newVariant_2_images_create', maxCount: 5 }
]);

// GET tất cả sản phẩm (có thể kèm theo lọc, tìm kiếm, sắp xếp, phân trang)
router.get('/', productController.getAllProducts);

// GET chi tiết sản phẩm theo ID
router.get('/:productId', productController.getProductById);

// POST tạo mới sản phẩm 
router.post('/', productImagesUploadFields, productController.createProduct);

// PUT cập nhật sản phẩm theo ID
router.put('/:productId', productImagesUploadFields, productController.updateProduct);

// DELETE sản phẩm theo ID (soft delete - cập nhật trạng thái variants)
router.delete('/:id', productController.deleteProduct);

module.exports = router;