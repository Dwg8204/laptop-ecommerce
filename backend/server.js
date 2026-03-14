const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const path = require('path');
const http = require('http');
const { initRealtime } = require('./socket/realtime');

const app = express();
const corsOrigin = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(',').map((origin) => origin.trim())
    : '*';

app.use(cors({ origin: corsOrigin })); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Laptop Shop API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
}));


const sliderRoutes = require('./routes/sliderRoutes');
const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const authRoutes = require('./routes/authRoutes');
const authAdminRoutes = require('./routes/authAdminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const blogCategoryRoutes = require('./routes/blogCategoryRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/sliders', sliderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth/admin', authAdminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/blog-categories', blogCategoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Cho phép truy cập trực tiếp vào thư mục uploads qua URL
app.use('/api/notifications', notificationRoutes);
// Global error handler: luôn trả JSON thay vì HTML error page.
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    if (res.headersSent) {
        return next(err);
    }
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Lỗi máy chủ nội bộ'
    });
});

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Đường dẫn API không tồn tại!' });
});


const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server đang chạy tại port ${PORT}`);
//     console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
// });
const server = http.createServer(app);
initRealtime(server);

server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server đang chạy tại port ${process.env.PORT || 5000}`);
});
