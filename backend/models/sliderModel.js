const db = require('../config/db');

const Slider = {
    // Hàm lấy tất cả banner, sắp xếp theo thứ tự hiển thị
    getAll: async () => {
        const query = 'SELECT * FROM slider_banners ORDER BY display_order ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Hàm tạo banner mới
    create: async (data) => {
        // Trong thực tế creator_id sẽ lấy từ Token của Admin lúc đăng nhập, tạm thời truyền null hoặc id cố định
        const { title, image_url, link_url, display_order, status, creator_id } = data;
        
        const query = `
            INSERT INTO slider_banners 
            (title, image_url, link_url, display_order, status, creator_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        // Mặc định order là 0, status là VISIBLE nếu không truyền
        const values = [
            title, 
            image_url, 
            link_url || null, 
            display_order || 0, 
            status || 'VISIBLE', 
            creator_id || null
        ];

        const [result] = await db.query(query, values);
        return result.insertId; // Trả về ID của dòng vừa thêm
    }
};

module.exports = Slider;