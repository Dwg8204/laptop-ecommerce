const buildNotificationTemplate = (key, payload = {}) => {
    switch (key) {
        case 'ORDER_PAID': {
            const { orderId, paymentMethod } = payload;
            return {
                type: 'ORDER',
                title: 'Thanh toán thành công',
                content: `Đơn hàng #${orderId} đã được thanh toán thành công qua ${paymentMethod}.`,
                referenceId: orderId,
                linkUrl: `/orders/${orderId}`
            };
        }

        default:
            throw new Error('UNKNOWN_NOTIFICATION_TEMPLATE');
    }
};

module.exports = { buildNotificationTemplate };