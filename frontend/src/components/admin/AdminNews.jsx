import React, { useEffect, useMemo, useState } from "react"
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
  FiFilter,
  FiMoreVertical,
  FiFile,
  FiCheckCircle,
  FiClock,
  FiCalendar
} from "react-icons/fi"
import "../../styles/Admin.css"

/**
 * AdminNews - Quản lý tin tức 
 * - Lưu mock data vào localStorage
 * - Field names bám theo schema MySQL:
 *   blog_categories(category_id, category_name, description, created_at)
 *   blog_posts(post_id, category_id, author_id, title, thumbnail_url, content_html,
 *              view_count, status, published_at)
 */

const LS_CATEGORIES_KEY = "blog_categories"
const LS_POSTS_KEY = "blog_posts"

const nowISO = () => new Date().toISOString()
const normalize = (s) => String(s || "").toLowerCase().trim()

const statusLabel = (status) => {
  if (status === "DRAFT") return "Nháp"
  if (status === "PUBLISHED") return "Đã đăng"
  if (status === "HIDDEN") return "Đã ẩn"
  return status
}

function loadFromLS(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function saveToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const seedCategories = [
  { category_id: 1, category_name: "Khuyến mãi", description: "Tin khuyến mãi, ưu đãi", created_at: nowISO() },
  { category_id: 2, category_name: "Sản phẩm mới", description: "Giới thiệu sản phẩm mới", created_at: nowISO() },
  { category_id: 3, category_name: "Review", description: "Đánh giá và trải nghiệm", created_at: nowISO() },
]

const seedPosts = [
  {
    post_id: 1,
    category_id: 1,
    author_id: null,
    title: "Sale Tháng 3 - Giảm tới 15%",
    thumbnail_url: "",
    content_html: "<p>Nội dung mẫu: chương trình khuyến mãi tháng 3...</p>",
    view_count: 0,
    status: "PUBLISHED",
    published_at: nowISO(),
    created_at: nowISO(),
    updated_at: nowISO(),
  },
  {
    post_id: 2,
    category_id: 2,
    author_id: null,
    title: "Ra mắt Vivobook 16X 2026",
    thumbnail_url: "",
    content_html: "<p>Nội dung mẫu: thông số, điểm nổi bật...</p>",
    view_count: 0,
    status: "DRAFT",
    published_at: nowISO(),
    created_at: nowISO(),
    updated_at: nowISO(),
  },
]

function AdminNews() {
  // ===== DATA =====
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])

  // ===== FILTERS =====
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [categoryFilter, setCategoryFilter] = useState("ALL")

  // ===== CATEGORY FORM =====
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    description: "",
  })

  // ===== POST FORM =====
  const emptyPostForm = {
    category_id: "",
    title: "",
    thumbnail_url: "",
    content_html: "",
    status: "DRAFT",
  }
  const [postForm, setPostForm] = useState(emptyPostForm)
  const [editingPostId, setEditingPostId] = useState("")

  // ===== INIT FROM localStorage =====
  useEffect(() => {
    const storedCats = loadFromLS(LS_CATEGORIES_KEY, null)
    const storedPosts = loadFromLS(LS_POSTS_KEY, null)

    if (!storedCats) {
      saveToLS(LS_CATEGORIES_KEY, seedCategories)
      setCategories(seedCategories)
    } else {
      setCategories(storedCats)
    }

    if (!storedPosts) {
      saveToLS(LS_POSTS_KEY, seedPosts)
      setPosts(seedPosts)
    } else {
      setPosts(storedPosts)
    }
  }, [])

  // Persist
  useEffect(() => {
    saveToLS(LS_CATEGORIES_KEY, categories)
  }, [categories])

  useEffect(() => {
    saveToLS(LS_POSTS_KEY, posts)
  }, [posts])

  // ===== DERIVED =====
  const categoryMap = useMemo(() => {
    const m = new Map()
    categories.forEach((c) => m.set(String(c.category_id), c))
    return m
  }, [categories])

  const filteredPosts = useMemo(() => {
    const query = normalize(q)
    return posts
      .filter((p) => {
        if (statusFilter !== "ALL" && p.status !== statusFilter) return false
        if (categoryFilter !== "ALL" && String(p.category_id) !== String(categoryFilter)) return false
        if (!query) return true
        return normalize(p.title).includes(query)
      })
      .sort((a, b) => {
        const au = new Date(a.updated_at || a.published_at || 0).getTime()
        const bu = new Date(b.updated_at || b.published_at || 0).getTime()
        return bu - au
      })
  }, [posts, q, statusFilter, categoryFilter])

  // ===== ACTIONS: categories =====
  const handleCreateCategory = (e) => {
    e.preventDefault()
    const name = newCategory.category_name.trim()
    if (!name) return alert("Vui lòng nhập tên danh mục")

    // mimic UNIQUE(category_name)
    const exists = categories.some((c) => normalize(c.category_name) === normalize(name))
    if (exists) return alert("Danh mục đã tồn tại")

    // mimic AUTO_INCREMENT
    const maxId = categories.reduce((max, c) => Math.max(max, Number(c.category_id) || 0), 0)
    const nextId = maxId + 1

    const payload = {
      category_id: nextId,
      category_name: name,
      description: newCategory.description.trim(),
      created_at: nowISO(),
    }

    setCategories((prev) => [payload, ...prev])
    setNewCategory({ category_name: "", description: "" })
  }

  // ===== ACTIONS: posts =====
  const validatePostForm = (form) => {
    if (!String(form.category_id || "").trim()) return "Vui lòng chọn danh mục"
    if (!String(form.title || "").trim()) return "Vui lòng nhập tiêu đề"
    if (!String(form.content_html || "").trim()) return "Vui lòng nhập nội dung (HTML)"
    return ""
  }

  const resetPostForm = () => {
    setPostForm(emptyPostForm)
    setEditingPostId("")
  }

  const handleSubmitPost = (e, forceStatus = null) => {
    e.preventDefault()

    const next = {
      ...postForm,
      category_id: Number(postForm.category_id),
      title: postForm.title.trim(),
      thumbnail_url: postForm.thumbnail_url.trim(),
      content_html: postForm.content_html,
      status: forceStatus || postForm.status || "DRAFT",
    }

    const err = validatePostForm(next)
    if (err) return alert(err)

    if (editingPostId) {
      setPosts((prev) =>
        prev.map((p) => {
          if (String(p.post_id) !== String(editingPostId)) return p
          return {
            ...p,
            ...next,
            published_at: p.status !== "PUBLISHED" && next.status === "PUBLISHED" ? nowISO() : p.published_at,
            updated_at: nowISO(),
          }
        })
      )
      alert("✅ Đã cập nhật bài viết")
    } else {
      const maxId = posts.reduce((max, p) => Math.max(max, Number(p.post_id) || 0), 0)
      const nextId = maxId + 1

      const payload = {
        post_id: nextId,
        category_id: next.category_id,
        author_id: null, // sau này lấy từ token/backend
        title: next.title,
        thumbnail_url: next.thumbnail_url,
        content_html: next.content_html,
        view_count: 0,
        status: next.status,
        published_at: next.status === "PUBLISHED" ? nowISO() : nowISO(),
        created_at: nowISO(),
        updated_at: nowISO(),
      }

      setPosts((prev) => [payload, ...prev])
      alert(next.status === "PUBLISHED" ? "✅ Đã đăng bài" : "✅ Đã lưu nháp")
    }

    resetPostForm()
  }

  const handleEditPost = (post) => {
    setEditingPostId(post.post_id)
    setPostForm({
      category_id: String(post.category_id ?? ""),
      title: post.title ?? "",
      thumbnail_url: post.thumbnail_url ?? "",
      content_html: post.content_html ?? "",
      status: post.status ?? "DRAFT",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDeletePost = (postId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return
    setPosts((prev) => prev.filter((p) => String(p.post_id) !== String(postId)))
  }

  const setPostStatus = (postId, status) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (String(p.post_id) !== String(postId)) return p
        return {
          ...p,
          status,
          published_at: p.status !== "PUBLISHED" && status === "PUBLISHED" ? nowISO() : p.published_at,
          updated_at: nowISO(),
        }
      })
    )
  }

  const previewPost = (post) => {
    const w = window.open("", "_blank")
    if (!w) return alert("Trình duyệt đang chặn popup. Hãy cho phép popup để xem preview.")
    const cat = categoryMap.get(String(post.category_id))?.category_name || "Không rõ"
    w.document.write(`
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>${post.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 920px; margin: 0 auto; }
            .meta { color: #666; margin-bottom: 14px; }
            .badge { display:inline-block; padding:2px 8px; border:1px solid #ddd; border-radius:999px; font-size:12px; margin-right: 6px; }
            img { max-width: 100%; height: auto; border-radius: 10px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>${post.title}</h1>
          <div class="meta">
            <span class="badge">${cat}</span>
            <span class="badge">${post.status}</span>
            <span>${new Date(post.published_at || post.updated_at || Date.now()).toLocaleString("vi-VN")}</span>
          </div>
          ${post.thumbnail_url ? `<img src="${post.thumbnail_url}" alt="thumbnail"/>` : ""}
          <div>${post.content_html}</div>
        </body>
      </html>
    `)
    w.document.close()
  }

  return (
    <div className="adm-news-container">
      {/* Header Section */}
      <div className="adm-news-header">
        <div className="adm-news-header-content">
          <div className="adm-news-title-group">
            <h2 className="adm-news-title">
              <FiFile className="adm-news-title-icon" />
              Quản lý Tin tức
            </h2>
            <p className="adm-news-subtitle">
              Tạo, chỉnh sửa và quản lý các bài viết tin tức
            </p>
          </div>
          <button 
            className="adm-btn-create"
            onClick={resetPostForm}
          >
            <FiPlus /> Tạo bài viết mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="adm-news-stats">
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-primary">
              <FiFile />
            </div>
            <div className="adm-stat-info">
              <div className="adm-stat-value">{posts.length}</div>
              <div className="adm-stat-label">Tổng bài viết</div>
            </div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-success">
              <FiCheckCircle />
            </div>
            <div className="adm-stat-info">
              <div className="adm-stat-value">
                {posts.filter(p => p.status === 'PUBLISHED').length}
              </div>
              <div className="adm-stat-label">Đã đăng</div>
            </div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-warning">
              <FiClock />
            </div>
            <div className="adm-stat-info">
              <div className="adm-stat-value">
                {posts.filter(p => p.status === 'DRAFT').length}
              </div>
              <div className="adm-stat-label">Bản nháp</div>
            </div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-icon adm-stat-muted">
              <FiEyeOff />
            </div>
            <div className="adm-stat-info">
              <div className="adm-stat-value">
                {posts.filter(p => p.status === 'HIDDEN').length}
              </div>
              <div className="adm-stat-label">Đã ẩn</div>
            </div>
          </div>
        </div>
      </div>

      <div className="adm-news-layout">
        {/* Sidebar - Form và Categories */}
        <aside className="adm-news-sidebar">
          {/* Post Form Card */}
          <div className="adm-news-card">
            <div className="adm-news-card-header">
              <h3 className="adm-news-card-title">
                {editingPostId ? (
                  <>
                    <FiEdit2 /> Chỉnh sửa bài viết
                  </>
                ) : (
                  <>
                    <FiPlus /> Tạo bài viết mới
                  </>
                )}
              </h3>
              {editingPostId && (
                <button 
                  className="adm-btn-icon"
                  onClick={resetPostForm}
                  title="Hủy chỉnh sửa"
                >
                  <FiX />
                </button>
              )}
            </div>
            
            <form onSubmit={(e) => handleSubmitPost(e)} className="adm-news-form">
              <div className="adm-form-group">
                <label className="adm-form-label">
                  <FiTag /> Danh mục
                </label>
                <select
                  className="adm-form-select"
                  value={postForm.category_id}
                  onChange={(e) => setPostForm((p) => ({ ...p, category_id: e.target.value }))}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Tiêu đề</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={postForm.title}
                  onChange={(e) => setPostForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">
                  <FiImage /> URL hình ảnh
                </label>
                <input
                  type="url"
                  className="adm-form-input"
                  value={postForm.thumbnail_url}
                  onChange={(e) => setPostForm((p) => ({ ...p, thumbnail_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                {postForm.thumbnail_url && (
                  <div className="adm-image-preview">
                    <img 
                      src={postForm.thumbnail_url} 
                      alt="Preview"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Nội dung (HTML)</label>
                <textarea
                  className="adm-form-textarea"
                  rows={8}
                  value={postForm.content_html}
                  onChange={(e) => setPostForm((p) => ({ ...p, content_html: e.target.value }))}
                  placeholder="<p>Nội dung bài viết...</p>"
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Trạng thái</label>
                <select
                  className="adm-form-select"
                  value={postForm.status}
                  onChange={(e) => setPostForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Đã đăng</option>
                  <option value="HIDDEN">Ẩn</option>
                </select>
              </div>

              <div className="adm-form-actions">
                <button 
                  type="button" 
                  className="adm-btn-secondary"
                  onClick={(e) => handleSubmitPost(e, "DRAFT")}
                >
                  <FiSave /> Lưu nháp
                </button>
                <button 
                  type="button" 
                  className="adm-btn-primary"
                  onClick={(e) => handleSubmitPost(e, "PUBLISHED")}
                >
                  <FiCheckCircle /> {editingPostId ? 'Cập nhật' : 'Đăng bài'}
                </button>
              </div>
            </form>
          </div>

          {/* Categories Management */}
          <div className="adm-news-card">
            <div className="adm-news-card-header">
              <h3 className="adm-news-card-title">
                <FiTag /> Danh mục
              </h3>
            </div>
            
            <form onSubmit={handleCreateCategory} className="adm-news-form">
              <div className="adm-form-group">
                <input
                  type="text"
                  className="adm-form-input"
                  value={newCategory.category_name}
                  onChange={(e) => setNewCategory((p) => ({ ...p, category_name: e.target.value }))}
                  placeholder="Tên danh mục..."
                />
              </div>
              <div className="adm-form-group">
                <input
                  type="text"
                  className="adm-form-input"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả..."
                />
              </div>
              <button type="submit" className="adm-btn-block">
                <FiPlus /> Thêm danh mục
              </button>
            </form>

            <div className="adm-category-list">
              {categories.map((c) => (
                <div key={c.category_id} className="adm-category-item">
                  <div className="adm-category-badge">{c.category_name}</div>
                  {c.description && (
                    <div className="adm-category-desc">{c.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Posts List */}
        <main className="adm-news-main">
          {/* Filters */}
          <div className="adm-news-filters">
            <div className="adm-search-box">
              <FiSearch className="adm-search-icon" />
              <input
                type="text"
                className="adm-search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
              />
            </div>

            <div className="adm-filter-row">
              <select 
                className="adm-filter-select"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Đã đăng</option>
                <option value="HIDDEN">Đã ẩn</option>
              </select>

              <select 
                className="adm-filter-select"
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="adm-posts-grid">
            {filteredPosts.length === 0 ? (
              <div className="adm-empty-state">
                <FiFile className="adm-empty-icon" />
                <p className="adm-empty-text">Không tìm thấy bài viết nào</p>
                <p className="adm-empty-subtext">
                  Thử thay đổi bộ lọc hoặc tạo bài viết mới
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const cat = categoryMap.get(String(post.category_id))?.category_name || "Không rõ"
                const updated = post.updated_at || post.published_at
                
                return (
                  <article key={post.post_id} className="adm-post-card">
                    {/* Thumbnail */}
                    <div className="adm-post-thumbnail">
                      {post.thumbnail_url ? (
                        <img 
                          src={post.thumbnail_url} 
                          alt={post.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="adm-post-no-image">
                          <FiImage />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`adm-post-status adm-status-${post.status.toLowerCase()}`}>
                        {post.status === 'PUBLISHED' && <FiCheckCircle />}
                        {post.status === 'DRAFT' && <FiClock />}
                        {post.status === 'HIDDEN' && <FiEyeOff />}
                        {statusLabel(post.status)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="adm-post-content">
                      <div className="adm-post-meta">
                        <span className="adm-post-category">
                          <FiTag /> {cat}
                        </span>
                        <span className="adm-post-date">
                          <FiCalendar /> {updated ? new Date(updated).toLocaleDateString("vi-VN") : "—"}
                        </span>
                      </div>

                      <h3 className="adm-post-title">{post.title}</h3>
                      
                      <div 
                        className="adm-post-excerpt"
                        dangerouslySetInnerHTML={{ 
                          __html: post.content_html?.substring(0, 100) + '...' || '' 
                        }}
                      />

                      {/* Actions */}
                      <div className="adm-post-actions">
                        <button 
                          className="adm-btn-action adm-btn-primary"
                          onClick={() => previewPost(post)}
                          title="Xem trước"
                        >
                          <FiEye /> Xem
                        </button>
                        
                        <button 
                          className="adm-btn-action"
                          onClick={() => handleEditPost(post)}
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 /> Sửa
                        </button>

                        {post.status !== 'PUBLISHED' ? (
                          <button 
                            className="adm-btn-action adm-btn-success"
                            onClick={() => setPostStatus(post.post_id, 'PUBLISHED')}
                            title="Đăng bài"
                          >
                            <FiCheckCircle /> Đăng
                          </button>
                        ) : (
                          <button 
                            className="adm-btn-action adm-btn-warning"
                            onClick={() => setPostStatus(post.post_id, 'HIDDEN')}
                            title="Ẩn bài"
                          >
                            <FiEyeOff /> Ẩn
                          </button>
                        )}

                        <button 
                          className="adm-btn-action adm-btn-danger"
                          onClick={() => handleDeletePost(post.post_id)}
                          title="Xóa bài"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminNews