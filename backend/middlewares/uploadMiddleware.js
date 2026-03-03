const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Cấu hình thông tin đăng nhập Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình kho lưu trữ trên mây
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'laptop_ecommerce/sliders', // Nó sẽ tự tạo thư mục này trên mây cho gọn
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Chỉ cho phép up ảnh
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }] // Tự động nén ảnh quá to để web load nhanh
    }
});

// 3. Khởi tạo Multer với bộ nhớ mây
const uploadSlider = multer({ storage: storage });

module.exports = uploadSlider;