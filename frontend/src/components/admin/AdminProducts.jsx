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
  handleDeleteProduct,
  brands,
  categories,
  loadingBrands,
  loadingCategories
}) {
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Store the actual File object for API upload
    setProductForm((prev) => ({ 
      ...prev, 
      imageFile: file, // Store File object for API
      image: URL.createObjectURL(file) // Create preview URL
    }))
  }

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
            <select
              value={productForm.brand_id}
              onChange={(e) => {
                const selectedBrand = brands.find(b => b.brand_id === parseInt(e.target.value))
                setProductForm((prev) => ({ 
                  ...prev, 
                  brand_id: e.target.value,
                  brand: selectedBrand?.brand_name || ''
                }))
              }}
              required
              disabled={loadingBrands}
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map(brand => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
          </div>

          <div className="adm-form-row">
            <label>Danh mục *</label>
            <select
              value={productForm.category_id}
              onChange={(e) => {
                const selectedCategory = categories.find(c => c.category_id === parseInt(e.target.value))
                setProductForm((prev) => ({ 
                  ...prev, 
                  category_id: e.target.value,
                  series: selectedCategory?.category_name || ''
                }))
              }}
              required
              disabled={loadingCategories}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
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
            <label>Loại RAM *</label>
            <select value={productForm.ramType} onChange={(e) => setProductForm((prev) => ({ ...prev, ramType: e.target.value }))} required>
              <option value="">-- Chọn loại RAM --</option>
              <option value="DDR4">DDR4</option>
              <option value="DDR5">DDR5</option>
              <option value="LPDDR4X">LPDDR4X</option>
              <option value="LPDDR5">LPDDR5</option>
              <option value="LPDDR5X">LPDDR5X</option>
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
            <label>Kích thước màn hình *</label>
            <select value={productForm.screenSize} onChange={(e) => setProductForm((prev) => ({ ...prev, screenSize: e.target.value }))} required>
              <option value="">-- Kích thước --</option>
              <option value="14 inch">14 inch</option>
              <option value="15.6 inch">15.6 inch</option>
              <option value="16 inch">16 inch</option>
              <option value="17 inch">17 inch</option>
            </select>
          </div>

          <div className="adm-form-row">
            <label>Trọng lượng (kg) *</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              placeholder="VD: 1.8"
              value={productForm.weightKg}
              onChange={(e) => setProductForm((prev) => ({ ...prev, weightKg: e.target.value }))}
              required
            />
          </div>

          <div className="adm-form-row">
            <label>Card đồ họa *</label>
            <input placeholder="NVIDIA RTX 3050 4GB" value={productForm.graphics} onChange={(e) => setProductForm((prev) => ({ ...prev, graphics: e.target.value }))} required />
          </div>

          <div className="adm-form-row">
            <label>Hệ điều hành *</label>
            <select value={productForm.os} onChange={(e) => setProductForm((prev) => ({ ...prev, os: e.target.value }))} required>
              <option value="">-- Chọn hệ điều hành --</option>
              <option value="Windows 11 Home">Windows 11 Home</option>
              <option value="Windows 11 Pro">Windows 11 Pro</option>
              <option value="Windows 10">Windows 10</option>
              <option value="Ubuntu">Ubuntu</option>
              <option value="No OS">No OS</option>
            </select>
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
            <label>Upload hình ảnh *</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} required={!editingProductId} />
            {productForm.image ? (
              <div className="adm-image-preview">
                <img src={productForm.image} alt="Xem trước ảnh sản phẩm" />
              </div>
            ) : null}
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
