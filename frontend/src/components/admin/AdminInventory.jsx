export default function AdminInventory({ 
  products, 
  stockForm, 
  setStockForm, 
  handleStockImport, 
  lowStockItems 
}) {
  return (
    <div className="adm-grid">
      <section className="adm-card adm-card-pad">
        <h3>Nhập kho</h3>
        <form className="adm-form-compact" onSubmit={handleStockImport}>
          <select value={stockForm.productId} onChange={(event) => setStockForm((prev) => ({ ...prev, productId: event.target.value }))}>
            {products.map((product) => <option key={product.id} value={product.id}>{product.id} - {product.name}</option>)}
          </select>
          <select value={stockForm.branch} onChange={(event) => setStockForm((prev) => ({ ...prev, branch: event.target.value }))}>
            <option value="HCM-Q1">HCM-Q1</option>
            <option value="HN-CauGiay">HN-Cầu Giấy</option>
            <option value="DN-HaiChau">ĐN-Hải Châu</option>
          </select>
          <input type="number" placeholder="Số lượng nhập" value={stockForm.quantity} onChange={(event) => setStockForm((prev) => ({ ...prev, quantity: event.target.value }))} required />
          <button type="submit" className="adm-btn adm-btn-primary">Tạo phiếu nhập</button>
        </form>
      </section>

      <section className="adm-card adm-card-pad">
        <h3>Cảnh báo dưới mức tối thiểu</h3>
        {lowStockItems.length ? (
          <ul className="adm-bullets">
            {lowStockItems.map((item) => <li key={item.id}>{item.productName} ({item.branch}) - còn {item.quantity}, mức tối thiểu {item.minStock}</li>)}
          </ul>
        ) : (
          <p className="adm-muted">Hiện chưa có sản phẩm dưới mức tối thiểu.</p>
        )}
      </section>
    </div>
  )
}
