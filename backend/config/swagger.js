const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cấu hình OpenAPI 3.0
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Laptop E-commerce API',
            version: '1.0.0',
            description: 'API Documentation cho hệ thống E-commerce bán laptop',
            contact: {
                name: 'API Support',
                email: 'support@laptop-shop.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'API đăng ký và đăng nhập người dùng'
            },
            {
                name: 'Sliders',
                description: 'API quản lý banner sliders'
            }
        ],
        components: {
            schemas: {
                Slider: {
                    type: 'object',
                    required: ['title', 'image_url'],
                    properties: {
                        slider_id: {
                            type: 'integer',
                            description: 'ID tự động tăng của slider',
                            example: 1
                        },
                        title: {
                            type: 'string',
                            description: 'Tiêu đề của slider',
                            example: 'Summer Sale 2024'
                        },
                        image_url: {
                            type: 'string',
                            description: 'URL hình ảnh slider',
                            example: 'https://example.com/banner.jpg'
                        },
                        link_url: {
                            type: 'string',
                            description: 'URL liên kết khi click vào slider',
                            example: 'https://example.com/sale'
                        },
                        display_order: {
                            type: 'integer',
                            description: 'Thứ tự hiển thị',
                            example: 1
                        },
                        is_active: {
                            type: 'boolean',
                            description: 'Trạng thái kích hoạt',
                            example: true
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Thời gian tạo'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Lấy dữ liệu thành công'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Lỗi máy chủ nội bộ'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        user_id: {
                            type: 'integer',
                            description: 'ID người dùng',
                            example: 1
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email đăng nhập',
                            example: 'user@example.com'
                        },
                        full_name: {
                            type: 'string',
                            description: 'Họ và tên',
                            example: 'Nguyễn Văn A'
                        },
                        phone_number: {
                            type: 'string',
                            description: 'Số điện thoại',
                            example: '0901234567'
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'LOCKED'],
                            description: 'Trạng thái tài khoản',
                            example: 'ACTIVE'
                        },
                        is_email_verified: {
                            type: 'boolean',
                            description: 'Email đã xác thực chưa',
                            example: false
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Thời gian tạo tài khoản'
                        }
                    }
                }
            }
        }
    },
    // Đường dẫn tới các file chứa JSDoc comments
    apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
