const Brand = require('../models/brandModel');

const brandController = {
    // API: Lấy tất cả thương hiệu (GET /api/brands)
    getAllBrands: async (req, res) => {
        try {
            const brands = await Brand.getAll();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách thương hiệu thành công',
                data: brands
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thương hiệu:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    // API: Lấy chi tiết thương hiệu theo ID (GET /api/brands/:id)
    getBrandById: async (req, res) => {
        try {
            const { id } = req.params;
            const brand = await Brand.getById(id);

            if (!brand) {
                return res.status(404).json({ success: false, message: 'Thương hiệu không tồn tại!' });
            }

            res.status(200).json({
                success: true,
                message: 'Lấy chi tiết thương hiệu thành công',
                data: brand
            });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết thương hiệu:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    /**
     * API: Thêm mới thương hiệu (POST /api/brands)
     * req.body: { brand_name: string, logo_url?: string }
     */
    createBrand: async (req, res) => {
        try {
            const { brand_name, logo_url } = req.body;

            if (!brand_name) {
                return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên thương hiệu.' });
            }

            // Có thể kiểm tra trùng tên thương hiệu ở đây trước khi tạo
            // const existingBrand = await Brand.getByName(brand_name); // Cần thêm hàm getByName
            // if (existingBrand) {
            //     return res.status(409).json({ success: false, message: 'Tên thương hiệu đã tồn tại.' });
            // }

            const newBrandId = await Brand.create({ brand_name, logo_url });

            res.status(201).json({
                success: true,
                message: 'Thêm thương hiệu thành công!',
                data: { brand_id: newBrandId, brand_name, logo_url }
            });
        } catch (error) {
            console.error('Lỗi khi thêm thương hiệu:', error);
            if (error.code === 'ER_DUP_ENTRY') { // MySQL duplicate entry error code
                return res.status(409).json({ success: false, message: 'Tên thương hiệu đã tồn tại.' });
            }
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    /**
     * API: Cập nhật thương hiệu (PUT /api/brands/:id)
     * req.body: { brand_name?: string, logo_url?: string }
     */
    updateBrand: async (req, res) => {
        try {
            const { id } = req.params;
            const { brand_name, logo_url } = req.body;

            const existingBrand = await Brand.getById(id);
            if (!existingBrand) {
                return res.status(404).json({ success: false, message: 'Thương hiệu không tồn tại để cập nhật!' });
            }

            const updateData = {};
            if (brand_name !== undefined) updateData.brand_name = brand_name;
            if (logo_url !== undefined) updateData.logo_url = logo_url;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'Không có thông tin nào được cung cấp để cập nhật.' });
            }

            const affectedRows = await Brand.update(id, updateData);

            if (affectedRows === 0) {
                return res.status(400).json({ success: false, message: 'Không có thay đổi nào được thực hiện hoặc thương hiệu không tồn tại.' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật thương hiệu thành công!'
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật thương hiệu:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'Tên thương hiệu đã tồn tại.' });
            }
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    // API: Xóa thương hiệu (DELETE /api/brands/:id)
    
    deleteBrand: async (req, res) => {
        try {
            const { id } = req.params;
            // Kiểm tra xem có sản phẩm nào đang sử dụng thương hiệu này không
            // Lớp bảo vệ bổ sung ngoài ràng buộc FOREIGN KEY ON DELETE RESTRICT
            const productsUsingBrand = await Brand.productsUsingBrand(id);
            if (productsUsingBrand > 0) {
                return res.status(409).json({ success: false, message: 'Không thể xóa thương hiệu này vì có sản phẩm đang sử dụng nó.' });
            }

            const affectedRows = await Brand.remove(id);

            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Thương hiệu không tồn tại để xóa!' });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thương hiệu thành công!'
            });
        } catch (error) {
            console.error('Lỗi khi xóa thương hiệu:', error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    success: false,
                    message: 'Không thể xóa thương hiệu này vì có sản phẩm đang sử dụng nó.'
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Lỗi máy chủ nội bộ'
            });
            }
        }
};

module.exports = brandController;