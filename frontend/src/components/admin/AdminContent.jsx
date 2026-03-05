export default function AdminContent({ 
  comments, 
  updateCommentStatus, 
  removeComment, 
  ads, 
  toggleAdStatus 
}) {
  return (
    <div className="adm-grid">
      <section className="adm-card adm-card-pad">
        <h3>Duyệt bình luận / đánh giá</h3>
        <ul className="adm-comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="adm-comment">
              <div className="adm-comment-body">
                <div className="adm-comment-head">
                  <strong>{comment.user}</strong>
                  <span className="adm-dot">•</span>
                  <span className="adm-muted">{comment.product}</span>
                  <span className={`adm-status2 ${comment.status === "visible" ? "ok" : comment.status === "pending" ? "warn" : "muted"}`}>
                    {comment.status}
                  </span>
                </div>
                <p>{comment.text}</p>
              </div>
              <div className="adm-row-actions">
                <button className="adm-btn adm-btn-primary" onClick={() => updateCommentStatus(comment.id, "visible")}>Duyệt</button>
                <button className="adm-btn adm-btn-light" onClick={() => updateCommentStatus(comment.id, "hidden")}>Ẩn</button>
                <button className="adm-btn adm-btn-danger" onClick={() => removeComment(comment.id)}>Xóa</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="adm-card adm-card-pad">
        <h3>Quảng cáo & nội dung trang chủ</h3>
        <ul className="adm-bullets">
          {ads.map((ad) => (
            <li key={ad.id} className="adm-ad-row">
              <span><strong>{ad.title}</strong></span>
              <button className="adm-btn adm-btn-light" onClick={() => toggleAdStatus(ad.id)}>
                {ad.status === "active" ? "Tạm dừng" : "Kích hoạt"}
              </button>
            </li>
          ))}
        </ul>
        <textarea className="adm-textarea" defaultValue="Chương trình chào mừng lễ 30/4 - ưu đãi đến 2 triệu." />
      </section>
    </div>
  )
}
