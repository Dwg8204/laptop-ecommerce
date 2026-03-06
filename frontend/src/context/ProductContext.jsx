import { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext()

// Dữ liệu sản phẩm mặc định
const defaultProducts = [
  {
    id: "1",
    name: "Laptop ASUS TUF Gaming F16 FX607VJ-RL034W",
    specs: "CORE i5-210H | RTX 3050",
    config: "16GB | 512GB | 16 inch WUXGA",
    price: 22490000,
    oldPrice: 24490000,
    discount: "Giảm 8%",
    installment: "Trả góp 0%",
    sold: 25,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: false,
    storage: "512GB",
    ram: "16GB",
    cpu: "Intel Core i5",
    screenSize: "16 inch",
    resolution: "Full HD (1920x1080)",
    graphics: "NVIDIA RTX 3050",
    features: ["Bàn phím có đèn", "Pin trâu"],
    hasAI: false,
    brand: "ASUS",
    series: "Gaming"
  },
  {
    id: "2",
    name: "Laptop Dell XPS 13 Plus 9320",
    specs: "CORE i7-1260P | Intel Iris Xe",
    config: "16GB | 1TB | 13.4 inch OLED",
    price: 35990000,
    oldPrice: 39990000,
    discount: "Giảm 10%",
    installment: "Trả góp 0%",
    sold: 18,
    stock: 30,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: true,
    storage: "1TB",
    ram: "16GB",
    cpu: "Intel Core i7",
    screenSize: "13 inch",
    resolution: "4K (3840x2160)",
    graphics: "Intel Iris Xe",
    features: ["Màn hình cảm ứng", "Mỏng nhẹ"],
    hasAI: true,
    brand: "Dell",
    series: "Cao cấp"
  },
  {
    id: "3",
    name: "Laptop HP Pavilion 15-eg2087TX",
    specs: "CORE i5-1235U | MX550",
    config: "8GB | 512GB | 15.6 inch FHD",
    price: 17990000,
    oldPrice: 19990000,
    discount: "Giảm 10%",
    installment: "Trả góp 0%",
    sold: 42,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: false,
    newArrival: false,
    storage: "512GB",
    ram: "8GB",
    cpu: "Intel Core i5",
    screenSize: "15.6 inch",
    resolution: "Full HD (1920x1080)",
    graphics: "NVIDIA GTX 1650",
    features: ["Bàn phím có đèn"],
    hasAI: false,
    brand: "HP",
    series: "Văn phòng"
  },
  {
    id: "4",
    name: "Laptop Lenovo ThinkPad X1 Carbon Gen 11",
    specs: "CORE i7-1355U | Intel Iris Xe",
    config: "32GB | 1TB | 14 inch WUXGA",
    price: 42990000,
    oldPrice: 47990000,
    discount: "Giảm 10%",
    installment: "Trả góp 0%",
    sold: 12,
    stock: 25,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: true,
    storage: "1TB",
    ram: "32GB",
    cpu: "Intel Core i7",
    screenSize: "14 inch",
    resolution: "2K (2560x1440)",
    graphics: "Intel Iris Xe",
    features: ["Mỏng nhẹ", "Pin trâu", "Chống nước"],
    hasAI: true,
    brand: "Lenovo",
    series: "Cao cấp"
  },
  {
    id: "5",
    name: "Laptop MSI Gaming GF63 Thin 11UC",
    specs: "CORE i5-11400H | RTX 3050",
    config: "8GB | 512GB | 15.6 inch FHD",
    price: 19490000,
    oldPrice: 21490000,
    discount: "Giảm 9%",
    installment: "Trả góp 0%",
    sold: 31,
    stock: 40,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: false,
    storage: "512GB",
    ram: "8GB",
    cpu: "Intel Core i5",
    screenSize: "15.6 inch",
    resolution: "Full HD (1920x1080)",
    graphics: "NVIDIA RTX 3050",
    features: ["Bàn phím có đèn"],
    hasAI: false,
    brand: "MSI",
    series: "Gaming"
  },
  {
    id: "6",
    name: "Laptop Acer Aspire 5 A515-58GM",
    specs: "CORE i5-1335U | RTX 2050",
    config: "16GB | 512GB | 15.6 inch FHD",
    price: 18990000,
    oldPrice: 20990000,
    discount: "Giảm 10%",
    installment: "Trả góp 0%",
    sold: 28,
    stock: 45,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: false,
    storage: "512GB",
    ram: "16GB",
    cpu: "Intel Core i5",
    screenSize: "15.6 inch",
    resolution: "Full HD (1920x1080)",
    graphics: "NVIDIA RTX 3050",
    features: [],
    hasAI: false,
    brand: "Acer",
    series: "Sinh viên"
  },
  {
    id: "7",
    name: "Laptop ASUS Vivobook Pro 16X OLED",
    specs: "CORE i9-12900H | RTX 4060",
    config: "32GB | 1TB | 16 inch 4K OLED",
    price: 49990000,
    oldPrice: 54990000,
    discount: "Giảm 9%",
    installment: "Trả góp 0%",
    sold: 8,
    stock: 20,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: true,
    storage: "1TB",
    ram: "32GB",
    cpu: "Intel Core i9",
    screenSize: "16 inch",
    resolution: "4K (3840x2160)",
    graphics: "NVIDIA RTX 4060",
    features: ["Bàn phím có đèn", "Màn hình cảm ứng"],
    hasAI: true,
    brand: "ASUS",
    series: "Đồ họa"
  },
  {
    id: "8",
    name: "Laptop Dell Inspiron 15 3520",
    specs: "CORE i3-1215U | Intel UHD",
    config: "8GB | 256GB | 15.6 inch FHD",
    price: 12490000,
    oldPrice: 13990000,
    discount: "Giảm 11%",
    installment: "Trả góp 0%",
    sold: 45,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: false,
    storage: "256GB",
    ram: "8GB",
    cpu: "Intel Core i3",
    screenSize: "15.6 inch",
    resolution: "Full HD (1920x1080)",
    graphics: "Intel UHD",
    features: [],
    hasAI: false,
    brand: "Dell",
    series: "Văn phòng"
  },
  {
    id: "9",
    name: "Laptop HP OMEN 16-wf0070TX",
    specs: "CORE i7-13700HX | RTX 4050",
    config: "16GB | 1TB | 16.1 inch FHD",
    price: 38990000,
    oldPrice: 42990000,
    discount: "Giảm 9%",
    installment: "Trả góp 0%",
    sold: 19,
    stock: 35,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: true,
    storage: "1TB",
    ram: "16GB",
    cpu: "Intel Core i7",
    screenSize: "16 inch",
    resolution: "Full HD (1920x1080)",
    graphics: "NVIDIA RTX 4050",
    features: ["Bàn phím có đèn", "Pin trâu"],
    hasAI: true,
    brand: "HP",
    series: "Gaming"
  },
  {
    id: "10",
    name: "Laptop Lenovo IdeaPad Slim 5",
    specs: "AMD Ryzen 7 7730U | Radeon",
    config: "16GB | 512GB | 14 inch WUXGA",
    price: 16990000,
    oldPrice: 18990000,
    discount: "Giảm 11%",
    installment: "Trả góp 0%",
    sold: 36,
    stock: 50,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_117.png",
    inStock: true,
    newArrival: false,
    storage: "512GB",
    ram: "16GB",
    cpu: "AMD Ryzen 7",
    screenSize: "14 inch",
    resolution: "Full HD (1920x1080)",
    graphics: "Intel Iris Xe",
    features: ["Mỏng nhẹ"],
    hasAI: true,
    brand: "Lenovo",
    series: "Sinh viên"
  }
]

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedProducts = localStorage.getItem('laptopProducts')
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts)
        setProducts(parsed)
      } catch (err) {
        console.error('Error loading products:', err)
        setProducts(defaultProducts)
        localStorage.setItem('laptopProducts', JSON.stringify(defaultProducts))
      }
    } else {
      setProducts(defaultProducts)
      localStorage.setItem('laptopProducts', JSON.stringify(defaultProducts))
    }
    setLoading(false)
  }, [])

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      sold: 0,
      inStock: product.stock > 0,
    }
    const updatedProducts = [newProduct, ...products]
    setProducts(updatedProducts)
    localStorage.setItem('laptopProducts', JSON.stringify(updatedProducts))
    return newProduct
  }

  const updateProduct = (id, updates) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ...updates, inStock: updates.stock > 0 } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('laptopProducts', JSON.stringify(updatedProducts))
  }

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(p => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('laptopProducts', JSON.stringify(updatedProducts))
  }

  const getProductById = (id) => {
    return products.find(p => p.id === id)
  }

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}
