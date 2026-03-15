import { useCart } from '../context/CartContext'
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiCreditCard, FiDollarSign, FiSmartphone, FiTag, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as voucherApi from '../services/voucherApi'
import * as orderApi from '../services/orderApi'
import * as paymentApi from '../services/paymentApi'
import * as productApi from '../services/productApi'
import { upsertOrderForUser } from '../lib/orderStorage'
import '../styles/Cart.css'

const toCurrency = (value) => `${value.toLocaleString('vi-VN')}đ`

const paymentMethods = [
  { id: 'COD', label: 'COD', icon: FiDollarSign, description: 'Thanh toán khi nhận hàng' },
  { id: 'MOMO', label: 'MoMo', icon: FiSmartphone, description: 'Thanh toán qua ví điện tử MoMo' },
  { id: 'VNPAY', label: 'VNPay', icon: FiCreditCard, description: 'Thanh toán online qua cổng VNPay' },
]

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [voucherCode, setVoucherCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [voucherFeedback, setVoucherFeedback] = useState('')
  const [voucherFeedbackType, setVoucherFeedbackType] = useState('')
  const [checkingVoucher, setCheckingVoucher] = useState(false)
  const [processingCheckout, setProcessingCheckout] = useState(false)

  const subtotal = getTotalPrice()
  const canApplyCurrentVoucher = appliedVoucher && subtotal >= Number(appliedVoucher.min_order_value || 0)
  const discountAmount = canApplyCurrentVoucher
    ? appliedVoucher.discount_type === 'PERCENTAGE'
      ? Math.min(subtotal, Math.round((subtotal * Number(appliedVoucher.discount_value || 0)) / 100))
      : Math.min(subtotal, Number(appliedVoucher.discount_value || 0))
    : 0
  const finalTotal = Math.max(0, subtotal - discountAmount)

  const handleApplyVoucher = async () => {
    const normalizedCode = String(voucherCode || '').trim()
    if (!normalizedCode) {
      setVoucherFeedbackType('error')
      setVoucherFeedback('Vui lòng nhập mã voucher')
      return
    }

    try {
      setCheckingVoucher(true)
      setVoucherFeedback('')
      setVoucherFeedbackType('')
      const response = await voucherApi.checkVoucherByCode(normalizedCode)
      const voucher = response?.data
      if (!voucher) {
        throw new Error('Mã voucher không hợp lệ')
      }
      if (subtotal < Number(voucher.min_order_value || 0)) {
        setAppliedVoucher(null)
        setVoucherFeedbackType('error')
        setVoucherFeedback(`Đơn hàng cần tối thiểu ${toCurrency(Number(voucher.min_order_value || 0))} để dùng mã này`)
        return
      }
      setAppliedVoucher(voucher)
      setVoucherCode(voucher.voucher_code)
      setVoucherFeedbackType('success')
      setVoucherFeedback(`Áp dụng voucher ${voucher.voucher_code} thành công`)
    } catch (error) {
      setAppliedVoucher(null)
      setVoucherFeedbackType('error')
      setVoucherFeedback(error.message)
    } finally {
      setCheckingVoucher(false)
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    setVoucherCode('')
    setVoucherFeedback('Đã gỡ voucher khỏi đơn hàng')
    setVoucherFeedbackType('info')
  }

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

  const handlePaymentConfirm = async () => {
    if (!selectedPayment) {
      alert('Vui lòng chọn hình thức thanh toán')
      return
    }

    if (!user?.user_id) {
      alert('Không xác định được tài khoản đăng nhập để tạo đơn hàng')
      return
    }

    const resolveVariantId = async (item) => {
      if (item.variantId) return Number(item.variantId)

      const cartIdParts = String(item.id || '').split('-')
      if (cartIdParts.length > 1 && Number(cartIdParts[1])) {
        return Number(cartIdParts[1])
      }

      const productId = item.productId || cartIdParts[0]
      if (!productId) {
        throw new Error(`Không thể xác định phiên bản cho sản phẩm ${item.name}`)
      }

      const detailResponse = await productApi.getProductById(productId)
      const fallbackVariantId = detailResponse?.data?.variants?.[0]?.variant_id
      if (!fallbackVariantId) {
        throw new Error(`Sản phẩm ${item.name} chưa có phiên bản khả dụng để đặt hàng`)
      }

      return Number(fallbackVariantId)
    }

    const persistLocalOrder = (orderPayload) => {
      upsertOrderForUser(user.user_id, orderPayload, user.name)
    }

    try {
      setProcessingCheckout(true)

      const resolvedItems = await Promise.all(
        cart.map(async (item) => ({
          variant_id: await resolveVariantId(item),
          quantity: item.quantity,
        }))
      )

      const orderResponse = await orderApi.createOrder({
        user_id: user.user_id,
        voucher_id: appliedVoucher?.voucher_id || undefined,
        order_type: 'NORMAL',
        items: resolvedItems,
      })

      const createdOrderId = orderResponse?.data?.order_id
      if (!createdOrderId) {
        throw new Error('Không nhận được mã đơn hàng từ hệ thống')
      }

      const paymentMethodData = paymentMethods.find(m => m.id === selectedPayment)
      const localOrder = {
        id: String(createdOrderId),
        user_id: user.user_id,
        customer: user.name,
        type: 'Thường',
        total: finalTotal,
        subtotal,
        discountAmount,
        status: 'cho-xac-nhan',
        date: new Date().toLocaleDateString('vi-VN'),
        paymentId: null,
        paymentMethod: selectedPayment,
        paymentMethodLabel: paymentMethodData?.label,
        paymentStatus: 'UNPAID',
        voucher: appliedVoucher
          ? {
              voucher_id: appliedVoucher.voucher_id,
              voucher_code: appliedVoucher.voucher_code,
              discount_type: appliedVoucher.discount_type,
              discount_value: appliedVoucher.discount_value,
            }
          : null,
        preOrder: false,
        privateOrder: false,
        refundRequest: false,
        items: cart.map(item => ({
          productId: item.productId || item.id,
          variantId: item.variantId || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))
      }

      persistLocalOrder(localOrder)

      const paymentResponse = await paymentApi.processPayment({
        order_id: createdOrderId,
        payment_method: selectedPayment,
      })

      persistLocalOrder({
        id: String(createdOrderId),
        paymentId: paymentResponse?.data?.payment_id || null,
        paymentStatus: paymentResponse?.data?.payment_status || 'UNPAID',
      })

      clearCart()
      setShowPaymentModal(false)
      setSelectedPayment(null)
      setAppliedVoucher(null)
      setVoucherCode('')
      setVoucherFeedback('')
      setVoucherFeedbackType('')

      if (selectedPayment === 'COD') {
        alert(`Đặt hàng thành công! Mã đơn hàng: ${createdOrderId}\nHình thức thanh toán: COD`)
        navigate('/order-tracking')
        return
      }

      const paymentUrl = paymentResponse?.data?.payment_url
      if (!paymentUrl) {
        throw new Error('Không nhận được liên kết thanh toán từ cổng thanh toán')
      }

      window.location.href = paymentUrl
    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Không thể thanh toán: ${error.message}`)
    } finally {
      setProcessingCheckout(false)
    }
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

            <div className="cart-voucher-box">
              <label className="cart-voucher-label">Mã voucher</label>
              <div className="cart-voucher-row">
                <div className="cart-voucher-input-wrap">
                  <FiTag />
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(event) => setVoucherCode(event.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá"
                  />
                </div>
                {appliedVoucher ? (
                  <button className="cart-btn cart-btn-secondary cart-voucher-action" onClick={handleRemoveVoucher}>
                    Gỡ
                  </button>
                ) : (
                  <button className="cart-btn cart-btn-checkout cart-voucher-action" onClick={handleApplyVoucher} disabled={checkingVoucher}>
                    {checkingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                )}
              </div>
              {voucherFeedback ? (
                <div className={`cart-voucher-feedback ${voucherFeedbackType}`}>
                  {voucherFeedback}
                </div>
              ) : null}
            </div>
            
            <div className="summary-row">
              <span>Tổng sản phẩm:</span>
              <strong>{cart.length}</strong>
            </div>

            <div className="summary-row">
              <span>Tổng số lượng:</span>
              <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong>
            </div>

            <div className="summary-row">
              <span>Tạm tính:</span>
              <strong>{toCurrency(subtotal)}</strong>
            </div>

            {appliedVoucher ? (
              <div className="summary-row cart-summary-discount">
                <span>Giảm giá ({appliedVoucher.voucher_code}):</span>
                <strong>-{toCurrency(discountAmount)}</strong>
              </div>
            ) : null}

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Tổng cộng:</span>
              <strong className="total-amount">
                {toCurrency(finalTotal)}
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
              <p className="payment-total">Tổng tiền: <strong>{toCurrency(finalTotal)}</strong></p>
              {appliedVoucher ? (
                <p className="payment-voucher-note">
                  Voucher {appliedVoucher.voucher_code} đang được áp dụng, giảm {toCurrency(discountAmount)}.
                </p>
              ) : null}
              
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
                disabled={processingCheckout}
              >
                {processingCheckout ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}