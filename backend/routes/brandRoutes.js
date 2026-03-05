const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// GET tất cả thương hiệu
router.get('/', brandController.getAllBrands);

// GET chi tiết thương hiệu theo ID
router.get('/:id', brandController.getBrandById);

// POST tạo mới thương hiệu
router.post('/', brandController.createBrand);

// PUT cập nhật thương hiệu theo ID
router.put('/:id', brandController.updateBrand);

// DELETE thương hiệu theo ID
router.delete('/:id', brandController.deleteBrand);

module.exports = router;