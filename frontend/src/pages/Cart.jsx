import { useCart } from '../context/CartContext'
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiCreditCard, FiDollarSign, FiSmartphone, FiTrendingUp, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Cart.css'

const toCurrency = (value) => `${value.toLocaleString('vi-VN')}đ`

const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng', icon: FiDollarSign, description: 'Thanh toán khi nhân viên giao hàng' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: FiCreditCard, description: 'Chuyển khoản qua các ngân hàng' },
  { id: 'wallet', label: 'Ví điện tử', icon: FiSmartphone, description: 'Momo, Zalopay, Paypal' },
  { id: 'installment', label: 'Trả góp 0%', icon: FiTrendingUp, description: 'Trả góp không lãi từ 3-12 tháng' },
]

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để tiếp tục thanh toán')
      return
    }

    if (cart.length === 0) {
      alert('Giỏ hàng của bạn trống!')
      return
    }

    // Hiển thị modal chọn hình thức thanh toán
    setShowPaymentModal(true)
  }

  const handlePaymentConfirm = () => {
    if (!selectedPayment) {
      alert('Vui lòng chọn hình thức thanh toán')
      return
    }

    // Tạo order mới
    const orderId = `O${String(Date.now()).slice(-6)}`
    const paymentMethodData = paymentMethods.find(m => m.id === selectedPayment)
    const newOrder = {
      id: orderId,
      customer: user.name,
      type: "Thường",
      total: getTotalPrice(),
      status: "cho-xac-nhan",
      date: new Date().toLocaleDateString('vi-VN'),
      paymentMethod: selectedPayment,
      paymentMethodLabel: paymentMethodData?.label,
      preOrder: false,
      privateOrder: false,
      refundRequest: false,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }))
    }

    // Lưu order vào localStorage
    const existingOrders = localStorage.getItem('laptopOrders')
    let orders = []
    if (existingOrders) {
      try {
        orders = JSON.parse(existingOrders)
      } catch (error) {
        console.error('Error parsing orders:', error)
      }
    }
    
    orders.push(newOrder)
    localStorage.setItem('laptopOrders', JSON.stringify(orders))

    // Xóa giỏ hàng
    clearCart()

    // Đóng modal
    setShowPaymentModal(false)
    setSelectedPayment(null)

    // Hiển thị thông báo và chuyển hướng
    alert(`Đặt hàng thành công! Mã đơn hàng: ${orderId}\nHình thức thanh toán: ${paymentMethodData?.label}`)
    navigate('/order-tracking')
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Giỏ hàng của bạn trống</h2>
          <p>Hãy thêm sản phẩm để tiếp tục mua sắm</p>
          <button 
            className="cart-btn cart-btn-primary" 
            onClick={() => navigate('/')}
          >
            <FiArrowLeft /> Tiếp tục mua sắm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-page-header">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Quay lại
        </button>
        <h1>Giỏ hàng của bạn</h1>
        <div style={{ width: '60px' }}></div>
      </div>
      <div className="cart-header">
        <p>{cart.length} sản phẩm</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-table-header">
            <div className="col-product">Sản phẩm</div>
            <div className="col-price">Giá</div>
            <div className="col-quantity">Số lượng</div>
            <div className="col-total">Tổng cộng</div>
            <div className="col-action">Tác vụ</div>
          </div>

          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="col-product">
                <div className="product-info">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h3>{item.name}</h3>
                    <p className="product-config">{item.config}</p>
                  </div>
                </div>
              </div>

              <div className="col-price">
                <span className="price-value">{toCurrency(item.price)}</span>
              </div>

              <div className="col-quantity">
                <div className="quantity-control">
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <input 
                    type="number" 
                    className="qty-input"
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 1
                      if (qty > 0) updateQuantity(item.id, qty)
                    }}
                    min="1"
                  />
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="col-total">
                <span className="total-value">
                  {toCurrency(item.price * item.quantity)}
                </span>
              </div>

              <div className="col-action">
                <button 
                  className="cart-btn-remove"
                  onClick={() => removeFromCart(item.id)}
                  title="Xoá sản phẩm"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Tóm tắt đơn hàng</h3>
            
            <div className="summary-row">
              <span>Tổng sản phẩm:</span>
              <strong>{cart.length}</strong>
            </div>

            <div className="summary-row">
              <span>Tổng số lượng:</span>
              <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Tổng cộng:</span>
              <strong className="total-amount">
                {toCurrency(getTotalPrice())}
              </strong>
            </div>

            <button 
              className="cart-btn cart-btn-checkout"
              onClick={handleCheckout}
            >
              Thanh toán
            </button>

            <button 
              className="cart-btn cart-btn-secondary"
              onClick={() => navigate('/')}
            >
              Tiếp tục mua sắm
            </button>

            <button 
              className="cart-btn cart-btn-danger"
              onClick={() => {
                if (window.confirm('Xóa tất cả sản phẩm trong giỏ?')) {
                  clearCart()
                }
              }}
            >
              Xóa giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="cart-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h2>Chọn hình thức thanh toán</h2>
              <button 
                className="cart-modal-close"
                onClick={() => {
                  setShowPaymentModal(false)
                  setSelectedPayment(null)
                }}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="cart-modal-body">
              <p className="payment-total">Tổng tiền: <strong>{toCurrency(getTotalPrice())}</strong></p>
              
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-method-card ${selectedPayment === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="payment-method-icon">
                      <method.icon size={28} />
                    </div>
                    <div className="payment-method-info">
                      <h3>{method.label}</h3>
                      <p>{method.description}</p>
                    </div>
                    <div className={`payment-method-checkbox ${selectedPayment === method.id ? 'checked' : ''}`}>
                      {selectedPayment === method.id && <div className="checkmark">✓</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-modal-footer">
              <button 
                className="cart-btn cart-btn-secondary"
                onClick={() => {
                  setShowPaymentModal(false)
                  setSelectedPayment(null)
                }}
              >
                Hủy
              </button>
              <button 
                className="cart-btn cart-btn-checkout"
                onClick={handlePaymentConfirm}
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}