import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProductProvider } from "./context/ProductContext"
import { CartProvider } from "./context/CartContext"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Laptop from "./pages/Laptop"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Admin from "./pages/Admin"
import OrderTracking from "./pages/OrderTracking"
import News from "./pages/News"
import Notifications from "./pages/Notifications"
import ResetPassword from "./pages/ResetPassword"
import FacebookCallback from "./pages/FacebookCallback"

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/facebook-callback" element={<FacebookCallback />} />
              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Laptop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<News />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  )
}

export default App