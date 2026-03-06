const toCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`

export default function AdminCustomers({ 
  customers, 
  handleCustomerSegment, 
  toggleCustomerLock 
}) {
  return (
    <section className="adm-card adm-card-pad">
      <h3>Quản lý khách hàng</h3>
      <div className="adm-table-wrap">
        <table className="adm-table2">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Lịch sử mua</th>
              <th>Phân loại</th>
              <th>Tổng chi tiêu</th>
              <th>Hành vi</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td><strong>{customer.name}</strong></td>
                <td>{customer.orders} đơn</td>
                <td>
                  <select value={customer.segment} onChange={(event) => handleCustomerSegment(customer.id, event.target.value)}>
                    <option value="moi">Mới</option>
                    <option value="than-thiet">Thân thiết</option>
                    <option value="vip">VIP</option>
                  </select>
                </td>
                <td className="adm-money">{toCurrency(customer.totalSpent)}</td>
                <td>{customer.orders >= 10 ? "Mua lặp lại cao" : "Mua theo nhu cầu"}</td>
                <td>
                  <button className={`adm-btn ${customer.status === "locked" ? "adm-btn-light" : "adm-btn-danger"}`} onClick={() => toggleCustomerLock(customer.id)}>
                    {customer.status === "locked" ? "Mở khóa" : "Khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
