import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as userProfileApi from '../services/userProfileApi'
import '../styles/UserProfile.css'

const createEmptyAddressForm = () => ({
  receiver_name: '',
  receiver_phone: '',
  specific_address: '',
  ward: '',
  district: '',
  province: '',
  is_default: false,
})

export default function UserProfileEnhanced() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [profileForm, setProfileForm] = useState({ full_name: '', phone_number: '' })
  const [addresses, setAddresses] = useState([])
  const [addressForm, setAddressForm] = useState(createEmptyAddressForm())
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  const activeAddressCount = useMemo(() => addresses.length, [addresses])

  const loadData = async () => {
    try {
      setLoading(true)
      const [profileResponse, addressResponse] = await Promise.all([
        userProfileApi.getMyProfile(),
        userProfileApi.getMyAddresses(),
      ])

      const profile = profileResponse?.data || {}
      setProfileForm({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
      })

      setAddresses(Array.isArray(addressResponse?.data) ? addressResponse.data : [])
    } catch (error) {
      alert(`Không thể tải trang cá nhân: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!authLoading && user) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    try {
      setSavingProfile(true)
      await userProfileApi.updateMyProfile(profileForm)
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          localStorage.setItem('user', JSON.stringify({
            ...parsed,
            full_name: profileForm.full_name,
            phone_number: profileForm.phone_number,
          }))
        } catch {
          // Ignore localStorage parse issue.
        }
      }
      alert('Đã cập nhật thông tin cá nhân')
    } catch (error) {
      alert(`Không thể cập nhật thông tin: ${error.message}`)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAddressSubmit = async (event) => {
    event.preventDefault()

    try {
      setSavingAddress(true)

      if (editingAddressId) {
        await userProfileApi.updateMyAddress(editingAddressId, addressForm)
      } else {
        await userProfileApi.createMyAddress(addressForm)
      }

      setAddressForm(createEmptyAddressForm())
      setEditingAddressId(null)
      await loadData()
    } catch (error) {
      alert(`Không thể lưu địa chỉ: ${error.message}`)
    } finally {
      setSavingAddress(false)
    }
  }

  const handleEditAddress = (address) => {
    setEditingAddressId(address.address_id)
    setAddressForm({
      receiver_name: address.receiver_name || '',
      receiver_phone: address.receiver_phone || '',
      specific_address: address.specific_address || '',
      ward: address.ward || '',
      district: address.district || '',
      province: address.province || '',
      is_default: Boolean(address.is_default),
    })
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này không?')) return

    try {
      await userProfileApi.deleteMyAddress(addressId)
      await loadData()
    } catch (error) {
      alert(`Không thể xóa địa chỉ: ${error.message}`)
    }
  }

  const handleSetDefaultAddress = async (address) => {
    try {
      await userProfileApi.updateMyAddress(address.address_id, {
        ...address,
        is_default: true,
      })
      await loadData()
    } catch (error) {
      alert(`Không thể đặt địa chỉ mặc định: ${error.message}`)
    }
  }

  if (authLoading || loading) {
    return <div className="profile-page"><p>Đang tải trang cá nhân...</p></div>
  }

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <h2>Trang cá nhân</h2>
        <p className="profile-subtitle">Quản lý thông tin liên hệ và địa chỉ giao hàng.</p>

        <section className="profile-card">
          <h3>Thông tin tài khoản</h3>
          <form className="profile-form" onSubmit={handleSaveProfile}>
            <label>
              Họ và tên
              <input
                value={profileForm.full_name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, full_name: event.target.value }))}
                required
              />
            </label>

            <label>
              Số điện thoại
              <input
                value={profileForm.phone_number}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, phone_number: event.target.value }))}
                placeholder="VD: 0901234567"
              />
            </label>

            <button type="submit" disabled={savingProfile}>
              {savingProfile ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </form>
        </section>

        <section className="profile-card">
          <h3>Địa chỉ giao hàng ({activeAddressCount})</h3>

          <form className="profile-form profile-form-grid" onSubmit={handleAddressSubmit}>
            <label>
              Người nhận
              <input
                value={addressForm.receiver_name}
                onChange={(event) => setAddressForm((prev) => ({ ...prev, receiver_name: event.target.value }))}
                required
              />
            </label>
            <label>
              Số điện thoại
              <input
                value={addressForm.receiver_phone}
                onChange={(event) => setAddressForm((prev) => ({ ...prev, receiver_phone: event.target.value }))}
                required
              />
            </label>
            <label className="profile-span-2">
              Địa chỉ cụ thể
              <input
                value={addressForm.specific_address}
                onChange={(event) => setAddressForm((prev) => ({ ...prev, specific_address: event.target.value }))}
                required
              />
            </label>
            <label>
              Phường/Xã
              <input
                value={addressForm.ward}
                onChange={(event) => setAddressForm((prev) => ({ ...prev, ward: event.target.value }))}
                required
              />
            </label>
            <label>
              Quận/Huyện
              <input
                value={addressForm.district}
                onChange={(event) => setAddressForm((prev) => ({ ...prev, district: event.target.value }))}
                required
              />
            </label>
            <label>
              Tỉnh/Thành phố
              <input
                value={addressForm.province}
                onChange={(event) => setAddressForm((prev) => ({ ...prev, province: event.target.value }))}
                required
              />
            </label>

            <label className="profile-checkbox profile-span-2">
              <input
                type="checkbox"
                checked={addressForm.is_default}
                onChange={(event) => setAddressForm((prev) => ({ ...prev, is_default: event.target.checked }))}
              />
              <span>Đặt làm địa chỉ mặc định</span>
            </label>

            <div className="profile-actions profile-span-2">
              <button type="submit" disabled={savingAddress}>
                {savingAddress ? 'Đang lưu...' : editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
              </button>
              {editingAddressId ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingAddressId(null)
                    setAddressForm(createEmptyAddressForm())
                  }}
                >
                  Hủy
                </button>
              ) : null}
            </div>
          </form>

          <div className="address-list">
            {addresses.length === 0 ? <p>Chưa có địa chỉ nào.</p> : null}
            {addresses.map((address) => (
              <article key={address.address_id} className="address-item">
                <header>
                  <strong>{address.receiver_name}</strong>
                  {address.is_default ? <span className="address-default">Mặc định</span> : null}
                </header>
                <p>{address.receiver_phone}</p>
                <p>{address.specific_address}, {address.ward}, {address.district}, {address.province}</p>
                <div className="address-actions">
                  <button type="button" onClick={() => handleEditAddress(address)}>Sửa</button>
                  {!address.is_default ? (
                    <button type="button" onClick={() => handleSetDefaultAddress(address)}>Đặt mặc định</button>
                  ) : null}
                  <button type="button" className="btn-danger" onClick={() => handleDeleteAddress(address.address_id)}>Xóa</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
