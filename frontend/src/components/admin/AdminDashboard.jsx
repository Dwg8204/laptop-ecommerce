import { FiBarChart2 } from 'react-icons/fi'

const toCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`

export default function AdminDashboard({ revenueSummary }) {
  return (
    <div className="adm-grid">
      <section className="adm-card adm-card-pad">
        <div className="adm-card-title">
          <h3>Doanh thu</h3>
          <span className="adm-pill">Realtime</span>
        </div>
        <div className="adm-kpi-grid">
          <div className="adm-kpi">
            <span>Ngày</span>
            <strong>{toCurrency(revenueSummary.day)}</strong>
          </div>
          <div className="adm-kpi">
            <span>Tháng</span>
            <strong>{toCurrency(revenueSummary.month)}</strong>
          </div>
          <div className="adm-kpi">
            <span>Năm</span>
            <strong>{toCurrency(revenueSummary.year)}</strong>
          </div>
        </div>
      </section>

      <section className="adm-card adm-card-pad">
        <div className="adm-card-title">
          <h3>Tổng quan đơn hàng</h3>
          <span className="adm-pill adm-pill-muted">KPI</span>
        </div>
        <div className="adm-kpi-grid">
          <div className="adm-kpi">
            <span>Đơn hoàn thành</span>
            <strong>{revenueSummary.completedOrders}</strong>
          </div>
          <div className="adm-kpi">
            <span>Tỷ lệ hủy</span>
            <strong>{revenueSummary.cancelRate}%</strong>
          </div>
          <div className="adm-kpi">
            <span>AOV</span>
            <strong>{toCurrency(Math.round(revenueSummary.avgOrder))}</strong>
          </div>
        </div>
      </section>

      <section className="adm-card adm-card-pad">
        <h3>Báo cáo khách hàng</h3>
        <ul className="adm-bullets">
          <li>Tỷ lệ khách quay lại: <strong>{revenueSummary.returnRate}%</strong></li>
          <li>Giá trị đơn hàng trung bình: <strong>{toCurrency(Math.round(revenueSummary.avgOrder))}</strong></li>
          <li>Tỷ lệ hủy đơn: <strong>{revenueSummary.cancelRate}%</strong></li>
        </ul>
      </section>

      <section className="adm-card adm-card-pad">
        <h3>Báo cáo Pre-order</h3>
        <ul className="adm-bullets">
          <li>Số lượng Pre-order: <strong>{revenueSummary.preOrders}</strong></li>
          <li>Tỷ lệ hủy Pre-order: <strong>{revenueSummary.preOrderCancelRate}%</strong></li>
          <li>Thời gian chờ trung bình: <strong>{revenueSummary.waitingAverageDays} ngày</strong></li>
        </ul>
      </section>

      <section className="adm-card adm-card-pad adm-span">
        <h3>Biểu đồ thống kê nhanh</h3>
        <div className="adm-progress-row">
          <div>
            <div className="adm-progress-label">Doanh thu theo thương hiệu (ASUS)</div>
            <div className="adm-progress"><div style={{ width: `${revenueSummary.brandAsus}%` }} /></div>
          </div>
          <strong>{revenueSummary.brandAsus}%</strong>
        </div>
        <div className="adm-progress-row">
          <div>
            <div className="adm-progress-label">Doanh thu phân khúc tầm trung</div>
            <div className="adm-progress"><div style={{ width: `${revenueSummary.priceSegmentMid}%` }} /></div>
          </div>
          <strong>{revenueSummary.priceSegmentMid}%</strong>
        </div>
      </section>
    </div>
  )
}
