import "../styles/HomeArticleSection.css"

export default function HomeArticleSection() {
  return (
    <div className="home-article-wrapper">
      
      {/* Cột trái - Nội dung */}
      <div className="article-left">
        <div className="article-intro">
          <p>
            <strong>Máy tính laptop</strong>  là thiết bị công nghệ được rất nhiều người dùng yêu thích và chọn lựa nhờ vào tính tiện lợi, đáp ứng tốt nhu cầu học tập, làm việc và giải trí của nhiều người dùng. Hiện nay, các thương hiệu máy tính xách tay không ngừng cải tiến sản phẩm để mang lại một dòng laptop mini giá rẻ mỏng nhẹ, có hiệu năng mạnh mẽ, thời lượng pin tốt đặc biệt là có một giá thành vô cùng hợp lý. 
          </p>
        </div>

        <div className="article-content">
          <h3>Nội dung chính</h3>
          <ol>
            <li>Laptop (máy tính xách tay) - Phục vụ công việc, học tập, giải trí</li>
            <li>Lợi ích khi sử dụng máy tính laptop là gì?</li>
            <li>Các loại máy tính laptop phổ biến</li>
            <li>Các tiêu chí chọn mua laptop chất lượng vượt trội</li>
          </ol>
        </div>

        <div className="article-content">
          <h3>Lợi ích của laptop</h3>
          <ol>
            <li>Tính di động và tiện lợi - Có thể mang theo bất cứ đâu</li>
            <li>Hiệu suất cao - Đáp ứng các tác vụ nặng như thiết kế, lập trình</li>
            <li>Thời lượng pin dài - Dùng cả ngày mà không cần sạc</li>
            <li>Kết nối dễ dàng - Nhiều cổng kết nối với thiết bị khác</li>
            <li>Giá thành hợp lý - Có nhiều mức giá để chọn lựa</li>
          </ol>
        </div>

        <div className="article-content">
          <h3>Các loại laptop phổ biến</h3>
          <ol>
            <li>Laptop mini - Kích thước nhỏ, giá rẻ, phù hợp cho sinh viên</li>
            <li>Laptop đồ họa - Hiệu năng cao, màn hình sắc nét cho designer</li>
            <li>Laptop gaming - Cấu hình mạnh mẽ, tản nhiệt tốt cho gamer</li>
            <li>Laptop doanh nhân - Thiết kế sang trọng, pin lâu cho công sở</li>
          </ol>
        </div>

        <div className="article-content">
          <h3>Tiêu chí chọn mua laptop</h3>
          <ol>
            <li>Bộ xử lý (CPU) - Chọn Intel Core hoặc AMD Ryzen phù hợp nhu cầu</li>
            <li>Bộ nhớ RAM - Tối thiểu 8GB cho công việc bình thường, 16GB+ cho chuyên gia</li>
            <li>Ổ cứng SSD - Giúp khởi động máy nhanh chóng và hiệu năng tổng thể tốt hơn</li>
            <li>Card đồ họa GPU - Quan trọng cho gaming và xử lý đồ họa</li>
            <li>Thời lượng pin - Chọn từ 8-10 giờ để sử dụng cả ngày</li>
            <li>Màn hình - Kích thước 13-17 inch tùy nhu cầu, độ phân giải 1080p trở lên</li>
          </ol>
        </div>
      </div>

      {/* Cột phải - Tin tức */}
      <div className="article-right">
        <div className="news-header">
          <h3>Tin tức sản phẩm</h3>
          <span className="view-all">Xem tất cả</span>
        </div>

        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/thongvo/tren-tay-asus-rog-strix-g16-g614p/tren-tay-asus-rog-strix-g16-g614p-cover.jpg" alt="news" />
          <p>Trên tay ROG Strix G16: Chi 40 triệu cho cấu hình RTX 5050...</p>
        </div>

        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/thanhhieu/laptop-hoc-tap-dip-dau-nam-moi-2026/laptop-hoc-tap-dip-dau-nam-moi-2026-cover.jpg" alt="news" />
          <p>Hết Tết rủng rỉnh ví: Điểm danh 5 laptop học tập...</p>
        </div>

        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/trannghia/trannghia/1/khuyen-mai-game-khi-mua-laptop.jpg" alt="news" />
          <p>Mua laptop/PC ROG & TUF Gaming với GPU RTX 50 Series...</p>
        </div>
        
        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/trannghia/trannghia/1/mua-laptop-amd-tang-game.jpg" alt="news" />
          <p>Mua laptop/PC ROG & TUF Gaming với GPU RTX 50 Series...</p>
        </div>
        
        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/thongvo/danh-gia-asus-experbook-p1403cva/danh-gia-asus-expertbook-p1403cva-cover.jpg" alt="news" />
          <p>Đánh giá ASUS ExperBook P1403CVA: Laptop cho sinh viên...</p>
        </div>

        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/thongvo/tren-tay-asus-rog-strix-g16-g614p/tren-tay-asus-rog-strix-g16-g614p-cover.jpg" alt="news" />
          <p>Laptop gaming giá tốt: Cách chọn máy chạy game mượt...</p>
        </div>

        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/thanhhieu/laptop-hoc-tap-dip-dau-nam-moi-2026/laptop-hoc-tap-dip-dau-nam-moi-2026-cover.jpg" alt="news" />
          <p>MacBook Pro 14 inch 2024: Hiệu năng vượt trội cho công việc...</p>
        </div>

        <div className="news-item">
          <img src="https://cdn-media.sforum.vn/storage/app/media/trannghia/trannghia/1/khuyen-mai-game-khi-mua-laptop.jpg" alt="news" />
          <p>Dell XPS 13: Laptop mỏng nhẹ cao cấp cho chuyên gia...</p>
        </div>
      </div>

    </div>
  )
}