import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useProducts } from "../context/ProductContext"
import {
  FiBarChart2,
  FiBox,
  FiClipboard,
  FiCpu,
  FiEdit,
  FiFileText,
  FiHeadphones,
  FiLayers,
  FiList,
  FiPackage,
  FiPlus,
  FiSave,
  FiSettings,
  FiTrash2,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi"
import "../styles/Admin.css"

// Import admin component modules
import AdminDashboard from "../components/admin/AdminDashboard"
import AdminProducts from "../components/admin/AdminProducts"
import AdminInventory from "../components/admin/AdminInventory"
import AdminOrders from "../components/admin/AdminOrders"
import AdminCustomers from "../components/admin/AdminCustomers"
import AdminContent from "../components/admin/AdminContent"
import AdminRecommendation from "../components/admin/AdminRecommendation"
import AdminAssistant from "../components/admin/AdminAssistant"
import AdminStaff from "../components/admin/AdminStaff"
import OrderDetailModal from "../components/admin/OrderDetailModal"
import AdminNews from "../components/admin/AdminNews"  

const moduleItems = [
  { id: "dashboard", label: "Dashboard", icon: FiBarChart2 },
  { id: "products", label: "Sản phẩm", icon: FiPackage },
  { id: "inventory", label: "Tồn kho", icon: FiBox },
  { id: "orders", label: "Đơn hàng", icon: FiClipboard },
  { id: "customers", label: "Khách hàng", icon: FiUsers },
  { id: "content", label: "Nội dung & đánh giá", icon: FiFileText },
  { id: "documentation", label: "Quản lý tin tức", icon: FiBookOpen },
  { id: "recommendation", label: "Gợi ý sản phẩm", icon: FiCpu },
  { id: "assistant", label: "Trợ lý AI", icon: FiHeadphones },
  { id: "staff", label: "Người dùng hệ thống", icon: FiSettings },
]

const initialInventory = [
  { id: "I001", productId: "P001", productName: "ASUS TUF Gaming F16", branch: "HCM-Q1", quantity: 25, minStock: 8 },
  { id: "I002", productId: "P002", productName: "ASUS Vivobook 16X", branch: "HN-CauGiay", quantity: 6, minStock: 10 },
]

const initialOrders = [
  { id: "O1001", customer: "Nguyễn Văn A", type: "Thường", total: 22490000, status: "dang-xu-ly", date: new Date(Date.now() - 2*24*60*60*1000).toLocaleDateString('vi-VN'), preOrder: false, privateOrder: false, refundRequest: false },
  { id: "O1002", customer: "Trần Minh B", type: "Pre-order", total: 19990000, status: "dang-giao", date: new Date(Date.now() - 1*24*60*60*1000).toLocaleDateString('vi-VN'), preOrder: true, privateOrder: false, refundRequest: false },
  { id: "O1003", customer: "Lê Gia C", type: "Đơn riêng", total: 32990000, status: "da-huy", date: new Date(Date.now() - 5*24*60*60*1000).toLocaleDateString('vi-VN'), preOrder: false, privateOrder: true, refundRequest: true },
]

const initialCustomers = [
  { id: "C001", name: "Nguyễn Văn A", segment: "than-thiet", orders: 8, totalSpent: 98700000, status: "active" },
  { id: "C002", name: "Trần Minh B", segment: "moi", orders: 1, totalSpent: 19990000, status: "active" },
  { id: "C003", name: "Lê Gia C", segment: "vip", orders: 20, totalSpent: 320000000, status: "locked" },
]

const initialComments = [
  { id: "CM01", user: "khach_hang_1", product: "ASUS TUF Gaming F16", text: "Máy đẹp, chơi game ổn.", status: "pending" },
  { id: "CM02", user: "khach_hang_2", product: "ASUS Vivobook 16X", text: "Pin hơi yếu nhưng màn hình đẹp.", status: "visible" },
]

const initialAds = [
  { id: "AD01", title: "Sale Back To School", status: "active" },
  { id: "AD02", title: "Flash Sale Cuối Tuần", status: "paused" },
]

const initialAiLogs = [
  { id: "AI01", topic: "Hỏi về laptop gaming", conversions: 4, interactions: 35 },
  { id: "AI02", topic: "So sánh RAM 16GB và 32GB", conversions: 2, interactions: 22 },
]

const initialStaff = [
  { id: "S001", name: "Admin Tổng", role: "admin", email: "admin@laptopshop.vn" },
  { id: "S002", name: "Nhân viên kho", role: "warehouse", email: "kho@laptopshop.vn" },
]

const toCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`

export default function Admin() {
  const { user, loading, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [activeModule, setActiveModule] = useState("dashboard")

  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  
  const [selectedOrder, setSelectedOrder] = useState(null)
  

  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    price: "",
    oldPrice: "",
    storage: "",
    ram: "",
    cpu: "",
    screenSize: "",
    resolution: "",
    graphics: "",
    features: [],
    hasAI: false,
    series: "",
    stock: "",
    config: "",
    specs: "",
    image: "",
    discount: "",
    installment: "Trả góp 0%",
    newArrival: false,
  })
  const [editingProductId, setEditingProductId] = useState("")

  const [inventory, setInventory] = useState(initialInventory)
  const [stockReceipts, setStockReceipts] = useState([])
  const [stockForm, setStockForm] = useState({ productId: "P001", branch: "HCM-Q1", quantity: "" })

  const [orders, setOrders] = useState(initialOrders)
  const [customers, setCustomers] = useState(initialCustomers)
  const [comments, setComments] = useState(initialComments)
  const [ads, setAds] = useState(initialAds)

  const [recommendationStrategy, setRecommendationStrategy] = useState("hanh-vi")
  const [aiLogs] = useState(initialAiLogs)
  const [aiTrainingNote, setAiTrainingNote] = useState("Bổ sung dữ liệu khuyến mãi tháng 3")

  const [staffUsers, setStaffUsers] = useState(initialStaff)
  const [newStaff, setNewStaff] = useState({ name: "", email: "", phone: "", password: "", role: "support" })
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingStaff, setLoadingStaff] = useState(false)

  // Fetch staff users từ API khi vào module "staff"
  useEffect(() => {
    if (activeModule === "staff") {
      fetchStaffUsers()
    }
  }, [activeModule])

  const fetchStaffUsers = async () => {
    setLoadingStaff(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/auth/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStaffUsers(data.data)
          console.log("✅ Đã tải danh sách nhân viên:", data.data)
        }
      } else {
        console.error("Lỗi:", response.statusText)
        // Giữ dữ liệu initial nếu lỗi
      }
    } catch (error) {
      console.error("Error fetching staff users:", error)
    } finally {
      setLoadingStaff(false)
    }
  }

  // Load orders từ localStorage
  useEffect(() => {
    const storedOrders = localStorage.getItem('laptopOrders')
    if (storedOrders) {
      try {
        const orderList = JSON.parse(storedOrders)
        setOrders([...initialOrders, ...orderList])
      } catch (error) {
        console.error('Error parsing orders:', error)
      }
    }
  }, [])

  const lowStockItems = useMemo(() => inventory.filter((item) => item.quantity < item.minStock), [inventory])
  
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  const revenueSummary = useMemo(() => {
    const completed = orders.filter((order) => order.status === "hoan-thanh")
    const processing = orders.filter((order) => order.status !== "da-huy")
    return {
      day: 125000000,
      month: 2480000000,
      year: 19800000000,
      brandAsus: 62,
      priceSegmentMid: 47,
      avgOrder: processing.length ? processing.reduce((sum, order) => sum + order.total, 0) / processing.length : 0,
      cancelRate: Math.round((orders.filter((order) => order.status === "da-huy").length / orders.length) * 100),
      returnRate: 36,
      completedOrders: completed.length,
      preOrders: orders.filter((order) => order.preOrder).length,
      preOrderCancelRate: 20,
      waitingAverageDays: 4,
    }
  }, [orders])

  const recommendationStats = {
    topSuggested: ["ASUS TUF Gaming F16", "ASUS Vivobook 16X", "ASUS ROG Strix G16"],
    clickRate: 18.5,
    purchaseRate: 5.2,
  }

  const aiStats = useMemo(() => {
    const interactions = aiLogs.reduce((sum, item) => sum + item.interactions, 0)
    const conversions = aiLogs.reduce((sum, item) => sum + item.conversions, 0)
    const conversionRate = interactions ? ((conversions / interactions) * 100).toFixed(1) : 0
    return { interactions, conversions, conversionRate }
  }, [aiLogs])

  const handleProductSubmit = (event) => {
    event.preventDefault()

    const payload = {
      name: productForm.name,
      brand: productForm.brand,
      price: Number(productForm.price),
      oldPrice: Number(productForm.oldPrice || productForm.price),
      storage: productForm.storage,
      ram: productForm.ram,
      cpu: productForm.cpu,
      screenSize: productForm.screenSize,
      resolution: productForm.resolution,
      graphics: productForm.graphics,
      features: productForm.features,
      hasAI: productForm.hasAI,
      series: productForm.series,
      stock: Number(productForm.stock),
      config: productForm.config,
      specs: productForm.specs,
      image: productForm.image || "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
      discount:
        productForm.discount ||
        `Giảm ${Math.round(((Number(productForm.oldPrice) - Number(productForm.price)) / Number(productForm.oldPrice)) * 100)}%`,
      installment: productForm.installment,
      newArrival: productForm.newArrival,
    }

    if (editingProductId) updateProduct(editingProductId, payload)
    else addProduct(payload)

    setProductForm({
      name: "",
      brand: "",
      price: "",
      oldPrice: "",
      storage: "",
      ram: "",
      cpu: "",
      screenSize: "",
      resolution: "",
      graphics: "",
      features: [],
      hasAI: false,
      series: "",
      stock: "",
      config: "",
      specs: "",
      image: "",
      discount: "",
      installment: "Trả góp 0%",
      newArrival: false,
    })
    setEditingProductId("")
  }

  const handleEditProduct = (product) => {
    setEditingProductId(product.id)
    setProductForm({
      name: product.name,
      brand: product.brand,
      price: String(product.price),
      oldPrice: String(product.oldPrice || product.price),
      storage: product.storage,
      ram: product.ram,
      cpu: product.cpu,
      screenSize: product.screenSize,
      resolution: product.resolution,
      graphics: product.graphics,
      features: product.features || [],
      hasAI: product.hasAI || false,
      series: product.series,
      stock: String(product.stock),
      config: product.config,
      specs: product.specs,
      image: product.image,
      discount: product.discount,
      installment: product.installment || "Trả góp 0%",
      newArrival: product.newArrival || false,
    })
    setActiveModule("products")
  }

  const handleDeleteProduct = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      deleteProduct(id)
      setInventory((prev) => prev.filter((item) => item.productId !== id))
    }
  }

  const handleStockImport = (event) => {
    event.preventDefault()
    const qty = Number(stockForm.quantity)
    if (!qty || qty <= 0) return

    const selectedProduct = products.find((product) => product.id === stockForm.productId)
    if (!selectedProduct) return

    setInventory((prev) => {
      const index = prev.findIndex((item) => item.productId === stockForm.productId && item.branch === stockForm.branch)
      if (index > -1) {
        return prev.map((item, idx) => (idx === index ? { ...item, quantity: item.quantity + qty } : item))
      }
      return [
        ...prev,
        {
          id: `I${String(prev.length + 1).padStart(3, "0")}`,
          productId: stockForm.productId,
          productName: selectedProduct.name,
          branch: stockForm.branch,
          quantity: qty,
          minStock: 8,
        },
      ]
    })

    setStockReceipts((prev) => [
      { id: `R${String(prev.length + 1).padStart(3, "0")}`, productName: selectedProduct.name, branch: stockForm.branch, quantity: qty, date: new Date().toLocaleString("vi-VN") },
      ...prev,
    ])

    setStockForm((prev) => ({ ...prev, quantity: "" }))
  }

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) => {
      const updated = prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      // Lưu vào localStorage nếu order có trong stored orders
      const storedOrders = localStorage.getItem('laptopOrders')
      if (storedOrders) {
        try {
          const orderList = JSON.parse(storedOrders)
          const updatedStored = orderList.map((order) => (order.id === orderId ? { ...order, status } : order))
          localStorage.setItem('laptopOrders', JSON.stringify(updatedStored))
        } catch (error) {
          console.error('Error updating order in localStorage:', error)
        }
      }
      return updated
    })
  }

  const renderOrderDetailModal = () => (
    <OrderDetailModal selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
  )

  const handleCustomerSegment = (customerId, segment) => setCustomers((prev) => prev.map((customer) => (customer.id === customerId ? { ...customer, segment } : customer)))
  const toggleCustomerLock = (customerId) => setCustomers((prev) => prev.map((customer) => (customer.id === customerId ? { ...customer, status: customer.status === "locked" ? "active" : "locked" } : customer)))
  const updateCommentStatus = (commentId, status) => setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, status } : comment)))
  const removeComment = (commentId) => setComments((prev) => prev.filter((comment) => comment.id !== commentId))
  const toggleAdStatus = (adId) => setAds((prev) => prev.map((ad) => (ad.id === adId ? { ...ad, status: ad.status === "active" ? "paused" : "active" } : ad)))

  const createStaff = async (event) => {
    event.preventDefault()
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.password) {
      alert("Vui lòng cung cấp đầy đủ thông tin")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/auth/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newStaff.name,
          email: newStaff.email,
          phone: newStaff.phone,
          password: newStaff.password,
          role: newStaff.role
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Reload danh sách nhân viên từ API
        await fetchStaffUsers()
        // Reset form
        setNewStaff({ name: "", email: "", phone: "", password: "", role: "support" })
        alert("✅ Tạo tài khoản nhân viên thành công")
        console.log("✅ Nhân viên mới:", data.data)
      } else {
        alert("❌ " + (data.message || "Lỗi khi tạo tài khoản"))
        console.error("Error:", data.message)
      }
    } catch (error) {
      alert("❌ Lỗi kết nối: " + error.message)
      console.error("Error createStaff:", error)
    }
  }

  // ===== RENDER MODULES =====
  const renderModule = () => {
    if (activeModule === "dashboard") return <AdminDashboard revenueSummary={revenueSummary} />
    if (activeModule === "products") return (
      <AdminProducts 
        products={products}
        filteredProducts={filteredProducts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        productForm={productForm}
        setProductForm={setProductForm}
        editingProductId={editingProductId}
        setEditingProductId={setEditingProductId}
        handleProductSubmit={handleProductSubmit}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
      />
    )
    if (activeModule === "inventory") return (
      <AdminInventory 
        products={products}
        stockForm={stockForm}
        setStockForm={setStockForm}
        handleStockImport={handleStockImport}
        lowStockItems={lowStockItems}
      />
    )
    if (activeModule === "orders") return (
      <AdminOrders 
        orders={orders}
        updateOrderStatus={updateOrderStatus}
        setSelectedOrder={setSelectedOrder}
      />
    )
    if (activeModule === "customers") return (
      <AdminCustomers 
        customers={customers}
        handleCustomerSegment={handleCustomerSegment}
        toggleCustomerLock={toggleCustomerLock}
      />
    )
    if (activeModule === "content") return (
      <AdminContent 
        comments={comments}
        updateCommentStatus={updateCommentStatus}
        removeComment={removeComment}
        ads={ads}
        toggleAdStatus={toggleAdStatus}
      />
    )
    if (activeModule === "documentation") return <AdminNews />
    if (activeModule === "recommendation") return (
      <AdminRecommendation 
        recommendationStats={recommendationStats}
        recommendationStrategy={recommendationStrategy}
        setRecommendationStrategy={setRecommendationStrategy}
      />
    )
    if (activeModule === "assistant") return (
      <AdminAssistant 
        aiLogs={aiLogs}
        aiStats={aiStats}
        aiTrainingNote={aiTrainingNote}
        setAiTrainingNote={setAiTrainingNote}
      />
    )
    if (activeModule === "staff") return (
      <AdminStaff 
        staffUsers={staffUsers}
        newStaff={newStaff}
        setNewStaff={setNewStaff}
        createStaff={createStaff}
      />
    )
    return null
  }

  const activeLabel = moduleItems.find((item) => item.id === activeModule)?.label

  if (loading) {
    return (
      <div className="adm-empty">
        <div className="adm-empty-card">
          <FiLayers className="adm-empty-icon" />
          <h2>Đang tải phiên đăng nhập...</h2>
          <p>Vui lòng chờ trong giây lát.</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="adm-empty">
        <div className="adm-empty-card">
          <FiLayers className="adm-empty-icon" />
          <h2>Yêu cầu đăng nhập</h2>
          <p>Vui lòng đăng nhập để truy cập trang quản trị.</p>
          <button className="adm-btn adm-btn-primary" onClick={() => navigate("/")}>Về trang chủ</button>
        </div>
      </div>
    )
  }

  if (!isAdmin()) {
    return (
      <div className="adm-empty">
        <div className="adm-empty-card">
          <FiLayers className="adm-empty-icon" />
          <h2>Không có quyền truy cập</h2>
          <p>
            Bạn không có quyền truy cập vào trang quản trị.<br />
            Chỉ tài khoản Admin, Nhân viên kho hoặc Nhân viên bán hàng mới có thể truy cập.
          </p>
          <button className="adm-btn adm-btn-primary" onClick={() => navigate("/")}>Về trang chủ</button>
        </div>
      </div>
    )
  }

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <FiLayers />
          <div>
            <strong>Admin Portal</strong>
            <span>Laptop Shop</span>
          </div>
        </div>

        <nav className="adm-nav">
          {moduleItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`adm-nav-item ${activeModule === item.id ? "active" : ""}`}
                onClick={() => setActiveModule(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="adm-main">
        <header className="adm-topbar">
          <div>
            <h1>{activeLabel}</h1>
            <p>Quản trị vận hành, theo dõi hiệu suất và phát triển hệ thống.</p>
          </div>
          <div className="adm-userbox">
            <div className="adm-user-meta">
              <div className="adm-user-name">{user?.name}</div>
              <div className="adm-user-role">
                {user?.role === "admin" ? "Admin" : user?.role === "warehouse" ? "Kho" : "Bán hàng"}
              </div>
            </div>
          </div>
        </header>

        {renderModule()}
        {renderOrderDetailModal()}
      </main>
    </div>
  )
}