import { useState } from "react"

const toCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`

export default function AdminOrders({ orders, updateOrderStatus, setSelectedOrder }) {
  return (
    <>
      <section className="adm-card adm-card-pad">
        <h3>Quản lý đơn hàng</h3>
        <div className="adm-table-wrap">
          <table className="adm-table2">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách hàng</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Trạng thái</th>
                <th>Nghiệp vụ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td>
                    {order.type}
                    <div className="adm-tags">
                      {order.preOrder && <span className="adm-tag2">Pre-order</span>}
                      {order.privateOrder && <span className="adm-tag2">Đơn riêng</span>}
                    </div>
                  </td>
                  <td className="adm-money">{toCurrency(order.total)}</td>
                  <td>
                    <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
                      <option value="cho-xac-nhan">Chờ xác nhận</option>
                      <option value="dang-xu-ly">Đang chuẩn bị</option>
                      <option value="dang-giao">Đang giao</option>
                      <option value="hoan-thanh">Hoàn thành</option>
                      <option value="da-huy">Đã hủy</option>
                    </select>
                  </td>
                  <td>
                    <div className="adm-row-actions">
                      <button className="adm-btn adm-btn-secondary" onClick={() => setSelectedOrder(order)}>Xem chi tiết</button>
                      <button className="adm-btn adm-btn-light" onClick={() => updateOrderStatus(order.id, "dang-xu-ly")}>Xác nhận</button>
                      <button className="adm-btn adm-btn-primary" onClick={() => updateOrderStatus(order.id, "hoan-thanh")}>Xuất hóa đơn</button>
                      {order.refundRequest && <button className="adm-btn adm-btn-danger" onClick={() => updateOrderStatus(order.id, "da-huy")}>Hoàn tiền</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
