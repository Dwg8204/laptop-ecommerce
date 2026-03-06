const ProductCategory = require('../models/productCategoryModel');
const db = require('../config/db');

const productCategoryController = {
    /**
     * API: Lấy tất cả danh mục (GET /api/categories)
     * Có thể có query param 'tree=true' để lấy dưới dạng cây.
     */
    getAllCategories: async (req, res) => {
        try {
            const { tree } = req.query;
            let categories;
            if (tree === 'true') {
                categories = await ProductCategory.getTree();
            } else {
                categories = await ProductCategory.getAll();
            }
            
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách danh mục thành công',
                data: categories
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    // API: Lấy chi tiết danh mục theo ID (GET /api/categories/:id)
    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await ProductCategory.getById(id);

            if (!category) {
                return res.status(404).json({ success: false, message: 'Danh mục không tồn tại!' });
            }

            res.status(200).json({
                success: true,
                message: 'Lấy chi tiết danh mục thành công',
                data: category
            });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết danh mục:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    /**
     * API: Thêm mới danh mục (POST /api/categories)
     * req.body: { category_name: string, parent_category_id?: number }
     */
    createCategory: async (req, res) => {
        try {
            const { category_name, parent_category_id } = req.body;

            if (!category_name) {
                return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên danh mục.' });
            }
            
            // Nếu có parent_category_id, kiểm tra xem nó có tồn tại không
            if (parent_category_id) {
                const parentCategory = await ProductCategory.getById(parent_category_id);
                if (!parentCategory) {
                    return res.status(400).json({ success: false, message: 'Danh mục cha không tồn tại.' });
                }
            }

            const newCategoryId = await ProductCategory.create({ 
                category_name, 
                parent_category_id: parent_category_id ? parseInt(parent_category_id) : null 
            });

            res.status(201).json({
                success: true,
                message: 'Thêm danh mục thành công!',
                data: { category_id: newCategoryId, category_name, parent_category_id }
            });
        } catch (error) {
            console.error('Lỗi khi thêm danh mục:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    /**
     * API: Cập nhật danh mục (PUT /api/categories/:id)
     * req.body: { category_name?: string, parent_category_id?: number|null }
     */
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { category_name, parent_category_id } = req.body;

            const existingCategory = await ProductCategory.getById(id);
            if (!existingCategory) {
                return res.status(404).json({ success: false, message: 'Danh mục không tồn tại để cập nhật!' });
            }

            const updateData = {};
            if (category_name !== undefined) updateData.category_name = category_name;
            if (parent_category_id !== undefined) {
                // Kiểm tra parent_category_id mới
                if (parent_category_id !== null) { // Set null thì không cần kiểm tra tồn tại
                    const parentCategory = await ProductCategory.getById(parent_category_id);
                    if (!parentCategory) {
                        return res.status(400).json({ success: false, message: 'Danh mục cha không tồn tại.' });
                    }
                }
                updateData.parent_category_id = parent_category_id === null ? null : parseInt(parent_category_id);
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'Không có thông tin nào được cung cấp để cập nhật.' });
            }
            
            const affectedRows = await ProductCategory.update(id, updateData);

            if (affectedRows === 0) {
                return res.status(400).json({ success: false, message: 'Không có thay đổi nào được thực hiện hoặc danh mục không tồn tại.' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật danh mục thành công!'
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            if (error.message === 'Không thể đặt danh mục làm danh mục cha của chính nó.') {
                return res.status(400).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    // API: Xóa danh mục (DELETE /api/categories/:id)
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;

            // Kiểm tra xem có sản phẩm nào đang sử dụng danh mục này không
            const productsUsingCategory = await ProductCategory.productsUsingCategory;
            if (productsUsingCategory > 0) {
                return res.status(409).json({ success: false, message: 'Không thể xóa danh mục này vì có sản phẩm đang sử dụng nó.' });
            }

            // Kiểm tra xem có danh mục con nào đang tham chiếu đến danh mục này không
            // ON DELETE SET NULL sẽ xử lý, kiểm tra để thông báo trước cho người dùng
            const childCategories = await ProductCategory.childCategories;
            if (childCategories > 0) {
                // Với ON DELETE SET NULL, các danh mục con sẽ không bị xóa mà chỉ mất cha.
                return res.status(409).json({ success: false, message: 'Không thể xóa danh mục này vì có danh mục con đang tham chiếu đến nó. Vui lòng cập nhật hoặc xóa các danh mục con trước.' });
            }


            const affectedRows = await ProductCategory.remove(id);

            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Danh mục không tồn tại để xóa!' });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa danh mục thành công!'
            });
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') { // Lỗi khi FOREIGN KEY ON DELETE RESTRICT ngăn cản xóa (do sản phẩm)
                return res.status(409).json({ success: false, message: 'Không thể xóa danh mục này vì có sản phẩm đang sử dụng nó. Vui lòng cập nhật hoặc xóa các sản phẩm liên quan trước.' });
            }
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    }
};

module.exports = productCategoryController;