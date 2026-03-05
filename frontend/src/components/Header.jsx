import { FiShoppingCart, FiUser, FiSearch, FiList, FiLogOut, FiPackage, FiBell } from 'react-icons/fi'
import { MdFiberNew } from 'react-icons/md'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import '../styles/header.css'
import { useCart } from '../context/CartContext'

export default function Header() {
  const [showAuth, setShowAuth] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const  {getTotalItems} = useCart()
  
  const topBarContent = [
    '⚙️ Thu cũ giá ngon - Lên đời tiết kiệm',
    '✅ Sản phẩm chính hãng - Xuất VAT đầy đủ',
    '🚚 Giao nhanh - Miễn phí cho đơn 300K',
    '🏬 Cửa hàng gần bạn',
    '📦 Tra cứu đơn hàng',
    '📞 1800 2097'
  ]

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const handleAdminClick = () => {
    setShowUserMenu(false)
    navigate('/admin')
  }
  
  const handleUserClick = () => {
  
    navigate("/")
  }

  return (
    <>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarTrack}>
          <div style={styles.topBarGroup}>
            {topBarContent.map((text, index) => (
              <span style={styles.topBarItem} key={`topbar-1-${index}`}>
                {text}
                <span style={styles.topBarDivider}>•</span>
              </span>
            ))}
          </div>
          <div style={styles.topBarGroup} aria-hidden="true">
            {topBarContent.map((text, index) => (
              <span style={styles.topBarItem} key={`topbar-2-${index}`}>
                {text}
                <span style={styles.topBarDivider}>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header style={styles.header}>
        <div style={styles.logo}>LaptopShop</div>

        <button style={styles.categoryBtn}>
          <FiList size={24} />
          Danh mục
        </button>

        <div style={styles.searchContainer}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Bạn muốn mua gì hôm nay?"
            style={styles.searchInput}
          />
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          {/* Cart */}
          <div style={styles.cartWrapper} onClick={() => navigate('/cart')}>
            <span>Giỏ hàng</span>
            <div style={styles.cartIcon}>
              <FiShoppingCart size={28} />
              <span style={styles.cartBadge}>{getTotalItems()}</span>
            </div>
          </div>
          {/*News*/}
           <div style={styles.newsWrapper} onClick={()=> navigate('/news')}>
            <span>Tin tức</span>
            <div style={styles.newsIcon}>
              <MdFiberNew size={28} />
              <span style={styles.newsBadge}>0</span>
            </div>
          </div>
            
          {/*Notification*/}
          <div style={styles.notificationWrapper} onClick={()=> navigate('/notifications')}>
            <span>Thông báo</span>
            <div style={styles.notificationIcon}>
              <FiBell size={28} />
              <span style={styles.notificationBadge}>0</span>
            </div>
          </div>
          {/* Login/User Menu */}
          {user ? (
            <div style={styles.userMenu}>
              <button 
                style={styles.userBtn} 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user.name}
                <FiUser size={24} />
              </button>
              {showUserMenu && (
                <div style={styles.userDropdown}>
                  <div style={styles.userInfo}>
                    <strong>{user.name}</strong>
                    <span style={styles.userRole}>{user.role === 'admin' ? 'Quản trị viên' : user.role === 'warehouse' ? 'Nhân viên kho' : user.role === 'sales' ? 'Nhân viên bán hàng' : 'Khách hàng'}</span>
                  </div>
                  {isAdmin() && (
                    <button className="user-dropdown-item" onClick={handleAdminClick}>
                      Trang quản trị
                    </button>
                  )}
                  {isAdmin() &&( <button className="user-dropdown-item" onClick={handleUserClick}>Trang người dùng</button>)}
                  <button 
                    className="user-dropdown-item" 
                    onClick={() => {
                      setShowUserMenu(false)
                      navigate('/order-tracking')
                    }}
                  >
                    <FiPackage size={16} />
                    Theo dõi đơn hàng
                  </button>
                  <button className="user-dropdown-item" onClick={handleLogout}>
                    <FiLogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button style={styles.loginBtn} onClick={() => setShowAuth(true)}>
              Đăng nhập
              <FiUser size={24} />
            </button>
          )}
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
const styles = {
  topBar: {
    background: 'linear-gradient(90deg, #e34d7b 0%, #d70018 55%, #d70018 100%)',
    color: '#fff',
    fontSize: '13px',
    padding: '6px 20px',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },

  topBarTrack: {
    display: 'flex',
    alignItems: 'center',
    width: 'max-content',
    animation: 'topBarScroll 20s linear infinite'
  },

  topBarGroup: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  },

  topBarItem: {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: '600',
    marginRight: '2px'
  },

  topBarDivider: {
    opacity: 0.45,
    margin: '0 14px'
  },

  header: {
    background: '#e30019',
    color: '#fff',
    padding: '24px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px'
  },

  logo: {
    fontSize: '32px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  categoryBtn: {
    background: '#ff4d4f',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '350px',
    background: '#fff',
    borderRadius: '20px',
    padding: '0 14px'
  },

  searchIcon: {
    color: '#999',
    marginRight: '10px',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center'
  },

  searchInput: {
    width: '100%',
    padding: '16px 0',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    background: 'transparent'
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },

  /* Cart */
  cartWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '16px'
  },

  cartIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  cartBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    background: '#ffb800',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '50%',
    padding: '2px 6px'
  },

  newsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '16px'
  },

  newsIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  newsBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    background: '#ffb800',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '50%',
    padding: '2px 6px'
  },
  /* Notification */
  notificationWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '16px'
  },

  notificationIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  notificationBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    background: '#ffb800',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '50%',
    padding: '2px 6px',
    minWidth: '20px',
    textAlign: 'center'
  },

  /* Login */
  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px'
  },

  /* User Menu */
  userMenu: {
    position: 'relative'
  },

  userBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500'
  },

  userDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 1000,
    overflow: 'hidden'
  },

  userInfo: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  userRole: {
    fontSize: '12px',
    color: '#666'
  }
}