const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Khởi tạo app
const app = express();

// 1. MIDDLEWARES (Xử lý dữ liệu đầu vào)
app.use(cors()); // Cho phép Frontend gọi API không bị chặn
app.use(express.json()); // Giúp server đọc được dữ liệu dạng JSON
app.use(express.urlencoded({ extended: true }));

// 2. IMPORT ROUTES 
const sliderRoutes = require('./routes/sliderRoutes');

// 3. Routes
app.use('/api/sliders', sliderRoutes);

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Đường dẫn API không tồn tại!' });
});

// 5. KHỞI ĐỘNG SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
});