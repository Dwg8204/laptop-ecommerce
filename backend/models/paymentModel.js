const db = require('../config/db');

// ✅ Whitelist tại Model — tầng bảo vệ cuối cùng
const ALLOWED_PAYMENT_STATUSES = ['UNPAID', 'PAID', 'REFUNDED'];
const ALLOWED_PAYMENT_METHODS  = ['COD', 'VNPAY'];

const Payment = {

    // ================================================================
    // [CREATE] Tạo payment record
    // ✅ Nhận connection từ ngoài để tham gia transaction của controller
    // ================================================================
    createPayment: async (connection, order_id, payment_method) => {
        if (!ALLOWED_PAYMENT_METHODS.includes(payment_method)) {
            throw new Error('INVALID_PAYMENT_METHOD');
        }

        const [result] = await connection.query(
            `INSERT INTO payments (order_id, payment_method, payment_status)
            VALUES (?, ?, 'UNPAID')`,
            [order_id, payment_method]  // ✅ Parameterized query
        );
        return result.insertId;
    },

    // ================================================================
    // [READ] Kiểm tra payment đã tồn tại chưa
    // ✅ Chỉ SELECT các cột cần thiết, không SELECT *
    // ================================================================
    getByOrderId: async (order_id) => {
        const [rows] = await db.query(
            `SELECT
                payment_id,
                order_id,
                payment_method,
                payment_status,
                transaction_id,
                payment_date
            FROM payments
            WHERE order_id = ?
            LIMIT 1`,
            [order_id]  // ✅ Parameterized query
        );
        return rows[0] || null;
    },

    // ================================================================
    // [UPDATE] Cập nhật trạng thái thanh toán
    // ✅ Whitelist tại Model — không để Controller tự do truyền vào
    // ✅ Không nối string query động → tránh SQL Injection
    // ================================================================
    updatePaymentStatus: async (order_id, status, transaction_id = null) => {
        // ✅ Double-check whitelist tại Model (Controller cũng đã check)
        if (!ALLOWED_PAYMENT_STATUSES.includes(status)) {
            throw new Error('INVALID_PAYMENT_STATUS');
        }

        // ✅ Dùng CASE thay vì nối string → an toàn, không SQL Injection
        const [result] = await db.query(
            `UPDATE payments
            SET
                payment_status = ?,
                transaction_id = CASE WHEN ? = 'PAID' THEN ?   ELSE transaction_id END,
                payment_date   = CASE WHEN ? = 'PAID' THEN NOW() ELSE payment_date  END
            WHERE order_id = ?`,
            [status, status, transaction_id, status, order_id]  // ✅ Toàn bộ dùng placeholder
        );
        return result.affectedRows;
    }
};

module.exports = { Payment, ALLOWED_PAYMENT_STATUSES, ALLOWED_PAYMENT_METHODS };