import { createContext, useContext, useState, useEffect } from 'react'
import * as productApi from '../services/productApi'
import { getImageUrl } from '../config/api'

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productApi.getAllProducts({ limit: 100 })

        // API list response uses pagination shape: { data: [...], pagination: {...} }
        // and may not include a `success` flag.
        const productList = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []

        // Transform backend list/detail data to frontend format.
        const transformedProducts = productList.map((product) => {
          const variant = product.variants?.[0]
          const price = variant?.price ?? product.min_price ?? 0
          const oldPrice = variant?.compare_at_price ?? product.max_price ?? price
          const stock = variant?.stock_quantity ?? product.total_stock_quantity ?? 0
          const ram = variant?.ram ?? (product.representative_ram_gb ? `${product.representative_ram_gb}GB` : '')
          const storage = variant?.storage ?? (product.representative_storage_gb ? `${product.representative_storage_gb}GB` : '')
          const cpu = variant?.cpu ?? product.representative_cpu_name ?? ''
          const graphics = variant?.graphics_card ?? product.representative_gpu ?? ''
          const version = variant?.color_name || ''

          return {
            id: String(product.product_id),
            name: product.product_name,
            brand_id: product.brand_id ? String(product.brand_id) : '',
            category_id: product.category_id ? String(product.category_id) : '',
            brand: product.brand_name || 'Unknown',
            series: product.category_name || '',
            price: Number(price) || 0,
            oldPrice: Number(oldPrice) || Number(price) || 0,
            storage,
            ram,
            ramType: variant?.ram_type || '',
            version,
            cpu,
            screenSize: product.screen_size ? `${product.screen_size} inch` : '',
            weightKg: product.weight_kg || '',
            os: product.os || '',
            graphics,
            stock: Number(stock) || 0,
            inStock: Number(stock) > 0,
            image: getImageUrl(product.primary_product_image_url || product.images?.[0]?.image_url || variant?.images?.[0]?.image_url),
            specs: cpu && graphics ? `${cpu} | ${graphics}` : 'Đang cập nhật',
            config: ram && storage && product.screen_size
              ? `${ram}${variant?.ram_type ? ` ${variant.ram_type}` : ''} | ${storage} | ${product.screen_size} inch`
              : 'Đang cập nhật',
            discount: Number(oldPrice) > Number(price) && Number(price) > 0
              ? `Giảm ${Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100)}%`
              : '',
            installment: 'Trả góp 0%',
            sold: 0,
            newArrival: false,
            hasAI: false,
            features: product.highlight_features ? [product.highlight_features] : [],
          }
        })

        setProducts(transformedProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.message)
        // Keep products empty on error instead of using defaults
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addProduct = async (productData) => {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      if (!productData.name?.trim()) {
        throw new Error('Tên sản phẩm không được để trống')
      }
      if (!productData.brand_id || productData.brand_id === '') {
        throw new Error('Vui lòng chọn thương hiệu')
      }
      if (!productData.category_id || productData.category_id === '') {
        throw new Error('Vui lòng chọn danh mục')
      }
      if (!productData.productImages || productData.productImages.length === 0) {
        throw new Error('Vui lòng upload hình ảnh sản phẩm')
      }
      let variants = []

      if (Array.isArray(productData.productVariants) && productData.productVariants.length > 0) {
        variants = productData.productVariants.map((v, index) => {
          const ramValue = parseInt(v.ram)
          const storageValue = parseInt(v.storage)
          const originalPrice = parseFloat(v.originalPrice)
          const discountPrice = v.discountPrice ? parseFloat(v.discountPrice) : null
          const stockQuantity = parseInt(v.stock) || 0
          const normalizedSku = String(v.sku || '').trim()

          if (!normalizedSku || !v.color || !v.cpu || !v.gpu || isNaN(ramValue) || isNaN(storageValue) || isNaN(originalPrice)) {
            throw new Error(`Phiên bản #${index + 1} chưa hợp lệ. Vui lòng kiểm tra lại thông tin.`)
          }
          if (!Array.isArray(v.imageFiles) || v.imageFiles.length === 0) {
            throw new Error(`Phiên bản #${index + 1} cần tối thiểu 1 ảnh.`)
          }

          return {
            sku: normalizedSku,
            ram_gb: ramValue,
            ram_type: v.ramType || 'DDR4',
            storage_gb: storageValue,
            cpu_name: v.cpu,
            gpu: v.gpu,
            color_name: v.color.trim(),
            original_price: originalPrice,
            discount_price: discountPrice,
            stock_quantity: stockQuantity,
            status: stockQuantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
          }
        })
      } else {
        if (!productData.ram) {
          throw new Error('Vui lòng chọn RAM')
        }
        if (!productData.storage) {
          throw new Error('Vui lòng chọn dung lượng ổ cứng')
        }
        if (!productData.price || parseFloat(productData.price) <= 0) {
          throw new Error('Vui lòng nhập giá sản phẩm hợp lệ')
        }

        const ramValue = parseInt(productData.ram)
        const storageValue = parseInt(productData.storage)

        if (isNaN(ramValue) || ramValue <= 0) {
          throw new Error('RAM không hợp lệ')
        }
        if (isNaN(storageValue) || storageValue <= 0) {
          throw new Error('Dung lượng ổ cứng không hợp lệ')
        }

        const variant = {
          sku: `${productData.brand || 'LAPTOP'}-${Date.now()}`,
          ram_gb: ramValue,
          ram_type: productData.ramType || 'DDR4',
          storage_gb: storageValue,
          cpu_name: productData.cpu || 'Intel Core i5',
          gpu: productData.graphics || 'Integrated',
          color_name: productData.version?.trim() || 'Default',
          original_price: parseFloat(productData.oldPrice || productData.price),
          stock_quantity: parseInt(productData.stock) || 0,
          status: parseInt(productData.stock) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
        }

        if (productData.oldPrice && parseFloat(productData.oldPrice) > parseFloat(productData.price)) {
          variant.discount_price = parseFloat(productData.price)
        }

        variants = [variant]
      }
      
      const apiData = {
        product_name: productData.name,
        brand_id: parseInt(productData.brand_id),
        category_id: parseInt(productData.category_id),
        description_html: productData.description || '<p>Laptop chất lượng cao</p>',
        highlight_features: productData.features?.join(', ') || 'Hiệu năng mạnh mẽ',
        screen_size: parseFloat(productData.screenSize) || undefined,
        weight_kg: parseFloat(productData.weightKg) || undefined,
        os: productData.os || 'Windows 11',
        variants,
        productImages: productData.productImages,
        variantImages: productData.productVariants?.map((variant) => variant.imageFiles || []) || []
      }

      console.log('🔍 Sending product data to API:', {
        ...apiData,
        productImages: apiData.productImages?.length ? `${apiData.productImages.length} files` : 'No file',
        variantImages: apiData.variantImages.length > 0 ? `${apiData.variantImages.length} files` : 'No files'
      })

      const response = await productApi.createProduct(apiData)

      if (response.success && response.data) {
        // Transform and add to local state
        const newProduct = {
          id: response.data.product_id.toString(),
          name: response.data.product_name,
          brand_id: String(productData.brand_id || ''),
          category_id: String(productData.category_id || ''),
          brand: productData.brand,
          series: productData.series || '',
          price: parseFloat(productData.price),
          oldPrice: parseFloat(productData.oldPrice || productData.price),
          storage: productData.storage,
          ram: productData.ram,
          ramType: productData.ramType,
          version: productData.version || '',
          cpu: productData.cpu,
          screenSize: productData.screenSize,
          weightKg: productData.weightKg,
          os: productData.os,
          graphics: productData.graphics,
          stock: parseInt(productData.stock) || 0,
          inStock: parseInt(productData.stock) > 0,
          image: getImageUrl(productData.image),
          specs: productData.specs || `${productData.cpu} | ${productData.graphics}`,
          config: productData.config || `${productData.ram} | ${productData.storage} | ${productData.screenSize}`,
          discount: productData.discount,
          installment: productData.installment || 'Trả góp 0%',
          sold: 0,
          newArrival: productData.newArrival || false,
          hasAI: productData.hasAI || false,
          features: productData.features || [],
        }

        setProducts(prev => [newProduct, ...prev])
        return newProduct
      }
    } catch (err) {
      console.error('Error adding product:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id, updates) => {
    try {
      setLoading(true)
      setError(null)

      // Transform frontend data to backend format
      const apiData = {
        product_name: updates.name,
        brand_id: updates.brand_id || 1,
        category_id: updates.category_id || 1,
        description_html: updates.description,
        highlight_features: updates.features?.join(', '),
        screen_size: parseFloat(updates.screenSize) || undefined,
        weight_kg: parseFloat(updates.weightKg) || undefined,
        os: updates.os,
      }

      // Add variants if product data includes variant info
      if (updates.ram || updates.storage || updates.price) {
        apiData.variants = [{
          ram: updates.ram,
          ram_type: updates.ramType || 'DDR4',
          storage: updates.storage,
          cpu: updates.cpu,
          graphics_card: updates.graphics,
          price: parseFloat(updates.price),
          compare_at_price: parseFloat(updates.oldPrice || updates.price),
          stock_quantity: parseInt(updates.stock) || 0,
          status: parseInt(updates.stock) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
        }]
      }

      // Add images if provided
      if (updates.productImages) {
        apiData.productImages = updates.productImages
      }
      if (updates.variantImages) {
        apiData.variantImages = updates.variantImages
      }

      const response = await productApi.updateProduct(id, apiData)

      if (response.success) {
        // Update local state
        const updatedProducts = products.map(p => 
          p.id === id ? { ...p, ...updates, inStock: updates.stock > 0 } : p
        )
        setProducts(updatedProducts)
      }
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await productApi.deleteProduct(id)

      if (response.success) {
        const updatedProducts = products.filter(p => p.id !== id)
        setProducts(updatedProducts)
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addVariantToProduct = async (productId, variantInput, variantImages = []) => {
    try {
      setLoading(true)
      setError(null)

      const ramValue = parseInt(variantInput.ram)
      const storageValue = parseInt(variantInput.storage)
      const originalPrice = parseFloat(variantInput.originalPrice)
      const discountPrice = variantInput.discountPrice ? parseFloat(variantInput.discountPrice) : null
      const stockQuantity = parseInt(variantInput.stock) || 0
      const normalizedSku = String(variantInput.sku || '').trim()

      if (!normalizedSku || !variantInput.color || !variantInput.cpu || !variantInput.gpu || isNaN(ramValue) || isNaN(storageValue) || isNaN(originalPrice)) {
        throw new Error('Thông tin phiên bản chưa đầy đủ hoặc không hợp lệ')
      }
      if (ramValue <= 0 || storageValue <= 0 || originalPrice <= 0) {
        throw new Error('RAM, ổ cứng và giá gốc phải lớn hơn 0')
      }
      if (discountPrice !== null && discountPrice >= originalPrice) {
        throw new Error('Giá khuyến mãi phải nhỏ hơn giá gốc')
      }
      if (!Array.isArray(variantImages) || variantImages.length === 0) {
        throw new Error('Phiên bản cần tối thiểu 1 ảnh')
      }

      const variantData = {
        sku: normalizedSku,
        cpu_name: variantInput.cpu,
        gpu: variantInput.gpu,
        ram_gb: ramValue,
        ram_type: variantInput.ramType || 'DDR4',
        storage_gb: storageValue,
        color_name: variantInput.color,
        original_price: originalPrice,
        discount_price: discountPrice,
        stock_quantity: stockQuantity,
        status: stockQuantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
      }

      const response = await productApi.addVariantToProduct(productId, variantData, variantImages)

      if (response?.success) {
        // Refresh minimal product state in list with newest stock aggregate when needed.
        setProducts((prev) => prev.map((p) => {
          if (String(p.id) !== String(productId)) return p

          const updatedPrice = discountPrice || originalPrice
          return {
            ...p,
            price: p.price > 0 ? Math.min(p.price, updatedPrice) : updatedPrice,
            oldPrice: p.oldPrice > 0 ? Math.max(p.oldPrice, originalPrice) : originalPrice,
            stock: Number(p.stock || 0) + stockQuantity,
            inStock: true,
          }
        }))
      }

      return response
    } catch (err) {
      console.error('Error adding variant to product:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateVariantInProduct = async (productId, variantInput, variantImages = []) => {
    try {
      setLoading(true)
      setError(null)

      const variantId = parseInt(variantInput.variant_id)
      const ramValue = parseInt(variantInput.ram)
      const storageValue = parseInt(variantInput.storage)
      const originalPrice = parseFloat(variantInput.originalPrice)
      const discountPrice = variantInput.discountPrice ? parseFloat(variantInput.discountPrice) : null
      const stockQuantity = parseInt(variantInput.stock) || 0
      const normalizedSku = String(variantInput.sku || '').trim()

      if (!variantId || !normalizedSku || !variantInput.color || !variantInput.cpu || !variantInput.gpu || isNaN(ramValue) || isNaN(storageValue) || isNaN(originalPrice)) {
        throw new Error('Thông tin phiên bản chưa đầy đủ hoặc không hợp lệ')
      }
      if (ramValue <= 0 || storageValue <= 0 || originalPrice <= 0) {
        throw new Error('RAM, ổ cứng và giá gốc phải lớn hơn 0')
      }
      if (discountPrice !== null && discountPrice >= originalPrice) {
        throw new Error('Giá khuyến mãi phải nhỏ hơn giá gốc')
      }

      const variantData = {
        sku: normalizedSku,
        cpu_name: variantInput.cpu,
        gpu: variantInput.gpu,
        ram_gb: ramValue,
        ram_type: variantInput.ramType || 'DDR4',
        storage_gb: storageValue,
        color_name: variantInput.color,
        original_price: originalPrice,
        discount_price: discountPrice,
        stock_quantity: stockQuantity,
        status: stockQuantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
      }

      return await productApi.updateProductVariant(productId, variantId, variantData, variantImages)
    } catch (err) {
      console.error('Error updating product variant:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeVariantFromProduct = async (productId, variantId) => {
    try {
      setLoading(true)
      setError(null)
      return await productApi.deleteVariantFromProduct(productId, variantId)
    } catch (err) {
      console.error('Error deleting product variant:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getProductById = (id) => {
    return products.find(p => p.id === id)
  }

  const value = {
    products,
    loading,
    error,
    addProduct,
    addVariantToProduct,
    updateVariantInProduct,
    removeVariantFromProduct,
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
