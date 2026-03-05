import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import {
  FiCheckCircle,
  FiChevronRight,
  FiCpu,
  FiHardDrive,
  FiHeart,
  FiMessageSquare,
  FiMinus,
  FiPlus,
  FiRotateCcw,
  FiShare2,
  FiShield,
  FiStar,
  FiTruck,
  FiShoppingCart,
} from "react-icons/fi"
import "../styles/ProductDetail.css"
import Breadcrumb from "../components/Breadcrumb"

const imagePool = [
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_2__9_254.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ssss_13__8.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_2__10_145.png",
]

const productSeeds = [
  { id: "0", name: "Laptop ASUS TUF Gaming F16 FX607VJ-RL034W" },
  { id: "1", name: "Laptop ASUS TUF Gaming F16 FX607VU-RL045W" },
  { id: "2", name: "Laptop ASUS Vivobook 16X K3605ZF-RP634W" },
  { id: "3", name: "Laptop ASUS Zenbook 14 OLED UX3405MA" },
  { id: "4", name: "Laptop ASUS ROG Strix G16 G614JVR" },
  { id: "5", name: "Laptop ASUS TUF A15 FA507NUR" },
]

const productCatalog = productSeeds.map((seed, index) => {
  const basePrice = 22490000 + index * 900000
  const baseImage = imagePool[index % imagePool.length]

  return {
    id: seed.id,
    name: seed.name,
    brand: "ASUS",
    category: "Laptop",
    fullSpecs: "Intel Core i5/i7 Gen 13-14, RTX 3050/4050, SSD NVMe tốc độ cao, màn hình 16\" chuẩn màu",
    baseImage,
    images: [
      baseImage,
      imagePool[(index + 1) % imagePool.length],
      imagePool[(index + 2) % imagePool.length],
      imagePool[(index + 3) % imagePool.length],
    ],
    colors: [
      { name: "Xám Graphite", swatch: "#6b7280", extraPrice: 0, image: baseImage },
      { name: "Đen Onyx", swatch: "#111827", extraPrice: 250000, image: imagePool[(index + 1) % imagePool.length] },
      { name: "Trắng Bạc", swatch: "#d1d5db", extraPrice: 350000, image: imagePool[(index + 2) % imagePool.length] },
    ],
    configs: [
      { label: "16GB | 512GB | RTX 3050", cpu: "Core i5-13500H", storage: "SSD 512GB", price: basePrice },
      { label: "16GB | 1TB | RTX 4050", cpu: "Core i7-13620H", storage: "SSD 1TB", price: basePrice + 2000000 },
      { label: "32GB | 1TB | RTX 4060", cpu: "Core i7-14650HX", storage: "SSD 1TB", price: basePrice + 4200000 },
    ],
    highlights: [
      "Màn hình 16 inch 165Hz hiển thị mượt, phù hợp học tập và giải trí.",
      "Tản nhiệt kép giúp máy vận hành ổn định khi chạy tác vụ nặng.",
      "Bàn phím full-size có đèn nền, hành trình phím tốt cho nhập liệu lâu.",
    ],
    promotions: [
      "Tặng balo gaming cao cấp trị giá 490.000đ",
      "Giảm thêm 500.000đ cho học sinh, sinh viên (S-Student)",
      "Trả góp 0% qua thẻ tín dụng, duyệt nhanh trong 5 phút",
    ],
    specTable: [
      { label: "CPU", value: "Intel Core i7 thế hệ mới" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4050 6GB" },
      { label: "RAM", value: "16GB DDR5 (nâng cấp tối đa 32GB)" },
      { label: "Ổ cứng", value: "SSD NVMe PCIe 4.0 1TB" },
      { label: "Màn hình", value: "16\" FHD+ IPS, 165Hz, 100% sRGB" },
      { label: "Pin", value: "90Wh, hỗ trợ sạc nhanh 100W USB-C" },
      { label: "Cổng kết nối", value: "USB-C, HDMI 2.1, RJ45, USB-A" },
      { label: "Khối lượng", value: "Khoảng 2.2kg" },
    ],
    reviews: [
      {
        user: "Nguyễn Khôi",
        rating: 5,
        date: "15/02/2026",
        content: "Máy chạy mượt, quạt êm khi làm việc văn phòng, chơi game ổn ở thiết lập high.",
      },
      {
        user: "Lê Phương",
        rating: 4,
        date: "03/02/2026",
        content: "Màn hình đẹp và bàn phím gõ sướng, pin đủ dùng 5-6 tiếng làm việc nhẹ.",
      },
    ],
    rating: 4.8,
    reviewCount: 126 + index * 9,
    soldCount: 900 + index * 110,
  }
})

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const product = useMemo(
    () => productCatalog.find((item) => item.id === id) || productCatalog[0],
    [id],
  )

  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("overview")
  const [isFavorite, setIsFavorite] = useState(false)
  const [addMessage, setAddMessage] = useState("")

  useEffect(() => {
    setSelectedImage(product.images[0])
    setSelectedColorIndex(0)
    setSelectedConfigIndex(0)
    setQuantity(1)
    setActiveTab("overview")
    setAddMessage("")
  }, [product])

  const selectedColor = product.colors[selectedColorIndex]
  const selectedConfig = product.configs[selectedConfigIndex]

  const finalPrice = selectedConfig.price + selectedColor.extraPrice
  const oldPrice = finalPrice + 2200000
  const saving = oldPrice - finalPrice
  const tradeInPrice = finalPrice - 3000000

  const relatedProducts = productCatalog.filter((item) => item.id !== product.id).slice(0, 4)

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Laptop", path: "/" },
    { label: product.brand, path: "/" },
    { label: product.name },
  ]

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1))
  const handleIncrease = () => setQuantity((prev) => prev + 1)

  const handleAddToCart = () => {
    const payload = {
      id: `${product.id}-${selectedConfigIndex}-${selectedColorIndex}`,
      name: product.name,
      config: selectedConfig.label,
      color: selectedColor.name,
      price: finalPrice,
      image: selectedImage,
    }

    addToCart(payload, quantity)
    setAddMessage("Đã thêm vào giỏ hàng thành công!")
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate("/cart")
  }

  const subtotal = finalPrice * quantity

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="pd-page">
        <div className="pd-container">
          <section className="pd-main">
            <div className="pd-card pd-gallery">
              <div className="pd-main-image-wrap">
                <img src={selectedImage} alt={product.name} className="pd-main-image" />
              </div>
              <div className="pd-thumbs">
                {product.images.map((image, index) => (
                  <button
                    key={`${product.id}-thumb-${index}`}
                    className={`pd-thumb ${selectedImage === image ? "active" : ""}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={`${product.name} - ${index + 1}`} />
                  </button>
                ))}
              </div>

              <div className="pd-highlight-box">
                <h3>Tính năng nổi bật</h3>
                <ul>
                  {product.highlights.map((feature) => (
                    <li key={feature}>
                      <FiCheckCircle />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pd-summary">
              <div className="pd-title-row">
                <div>
                  <h1>{product.name}</h1>
                  <p>{product.fullSpecs}</p>
                </div>
                <div className="pd-top-actions">
                  <button className={`pd-chip ${isFavorite ? "active" : ""}`} onClick={() => setIsFavorite((prev) => !prev)}>
                    <FiHeart /> {isFavorite ? "Đã yêu thích" : "Yêu thích"}
                  </button>
                  <button className="pd-chip">
                    <FiShare2 /> Chia sẻ
                  </button>
                  <button className="pd-chip" onClick={() => setActiveTab("reviews")}>
                    <FiMessageSquare /> Hỏi đáp
                  </button>
                </div>
              </div>

              <div className="pd-rating-row">
                <div className="pd-stars">
                  <FiStar /> <FiStar /> <FiStar /> <FiStar /> <FiStar />
                </div>
                <span>{product.rating}/5</span>
                <span>({product.reviewCount} đánh giá)</span>
                <span>Đã bán {product.soldCount}+</span>
              </div>

              <div className="pd-card pd-price-box">
                <div className="pd-price-current">{formatCurrency(finalPrice)}</div>
                <div className="pd-price-old">{formatCurrency(oldPrice)}</div>
                <div className="pd-price-save">Tiết kiệm {formatCurrency(saving)}</div>
                <div className="pd-tradein">Thu cũ lên đời từ {formatCurrency(tradeInPrice)}</div>
              </div>

              <div className="pd-card">
                <h3>Màu sắc</h3>
                <div className="pd-color-grid">
                  {product.colors.map((color, index) => (
                    <button
                      key={`${color.name}-${index}`}
                      className={`pd-color-option ${index === selectedColorIndex ? "active" : ""}`}
                      onClick={() => {
                        setSelectedColorIndex(index)
                        setSelectedImage(color.image)
                      }}
                    >
                      <span className="pd-swatch" style={{ background: color.swatch }} />
                      <span className="pd-color-name">{color.name}</span>
                      <span className="pd-color-price">+{formatCurrency(color.extraPrice)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pd-card">
                <h3>Cấu hình</h3>
                <div className="pd-config-grid">
                  {product.configs.map((config, index) => (
                    <button
                      key={config.label}
                      className={`pd-config-item ${index === selectedConfigIndex ? "active" : ""}`}
                      onClick={() => setSelectedConfigIndex(index)}
                    >
                      <strong>{config.label}</strong>
                      <span><FiCpu /> {config.cpu}</span>
                      <span><FiHardDrive /> {config.storage}</span>
                      <em>{formatCurrency(config.price)}</em>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pd-card">
                <h3>Ưu đãi đi kèm</h3>
                <ul className="pd-promo-list">
                  {product.promotions.map((promo) => (
                    <li key={promo}>
                      <FiCheckCircle />
                      <span>{promo}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pd-buy-box pd-card">
                <div className="pd-qty-row">
                  <span>Số lượng</span>
                  <div className="pd-qty-control">
                    <button onClick={handleDecrease}><FiMinus /></button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrease}><FiPlus /></button>
                  </div>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                <div className="pd-buy-actions">
                  <button className="pd-outline-btn" onClick={handleAddToCart}>
                    <FiShoppingCart /> Thêm vào giỏ
                  </button>
                  <button className="pd-primary-btn" onClick={handleBuyNow}>
                    <FiShoppingCart /> Mua ngay
                  </button>
                </div>

                {addMessage && <p className="pd-add-message">{addMessage}</p>}
              </div>
            </div>
          </section>

          <section className="pd-bottom-grid">
            <div className="pd-card pd-tabs-card">
              <div className="pd-tab-header">
                <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>Mô tả</button>
                <button className={activeTab === "specs" ? "active" : ""} onClick={() => setActiveTab("specs")}>Thông số</button>
                <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>Đánh giá</button>
              </div>

              {activeTab === "overview" && (
                <div className="pd-tab-content">
                  <p>
                    {product.name} là mẫu laptop cân bằng tốt giữa hiệu năng và tính di động, phù hợp cho học tập,
                    làm việc lẫn giải trí đa phương tiện.
                  </p>
                  <ul>
                    {product.highlights.map((item) => (
                      <li key={`overview-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="pd-tab-content">
                  <div className="pd-spec-table">
                    {product.specTable.map((spec) => (
                      <div className="pd-spec-row" key={spec.label}>
                        <span>{spec.label}</span>
                        <strong>{spec.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="pd-tab-content">
                  {product.reviews.map((review) => (
                    <article className="pd-review-item" key={`${review.user}-${review.date}`}>
                      <div className="pd-review-head">
                        <strong>{review.user}</strong>
                        <span>{"⭐".repeat(review.rating)}</span>
                        <small>{review.date}</small>
                      </div>
                      <p>{review.content}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <aside className="pd-card pd-policy-card">
              <h3>Chính sách bán hàng</h3>
              <ul>
                <li>
                  <FiTruck /> Giao nhanh toàn quốc, miễn phí đơn từ 300K
                </li>
                <li>
                  <FiShield /> Bảo hành chính hãng 24 tháng
                </li>
                <li>
                  <FiRotateCcw /> 1 đổi 1 trong 30 ngày nếu lỗi phần cứng
                </li>
              </ul>
            </aside>
          </section>

          <section className="pd-card pd-related-section">
            <div className="pd-section-title">
              <h3>Sản phẩm liên quan</h3>
              <button className="pd-view-all" onClick={() => navigate("/")}>
                Xem thêm <FiChevronRight />
              </button>
            </div>

            <div className="pd-related-grid">
              {relatedProducts.map((item) => (
                <article className="pd-related-card" key={item.id} onClick={() => navigate(`/product/${item.id}`)}>
                  <img src={item.baseImage} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p>{item.configs[0].label}</p>
                  <div>
                    <strong>{formatCurrency(item.configs[0].price)}</strong>
                    <span>{formatCurrency(item.configs[0].price + 1800000)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
