const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCategoryController');

// GET tất cả danh mục (có thể kèm query param 'tree=true')
router.get('/', categoryController.getAllCategories);

// GET chi tiết danh mục theo ID
router.get('/:id', categoryController.getCategoryById);

// POST tạo mới danh mục
router.post('/', categoryController.createCategory);

// PUT cập nhật danh mục theo ID
router.put('/:id', categoryController.updateCategory);

// DELETE danh mục theo ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;