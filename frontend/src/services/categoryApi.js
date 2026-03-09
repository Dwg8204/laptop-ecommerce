import { buildApiUrl } from '../config/api'

const API_BASE = buildApiUrl('/api/product-categories')

/**
 * Get all product categories
 */
export const getAllCategories = async () => {
  try {
    const response = await fetch(API_BASE)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

/**
 * Get a single category by ID
 */
export const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error)
    throw error
  }
}
