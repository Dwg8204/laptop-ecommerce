import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Normalize user data từ backend
  const normalizeUser = (userData) => {
    if (!userData) return null
    
    // Lấy role đầu tiên từ roles array
    const primaryRole = userData.roles && userData.roles.length > 0 
      ? userData.roles[0].role_name.toLowerCase() 
      : 'customer'
    
    return {
      ...userData,
      name: userData.full_name || userData.name, // Map full_name thành name
      role: primaryRole // Map roles array thành role string đơn
    }
  }

  // Khôi phục session khi load app
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      const savedUser = localStorage.getItem("user")
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(normalizeUser(userData))
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.message }
      }

      // Lưu token và user data
      if (data.data && data.data.token) {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        
        const normalizedUser = normalizeUser(data.data.user)
        setUser(normalizedUser)
      }

      return { success: true, data: data.data }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Lỗi kết nối server" }
    }
  }

  const register = async (name, email, password, phone) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: name,
          email,
          password,
          phone_number: phone
        })
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.message }
      }

      // Lưu token và user data sau khi đăng ký thành công
      if (data.data && data.data.token) {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        
        const normalizedUser = normalizeUser(data.data.user)
        setUser(normalizedUser)
      }

      return { success: true, data: data.data }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, error: "Lỗi kết nối server" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  // Hàm kiểm tra quyền admin
  const isAdmin = () => {
    if (!user) return false
    return user.role === 'admin' || user.role === 'warehouse' || user.role === 'sales'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)