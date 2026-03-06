const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const ProductCategory = require('../models/productCategoryModel');

const productController = {
    /**
     * API: Lấy danh sách sản phẩm (GET /api/products)
     * Hỗ trợ tìm kiếm, lọc, sắp xếp và phân trang.
     */
    getAllProducts: async (req, res) => {
        try {
            // Lấy các tham số query từ request
            const { 
                search, 
                categoryId, 
                brandId, 
                minPrice, 
                maxPrice, 
                sortBy, 
                sortOrder, 
                page = 1, 
                limit = 12 
            } = req.query;

            const options = {
                search,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                brandId: brandId ? parseInt(brandId) : undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                sortBy,
                sortOrder,
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit)
            };

            const products = await Product.getAll(options);
            const totalCount = await Product.getTotalCount(options);

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách sản phẩm thành công',
                data: products,
                pagination: {
                    totalItems: totalCount,
                    currentPage: parseInt(page),
                    itemsPerPage: parseInt(limit),
                    totalPages: Math.ceil(totalCount / parseInt(limit))
                }
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    // API: Lấy chi tiết sản phẩm theo ID (GET /api/products/:id)
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.getById(id);

            if (!product) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại!' });
            }

            res.status(200).json({
                success: true,
                message: 'Lấy chi tiết sản phẩm thành công',
                data: product
            });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    /**
     * API: Thêm mới sản phẩm (POST /api/products)
     * Yêu cầu dữ liệu sản phẩm trong req.body và các file ảnh trong req.files
     */
    createProduct: async (req, res) => {
        try {
            const { 
                product_name, brand_id, category_id, original_price, discount_price, 
                stock_quantity, status, description_html,
                // Thông số kỹ thuật được gửi dưới dạng JSON string từ frontend hoặc từng trường riêng
                cpu_name, cpu_benchmark_score, ram_gb, ram_type, storage_gb, gpu, screen_size, weight_kg, os 
            } = req.body;

            // Kiểm tra các trường bắt buộc
            if (!product_name || !brand_id || !category_id || !original_price) {
                return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ thông tin sản phẩm bắt buộc (tên, hãng, danh mục, giá gốc).' });
            }

            // Xử lý các file ảnh được upload
            const imageUrls = req.files ? req.files.map(file => file.path) : [];
            if (imageUrls.length === 0) {
                return res.status(400).json({ success: false, message: 'Vui lòng upload ít nhất một ảnh cho sản phẩm.' });
            }

            const productData = {
                product_name,
                brand_id: parseInt(brand_id),
                category_id: parseInt(category_id),
                original_price: parseFloat(original_price),
                discount_price: discount_price ? parseFloat(discount_price) : null,
                stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
                status: status || 'IN_STOCK',
                description_html: description_html || null
            };

            const specData = {
                cpu_name, 
                cpu_benchmark_score: cpu_benchmark_score ? parseInt(cpu_benchmark_score) : null, 
                ram_gb: ram_gb ? parseInt(ram_gb) : null, 
                ram_type, 
                storage_gb: storage_gb ? parseInt(storage_gb) : null, 
                gpu, 
                screen_size: screen_size ? parseFloat(screen_size) : null, 
                weight_kg: weight_kg ? parseFloat(weight_kg) : null, 
                os 
            };
            
            // Xóa các trường null hoặc undefined khỏi specData
            Object.keys(specData).forEach(key => specData[key] === undefined && delete specData[key]);


            const newProductId = await Product.create(productData, specData, imageUrls);

            res.status(201).json({
                success: true,
                message: 'Thêm sản phẩm thành công!',
                data: {
                    product_id: newProductId,
                    image_urls: imageUrls // Trả về các URL ảnh đã upload
                }
            });
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    /**
     * API: Cập nhật sản phẩm (PUT /api/products/:id)
     * Có thể cập nhật thông tin sản phẩm, thông số kỹ thuật, thêm/xóa ảnh.
     */
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const existingProduct = await Product.getById(id);
            if (!existingProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại!' });
            }

            const { 
                product_name, brand_id, category_id, original_price, discount_price, 
                stock_quantity, status, description_html,
                // Thông số kỹ thuật
                cpu_name, cpu_benchmark_score, ram_gb, ram_type, storage_gb, gpu, screen_size, weight_kg, os,
                // Quản lý ảnh
                delete_image_ids, // Mảng các ID ảnh cần xóa
                primary_image_id // ID của ảnh muốn đặt làm ảnh chính
            } = req.body;

            const productData = {
                product_name,
                brand_id: brand_id ? parseInt(brand_id) : undefined,
                category_id: category_id ? parseInt(category_id) : undefined,
                original_price: original_price ? parseFloat(original_price) : undefined,
                discount_price: discount_price ? parseFloat(discount_price) : null, // Có thể cập nhật thành null
                stock_quantity: stock_quantity ? parseInt(stock_quantity) : undefined,
                status,
                description_html
            };

            const specData = {
                cpu_name, 
                cpu_benchmark_score: cpu_benchmark_score ? parseInt(cpu_benchmark_score) : undefined, 
                ram_gb: ram_gb ? parseInt(ram_gb) : undefined, 
                ram_type, 
                storage_gb: storage_gb ? parseInt(storage_gb) : undefined, 
                gpu, 
                screen_size: screen_size ? parseFloat(screen_size) : undefined, 
                weight_kg: weight_kg ? parseFloat(weight_kg) : undefined, 
                os 
            };

            // Lọc bỏ các trường undefined để không ghi đè giá trị cũ bằng undefined trong DB
            Object.keys(productData).forEach(key => productData[key] === undefined && delete productData[key]);
            Object.keys(specData).forEach(key => specData[key] === undefined && delete specData[key]);

            // Xử lý các file ảnh mới được upload
            const newImageUrls = req.files ? req.files.map(file => file.path) : [];
            
            // Chuyển delete_image_ids từ chuỗi JSON hoặc chuỗi số sang mảng số nguyên
            let deleteImageIdsArray = [];
            if (delete_image_ids) {
                try {
                    // Nếu delete_image_ids là một chuỗi JSON của mảng
                    deleteImageIdsArray = JSON.parse(delete_image_ids).map(id => parseInt(id));
                } catch (e) {
                    // Nếu delete_image_ids là một chuỗi số duy nhất hoặc một chuỗi các số cách nhau bởi dấu phẩy
                    deleteImageIdsArray = String(delete_image_ids).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                }
            }
            
            const affectedRows = await Product.update(
                id, 
                productData, 
                specData, 
                newImageUrls, 
                deleteImageIdsArray,
                primary_image_id ? parseInt(primary_image_id) : undefined
            );

            if (affectedRows === 0 && newImageUrls.length === 0 && deleteImageIdsArray.length === 0) {
                 return res.status(400).json({ success: false, message: 'Không có trường nào được cập nhật hoặc không có thay đổi về hình ảnh.' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật sản phẩm thành công!',
                data: {
                    new_image_urls: newImageUrls // Trả về các URL ảnh mới
                }
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    // PI: Xóa sản phẩm (DELETE /api/products/:id)
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const newStatus = 'DISCONTINUED';

            // Kiểm tra xem sản phẩm có tồn tại không
            const existingProduct = await Product.getById(id);
            if (!existingProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại để cập nhật trạng thái!' });
            }

            const affectedRows = await Product.updateProductStatus(id, newStatus);

            if (affectedRows === 0) {
                // Trường hợp này hiếm xảy ra nếu sản phẩm tồn tại,
                // có thể do trạng thái đã là DISCONTINUED hoặc lỗi khác
                return res.status(400).json({ success: false, message: 'Không thể cập nhật trạng thái sản phẩm. Có thể trạng thái đã là DISCONTINUED hoặc không có thay đổi.' });
            }

            res.status(200).json({
                success: true,
                message: `Trạng thái sản phẩm ID ${id} đã được cập nhật thành "${newStatus}" thành công!`,
                data: {
                    product_id: id,
                    new_status: newStatus
                }
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    }
};

module.exports = productController;