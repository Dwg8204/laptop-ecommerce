const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo Connection Pool
const pool = mysql.createPool({
   host:'localhost',
    user:'root',
    password:'',
    database:'laptop_ecommerce_db',
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