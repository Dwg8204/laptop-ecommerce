const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { swaggerUi, swaggerSpec } = require('./config/swagger');


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
const authRoutes = require('./routes/authRoutes');
const authAdminRoutes = require('./routes/authAdminRoutes');
const blogRoutes = require('./routes/blogRoutes');


app.use('/api/sliders', sliderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth/admin', authAdminRoutes);
app.use('/api/blog', blogRoutes);

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Đường dẫn API không tồn tại!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
    console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
});
