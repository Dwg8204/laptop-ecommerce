const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const uploadSlider = require('../middlewares/uploadMiddleware'); // Import multer

// Khi gọi POST, nó sẽ chạy qua uploadSlider để lưu file 'image' trước, rồi mới chạy vào Controller
router.post('/', uploadSlider.single('image'), sliderController.createSlider);
router.get('/', sliderController.getAllSliders);

module.exports = router;