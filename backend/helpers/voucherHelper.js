const { isInWhitelist } = require('./validateHelper');  //Tái sử dụng helper

const ALLOWED_DISCOUNT_TYPES = ['PERCENTAGE', 'FIXED_AMOUNT'];

const validateVoucherData = (data, isUpdate = false) => {
    const { voucher_code, discount_type, discount_value,
            expiration_date, remaining_quantity, min_order_value } = data;
    const errors = [];

    if (!isUpdate) {
        if (!voucher_code?.trim())        errors.push('Mã voucher không được để trống');
        if (!discount_type)               errors.push('Loại giảm giá không được để trống');
        if (discount_value === undefined) errors.push('Giá trị giảm không được để trống');
        if (!expiration_date)             errors.push('Ngày hết hạn không được để trống');
    }

    if (voucher_code !== undefined && !voucher_code.trim()) {
        errors.push('Mã voucher không được để trống');
    }

    // Dùng isInWhitelist từ validateHelper để kiểm tra discount_type
    if (discount_type !== undefined && !isInWhitelist(discount_type, ALLOWED_DISCOUNT_TYPES)) {
        errors.push(`discount_type phải là ${ALLOWED_DISCOUNT_TYPES.join(' hoặc ')}`);
    }

    if (discount_value !== undefined) {
        const val = parseFloat(discount_value);
        if (isNaN(val) || val <= 0)                         errors.push('Giá trị giảm phải là số dương');
        else if (discount_type === 'PERCENTAGE' && val > 100) errors.push('Phần trăm giảm không được vượt quá 100%');
    }

    if (min_order_value !== undefined && parseFloat(min_order_value) < 0) {
        errors.push('Giá trị đơn hàng tối thiểu không được âm');
    }

    if (remaining_quantity !== undefined) {
        const qty = Number(remaining_quantity);
        if (!Number.isInteger(qty) || qty < 0) errors.push('Số lượng phải là số nguyên không âm');
    }

    if (expiration_date !== undefined && new Date(expiration_date) <= new Date()) {
        errors.push('Ngày hết hạn phải lớn hơn ngày hiện tại');
    }

    return errors;
};

const normalizeVoucherCode    = (code) => code?.trim().toUpperCase();
const isValidVoucherCodeFormat = (code) => /^[A-Z0-9_-]+$/.test(code);

module.exports = { validateVoucherData, normalizeVoucherCode, isValidVoucherCodeFormat };