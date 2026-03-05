import "../styles/LaptopFilterSection.css"

const brands = [
  "MacBook",
  "ASUS",
  "Lenovo",
  "MSI",
  "Acer",
  "HP",
  "Dell",
  "LG",
  "GIGABYTE",
  "Masstel",
  "SAMSUNG",
]

const needs = [
  { title: "Văn phòng", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/Group_846.png" },
  { title: "Gaming", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/Group_848_2.png" },
  { title: "Mỏng nhẹ", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_6__1.png" },
  { title: "Đồ họa - kỹ thuật", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_1__4.png" },
  { title: "Sinh viên", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_2__4.png" },
  { title: "Cảm ứng", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_4__4.png" },
  { title: "Laptop AI", img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_5__3.png" },
]

export default function LaptopFilterSection() {
  return (
    <div className="filter-wrapper">
      
      {/* Brands */}
      <h2 className="section-title">Máy tính laptop</h2>
      <div className="brand-list">
        {brands.map((brand, index) => (
          <div className="brand-item" key={index}>
            {brand}
          </div>
        ))}
      </div>

      {/* Needs */}
      <h2 className="section-title">Chọn theo nhu cầu</h2>
      <div className="need-list">
        {needs.map((item, index) => (
          <div className="need-card" key={index}>
            <img src={item.img} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}