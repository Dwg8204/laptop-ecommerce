const jwt = require('jsonwebtoken');
const db = require('../config/db');

const extractBearerToken = (req) => {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    return authHeader.slice(7).trim();
};

const verifyToken = async (req, res, next) => {
    try {
        const token = extractBearerToken(req);
        if (!token) {
            return res.status(401).json({ success: false, message: 'Thiếu token xác thực' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id || decoded.id || decoded.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
        }

        // Kiểm tra user còn ACTIVE
        const [rows] = await db.query(
            `SELECT user_id, email, full_name, status
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [userId]
        );

        if (!rows[0]) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        if (rows[0].status !== 'ACTIVE') {
            return res.status(403).json({ success: false, message: 'Tài khoản đã bị khoá' });
        }

        req.user = {
            ...decoded,
            user_id: rows[0].user_id,
            email: rows[0].email,
            full_name: rows[0].full_name
        };

        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token hết hạn hoặc không hợp lệ' });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa xác thực người dùng' });
        }

        const [rows] = await db.query(
            `SELECT 1
             FROM user_roles ur
             INNER JOIN roles r ON r.role_id = ur.role_id
             WHERE ur.user_id = ? AND r.role_name = 'ADMIN'
             LIMIT 1`,
            [userId]
        );

        if (!rows[0]) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
        }

        return next();
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xác thực phân quyền' });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};