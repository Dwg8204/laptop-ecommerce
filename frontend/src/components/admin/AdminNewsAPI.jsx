import React, { useEffect, useState } from "react"
import axios from "axios"
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiSave, 
  FiX, 
  FiImage,
  FiTag,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from "react-icons/fi"
import "../../styles/AdminNews.css"
import { BLOG_API_BASE } from "../../config/api"

const API_BASE = BLOG_API_BASE

const statusLabel = (status) => {
  if (status === "DRAFT") return "Nháp"
  if (status === "PUBLISHED") return "Đã đăng"
  if (status === "HIDDEN") return "Ẩn"
  return status
}

const statusIcon = (status) => {
  if (status === "DRAFT") return <FiClock />
  if (status === "PUBLISHED") return <FiCheckCircle />
  if (status === "HIDDEN") return <FiEyeOff />
  return null
}

const plainText = (html) =>
  String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const excerpt = (html, max = 140) => {
  const text = plainText(html)
  if (!text) return ""
  return text.length > max ? `${text.slice(0, max).trim()}...` : text
}

function AdminNewsAPI() {
  // ===== STATE =====
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ===== FILTERS =====
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [categoryFilter, setCategoryFilter] = useState("ALL")

  // ===== CATEGORY FORM =====
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    category_name: "",
    description: ""
  })

  // ===== POST FORM =====
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPostId, setEditingPostId] = useState(null)
  const [postForm, setPostForm] = useState({
    category_id: "",
    title: "",
    thumbnail_url: "",
    content_html: "",
    status: "DRAFT"
  })

  // ===== LOAD DATA =====
  useEffect(() => {
    loadCategories()
    loadPosts()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`)
      setCategories(response.data?.data || [])
    } catch (err) {
      console.error("❌ Lỗi load categories:", err)
      setError("Không thể tải danh mục")
    }
  }

  const loadPosts = async () => {
    try {
      setLoading(true)
      // Load all posts (admin view, includes all statuses)
      const response = await axios.get(`${API_BASE}/posts/all`)
      setPosts(response.data?.data || [])
      setError("")
    } catch (err) {
      console.error("❌ Lỗi load posts:", err)
      setError("Không thể tải bài viết")
    } finally {
      setLoading(false)
    }
  }

  // ===== CATEGORY ACTIONS =====
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    const name = categoryForm.category_name.trim()
    if (!name) {
      alert("Vui lòng nhập tên danh mục")
      return
    }

    try {
      await axios.post(`${API_BASE}/categories`, {
        category_name: name,
        description: categoryForm.description.trim()
      })
      alert("✅ Đã tạo danh mục")
      setCategoryForm({ category_name: "", description: "" })
      setShowCategoryForm(false)
      loadCategories()
    } catch (err) {
      console.error("❌ Lỗi tạo category:", err)
      alert(err.response?.data?.message || "Không thể tạo danh mục")
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return

    try {
      await axios.delete(`${API_BASE}/categories/${categoryId}`)
      alert("✅ Đã xóa danh mục")
      loadCategories()
      loadPosts() // Reload posts in case some were affected
    } catch (err) {
      console.error("❌ Lỗi xóa category:", err)
      alert(err.response?.data?.message || "Không thể xóa danh mục")
    }
  }

  // ===== POST ACTIONS =====
  const validatePostForm = () => {
    if (!postForm.category_id) return "Vui lòng chọn danh mục"
    if (!postForm.title.trim()) return "Vui lòng nhập tiêu đề"
    if (!plainText(postForm.content_html)) return "Vui lòng nhập nội dung"
    return ""
  }

  const resetPostForm = () => {
    setPostForm({
      category_id: "",
      title: "",
      thumbnail_url: "",
      content_html: "",
      status: "DRAFT"
    })
    setEditingPostId(null)
    setShowPostForm(false)
  }

  const handleSubmitPost = async (e, statusOverride = null) => {
    e.preventDefault()

    const err = validatePostForm()
    if (err) {
      alert(err)
      return
    }

    const payload = {
      category_id: parseInt(postForm.category_id),
      title: postForm.title.trim(),
      thumbnail_url: postForm.thumbnail_url.trim(),
      content_html: postForm.content_html,
      status: statusOverride || postForm.status
    }

    try {
      if (editingPostId) {
        // Update existing post
        await axios.put(`${API_BASE}/posts/${editingPostId}`, payload)
        alert("✅ Đã cập nhật bài viết")
      } else {
        // Create new post
        await axios.post(`${API_BASE}/posts`, payload)
        alert(payload.status === "PUBLISHED" ? "✅ Đã đăng bài" : "✅ Đã lưu nháp")
      }
      
      resetPostForm()
      loadPosts()
    } catch (err) {
      console.error("❌ Lỗi submit post:", err)
      alert(err.response?.data?.message || "Không thể lưu bài viết")
    }
  }

  const handleEditPost = (post) => {
    setEditingPostId(post.post_id)
    setPostForm({
      category_id: String(post.category_id || ""),
      title: post.title || "",
      thumbnail_url: post.thumbnail_url || "",
      content_html: post.content_html || "",
      status: post.status || "DRAFT"
    })
    setShowPostForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return

    try {
      await axios.delete(`${API_BASE}/posts/${postId}`)
      alert("✅ Đã xóa bài viết")
      loadPosts()
    } catch (err) {
      console.error("❌ Lỗi xóa post:", err)
      alert(err.response?.data?.message || "Không thể xóa bài viết")
    }
  }

  const handleChangeStatus = async (postId, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/posts/${postId}/status`, { status: newStatus })
      alert(`✅ Đã chuyển sang: ${statusLabel(newStatus)}`)
      loadPosts()
    } catch (err) {
      console.error("❌ Lỗi đổi status:", err)
      alert(err.response?.data?.message || "Không thể đổi trạng thái")
    }
  }

  // ===== FILTERED POSTS =====
  const filteredPosts = posts.filter(post => {
    // Status filter
    if (statusFilter !== "ALL" && post.status !== statusFilter) return false
    
    // Category filter
    if (categoryFilter !== "ALL" && String(post.category_id) !== categoryFilter) return false
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const title = (post.title || "").toLowerCase()
      const content = (post.content_html || "").toLowerCase()
      if (!title.includes(query) && !content.includes(query)) return false
    }
    
    return true
  })

  // ===== CATEGORY MAP =====
  const categoryMap = {}
  categories.forEach(cat => {
    categoryMap[cat.category_id] = cat.category_name
  })

  // ===== RENDER =====
  return (
    <div className="admin-news-container">
      <div className="admin-news-header">
        <div>
          <h2>📰 Quản lý Tin tức</h2>
          <p className="admin-news-subtitle">Sắp xếp nội dung, trạng thái và danh mục trên một màn hình rõ ràng.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
          >
            <FiTag /> Quản lý Danh mục
          </button>
          <button 
            className="btn-success"
            onClick={() => {
              resetPostForm()
              setShowPostForm(true)
            }}
          >
            <FiPlus /> Tạo bài viết mới
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <FiAlertCircle /> {error}
        </div>
      )}

      <section className="news-overview">
        <div className="news-overview-card">
          <span className="news-overview-label">Tổng bài viết</span>
          <strong>{posts.length}</strong>
        </div>
        <div className="news-overview-card is-published">
          <span className="news-overview-label">Đã đăng</span>
          <strong>{posts.filter((p) => p.status === "PUBLISHED").length}</strong>
        </div>
        <div className="news-overview-card is-draft">
          <span className="news-overview-label">Bản nháp</span>
          <strong>{posts.filter((p) => p.status === "DRAFT").length}</strong>
        </div>
        <div className="news-overview-card is-categories">
          <span className="news-overview-label">Danh mục</span>
          <strong>{categories.length}</strong>
        </div>
      </section>

      <div className="admin-news-layout">
        <aside className="admin-news-left">
          {/* CATEGORY MANAGEMENT */}
          {showCategoryForm && (
            <div className="card category-section">
              <div className="card-header">
                <h3><FiTag /> Danh mục</h3>
                <button className="btn-icon" onClick={() => setShowCategoryForm(false)}>
                  <FiX />
                </button>
              </div>
              <div className="card-body">
                <form onSubmit={handleCreateCategory} className="category-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Tên danh mục"
                      value={categoryForm.category_name}
                      onChange={(e) => setCategoryForm({...categoryForm, category_name: e.target.value})}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Mô tả (tùy chọn)"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className="form-input"
                    />
                    <button type="submit" className="btn-primary">
                      <FiPlus /> Thêm
                    </button>
                  </div>
                </form>

                <div className="category-list">
                  {categories.length === 0 ? (
                    <p className="text-muted">Chưa có danh mục nào</p>
                  ) : (
                    categories.map(cat => (
                      <div key={cat.category_id} className="category-item">
                        <div className="category-info">
                          <strong>{cat.category_name}</strong>
                          {cat.description && <span className="text-muted">— {cat.description}</span>}
                        </div>
                        <button 
                          className="btn-icon btn-danger"
                          onClick={() => handleDeleteCategory(cat.category_id)}
                          title="Xóa danh mục"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* POST FORM */}
          {showPostForm && (
            <div className="card post-form-section">
              <div className="card-header">
                <h3>{editingPostId ? "✏️ Chỉnh sửa bài viết" : "➕ Tạo bài viết mới"}</h3>
                <button className="btn-icon" onClick={resetPostForm}>
                  <FiX />
                </button>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitPost}>
                  <div className="form-group">
                    <label>Danh mục *</label>
                    <select
                      value={postForm.category_id}
                      onChange={(e) => setPostForm({...postForm, category_id: e.target.value})}
                      className="form-select"
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tiêu đề *</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      className="form-input"
                      placeholder="Nhập tiêu đề bài viết"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Ảnh thumbnail (URL)</label>
                    <div className="input-with-icon">
                      <FiImage />
                      <input
                        type="text"
                        value={postForm.thumbnail_url}
                        onChange={(e) => setPostForm({...postForm, thumbnail_url: e.target.value})}
                        className="form-input"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {postForm.thumbnail_url && (
                      <img 
                        src={postForm.thumbnail_url} 
                        alt="Preview" 
                        className="thumbnail-preview"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Nội dung bài viết *</label>
                    <textarea
                      value={postForm.content_html}
                      onChange={(e) => setPostForm({ ...postForm, content_html: e.target.value })}
                      placeholder="Nhập nội dung tin tức (hỗ trợ HTML cơ bản)..."
                      className="form-textarea news-editor"
                      rows="8"
                    />
                    <small className="editor-hint">
                      💡 Bạn có thể nhập HTML cơ bản: &lt;h2&gt;Tiêu đề&lt;/h2&gt;, &lt;p&gt;Đoạn văn&lt;/p&gt;, &lt;img src="..."&gt;, &lt;a href="..."&gt;Liên kết&lt;/a&gt;
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                      value={postForm.status}
                      onChange={(e) => setPostForm({...postForm, status: e.target.value})}
                      className="form-select"
                    >
                      <option value="DRAFT">Nháp</option>
                      <option value="PUBLISHED">Đã đăng</option>
                      <option value="HIDDEN">Ẩn</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={resetPostForm}>
                      <FiX /> Hủy
                    </button>
                    <button 
                      type="button" 
                      className="btn-warning"
                      onClick={(e) => handleSubmitPost(e, "DRAFT")}
                    >
                      <FiSave /> Lưu nháp
                    </button>
                    <button 
                      type="submit" 
                      className="btn-success"
                    >
                      <FiCheckCircle /> {editingPostId ? "Cập nhật" : "Đăng bài"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </aside>

        <section className="admin-news-right">
          {/* FILTERS */}
          <div className="card filters-section">
            <div className="card-header">
              <h3><FiSearch /> Bộ lọc nhanh</h3>
            </div>
            <div className="card-body">
              <div className="filters-grid">
                <div className="filter-field">
                  <label className="filter-label">Từ khóa</label>
                  <div className="search-box">
                    <FiSearch />
                    <input
                      type="text"
                      placeholder="Tìm theo tiêu đề hoặc nội dung..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="filter-field">
                  <label className="filter-label">Danh mục</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="ALL">Tất cả danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.category_id} value={String(cat.category_id)}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label className="filter-label">Trạng thái</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="DRAFT">Nháp</option>
                    <option value="PUBLISHED">Đã đăng</option>
                    <option value="HIDDEN">Ẩn</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* POSTS LIST */}
          <div className="card posts-section">
            <div className="card-header">
              <h3>📝 Danh sách bài viết ({filteredPosts.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-spinner">Đang tải...</div>
              ) : filteredPosts.length === 0 ? (
                <p className="text-muted">Không có bài viết nào</p>
              ) : (
                <div className="posts-list">
                  {filteredPosts.map(post => (
                    <div key={post.post_id} className="post-item">
                      <div className="post-thumbnail">
                        {post.thumbnail_url ? (
                          <img src={post.thumbnail_url} alt={post.title} />
                        ) : (
                          <div className="placeholder-thumbnail">
                            <FiImage />
                          </div>
                        )}
                      </div>

                      <div className="post-content">
                        <div className="post-meta">
                          <span className="post-category">
                            <FiTag /> {categoryMap[post.category_id] || "Không rõ"}
                          </span>
                          <span className={`post-status status-${post.status.toLowerCase()}`}>
                            {statusIcon(post.status)} {statusLabel(post.status)}
                          </span>
                        </div>

                        <h4 className="post-title">{post.title}</h4>

                        {excerpt(post.content_html) && (
                          <p className="post-excerpt">{excerpt(post.content_html)}</p>
                        )}

                        <div className="post-info">
                          <span><FiEye /> {post.view_count || 0} lượt xem</span>
                          {post.published_at && (
                            <span>📅 {new Date(post.published_at).toLocaleDateString('vi-VN')}</span>
                          )}
                          {post.updated_at && (
                            <span>🛠️ Cập nhật: {new Date(post.updated_at).toLocaleDateString('vi-VN')}</span>
                          )}
                        </div>
                      </div>

                      <div className="post-actions">
                        <button 
                          className="btn-icon btn-primary"
                          onClick={() => handleEditPost(post)}
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 />
                        </button>

                        {post.status === "DRAFT" && (
                          <button 
                            className="btn-icon btn-success"
                            onClick={() => handleChangeStatus(post.post_id, "PUBLISHED")}
                            title="Đăng bài"
                          >
                            <FiCheckCircle />
                          </button>
                        )}

                        {post.status === "PUBLISHED" && (
                          <button 
                            className="btn-icon btn-warning"
                            onClick={() => handleChangeStatus(post.post_id, "HIDDEN")}
                            title="Ẩn bài"
                          >
                            <FiEyeOff />
                          </button>
                        )}

                        {post.status === "HIDDEN" && (
                          <button 
                            className="btn-icon btn-info"
                            onClick={() => handleChangeStatus(post.post_id, "PUBLISHED")}
                            title="Hiện bài"
                          >
                            <FiEye />
                          </button>
                        )}

                        <button 
                          className="btn-icon btn-danger"
                          onClick={() => handleDeletePost(post.post_id)}
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminNewsAPI
