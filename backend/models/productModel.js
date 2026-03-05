const db = require('../config/db');

const Product = {
    /**
     * Lấy tất cả sản phẩm với tùy chọn lọc, sắp xếp và phân trang.
     * @param {Object} options - Các tùy chọn lọc, sắp xếp, phân trang.
     * @param {string} options.search - Từ khóa tìm kiếm trong tên sản phẩm.
     * @param {number} options.categoryId - Lọc theo ID danh mục.
     * @param {number} options.brandId - Lọc theo ID thương hiệu.
     * @param {string} options.minPrice - Giá tối thiểu.
     * @param {string} options.maxPrice - Giá tối đa.
     * @param {string} options.sortBy - Trường sắp xếp (e.g., 'price', 'created_at', 'name').
     * @param {'ASC'|'DESC'} options.sortOrder - Thứ tự sắp xếp.
     * @param {number} options.limit - Số lượng sản phẩm trên mỗi trang.
     * @param {number} options.offset - Vị trí bắt đầu lấy sản phẩm (để phân trang).
     * @returns {Promise<Array>} Danh sách sản phẩm.
     */
    getAll: async (options = {}) => {
        let query = `
            SELECT 
                p.product_id, 
                p.product_name, 
                p.original_price, 
                p.discount_price, 
                p.stock_quantity, 
                p.status,
                b.brand_name,
                c.category_name,
                s.cpu_name,         
                s.gpu,              
                s.ram_gb,           
                s.storage_gb,       
                s.screen_size,
                (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) AS primary_image_url
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_specifications s ON p.product_id = s.product_id 
            WHERE 1=1
        `;
        const values = [];

        // Lọc theo từ khóa tìm kiếm
        if (options.search) {
            query += ` AND p.product_name LIKE ?`;
            values.push(`%${options.search}%`);
        }

        // Lọc theo danh mục
        if (options.categoryId) {
            query += ` AND p.category_id = ?`;
            values.push(options.categoryId);
        }

        // Lọc theo thương hiệu
        if (options.brandId) {
            query += ` AND p.brand_id = ?`;
            values.push(options.brandId);
        }

        // Lọc theo giá
        if (options.minPrice) {
            query += ` AND p.discount_price >= ?`; // Hoặc original_price tùy logic
            values.push(options.minPrice);
        }
        if (options.maxPrice) {
            query += ` AND p.discount_price <= ?`; // Hoặc original_price tùy logic
            values.push(options.maxPrice);
        }

        // Sắp xếp
        if (options.sortBy) {
            let orderByField = '';
            switch (options.sortBy) {
                case 'price':
                    orderByField = 'p.discount_price IS NULL, p.discount_price, p.original_price'; // Ưu tiên discount_price nếu có
                    break;
                case 'name':
                    orderByField = 'p.product_name';
                    break;
                case 'created_at':
                    orderByField = 'p.created_at';
                    break;
                // Có thể thêm các trường sắp xếp khác như 'views', 'sales'
                default:
                    orderByField = 'p.created_at'; // Mặc định sắp xếp theo ngày tạo
            }
            const sortOrder = options.sortOrder && ['ASC', 'DESC'].includes(options.sortOrder.toUpperCase()) 
                                ? options.sortOrder.toUpperCase() 
                                : 'DESC'; // Mặc định giảm dần
            query += ` ORDER BY ${orderByField} ${sortOrder}`;
        } else {
            query += ` ORDER BY p.created_at DESC`; // Mặc định sắp xếp theo ngày tạo mới nhất
        }

        // Phân trang
        if (options.limit) {
            query += ` LIMIT ?`;
            values.push(parseInt(options.limit));
            if (options.offset) {
                query += ` OFFSET ?`;
                values.push(parseInt(options.offset));
            }
        }

        const [rows] = await db.query(query, values);
        return rows;
    },

    /**
     * Lấy tổng số lượng sản phẩm dựa trên các bộ lọc (dùng cho phân trang).
     * @param {Object} options - Các tùy chọn lọc.
     * @returns {Promise<number>} Tổng số sản phẩm.
     */
    getTotalCount: async (options = {}) => {
        let query = `
            SELECT COUNT(p.product_id) AS total_count
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE 1=1
        `;
        const values = [];

        if (options.search) {
            query += ` AND p.product_name LIKE ?`;
            values.push(`%${options.search}%`);
        }
        if (options.categoryId) {
            query += ` AND p.category_id = ?`;
            values.push(options.categoryId);
        }
        if (options.brandId) {
            query += ` AND p.brand_id = ?`;
            values.push(options.brandId);
        }
        if (options.minPrice) {
            query += ` AND p.discount_price >= ?`;
            values.push(options.minPrice);
        }
        if (options.maxPrice) {
            query += ` AND p.discount_price <= ?`;
            values.push(options.maxPrice);
        }

        const [rows] = await db.query(query, values);
        return rows[0].total_count;
    },


    /**
     * Lấy thông tin chi tiết một sản phẩm theo ID, bao gồm thông số kỹ thuật, hình ảnh, hãng, danh mục VÀ ĐÁNH GIÁ SẢN PHẨM.
     * @param {number} id - ID của sản phẩm.
     * @returns {Promise<Object|null>} Đối tượng sản phẩm hoặc null nếu không tìm thấy.
     */
    getById: async (id) => {
        const query = `
            SELECT 
                p.*, 
                b.brand_name, 
                c.category_name,
                s.cpu_name, s.cpu_benchmark_score, s.ram_gb, s.ram_type, s.storage_gb, s.gpu, s.screen_size, s.weight_kg, s.os
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_specifications s ON p.product_id = s.product_id
            WHERE p.product_id = ?
        `;
        const [productRows] = await db.query(query, [id]);

        if (productRows.length === 0) {
            return null; // Sản phẩm không tồn tại
        }

        const product = productRows[0];

        // Lấy danh sách hình ảnh
        const [imageRows] = await db.query('SELECT image_id, image_url, is_primary FROM product_images WHERE product_id = ?', [id]);
        product.images = imageRows;

        // 3. Lấy danh sách đánh giá của sản phẩm, bao gồm tên người dùng
        const [reviewRows] = await db.query(
            `SELECT 
                pr.review_id, 
                pr.user_id, 
                u.full_name AS reviewer_name, 
                pr.rating, 
                pr.content, 
                pr.created_at
            FROM product_reviews pr
            JOIN users u ON pr.user_id = u.user_id
            WHERE pr.product_id = ?
            ORDER BY pr.created_at DESC`, // Sắp xếp đánh giá mới nhất lên đầu
            [id]
        );
        product.reviews = reviewRows;

        return product;
    },

    /**
     * Thêm mới một sản phẩm vào cơ sở dữ liệu.
     * @param {Object} productData - Dữ liệu của sản phẩm (product_name, brand_id, category_id, original_price, discount_price, stock_quantity, status, description_html).
     * @param {Object} specData - Dữ liệu thông số kỹ thuật (cpu_name, ram_gb, etc.).
     * @param {Array<string>} imageUrls - Mảng các URL hình ảnh sản phẩm.
     * @returns {Promise<number>} ID của sản phẩm vừa được thêm.
     */
    create: async (productData, specData, imageUrls) => {
        const connection = await db.getConnection(); // Sử dụng transaction để đảm bảo toàn vẹn dữ liệu
        try {
            await connection.beginTransaction();

            // 1. Thêm sản phẩm
            const productInsertQuery = `
                INSERT INTO products 
                (product_name, brand_id, category_id, original_price, discount_price, stock_quantity, status, description_html) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const productValues = [
                productData.product_name,
                productData.brand_id,
                productData.category_id,
                productData.original_price,
                productData.discount_price || null,
                productData.stock_quantity || 0,
                productData.status || 'IN_STOCK',
                productData.description_html || null
            ];
            const [productResult] = await connection.query(productInsertQuery, productValues);
            const newProductId = productResult.insertId;

            // 2. Thêm thông số kỹ thuật (nếu có)
            if (specData && Object.keys(specData).length > 0) {
                const specInsertQuery = `
                    INSERT INTO product_specifications 
                    (product_id, cpu_name, cpu_benchmark_score, ram_gb, ram_type, storage_gb, gpu, screen_size, weight_kg, os) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const specValues = [
                    newProductId,
                    specData.cpu_name || null,
                    specData.cpu_benchmark_score || null,
                    specData.ram_gb || null,
                    specData.ram_type || null,
                    specData.storage_gb || null,
                    specData.gpu || null,
                    specData.screen_size || null,
                    specData.weight_kg || null,
                    specData.os || null
                ];
                await connection.query(specInsertQuery, specValues);
            }

            // 3. Thêm hình ảnh
            if (imageUrls && imageUrls.length > 0) {
                const imageInsertQuery = `
                    INSERT INTO product_images (product_id, image_url, is_primary) 
                    VALUES (?, ?, ?)
                `;
                for (let i = 0; i < imageUrls.length; i++) {
                    // Đặt ảnh đầu tiên là ảnh chính
                    const isPrimary = (i === 0); 
                    await connection.query(imageInsertQuery, [newProductId, imageUrls[i], isPrimary]);
                }
            }

            await connection.commit();
            return newProductId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Cập nhật thông tin một sản phẩm.
     * @param {number} id - ID của sản phẩm cần cập nhật.
     * @param {Object} productData - Dữ liệu sản phẩm cần cập nhật.
     * @param {Object} specData - Dữ liệu thông số kỹ thuật cần cập nhật.
     * @param {Array<string>} newImageUrls - Mảng các URL hình ảnh mới để thêm.
     * @param {Array<number>} deleteImageIds - Mảng các ID hình ảnh cũ cần xóa.
     * @param {number} primaryImageId - ID của ảnh muốn đặt làm ảnh chính (nếu có).
     * @returns {Promise<number>} Số dòng bị ảnh hưởng (0 hoặc 1).
     */
    update: async (id, productData, specData, newImageUrls, deleteImageIds, primaryImageId) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Cập nhật thông tin sản phẩm
            const allowedProductFields = ['product_name', 'brand_id', 'category_id', 'original_price', 'discount_price', 'stock_quantity', 'status', 'description_html'];
            const productFieldsToUpdate = [];
            const productValues = [];

            allowedProductFields.forEach(field => {
                if (productData[field] !== undefined) {
                    productFieldsToUpdate.push(`${field} = ?`);
                    productValues.push(productData[field]);
                }
            });

            if (productFieldsToUpdate.length > 0) {
                const productUpdateQuery = `UPDATE products SET ${productFieldsToUpdate.join(', ')} WHERE product_id = ?`;
                productValues.push(id);
                await connection.query(productUpdateQuery, productValues);
            }

            // 2. Cập nhật hoặc thêm thông số kỹ thuật
            if (specData && Object.keys(specData).length > 0) {
                const [existingSpec] = await connection.query('SELECT spec_id FROM product_specifications WHERE product_id = ?', [id]);
                if (existingSpec.length > 0) {
                    // Cập nhật thông số kỹ thuật hiện có
                    const allowedSpecFields = ['cpu_name', 'cpu_benchmark_score', 'ram_gb', 'ram_type', 'storage_gb', 'gpu', 'screen_size', 'weight_kg', 'os'];
                    const specFieldsToUpdate = [];
                    const specValues = [];

                    allowedSpecFields.forEach(field => {
                        if (specData[field] !== undefined) {
                            specFieldsToUpdate.push(`${field} = ?`);
                            specValues.push(specData[field]);
                        }
                    });

                    if (specFieldsToUpdate.length > 0) {
                        const specUpdateQuery = `UPDATE product_specifications SET ${specFieldsToUpdate.join(', ')} WHERE product_id = ?`;
                        specValues.push(id);
                        await connection.query(specUpdateQuery, specValues);
                    }
                } else {
                    // Thêm thông số kỹ thuật mới nếu chưa có
                    const specInsertQuery = `
                        INSERT INTO product_specifications 
                        (product_id, cpu_name, cpu_benchmark_score, ram_gb, ram_type, storage_gb, gpu, screen_size, weight_kg, os) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const insertSpecValues = [
                        id,
                        specData.cpu_name || null,
                        specData.cpu_benchmark_score || null,
                        specData.ram_gb || null,
                        specData.ram_type || null,
                        specData.storage_gb || null,
                        specData.gpu || null,
                        specData.screen_size || null,
                        specData.weight_kg || null,
                        specData.os || null
                    ];
                    await connection.query(specInsertQuery, insertSpecValues);
                }
            }


            // 3. Xóa hình ảnh cũ
            if (deleteImageIds && deleteImageIds.length > 0) {
                // Xóa ảnh trên Cloudinary ở đây nếu cần (phức tạp hơn)
                const deleteImageQuery = 'DELETE FROM product_images WHERE image_id IN (?) AND product_id = ?';
                await connection.query(deleteImageQuery, [deleteImageIds, id]);
            }

            // 4. Thêm hình ảnh mới
            if (newImageUrls && newImageUrls.length > 0) {
                const imageInsertQuery = 'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)';
                for (const url of newImageUrls) {
                    await connection.query(imageInsertQuery, [id, url, false]); // Mặc định là không chính
                }
            }
            
            // 5. Cập nhật ảnh chính
            if (primaryImageId) {
                // Đặt tất cả ảnh của sản phẩm này về không chính
                await connection.query('UPDATE product_images SET is_primary = FALSE WHERE product_id = ?', [id]);
                // Đặt ảnh được chỉ định làm chính
                await connection.query('UPDATE product_images SET is_primary = TRUE WHERE image_id = ? AND product_id = ?', [primaryImageId, id]);
            } else if (newImageUrls && newImageUrls.length > 0) {
                // Nếu không có ảnh chính được chỉ định nhưng có ảnh mới, đặt ảnh đầu tiên trong số ảnh mới làm ảnh chính
                // Hoặc đặt ảnh đầu tiên trong số các ảnh còn lại làm ảnh chính nếu không có ảnh chính nào tồn tại
                const [currentPrimary] = await connection.query('SELECT image_id FROM product_images WHERE product_id = ? AND is_primary = TRUE', [id]);
                if (currentPrimary.length === 0) { // Nếu không có ảnh chính nào hiện tại
                     const [anyImage] = await connection.query('SELECT image_id FROM product_images WHERE product_id = ? LIMIT 1', [id]);
                     if (anyImage.length > 0) {
                         await connection.query('UPDATE product_images SET is_primary = TRUE WHERE image_id = ?', [anyImage[0].image_id]);
                     }
                }
            }


            await connection.commit();
            return 1; // Giả sử 1 dòng bị ảnh hưởng nếu không có lỗi
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Cập nhật trạng thái của một sản phẩm.
     * @param {number} id - ID của sản phẩm cần cập nhật.
     * @param {string} newStatus - Trạng thái mới (ví dụ: 'IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED').
     * @returns {Promise<number>} Số dòng bị ảnh hưởng (0 hoặc 1).
     */
    updateProductStatus: async (id, newStatus) => {
        // Đảm bảo trạng thái mới là một trong các giá trị hợp lệ của ENUM
        const validStatuses = ['IN_STOCK', 'OUT_OF_STOCK', 'COMING_SOON', 'DISCONTINUED'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Trạng thái "${newStatus}" không hợp lệ.`);
        }

        const query = 'UPDATE products SET status = ? WHERE product_id = ?';
        const [result] = await db.query(query, [newStatus, id]);
        return result.affectedRows;
    },

    /**
     * Hàm xóa sản phẩm vật lý khỏi database.
     * Hàm này được giữ lại nếu sau này bạn muốn có một API xóa cứng riêng biệt (chỉ dùng cho Admin cấp cao).
     * Hiện tại, API DELETE sẽ chỉ cập nhật trạng thái.
     * @param {number} id - ID của sản phẩm cần xóa cứng.
     * @returns {Promise<number>} Số dòng bị ảnh hưởng (0 hoặc 1).
     */
    hardDelete: async (id) => {
        const query = 'DELETE FROM products WHERE product_id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
};

module.exports = Product;