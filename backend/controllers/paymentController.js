const db = require('../config/db');
const { Payment, ALLOWED_PAYMENT_STATUSES, ALLOWED_PAYMENT_METHODS } = require('../models/paymentModel');

const paymentController = {

    // ================================================================
    // POST /api/payments/process
    // Body: { order_id, payment_method }
    // ================================================================
    processPayment: async (req, res) => {
        const connection = await db.getConnection(); // ✅ Lấy connection cho transaction
        try {
            const { order_id, payment_method } = req.body;

            // ✅ Validate order_id là số nguyên dương
            const parsedOrderId = parseInt(order_id);
            if (!parsedOrderId || parsedOrderId <= 0 || !Number.isInteger(parsedOrderId)) {
                return res.status(400).json({
                    success: false,
                    message: 'order_id phải là số nguyên dương'
                });
            }

            // ✅ Whitelist payment_method
            if (!payment_method || !ALLOWED_PAYMENT_METHODS.includes(payment_method)) {
                return res.status(400).json({
                    success: false,
                    message: `Phương thức thanh toán không hợp lệ. Chấp nhận: ${ALLOWED_PAYMENT_METHODS.join(', ')}`
                });
            }

            await connection.beginTransaction(); // ✅ Bắt đầu transaction

            // ✅ Kiểm tra order tồn tại + lấy đúng cột cần thiết (không SELECT *)
            const [orderRows] = await connection.query(
                `SELECT
                    order_id,
                    status,
                    total_amount
                FROM orders
                WHERE order_id = ?
                LIMIT 1`,
                [parsedOrderId]
            );

            if (!orderRows[0]) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Đơn hàng không tồn tại'
                });
            }

            const order = orderRows[0];

            // ✅ Chỉ cho thanh toán khi đơn hàng ở trạng thái hợp lệ
            const PAYABLE_STATUSES = ['PENDING_CONFIRMATION', 'PROCESSING'];
            if (!PAYABLE_STATUSES.includes(order.status)) {
                await connection.rollback();
                return res.status(409).json({
                    success: false,
                    message: `Đơn hàng đang ở trạng thái "${order.status}", không thể thanh toán`
                });
            }

            // ✅ Kiểm tra chưa có payment để tránh tạo trùng
            const [existRows] = await connection.query(
                `SELECT payment_id FROM payments WHERE order_id = ? LIMIT 1`,
                [parsedOrderId]
            );

            if (existRows[0]) {
                await connection.rollback();
                return res.status(409).json({
                    success: false,
                    message: 'Đơn hàng này đã được khởi tạo thanh toán'
                });
            }

            // ✅ Xử lý COD
            if (payment_method === 'COD') {
                const paymentId = await Payment.createPayment(connection, parsedOrderId, 'COD');
                await connection.commit(); // ✅ Commit transaction

                return res.status(201).json({
                    success: true,
                    message: 'Đặt hàng COD thành công! Vui lòng thanh toán khi nhận hàng.',
                    data: {
                        order_id:       parsedOrderId,
                        payment_id:     paymentId,
                        payment_method: 'COD',
                        payment_status: 'UNPAID',
                        total_amount:   order.total_amount
                    }
                });
            }

            // 🔧 VNPAY — làm sau
            if (payment_method === 'VNPAY') {
                await connection.rollback();
                return res.status(501).json({
                    success: false,
                    message: 'Thanh toán VNPAY đang được xây dựng'
                });
            }

        } catch (error) {
            await connection.rollback(); // ✅ Rollback nếu lỗi bất kỳ bước nào
            console.error('[Payment.processPayment]', error);
            return res.status(500).json({ // ✅ Thêm return
                success: false,
                message: 'Lỗi máy chủ nội bộ'
            });
        } finally {
            connection.release(); // ✅ Luôn release dù thành công hay lỗi
        }
    },

    // ================================================================
    // PUT /api/payments/:orderId/status
    // Body: { status, transaction_id? }
    // ================================================================
    updateStatus: async (req, res) => {
        try {
            // ✅ Validate orderId là số nguyên dương
            const parsedOrderId = parseInt(req.params.orderId);
            if (!parsedOrderId || parsedOrderId <= 0 || !Number.isInteger(parsedOrderId)) {
                return res.status(400).json({
                    success: false,
                    message: 'orderId phải là số nguyên dương'
                });
            }

            const { status, transaction_id } = req.body;

            // ✅ Whitelist tại Controller (Model cũng tự whitelist thêm)
            if (!status || !ALLOWED_PAYMENT_STATUSES.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Trạng thái không hợp lệ. Chấp nhận: ${ALLOWED_PAYMENT_STATUSES.join(', ')}`
                });
            }

            // ✅ Validate transaction_id nếu status là PAID
            if (status === 'PAID' && transaction_id !== undefined) {
                if (typeof transaction_id !== 'string' || !transaction_id.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: 'transaction_id không hợp lệ'
                    });
                }
            }

            // ✅ Kiểm tra payment tồn tại trước khi update
            const existing = await Payment.getByOrderId(parsedOrderId);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy thông tin thanh toán cho đơn hàng này'
                });
            }

            // ✅ Không cho phép cập nhật nếu đã PAID hoặc REFUNDED
            if (['PAID', 'REFUNDED'].includes(existing.payment_status)) {
                return res.status(409).json({
                    success: false,
                    message: `Không thể cập nhật thanh toán đang ở trạng thái "${existing.payment_status}"`
                });
            }

            await Payment.updatePaymentStatus(
                parsedOrderId,
                status,
                transaction_id?.trim() || null
            );

            return res.status(200).json({ // ✅ Thêm return
                success: true,
                message: `Cập nhật trạng thái thanh toán thành công: ${status}`
            });

        } catch (error) {
            if (error.message === 'INVALID_PAYMENT_STATUS') {
                return res.status(400).json({
                    success: false,
                    message: 'Trạng thái thanh toán không hợp lệ'
                });
            }
            console.error('[Payment.updateStatus]', error);
            return res.status(500).json({ // ✅ Thêm return
                success: false,
                message: 'Lỗi máy chủ nội bộ'
            });
        }
    },

    // ================================================================
    // GET /api/payments/:orderId
    // ================================================================
    getByOrderId: async (req, res) => {
        try {
            // ✅ Validate orderId
            const parsedOrderId = parseInt(req.params.orderId);
            if (!parsedOrderId || parsedOrderId <= 0 || !Number.isInteger(parsedOrderId)) {
                return res.status(400).json({
                    success: false,
                    message: 'orderId phải là số nguyên dương'
                });
            }

            const payment = await Payment.getByOrderId(parsedOrderId);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy thông tin thanh toán'
                });
            }

            return res.status(200).json({ success: true, data: payment });
        } catch (error) {
            console.error('[Payment.getByOrderId]', error);
            return res.status(500).json({ 
                success: false,
                message: 'Lỗi máy chủ nội bộ'
            });
        }
    }
};

module.exports = paymentController;