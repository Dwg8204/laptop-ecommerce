import "../styles/LaptopFilterSection.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { buildApiUrl } from "../config/api"
// const brands = [
//   "MacBook",
//   "ASUS",
//   "Lenovo",
//   "MSI",
//   "Acer",
//   "HP",
//   "Dell",
//   "LG",
//   "GIGABYTE",
//   "Masstel",
//   "SAMSUNG",
// ]
const resolveLogoUrl = (url) => {
  const raw = String(url || '').trim();
  if (!raw) return null;
  if(/^https?:\/\//.test(raw) || raw.startsWith("data:")) return raw; // URL đã đầy đủ hoặc data URI
  return buildApiUrl(raw.startsWith('/') ? raw : `/${raw}`); // Đảm bảo có dấu / ở đầu nếu cần
}
// const needs = [
//   { title: "Văn phòng", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/Group_846.png" },
//   { title: "Gaming", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/Group_848_2.png" },
//   { title: "Mỏng nhẹ", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_6__1.png" },
//   { title: "Đồ họa - kỹ thuật", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_1__4.png" },
//   { title: "Sinh viên", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_2__4.png" },
//   { title: "Cảm ứng", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_4__4.png" },
//   { title: "Laptop AI", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_5__3.png" },
// ]

export default function LaptopFilterSection() {
  const [brands, setBrands] = useState([])
  const navigate = useNavigate()
  const [category, setCategory] = useState([])
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/brands"))
        const data = await res.json().catch(() => ({}))
        const list = Array.isArray(data?.data) ? data.data : []
        setBrands(list)
      } catch {
        setBrands([])
      }
    }

    loadBrands()
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/product-categories"))
        const data = await res.json().catch(() => ({}))
        const list = Array.isArray(data?.data) ? data.data : []
        setCategory(list)
      } catch {
        setCategory([])
      }
    }

    loadCategories()
  }, [])

  return (
    <div className="filter-wrapper">
      <h2 className="section-title">Máy tính laptop</h2>
      <div className="brand-list">
        {brands.map((brand) => (
          <div
            className="brand-item"
            key={brand.brand_id}
            title={brand.brand_name}
            onClick={() => navigate(`/brands/${brand.brand_id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/brands/${brand.brand_id}`)
            }}
          >
            {brand.logo_url ? (
              <img className="brand-logo" src={resolveLogoUrl(brand.logo_url)} alt={brand.brand_name} loading="lazy" />
            ) : (
              <span className="brand-fallback">{brand.brand_name}</span>
            )}
          </div>
        ))}
      </div>

      <h2 className="section-title">Chọn theo nhu cầu</h2>
      <div className="need-list">
        {category.map((item, index) => (
          <div className="need-card" key={index}>
            {/* <img src={item.img} alt={item.category_name} /> */}
            <p>{item.category_name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}