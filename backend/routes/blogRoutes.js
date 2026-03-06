const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// ============ BLOG CATEGORIES ROUTES ============

/**
 * @swagger
 * /api/blog/categories:
 *   get:
 *     summary: Lấy tất cả danh mục tin tức
 *     tags: [Blog Categories]
 *     description: Lấy danh sách tất cả danh mục tin tức kèm số lượng bài viết
 *     responses:
 *       200:
 *         description: Lấy danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh mục thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogCategory'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/categories', blogController.getAllCategories);

/**
 * @swagger
 * /api/blog/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục theo ID
 *     tags: [Blog Categories]
 *     description: Lấy thông tin chi tiết của một danh mục
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Lấy danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh mục thành công
 *                 data:
 *                   $ref: '#/components/schemas/BlogCategory'
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.get('/categories/:id', blogController.getCategoryById);

/**
 * @swagger
 * /api/blog/categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Blog Categories]
 *     description: Tạo một danh mục tin tức mới (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *                 example: Công nghệ
 *               description:
 *                 type: string
 *                 example: Tin tức về công nghệ
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tạo danh mục thành công
 *                 data:
 *                   $ref: '#/components/schemas/BlogCategory'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc tên danh mục đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post('/categories', blogController.createCategory);

/**
 * @swagger
 * /api/blog/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [Blog Categories]
 *     description: Cập nhật thông tin danh mục (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *                 example: Công nghệ AI
 *               description:
 *                 type: string
 *                 example: Tin tức về AI và Machine Learning
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.put('/categories/:id', blogController.updateCategory);

/**
 * @swagger
 * /api/blog/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Blog Categories]
 *     description: Xóa một danh mục (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.delete('/categories/:id', blogController.deleteCategory);

// ============ BLOG POSTS ROUTES ============

/**
 * @swagger
 * /api/blog/posts/published:
 *   get:
 *     summary: Lấy tất cả bài viết đã xuất bản
 *     tags: [Blog Posts]
 *     description: Lấy danh sách bài viết đã xuất bản (cho người dùng)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng bài viết trên mỗi trang
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Vị trí bắt đầu
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách bài viết thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
 *       500:
 *         description: Lỗi server
 */
router.get('/posts/published', blogController.getPublishedPosts);

/**
 * @swagger
 * /api/blog/posts/all:
 *   get:
 *     summary: Lấy tất cả bài viết
 *     tags: [Blog Posts]
 *     description: Lấy tất cả bài viết bao gồm cả draft (Admin only)
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách bài viết thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
 *       500:
 *         description: Lỗi server
 */
router.get('/posts/all', blogController.getAllPosts);

/**
 * @swagger
 * /api/blog/posts/search:
 *   get:
 *     summary: Tìm kiếm bài viết
 *     tags: [Blog Posts]
 *     description: Tìm kiếm bài viết theo từ khóa trong tiêu đề và nội dung
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *         example: laptop gaming
 *     responses:
 *       200:
 *         description: Tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tìm kiếm thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Thiếu từ khóa tìm kiếm
 *       500:
 *         description: Lỗi server
 */
router.get('/posts/search', blogController.searchPosts);

/**
 * @swagger
 * /api/blog/posts/category/{categoryId}:
 *   get:
 *     summary: Lấy bài viết theo danh mục
 *     tags: [Blog Posts]
 *     description: Lấy tất cả bài viết đã xuất bản thuộc một danh mục
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách bài viết thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
 *       500:
 *         description: Lỗi server
 */
router.get('/posts/category/:categoryId', blogController.getPostsByCategory);

/**
 * @swagger
 * /api/blog/posts/{id}/related:
 *   get:
 *     summary: Lấy bài viết liên quan
 *     tags: [Blog Posts]
 *     description: Lấy các bài viết liên quan cùng danh mục
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Số lượng bài viết liên quan
 *     responses:
 *       200:
 *         description: Lấy bài viết liên quan thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy bài viết liên quan thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */
router.get('/posts/:id/related', blogController.getRelatedPosts);

/**
 * @swagger
 * /api/blog/posts/{id}:
 *   get:
 *     summary: Lấy chi tiết bài viết
 *     tags: [Blog Posts]
 *     description: Lấy thông tin chi tiết của một bài viết và tự động tăng view count
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy bài viết thành công
 *                 data:
 *                   $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */
router.get('/posts/:id', blogController.getPostById);

/**
 * @swagger
 * /api/blog/posts:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Blog Posts]
 *     description: Tạo một bài viết tin tức mới (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content_html
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Top 5 Laptop Gaming 2026
 *               thumbnail_url:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               content_html:
 *                 type: string
 *                 example: <p>Nội dung bài viết...</p>
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, HIDDEN]
 *                 default: DRAFT
 *                 example: DRAFT
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tạo bài viết thành công
 *                 data:
 *                   $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/posts', blogController.createPost);

/**
 * @swagger
 * /api/blog/posts/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Blog Posts]
 *     description: Cập nhật thông tin bài viết (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content_html
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Top 5 Laptop Gaming 2026 - Updated
 *               thumbnail_url:
 *                 type: string
 *                 example: https://example.com/new-image.jpg
 *               content_html:
 *                 type: string
 *                 example: <p>Nội dung cập nhật...</p>
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, HIDDEN]
 *                 example: PUBLISHED
 *     responses:
 *       200:
 *         description: Cập nhật bài viết thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */
router.put('/posts/:id', blogController.updatePost);

/**
 * @swagger
 * /api/blog/posts/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     tags: [Blog Posts]
 *     description: Xóa một bài viết (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */
router.delete('/posts/:id', blogController.deletePost);

module.exports = router;
