const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// API test server
app.get('/', (req, res) => {
    res.json({ message: 'Server Web Laptop đang chạy ngon lành!' });
});

// API test truy vấn Database thực tế
app.get('/api/test-db', async (req, res) => {
    try {
        // Thử chọc vào database, đếm xem có bao nhiêu bảng
        const [rows] = await db.query("SHOW TABLES");
        res.json({
            success: true,
            message: 'Đã kết nối và lấy dữ liệu Database thành công!',
            tables: rows
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi truy vấn Database', 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
});