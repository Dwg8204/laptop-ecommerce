const db = require('../config/db');
const Notification = require('../models/notificationModel');
const { emitToUser, emitToUsers } = require('../socket/realtime');
const { buildNotificationTemplate } = require('../helpers/notificationTemplateHelper');

const sendToUser = async ({ userId, type, title, content, referenceId = null, linkUrl = null }) => {
    const notificationId = await Notification.create(
        userId,
        title,
        content,
        type,
        referenceId,
        linkUrl
    );

    const payload = {
        notification_id: notificationId,
        user_id: userId,
        title,
        content,
        type,
        reference_id: referenceId,
        link_url: linkUrl,
        is_read: false,
        created_at: new Date().toISOString()
    };

    emitToUser(userId, 'notification:new', payload);
    return payload;
};

const notifyByTemplate = async (userId, templateKey, payload = {}) => {
    const tpl = buildNotificationTemplate(templateKey, payload);
    return sendToUser({
        userId,
        type: tpl.type,
        title: tpl.title,
        content: tpl.content,
        referenceId: tpl.referenceId,
        linkUrl: tpl.linkUrl
    });
};

const notifyOrderPaid = async (orderId, paymentMethod, transactionId = null) => {
    const [rows] = await db.query(
        `SELECT order_id, user_id
         FROM orders
         WHERE order_id = ?
         LIMIT 1`,
        [orderId]
    );
    if (!rows[0]) return null;

    return notifyByTemplate(rows[0].user_id, 'ORDER_PAID', {
        orderId,
        paymentMethod,
        transactionId
    });
};

const adminSendToSpecificUser = async ({ userId, title, content, type, referenceId = null, linkUrl = null }) => {
    return sendToUser({
        userId,
        type,
        title,
        content,
        referenceId,
        linkUrl
    });
};

const adminSendToAllActiveUsers = async ({ title, content, type, referenceId = null, linkUrl = null }) => {
    const insertedCount = await Notification.createBulkForActiveUsers(
        title,
        content,
        type,
        referenceId,
        linkUrl
    );

    const activeUserIds = await Notification.getActiveUserIds();
    emitToUsers(activeUserIds, 'notification:refresh', {
        reason: "ADMIN_BROADCAST",
        at: new Date().toISOString()
    });
    return {
        insertedCount,
        emittedCount: activeUserIds.length
    };
};

module.exports = {
    sendToUser,
    notifyByTemplate,
    notifyOrderPaid,
    adminSendToSpecificUser,
    adminSendToAllActiveUsers
};