import { buildApiUrl } from '../config/api'

const API_BASE = buildApiUrl('/api/products')

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token')
}

/**
 * Get all products with pagination
 * @param {Object} params - Query parameters (page, limit, sortBy, order, search, etc.)
 */
export const getAllProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value)
      }
    })

    const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

/**
 * Get a single product by ID
 * @param {number} id - Product ID
 */
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

/**
 * Create a new product
 * @param {Object} productData - Product data (will be converted to FormData)
 */
export const createProduct = async (productData) => {
  try {
    const formData = new FormData()

    // Add basic product fields
    formData.append('product_name', productData.product_name || productData.name)
    formData.append('brand_id', productData.brand_id || 1) // Default brand
    formData.append('category_id', productData.category_id || 1) // Default category (laptops)
    formData.append('description_html', productData.description_html || '<p>Laptop chất lượng cao</p>')
    formData.append('highlight_features', productData.highlight_features || 'Hiệu năng mạnh mẽ')
    
    if (productData.screen_size !== undefined) {
      formData.append('screen_size', productData.screen_size)
    }
    if (productData.weight_kg !== undefined) {
      formData.append('weight_kg', productData.weight_kg)
    }
    if (productData.os) {
      formData.append('os', productData.os)
    }

    // Add variants as JSON string
    if (productData.variants && Array.isArray(productData.variants)) {
      const variantsJSON = JSON.stringify(productData.variants)
      formData.append('variants', variantsJSON)
      console.log('📦 Variants JSON:', variantsJSON)
    }

    // Add product main images
    if (productData.productImages) {
      if (productData.productImages instanceof FileList) {
        Array.from(productData.productImages).forEach(file => {
          formData.append('productImages', file)
        })
      } else if (productData.productImages instanceof File) {
        formData.append('productImages', productData.productImages)
      }
    }

    // Add variant images
    if (productData.variantImages && Array.isArray(productData.variantImages)) {
      productData.variantImages.forEach((variantImgs, index) => {
        if (variantImgs instanceof FileList) {
          Array.from(variantImgs).forEach(file => {
            formData.append(`variant_${index}_images`, file)
          })
        } else if (variantImgs instanceof File) {
          formData.append(`variant_${index}_images`, variantImgs)
        }
      })
    }

    const token = getAuthToken()
    const headers = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers,
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        data
      })
      throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    console.log('✅ Product created:', data)
    return data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} productData - Updated product data
 */
export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData()

    // Add updated fields
    if (productData.product_name !== undefined) {
      formData.append('product_name', productData.product_name)
    }
    if (productData.brand_id !== undefined) {
      formData.append('brand_id', productData.brand_id)
    }
    if (productData.category_id !== undefined) {
      formData.append('category_id', productData.category_id)
    }
    if (productData.description_html !== undefined) {
      formData.append('description_html', productData.description_html)
    }
    if (productData.highlight_features !== undefined) {
      formData.append('highlight_features', productData.highlight_features)
    }
    if (productData.screen_size !== undefined) {
      formData.append('screen_size', productData.screen_size)
    }
    if (productData.weight_kg !== undefined) {
      formData.append('weight_kg', productData.weight_kg)
    }
    if (productData.os !== undefined) {
      formData.append('os', productData.os)
    }
    if (productData.is_active !== undefined) {
      formData.append('is_active', productData.is_active ? 1 : 0)
    }

    // Add variants if provided
    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants))
    }

    // Add new images if provided
    if (productData.productImages) {
      if (productData.productImages instanceof FileList) {
        Array.from(productData.productImages).forEach(file => {
          formData.append('productImages', file)
        })
      } else if (productData.productImages instanceof File) {
        formData.append('productImages', productData.productImages)
      }
    }

    if (productData.variantImages && Array.isArray(productData.variantImages)) {
      productData.variantImages.forEach((variantImgs, index) => {
        if (variantImgs instanceof FileList) {
          Array.from(variantImgs).forEach(file => {
            formData.append(`variant_${index}_images`, file)
          })
        } else if (variantImgs instanceof File) {
          formData.append(`variant_${index}_images`, variantImgs)
        }
      })
    }

    const token = getAuthToken()
    const headers = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers,
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

/**
 * Delete a product
 * @param {number} id - Product ID
 */
export const deleteProduct = async (id) => {
  try {
    const token = getAuthToken()
    const headers = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}
