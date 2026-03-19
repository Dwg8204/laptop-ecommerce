import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPackage, FiTruck, FiCheckCircle, FiArrowLeft, FiCalendar, FiMapPin } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import * as orderApi from '../services/orderApiEnhanced'
//import { readOrdersForUser } from '../lib/orderStorage'
import '../styles/OrderTracking.css'

export default function OrderTracking() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const mapBackendStatus = (status) => {
  const map = {
    PENDING_CONFIRMATION: 'cho-xac-nhan',
    PROCESSING: 'dang-xu-ly',
    SHIPPING: 'dang-giao',
    COMPLETED: 'hoan-thanh',
    CANCELLED: 'da-huy',
  }
  return map[status] || 'cho-xac-nhan'
}

  useEffect(() => {
  const fetchOrders = async () => {
    if (!user?.user_id) {
      setOrders([])
      setSelectedOrder(null)
      return
    }

    try {
      const res = await orderApi.getOrders({ user_id: user.user_id })
      const list = Array.isArray(res?.data) ? res.data : []

      const mapped = list.map(order => ({
        id: order.order_id,
        customer: order.customer_name,
        total: Number(order.total_amount || 0),
        status: mapBackendStatus(order.status), // 🔥 map lại status
        date: order.order_date
          ? new Date(order.order_date).toLocaleDateString('vi-VN')
          : '',
        preOrder: order.order_type === "PRE_ORDER",
      }))

      setOrders(mapped)
      setSelectedOrder(mapped[0] || null)
    } catch (err) {
      console.error("Error loading orders:", err)
    }
  }

  fetchOrders()
}, [user])

  const getTrackingSteps = (order) => {
    const steps = [
      { key: 'cho-xac-nhan', label: 'Chờ xác nhận', icon: FiPackage, description: 'Đơn hàng chờ xác nhận' },
      { key: 'dang-chuan-bi', label: 'Đang chuẩn bị', icon: FiPackage, description: 'Đang chuẩn bị hàng hóa' },
      { key: 'dang-giao', label: 'Đang giao', icon: FiTruck, description: 'Hàng đang trong quá trình giao' },
      { key: 'da-nhan', label: 'Đã nhận', icon: FiCheckCircle, description: 'Giao hàng thành công' },
    ]

    const statusMap = {
      'cho-xac-nhan': 'cho-xac-nhan',
      'dang-xu-ly': 'dang-chuan-bi',
      'dang-giao': 'dang-giao',
      'hoan-thanh': 'da-nhan',
      'da-huy': 'da-huy',
    }

    const currentStep = statusMap[order.status] || 'cho-xac-nhan'
    
    return steps.map((step, index) => {
      const isCompleted = steps.findIndex(s => s.key === currentStep) >= index
      const isActive = step.key === currentStep

      return {
        ...step,
        isCompleted,
        isActive,
        index,
      }
    })
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      'cho-xac-nhan': 'status-pending',
      'dang-xu-ly': 'status-preparing',
      'dang-giao': 'status-shipping',
      'hoan-thanh': 'status-completed',
      'da-huy': 'status-cancelled',
    }
    return colors[status] || 'status-pending'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'cho-xac-nhan': 'Chờ xác nhận',
      'dang-xu-ly': 'Đang chuẩn bị',
      'dang-giao': 'Đang giao',
      'hoan-thanh': 'Đã nhận',
      'da-huy': 'Đã hủy',
    }
    return labels[status] || 'Chờ xác nhận'
  }

  const toCurrency = (value) => `${value.toLocaleString('vi-VN')}đ`

  return (
    <div className="ot-container">
      <div className="ot-header">
        <button className="ot-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Quay lại
        </button>
        <h1>Theo dõi đơn hàng</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="ot-content">
        {orders.length === 0 ? (
          <div className="ot-empty">
            <FiPackage size={48} />
            <h2>Không có đơn hàng nào</h2>
            <p>Bạn chưa có đơn hàng để theo dõi.</p>
            <button className="ot-btn ot-btn-primary" onClick={() => navigate('/')}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="ot-grid">
            {/* Danh sách đơn hàng */}
            <div className="ot-orders-list">
              <h2>Danh sách đơn hàng</h2>
              <div className="ot-orders">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`ot-order-card ${selectedOrder?.id === order.id ? 'active' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="ot-order-header">
                      <span className="ot-order-id">#{order.id}</span>
                      <span className={`ot-status ${getStatusBadgeColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="ot-order-customer">{order.customer}</p>
                    <p className="ot-order-total">{toCurrency(order.total)}</p>
                    <p className="ot-order-date">{order.date || new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chi tiết tracking */}
            {selectedOrder && (
              <div className="ot-tracking-detail">
                <div className="ot-tracking-header">
                  <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
                  <span className={`ot-status-large ${getStatusBadgeColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {/* Order Info */}
                <div className="ot-order-info">
                  <div className="ot-info-item">
                    <label>Khách hàng</label>
                    <p>{selectedOrder.customer}</p>
                  </div>
                  <div className="ot-info-item">
                    <label>Tổng tiền</label>
                    <p className="ot-amount">{toCurrency(selectedOrder.total)}</p>
                  </div>
                  <div className="ot-info-item">
                    <label>Hình thức thanh toán</label>
                    <p>
                      {selectedOrder.paymentMethodLabel || selectedOrder.type}
                    </p>
                  </div>
                  <div className="ot-info-item">
                    <label>Ngày đặt</label>
                    <p><FiCalendar size={14} style={{ marginRight: '4px' }} /> {selectedOrder.date || new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="ot-timeline">
                  <h3>Quá trình vận chuyển</h3>
                  <div className="ot-steps">
                    {getTrackingSteps(selectedOrder).map((step, index) => (
                      <div key={step.key} className={`ot-step ${step.isCompleted ? 'completed' : ''} ${step.isActive ? 'active' : ''}`}>
                        <div className="ot-step-icon">
                          <step.icon size={20} />
                        </div>
                        <div className="ot-step-content">
                          <h4>{step.label}</h4>
                          <p>{step.description}</p>
                        </div>
                        {index < getTrackingSteps(selectedOrder).length - 1 && (
                          <div className={`ot-step-line ${step.isCompleted ? 'completed' : ''}`}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Status cancelled */}
                  {selectedOrder.status === 'da-huy' && (
                    <div className="ot-cancelled-notice">
                      <p>⚠️ Đơn hàng này đã bị hủy</p>
                      {selectedOrder.refundRequest && (
                        <p style={{ marginTop: '8px', fontSize: '13px' }}>Yêu cầu hoàn tiền đang được xử lý.</p>
                      )}
                    </div>
                  )}

                  {/* Additional info */}
                  <div className="ot-additional-info">
                    {selectedOrder.preOrder && (
                      <div className="ot-tag">📅 Đơn hàng Pre-order</div>
                    )}
                    {selectedOrder.privateOrder && (
                      <div className="ot-tag">🎁 Đơn hàng riêng</div>
                    )}
                    {selectedOrder.refundRequest && (
                      <div className="ot-tag">🔄 Có yêu cầu hoàn trả</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
