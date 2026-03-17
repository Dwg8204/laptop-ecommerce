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
        const tokenVersion = decoded.token_version;
        console.log(tokenVersion);
        if (tokenVersion === undefined || tokenVersion === null) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
}
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
        }

        const [rows] = await db.query(
            'SELECT user_id, email, token_version FROM users WHERE user_id = ? LIMIT 1',
            [userId]
        );

        const dbUser = rows[0];
        if (!dbUser) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        if ((dbUser.token_version || 1) !== tokenVersion) {
            return res.status(401).json({ success: false, message: 'Token đã bị thu hồi, vui lòng đăng nhập lại' });
        }

        req.user = {
            user_id: dbUser.user_id,
            email: dbUser.email
        };

        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa xác thực người dùng' });
        }

        const [rows] = await db.query(
            `SELECT r.role_name
             FROM user_roles ur
             INNER JOIN roles r ON r.role_id = ur.role_id
             WHERE ur.user_id = ?
               AND UPPER(TRIM(r.role_name)) = 'ADMIN'
             LIMIT 1`,
            [userId]
        );

        if (!rows[0]) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
        }

        return next();
    } catch (error) {
        console.error('[verifyAdmin]', error);
        return res.status(500).json({ success: false, message: 'Lỗi xác thực phân quyền' });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};