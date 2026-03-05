-- =========================================================================
-- SEED DATA FOR INITIAL SETUP
-- =========================================================================

USE laptop_ecommerce_db;

-- Insert default roles
INSERT INTO roles (role_id, role_name) VALUES 
(1, 'ADMIN'),
(2, 'STAFF'),
(3, 'CUSTOMER')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- Insert sample slider banners
INSERT INTO slider_banners (title, image_url, link_url, display_order, status) VALUES
('Summer Sale 2024', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200', 'https://example.com/sale', 1, 'VISIBLE'),
('New Arrivals', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200', 'https://example.com/new', 2, 'VISIBLE'),
('Gaming Laptops', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200', 'https://example.com/gaming', 3, 'VISIBLE')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insert sample brands
INSERT INTO brands (brand_name, logo_url) VALUES
('ASUS', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg'),
('Dell', 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg'),
('HP', 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg'),
('Lenovo', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg'),
('MSI', 'https://upload.wikimedia.org/wikipedia/commons/7/7e/MSI_Logo.svg'),
('Acer', 'https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg')
ON DUPLICATE KEY UPDATE brand_name = VALUES(brand_name);

-- Insert sample categories
INSERT INTO categories (category_name, parent_category_id) VALUES
('Laptop Gaming', NULL),
('Laptop Văn Phòng', NULL),
('Laptop Đồ Họa', NULL),
('Laptop Sinh Viên', NULL),
('Laptop Cao Cấp', NULL)
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

-- Insert sample admin user (password: admin123)
-- Password hash cho 'admin123' với bcrypt salt rounds = 10
INSERT INTO users (email, password_hash, full_name, phone_number, status, is_email_verified) VALUES
('admin@laptop-shop.com', '$2b$10$rZ7Yx5J5J5J5J5J5J5J5J5uXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Admin System', '0900000000', 'ACTIVE', TRUE)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Gán role ADMIN cho user admin (user_id = 1, role_id = 1)
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1)
ON DUPLICATE KEY UPDATE user_id = VALUES(user_id);

-- Insert sample vouchers
INSERT INTO vouchers (voucher_code, discount_type, discount_value, min_order_value, remaining_quantity, expiration_date) VALUES
('WELCOME10', 'PERCENTAGE', 10.00, 5000000, 100, '2026-12-31 23:59:59'),
('SUMMER500K', 'FIXED_AMOUNT', 500000.00, 10000000, 50, '2026-06-30 23:59:59'),
('NEWUSER15', 'PERCENTAGE', 15.00, 3000000, 200, '2026-12-31 23:59:59')
ON DUPLICATE KEY UPDATE voucher_code = VALUES(voucher_code);

-- Insert blog categories
INSERT INTO blog_categories (category_name, description) VALUES
('Tin Công Nghệ', 'Tin tức và xu hướng công nghệ mới nhất'),
('Hướng Dẫn', 'Hướng dẫn sử dụng và bảo trì laptop'),
('Đánh Giá Sản Phẩm', 'Đánh giá chi tiết các sản phẩm laptop')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

COMMIT;
