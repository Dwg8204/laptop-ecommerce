const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');

// Phân luồng:
// - Phương thức GET gọi tới hàm getAllSliders
// - Phương thức POST gọi tới hàm createSlider
router.get('/', sliderController.getAllSliders);
router.post('/', sliderController.createSlider);

module.exports = router;