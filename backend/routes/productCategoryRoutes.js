const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCategoryController');

// GET tất cả danh mục (có thể kèm query param 'tree=true')
router.get('/', productCategoryController.getAllCategories);

// GET chi tiết danh mục theo ID
router.get('/:id', productCategoryController.getCategoryById);

// POST tạo mới danh mục
router.post('/', productCategoryController.createCategory);

// PUT cập nhật danh mục theo ID
router.put('/:id', productCategoryController.updateCategory);

// DELETE danh mục theo ID
router.delete('/:id', productCategoryController.deleteCategory);

module.exports = router;