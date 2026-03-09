const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const uploadSlider = require('../middlewares/uploadMiddleware'); // Import multer

// Đảm bảo lỗi upload luôn trả về JSON thay vì trang HTML mặc định.
const handleSliderUpload = (req, res, next) => {
	uploadSlider.single('image')(req, res, (err) => {
		if (err) {
			console.error('Upload slider error:', err);
			return res.status(400).json({
				success: false,
				message: err.message || 'Lỗi upload ảnh slider'
			});
		}
		next();
	});
};

router.get('/', sliderController.getAllSliders);
// Khi gọi POST, nó sẽ chạy qua uploadSlider để lưu file 'image' trước, rồi mới chạy vào Controller
router.post('/', handleSliderUpload, sliderController.createSlider);
router.get('/:id', sliderController.getSliderById);
router.put('/:id', handleSliderUpload, sliderController.updateSlider);
router.delete('/:id', sliderController.deleteSlider);
module.exports = router;