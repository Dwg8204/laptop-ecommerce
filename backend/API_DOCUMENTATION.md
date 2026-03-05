# API Documentation với Swagger

## 📚 Truy cập Swagger UI

Sau khi khởi động server backend, truy cập Swagger UI tại:

```
http://localhost:5000/api-docs
```

## 🚀 Cách sử dụng Swagger để test API

### 1. **GET /api/sliders** - Lấy danh sách sliders

#### Bước test:
1. Mở Swagger UI tại `http://localhost:5000/api-docs`
2. Click vào endpoint **GET /api/sliders**
3. Click nút **"Try it out"**
4. Click nút **"Execute"**
5. Xem kết quả trả về ở phần **Response body**

#### Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Lấy dữ liệu thành công",
  "data": [
    {
      "slider_id": 1,
      "title": "Summer Sale",
      "image_url": "https://example.com/banner.jpg",
      "link_url": "https://example.com/sale",
      "display_order": 1,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. **POST /api/sliders** - Tạo slider mới

#### Bước test:
1. Mở Swagger UI tại `http://localhost:5000/api-docs`
2. Click vào endpoint **POST /api/sliders**
3. Click nút **"Try it out"**
4. Chỉnh sửa Request body (JSON) theo mẫu:

```json
{
  "title": "Khuyến mãi Black Friday",
  "image_url": "https://example.com/blackfriday.jpg",
  "link_url": "https://example.com/blackfriday",
  "display_order": 2,
  "is_active": true
}
```

5. Click nút **"Execute"**
6. Xem kết quả trả về ở phần **Response body**

#### Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Thêm Slider mới thành công!",
  "data": {
    "id": 2,
    "title": "Khuyến mãi Black Friday",
    "image_url": "https://example.com/blackfriday.jpg",
    "link_url": "https://example.com/blackfriday",
    "display_order": 2,
    "is_active": true
  }
}
```

---

## 📁 Cấu trúc file OpenAPI

### 1. **config/swagger.js**
File cấu hình chính cho Swagger:
- Định nghĩa thông tin API (title, version, description)
- Định nghĩa servers (development, production)
- Định nghĩa các schemas (Slider, SuccessResponse, ErrorResponse)
- Đường dẫn đến các file chứa JSDoc comments

### 2. **routes/sliderRoutes.js**
File routes có chứa JSDoc comments cho OpenAPI:
- Sử dụng `@swagger` tag
- Mô tả đầy đủ request/response
- Định nghĩa parameters, request body, responses

### 3. **server.js**
Tích hợp Swagger UI vào Express app:
```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

---

## 🔧 Thông tin kỹ thuật

### OpenAPI Version: 3.0.0

### Components Schemas:

#### **Slider Schema**
```yaml
Slider:
  type: object
  required:
    - title
    - image_url
  properties:
    slider_id:
      type: integer
    title:
      type: string
    image_url:
      type: string
    link_url:
      type: string
    display_order:
      type: integer
    is_active:
      type: boolean
    created_at:
      type: string
      format: date-time
```

---

## 💡 Tips

1. **Test nhanh**: Dùng Swagger UI để test API không cần Postman
2. **Xem schema**: Click vào **Schemas** ở cuối trang để xem cấu trúc dữ liệu
3. **Copy curl command**: Swagger tự động tạo curl command để test từ terminal
4. **Response codes**: Xem tất cả response codes có thể (200, 201, 400, 500...)

---

## 📦 Packages đã cài đặt

```json
{
  "swagger-ui-express": "^5.0.1",
  "swagger-jsdoc": "^6.2.8"
}
```

---

## 🌐 URL quan trọng

- **Backend Server**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/api-docs
- **API Base URL**: http://localhost:5000/api

---

Chúc bạn test API thành công! 🎉
