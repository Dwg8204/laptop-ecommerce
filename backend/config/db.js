const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Trỏ đúng vào cổng 3307 của bạn
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Chạy test kết nối ngay khi file này được gọi
pool.getConnection()
    .then(connection => {
        console.log(`✅ Kết nối thành công đến MySQL (DB: ${process.env.DB_NAME}) trên cổng ${process.env.DB_PORT}`);
        connection.release(); // Trả kết nối lại cho Pool
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối Database:', err.message);
    });

module.exports = pool;