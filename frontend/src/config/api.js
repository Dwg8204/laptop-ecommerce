const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`
export const BLOG_API_BASE = `${API_BASE_URL}/api/blog`
