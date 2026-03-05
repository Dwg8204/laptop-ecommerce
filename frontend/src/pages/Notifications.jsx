import { useState } from 'react'
import { FiBell, FiCheck, FiPackage, FiTag, FiTruck, FiX } from 'react-icons/fi'
import '../styles/Notifications.css'

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Đơn hàng đang được giao',
      message: 'Đơn hàng #O1001 của bạn đang trên đường giao đến địa chỉ của bạn',
      time: '2 giờ trước',
      read: false,
      icon: FiTruck,
      color: '#2196f3'
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Giảm giá đặc biệt',
      message: 'Flash Sale cuối tuần - Giảm đến 30% cho các dòng laptop gaming',
      time: '5 giờ trước',
      read: false,
      icon: FiTag,
      color: '#ff9800'
    },
    {
      id: 3,
      type: 'order',
      title: 'Đơn hàng đã giao thành công',
      message: 'Đơn hàng #O1000 đã được giao thành công. Cảm ơn bạn đã mua hàng!',
      time: '1 ngày trước',
      read: true,
      icon: FiCheck,
      color: '#4caf50'
    },
    {
      id: 4,
      type: 'product',
      title: 'Sản phẩm đã về hàng',
      message: 'ASUS ROG Strix G16 bạn đang quan tâm đã có hàng trở lại',
      time: '2 ngày trước',
      read: true,
      icon: FiPackage,
      color: '#9c27b0'
    }
  ])

  const [filter, setFilter] = useState('all')

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="notifications-title">
            <FiBell size={32} />
            <div>
              <h1>Thông báo</h1>
              <p>{unreadCount} thông báo chưa đọc</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              <FiCheck size={18} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        <div className="notifications-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'order' ? 'active' : ''}`}
            onClick={() => setFilter('order')}
          >
            Đơn hàng
          </button>
          <button 
            className={`filter-btn ${filter === 'promotion' ? 'active' : ''}`}
            onClick={() => setFilter('promotion')}
          >
            Khuyến mãi
          </button>
          <button 
            className={`filter-btn ${filter === 'product' ? 'active' : ''}`}
            onClick={() => setFilter('product')}
          >
            Sản phẩm
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <FiBell size={64} />
              <h3>Không có thông báo</h3>
              <p>Bạn chưa có thông báo nào trong mục này</p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const Icon = notif.icon
              return (
                <div 
                  key={notif.id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="notification-icon" style={{ backgroundColor: notif.color }}>
                    <Icon size={24} />
                  </div>
                  <div className="notification-content">
                    <div className="notification-header-row">
                      <h3>{notif.title}</h3>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                    <p>{notif.message}</p>
                  </div>
                  <div className="notification-actions">
                    {!notif.read && (
                      <button 
                        className="action-btn read-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notif.id)
                        }}
                        title="Đánh dấu đã đọc"
                      >
                        <FiCheck size={18} />
                      </button>
                    )}
                    <button 
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notif.id)
                      }}
                      title="Xóa thông báo"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
