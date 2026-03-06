import { useRef } from "react"
import "../styles/FeaturedProducts.css"
import { useNavigate } from "react-router-dom"

const products = [
  {
    id: 1,
    name: "Laptop ASUS TUF Gaming F16 FX607VU-RL045W",
    spec: "CORE i5-210H RTX 4050 | 16GB | 512GB | 16\" Full HD+",
    price: "26.990.000đ",
    oldPrice: "28.990.000đ",
    discount: "Giảm 7%",
    installment: "Trả góp 0%",
    rating: 5,
    sold: 38,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
  },
  {
    id: 2,
    name: "Laptop ASUS TUF Gaming F16 FX607VU-RL045W",
    spec: "CORE i5-210H RTX 4050 | 16GB | 512GB | 16\" Full HD+",
    price: "26.990.000đ",
    oldPrice: "28.990.000đ",
    discount: "Giảm 7%",
    installment: "Trả góp 0%",
    rating: 5,
    sold: 42,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_2__9_254.png",
  },
  {
    id: 3,
    name: "Laptop ASUS TUF Gaming F16 FX607VU-RL045W",
    spec: "CORE i5-210H RTX 4050 | 16GB | 512GB | 16\" Full HD+",
    price: "26.990.000đ",
    oldPrice: "28.990.000đ",
    discount: "Giảm 7%",
    installment: "Trả góp 0%",
    rating: 5,
    sold: 45,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ssss_13__8.png",
  },
  {
    id: 4,
    name: "Laptop ASUS TUF Gaming F16 FX607VU-RL045W",
    spec: "CORE i5-210H RTX 4050 | 16GB | 512GB | 16\" Full HD+",
    price: "26.990.000đ",
    oldPrice: "28.990.000đ",
    discount: "Giảm 7%",
    installment: "Trả góp 0%",
    rating: 5,
    sold: 47,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_2__10_145.png",
  },
  {
    id: 5,  
    name: "Laptop ASUS TUF Gaming F16 FX607VU-RL045W",
    spec: "CORE i5-210H RTX 4050 | 16GB | 512GB | 16\" Full HD+",
    price: "26.990.000đ",
    oldPrice: "28.990.000đ",
    discount: "Giảm 7%",
    installment: "Trả góp 0%",
    rating: 5,
    sold: 49,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
  },
]

export default function FeaturedProducts() {
  const scrollRef = useRef()

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }
  const navigate = useNavigate()
  return (
    <div className="featured-wrapper">
      <h2 className="featured-title">🔥 SẢN PHẨM NỔI BẬT</h2>

      <div className="featured-container">
        <button className="nav-btn left" onClick={scrollLeft}>‹</button>

        <div className="product-list" ref={scrollRef}>
          {products.map((item) => (
            <div className="product-card"
            onClick={() => navigate(`/product/${item.id}`)}
             key={item.id}>
              {(() => {
                const percent = Math.min(100, Math.round((item.sold / item.stock) * 100))
                const remain = Math.max(0, item.stock - item.sold)
                return (
                  <>
                    {remain <= 8 && <div className="featured-stock-alert">Sắp hết hàng</div>}
                    <div className="featured-stock-wrap">
                      <div className="featured-stock-top">
                        <span>Đã bán {item.sold}</span>
                        <span>Còn {remain}</span>
                      </div>
                      <div className="featured-stock-bar">
                        <div className="featured-stock-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </>
                )
              })()}
              <span className="discount">{item.discount}</span>
              {item.installment && <span className="installment">{item.installment}</span>}
              <img src={item.image} alt={item.name} />
              <div className="spec">{item.spec}</div>
              <h4 className="prod-name">{item.name}</h4>
              {item.rating && <div className="rating">{'⭐'.repeat(item.rating)}</div>}
              <div className="price">
                <span className="new">{item.price}</span>
                <span className="old">{item.oldPrice}</span>
              </div>
              <button className="favorite">♡ Yêu thích</button>
            </div>
          ))}
        </div>

        <button className="nav-btn right" onClick={scrollRight}>›</button>
      </div>
    </div>
  )
}