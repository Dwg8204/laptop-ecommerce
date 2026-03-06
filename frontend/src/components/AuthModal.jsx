import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/AuthModal.css'

export default function AuthModal({ onClose }) {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  })
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const toggleMode = () => {
    setIsRegister((prev) => !prev)
    setError('')
    setFormData({ name: '', email: '', password: '', phone: '', confirm: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (isRegister) {
    if (formData.password !== formData.confirm) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    )

    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }

  } else {
    const result = await login(
      formData.email,
      formData.password
    )

    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }
  }
}

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>&times;</button>
        <h2>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input 
              type="text" 
              placeholder="Họ tên" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          {isRegister && (
            <input
              type="text"
              placeholder="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="password"
            placeholder="Mật khẩu"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              required
            />
          )}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-submit">
            {isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button type="button" onClick={toggleMode} className="auth-toggle">
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </p>
        <div className="auth-demo">
          <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
            <strong>Tài khoản demo:</strong><br/>
            Admin: admin@laptopshop.vn / Admin@123456<br/>
            User: user@example.com / User@123<br/>
          </p>
        </div>
      </div>
    </div>
  )
}
