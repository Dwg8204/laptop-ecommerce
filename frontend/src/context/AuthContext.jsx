import { createContext, useContext, useState, useEffect } from "react"
import { buildApiUrl } from "../config/api"
import { clearAuthToken, getAuthToken, setAuthToken } from "../lib/authToken"

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
      const token = getAuthToken()
      const savedUser = localStorage.getItem("user")
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(normalizeUser(userData))
        } catch (error) {
          console.error("Error parsing saved user:", error)
          clearAuthToken()
          localStorage.removeItem("user")
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/login"), {
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
        setAuthToken(data.data.token)
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

  const loginWithFacebook = async (accessToken) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/facebook"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ accessToken })
      })

      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.message }
      }

      if (data.data && data.data.token) {
        setAuthToken(data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))

        const normalizedUser = normalizeUser(data.data.user)
        setUser(normalizedUser)
      }

      return { success: true, data: data.data }
    } catch (error) {
      console.error("Facebook login error:", error)
      return { success: false, error: "Lỗi kết nối server" }
    }
  }

  const register = async (name, email, password, phone) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/register"), {
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
        setAuthToken(data.data.token)
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

  const forgotPassword = async (email) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.message }
      }

      return { success: true, message: data.message }
    } catch (error) {
      console.error("Forgot password error:", error)
      return { success: false, error: "Lỗi kết nối server" }
    }
  }

  const verifyResetCode = async (email, code) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/verify-reset-code"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
      })

      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.message }
      }

      return { success: true, message: data.message }
    } catch (error) {
      console.error("Verify reset code error:", error)
      return { success: false, error: "Lỗi kết nối server" }
    }
  }

  const resetPassword = async (email, code, newPassword) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code, newPassword })
      })

      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.message }
      }

      return { success: true, message: data.message }
    } catch (error) {
      console.error("Reset password error:", error)
      return { success: false, error: "Lỗi kết nối server" }
    }
  }

  const logout = () => {
    clearAuthToken()
    localStorage.removeItem("user")
    setUser(null)
  }

  // Hàm kiểm tra quyền admin
  const isAdmin = () => {
    if (!user) return false
    return user.role === 'admin' || user.role === 'staff'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithFacebook, register, forgotPassword, verifyResetCode, resetPassword, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)