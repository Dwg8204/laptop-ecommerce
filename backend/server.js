const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ Frontend gửi lên

// API Test cơ bản
app.get('/', (req, res) => {
    res.json({ message: 'Server Web Laptop đang chạy ngon lành!' });
});

// Cổng chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
});