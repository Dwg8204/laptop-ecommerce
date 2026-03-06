import { useState } from "react"
import { FiEdit, FiPlus, FiSave, FiTrash2 } from "react-icons/fi"

const toCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`

export default function AdminProducts({ 
  products, 
  filteredProducts, 
  searchTerm, 
  setSearchTerm,
  productForm, 
  setProductForm, 
  editingProductId, 
  setEditingProductId,
  handleProductSubmit,
  handleEditProduct,
  handleDeleteProduct
}) {
  return (
    <div className="adm-split">
      <section className="adm-card adm-card-pad">
        <div className="adm-card-title">
          <h3>{editingProductId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
          <span className="adm-pill">{editingProductId ? "Edit" : "New"}</span>
        </div>

        <form className="adm-form" onSubmit={handleProductSubmit}>
          <div className="adm-form-row adm-span2">
            <label>Tên sản phẩm *</label>
            <input
              placeholder="VD: ASUS TUF Gaming F15"
              value={productForm.name}
              onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="adm-form-row">
            <label>Thương hiệu *</label>
            <input
              placeholder="ASUS, Dell, HP..."
              value={productForm.brand}
              onChange={(e) => setProductForm((prev) => ({ ...prev, brand: e.target.value }))}
              required
            />
          </div>

          <div className="adm-form-row">
            <label>Dòng sản phẩm *</label>
            <select value={productForm.series} onChange={(e) => setProductForm((prev) => ({ ...prev, series: e.target.value }))} required>
              <option value="">-- Chọn dòng --</option>
              <option value="Gaming">Gaming</option>
              <option value="Văn phòng">Văn phòng</option>
              <option value="Đồ họa">Đồ họa</option>
              <option value="Cao cấp">Cao cấp</option>
              <option value="Sinh viên">Sinh viên</option>
            </select>
          </div>

          <div className="adm-form-row">
            <label>Giá bán *</label>
            <input type="number" placeholder="22490000" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} required />
          </div>

          <div className="adm-form-row">
            <label>Giá cũ</label>
            <input type="number" placeholder="24490000" value={productForm.oldPrice} onChange={(e) => setProductForm((prev) => ({ ...prev, oldPrice: e.target.value }))} />
          </div>

          <div className="adm-form-row">
            <label>CPU *</label>
            <input placeholder="Intel Core i5-12500H" value={productForm.cpu} onChange={(e) => setProductForm((prev) => ({ ...prev, cpu: e.target.value }))} required />
          </div>

          <div className="adm-form-row">
            <label>RAM *</label>
            <select value={productForm.ram} onChange={(e) => setProductForm((prev) => ({ ...prev, ram: e.target.value }))} required>
              <option value="">-- Chọn RAM --</option>
              <option value="8GB">8GB</option>
              <option value="16GB">16GB</option>
              <option value="32GB">32GB</option>
              <option value="64GB">64GB</option>
            </select>
          </div>

          <div className="adm-form-row">
            <label>Ổ cứng *</label>
            <select value={productForm.storage} onChange={(e) => setProductForm((prev) => ({ ...prev, storage: e.target.value }))} required>
              <option value="">-- Chọn ổ cứng --</option>
              <option value="256GB">256GB SSD</option>
              <option value="512GB">512GB SSD</option>
              <option value="1TB">1TB SSD</option>
              <option value="2TB">2TB SSD</option>
            </select>
          </div>

          <div className="adm-form-row">
            <label>Màn hình *</label>
            <select value={productForm.screenSize} onChange={(e) => setProductForm((prev) => ({ ...prev, screenSize: e.target.value }))} required>
              <option value="">-- Kích thước --</option>
              <option value="14 inch">14 inch</option>
              <option value="15.6 inch">15.6 inch</option>
              <option value="16 inch">16 inch</option>
              <option value="17 inch">17 inch</option>
            </select>
          </div>

          <div className="adm-form-row">
            <label>Độ phân giải *</label>
            <select value={productForm.resolution} onChange={(e) => setProductForm((prev) => ({ ...prev, resolution: e.target.value }))} required>
              <option value="">-- Chọn độ phân giải --</option>
              <option value="Full HD (1920x1080)">Full HD (1920x1080)</option>
              <option value="2K (2560x1440)">2K (2560x1440)</option>
              <option value="4K (3840x2160)">4K (3840x2160)</option>
            </select>
          </div>

          <div className="adm-form-row">
            <label>Card đồ họa *</label>
            <input placeholder="NVIDIA RTX 3050 4GB" value={productForm.graphics} onChange={(e) => setProductForm((prev) => ({ ...prev, graphics: e.target.value }))} required />
          </div>

          <div className="adm-form-row-3col">
            <div className="adm-form-item">
              <label>Số lượng kho *</label>
              <input type="number" placeholder="50" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} required />
            </div>
            <label className="adm-check-item">
              <input type="checkbox" checked={productForm.hasAI} onChange={(e) => setProductForm((prev) => ({ ...prev, hasAI: e.target.checked }))} />
              <span>Công nghệ AI</span>
            </label>
            <label className="adm-check-item">
              <input type="checkbox" checked={productForm.newArrival} onChange={(e) => setProductForm((prev) => ({ ...prev, newArrival: e.target.checked }))} />
              <span>Hàng mới về</span>
            </label>
          </div>

          <div className="adm-form-row adm-span2">
            <label>Cấu hình ngắn gọn *</label>
            <textarea placeholder="VD: 16GB RAM | 512GB SSD | 15.6 inch Full HD | RTX 3050" value={productForm.config} onChange={(e) => setProductForm((prev) => ({ ...prev, config: e.target.value }))} required />
          </div>

          <div className="adm-form-row adm-span2">
            <label>Thông số kỹ thuật *</label>
            <textarea placeholder="VD: Intel Core i5-12500H | RTX 3050 | 144Hz..." value={productForm.specs} onChange={(e) => setProductForm((prev) => ({ ...prev, specs: e.target.value }))} required />
          </div>

          <div className="adm-form-row adm-span2">
            <label>Link hình ảnh</label>
            <input placeholder="https://example.com/image.jpg" value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} />
          </div>

          <div className="adm-form-actions adm-span2">
            <button className="adm-btn adm-btn-primary" type="submit">
              {editingProductId ? <FiSave /> : <FiPlus />}
              {editingProductId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </section>

      <section className="adm-card adm-card-pad">
        <div className="adm-card-title">
          <h3>Danh sách sản phẩm</h3>
          <span className="adm-pill adm-pill-muted">{filteredProducts.length} items</span>
        </div>

        <div className="adm-search-box">
          <input 
            type="text" 
            placeholder="🔍 Tìm kiếm theo tên, thương hiệu, dòng sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="adm-search-input"
          />
        </div>

        <div className="adm-table-wrap adm-product-list-scroll">
          <table className="adm-table2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình</th>
                <th>Tên</th>
                <th>Hãng</th>
                <th>Dòng</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Trạng thái</th>
                <th>Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockTone = product.stock === 0 ? "danger" : product.stock <= 10 ? "warn" : "ok"
                const stockText = product.stock === 0 ? "Hết hàng" : product.stock <= 10 ? "Sắp hết" : "Còn hàng"

                return (
                  <tr key={product.id}>
                    <td><strong>#{product.id}</strong></td>
                    <td><img src={product.image} alt={product.name} className="adm-product-img" /></td>
                    <td className="adm-ellipsis">{product.name}</td>
                    <td>{product.brand}</td>
                    <td><span className="adm-chip">{product.series}</span></td>
                    <td className="adm-money">{toCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td><span className={`adm-status2 ${stockTone}`}>{stockText}</span></td>
                    <td>
                      <div className="adm-row-actions">
                        <button className="adm-btn adm-btn-light" onClick={() => handleEditProduct(product)}><FiEdit /> Sửa</button>
                        <button className="adm-btn adm-btn-danger" onClick={() => handleDeleteProduct(product.id)}><FiTrash2 /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
