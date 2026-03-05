import { useState } from 'react';
import { FiCalendar, FiUser, FiTag, FiClock } from 'react-icons/fi';
import '../styles/News.css';
import Breadcrumb from '../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';

export default function News() {
  const [selectedNews, setSelectedNews] = useState(null);
  const navigate = useNavigate();
  const newsData = [
    {
      id: 1,
      title: "Top 5 Laptop Gaming Đáng Mua Nhất 2026",
      excerpt: "Khám phá những mẫu laptop gaming mạnh mẽ nhất với chip mới nhất từ Intel và AMD, card đồ họa RTX 40 series...",
      content: "Năm 2026 đánh dấu sự bùng nổ của công nghệ laptop gaming với nhiều mẫu máy ấn tượng. Từ ASUS ROG, MSI, đến Acer Predator, mỗi thương hiệu đều mang đến những tính năng vượt trội...",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
      category: "Gaming",
      author: "Tech Review",
      date: "2026-03-02",
      readTime: "5 phút"
    },
    {
      id: 2,
      title: "Hướng Dẫn Chọn Laptop Văn Phòng Phù Hợp",
      excerpt: "Laptop văn phòng cần những tiêu chí gì? Pin trâu, nhẹ, hiệu năng ổn định? Cùng tìm hiểu ngay...",
      content: "Laptop văn phòng không cần quá mạnh nhưng phải đủ để xử lý công việc hàng ngày. Các tiêu chí quan trọng bao gồm thời lượng pin, trọng lượng, bàn phím thoải mái...",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
      category: "Văn phòng",
      author: "LaptopShop",
      date: "2026-03-01",
      readTime: "4 phút"
    },
    {
      id: 3,
      title: "So Sánh Intel Core Ultra vs AMD Ryzen 9000",
      excerpt: "Cuộc chiến giữa hai ông lớn CPU tiếp tục nóng bỏng với thế hệ chip mới nhất. Đâu là lựa chọn tối ưu?",
      content: "Intel Core Ultra mang đến hiệu năng AI vượt trội trong khi AMD Ryzen 9000 tập trung vào đa luồng và tiết kiệm điện năng. Tùy nhu cầu sử dụng, mỗi dòng chip đều có ưu điểm riêng...",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
      category: "Công nghệ",
      author: "Tech Insider",
      date: "2026-02-28",
      readTime: "6 phút"
    },
    {
      id: 4,
      title: "MacBook Air M4 2026: Đánh Giá Chi Tiết",
      excerpt: "Apple tiếp tục cải tiến dòng MacBook Air với chip M4 mạnh mẽ, thiết kế mỏng nhẹ hơn và thời lượng pin ấn tượng...",
      content: "MacBook Air M4 không chỉ mạnh mẽ hơn mà còn tiết kiệm điện tốt hơn. Với màn hình Retina cải tiến và thiết kế không quạt, đây là lựa chọn hoàn hảo cho người dùng di động...",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      category: "Apple",
      author: "Mac Lover",
      date: "2026-02-27",
      readTime: "7 phút"
    },
    {
      id: 5,
      title: "Laptop Đồ Họa: Những Yếu Tố Cần Quan Tâm",
      excerpt: "Thiết kế đồ họa, render video cần laptop như thế nào? Màn hình, card đồ họa, RAM và nhiều yếu tố khác...",
      content: "Laptop đồ họa đòi hỏi màn hình chuẩn màu cao (100% sRGB, Adobe RGB), card đồ họa mạnh (RTX hoặc Radeon Pro), RAM tối thiểu 16GB và SSD dung lượng lớn để xử lý file nặng...",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
      category: "Đồ họa",
      author: "Designer Hub",
      date: "2026-02-26",
      readTime: "5 phút"
    },
    {
      id: 6,
      title: "Bảo Dưỡng Laptop: Làm Sao Để Máy Bền Lâu?",
      excerpt: "Mẹo đơn giản giúp laptop của bạn hoạt động tốt và bền bỉ theo thời gian. Vệ sinh, tản nhiệt, sạc pin đúng cách...",
      content: "Bảo dưỡng laptop định kỳ giúp máy hoạt động ổn định lâu dài. Làm sạch bàn phím, quạt tản nhiệt, thay keo tản nhiệt, kiểm tra pin là những việc cần làm thường xuyên...",
      image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=800",
      category: "Bảo trì",
      author: "Tech Care",
      date: "2026-02-25",
      readTime: "4 phút"
    }
  ];

  const handleReadMore = (news) => {
    setSelectedNews(news);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedNews(null);
  };
  const handleGoBack = () => {
    window.history.back();
  }
  

  return (
    <div className="news-page">
      <div className="news-container">
        {!selectedNews ? (
          <>
           <button className="back-btn" onClick={handleGoBack}>
              ← Quay lại
            </button>
            <div className="news-header">
              <h1>Tin Tức & Công Nghệ</h1>
              <p>Cập nhật thông tin mới nhất về laptop, công nghệ và xu hướng thị trường</p>
            </div>

            <div className="news-grid">
              {newsData.map((news) => (
                <article key={news.id} className="news-card">
                  <div className="news-image">
                    <img src={news.image} alt={news.title} />
                    <span className="news-category">{news.category}</span>
                  </div>
                  <div className="news-content">
                    <h2 className="news-title">{news.title}</h2>
                    <div className="news-meta">
                      <span><FiCalendar size={14} /> {news.date}</span>
                      <span><FiUser size={14} /> {news.author}</span>
                      <span><FiClock size={14} /> {news.readTime}</span>
                    </div>
                    <p className="news-excerpt">{news.excerpt}</p>
                    <button 
                      className="read-more-btn"
                      onClick={() => handleReadMore(news)}
                    >
                      Đọc thêm →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="news-detail">
            <button className="back-btn" onClick={handleBackToList}>
              ← Quay lại danh sách
            </button>
            <div className="detail-header">
              <span className="detail-category">
                <FiTag size={16} /> {selectedNews.category}
              </span>
              <h1>{selectedNews.title}</h1>
              <div className="detail-meta">
                <span><FiCalendar size={16} /> {selectedNews.date}</span>
                <span><FiUser size={16} /> {selectedNews.author}</span>
                <span><FiClock size={16} /> {selectedNews.readTime}</span>
              </div>
            </div>
            <img src={selectedNews.image} alt={selectedNews.title} className="detail-image" />
            <div className="detail-content">
              <p className="lead">{selectedNews.excerpt}</p>
              <p>{selectedNews.content}</p>
              <p>
                Đây chỉ là phần nội dung mẫu. Trong thực tế, bạn có thể tích hợp CMS hoặc 
                backend API để quản lý và hiển thị nội dung tin tức chi tiết, đầy đủ hơn 
                với hình ảnh, video và các định dạng phong phú khác.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
