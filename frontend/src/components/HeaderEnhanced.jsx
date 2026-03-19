import { FiShoppingCart, FiUser, FiSearch, FiList, FiLogOut, FiPackage, FiBell } from 'react-icons/fi'
import { MdFiberNew } from 'react-icons/md'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import '../styles/header.css'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { useNotifications } from '../context/NotificationContext'
import { buildApiUrl } from "../config/api"
import SearchSuggestBox from "./SearchSuggestBox";

export default function Header() {
  const [showAuth, setShowAuth] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const categoryMenuRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const  {getTotalItems} = useCart()
  const { products } = useProducts()
  const { unreadCount } = useNotifications()
  const [categoryItems, setCategoryItems] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/product-categories"))
        const data = await res.json().catch(() => ({}))
        setCategoryItems(Array.isArray(data?.data) ? data.data : [])
      } catch {
        setCategoryItems([])
      }
    }
    loadCategories()
  }, [])
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

  const categories = useMemo(() => {
    const names = products
      .map((product) => (product.series || '').trim())
      .filter(Boolean)

    return [...new Set(names)]
  }, [products])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setShowCategoryMenu(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleCategoryClick = (category) => {
    setShowCategoryMenu(false)
    navigate(`/categories/${category.category_id}`)
  }

  return (
    <>
      <div style={styles.headerShell}>
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
          <div style={styles.logo} onClick={() => navigate('/')}>LaptopShop</div>

          <div style={styles.categoryMenuWrap} ref={categoryMenuRef}>
            <button style={styles.categoryBtn} onClick={() => setShowCategoryMenu((prev) => !prev)}>
              <FiList size={24} />
              Danh mục
            </button>
            {showCategoryMenu && (
        <div style={styles.categoryDropdown}>
          {categoryItems.length === 0 ? (
            <button style={styles.categoryItem} type="button" disabled>
              Chưa có danh mục
            </button>
          ) : (
            categoryItems.map((category) => (
              <button
                key={category.category_id}
                style={styles.categoryItem}
                type="button"
                onClick={() => handleCategoryClick(category)}
              >
                {category.category_name}
              </button>
            ))
          )}
        </div>
      )}
          </div>

          {/* <div style={styles.searchContainer}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Bạn muốn mua gì hôm nay?"
              style={styles.searchInput}
            />
          </div> */}
          <div className="header-search-area">
            <SearchSuggestBox />
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
                {user && unreadCount > 0 ? <span style={styles.notificationBadge}>{unreadCount}</span> : null}
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
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
const styles = {
  headerShell: {
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.12)'
  },

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

  categoryMenuWrap: {
    position: 'relative'
  },

  categoryDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    minWidth: '220px',
    maxHeight: '340px',
    overflowY: 'auto',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.18)',
    zIndex: 1300,
    padding: '8px 0'
  },

  categoryItem: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    color: '#0f172a',
    textAlign: 'left',
    fontSize: '14px',
    padding: '10px 14px',
    cursor: 'pointer'
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