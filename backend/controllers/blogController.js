const Blog = require('../models/blogModel');

const blogController = {
    // ============ BLOG CATEGORIES ============
    
    // Lấy tất cả danh mục tin tức
    getAllCategories: async (req, res) => {
        try {
            const categories = await Blog.getAllCategories();
            res.status(200).json({ 
                success: true, 
                message: 'Lấy danh mục thành công',
                data: categories 
            });
        } catch (error) {
            console.error('Error getting categories:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh mục' });
        }
    },

    // Lấy danh mục theo ID
    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Blog.getCategoryById(id);
            
            if (!category) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy danh mục' 
                });
            }
            
            res.status(200).json({ 
                success: true, 
                message: 'Lấy danh mục thành công',
                data: category 
            });
        } catch (error) {
            console.error('Error getting category:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh mục' });
        }
    },

    // Tạo danh mục mới (Admin)
    createCategory: async (req, res) => {
        try {
            const { category_name, description } = req.body;

            if (!category_name) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tên danh mục không được để trống' 
                });
            }

            const categoryId = await Blog.createCategory(req.body);
            
            res.status(201).json({ 
                success: true, 
                message: 'Tạo danh mục thành công',
                data: { category_id: categoryId, ...req.body }
            });
        } catch (error) {
            console.error('Error creating category:', error);
            
            // Xử lý trường hợp tên danh mục bị trùng
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tên danh mục đã tồn tại' 
                });
            }
            
            res.status(500).json({ success: false, message: 'Lỗi khi tạo danh mục' });
        }
    },

    // Cập nhật danh mục (Admin)
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { category_name, description } = req.body;

            if (!category_name) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tên danh mục không được để trống' 
                });
            }

            const success = await Blog.updateCategory(id, req.body);
            
            if (!success) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy danh mục' 
                });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Cập nhật danh mục thành công'
            });
        } catch (error) {
            console.error('Error updating category:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tên danh mục đã tồn tại' 
                });
            }
            
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật danh mục' });
        }
    },

    // Xóa danh mục (Admin)
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const success = await Blog.deleteCategory(id);
            
            if (!success) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy danh mục' 
                });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Xóa danh mục thành công'
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục' });
        }
    },

    // ============ BLOG POSTS ============
    
    // Lấy tất cả bài viết (Admin - bao gồm cả draft)
    getAllPosts: async (req, res) => {
        try {
            const posts = await Blog.getAllPosts();
            res.status(200).json({ 
                success: true, 
                message: 'Lấy danh sách bài viết thành công',
                data: posts 
            });
        } catch (error) {
            console.error('Error getting all posts:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách bài viết' });
        }
    },

    // Lấy bài viết đã publish (Public)
    getPublishedPosts: async (req, res) => {
        try {
            const { limit, offset } = req.query;
            const posts = await Blog.getPublishedPosts(limit, offset);
            
            res.status(200).json({ 
                success: true, 
                message: 'Lấy danh sách bài viết thành công',
                data: posts 
            });
        } catch (error) {
            console.error('Error getting published posts:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách bài viết' });
        }
    },

    // Lấy bài viết theo danh mục (Public)
    getPostsByCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const posts = await Blog.getPostsByCategory(categoryId);
            
            res.status(200).json({ 
                success: true, 
                message: 'Lấy danh sách bài viết thành công',
                data: posts 
            });
        } catch (error) {
            console.error('Error getting posts by category:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách bài viết' });
        }
    },

    // Lấy chi tiết bài viết
    getPostById: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await Blog.getPostById(id);
            
            if (!post) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy bài viết' 
                });
            }

            // Tăng lượt xem nếu bài viết đã được publish
            if (post.status === 'PUBLISHED') {
                await Blog.incrementViewCount(id);
                post.view_count += 1;
            }
            
            res.status(200).json({ 
                success: true, 
                message: 'Lấy bài viết thành công',
                data: post 
            });
        } catch (error) {
            console.error('Error getting post:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy bài viết' });
        }
    },

    // Tạo bài viết mới (Admin)
    createPost: async (req, res) => {
        try {
            const { title, content_html, category_id, thumbnail_url, status } = req.body;

            // Validate dữ liệu
            if (!title || !content_html) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tiêu đề và nội dung không được để trống' 
                });
            }

            // Lấy author_id từ user đã đăng nhập (từ middleware auth)
            const author_id = req.user?.user_id || null;

            const postData = {
                ...req.body,
                author_id
            };

            const postId = await Blog.createPost(postData);
            
            res.status(201).json({ 
                success: true, 
                message: 'Tạo bài viết thành công',
                data: { post_id: postId, ...postData }
            });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo bài viết' });
        }
    },

    // Cập nhật bài viết (Admin)
    updatePost: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content_html } = req.body;

            if (!title || !content_html) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tiêu đề và nội dung không được để trống' 
                });
            }

            const success = await Blog.updatePost(id, req.body);
            
            if (!success) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy bài viết' 
                });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Cập nhật bài viết thành công'
            });
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật bài viết' });
        }
    },

    // Xóa bài viết (Admin)
    deletePost: async (req, res) => {
        try {
            const { id } = req.params;
            const success = await Blog.deletePost(id);
            
            if (!success) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy bài viết' 
                });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Xóa bài viết thành công'
            });
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi xóa bài viết' });
        }
    },

    // Tìm kiếm bài viết (Public)
    searchPosts: async (req, res) => {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Từ khóa tìm kiếm không được để trống' 
                });
            }

            const posts = await Blog.searchPosts(q);
            
            res.status(200).json({ 
                success: true, 
                message: 'Tìm kiếm thành công',
                data: posts 
            });
        } catch (error) {
            console.error('Error searching posts:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm bài viết' });
        }
    },

    // Lấy bài viết liên quan (Public)
    getRelatedPosts: async (req, res) => {
        try {
            const { id } = req.params;
            const { limit } = req.query;
            
            // Lấy thông tin bài viết hiện tại
            const currentPost = await Blog.getPostById(id);
            
            if (!currentPost) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy bài viết' 
                });
            }

            const relatedPosts = await Blog.getRelatedPosts(
                id, 
                currentPost.category_id, 
                limit || 4
            );
            
            res.status(200).json({ 
                success: true, 
                message: 'Lấy bài viết liên quan thành công',
                data: relatedPosts 
            });
        } catch (error) {
            console.error('Error getting related posts:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy bài viết liên quan' });
        }
    }
};

module.exports = blogController;
