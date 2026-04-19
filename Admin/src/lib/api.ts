import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getAuthToken = async () => {
  try {
    // First, check localStorage for manually stored token
    const storedToken = localStorage.getItem('admin_auth_token')
    if (storedToken) {
      console.log('[API] Token retrieved from localStorage')
      return storedToken
    }

    // Then try to get token from Supabase session
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      console.log('[API] Token retrieved from Supabase session')
      // Store it for future use
      localStorage.setItem('admin_auth_token', session.access_token)
      return session.access_token
    }
  } catch (e) {
    console.error('[API] Error getting auth token:', e)
  }

  console.warn('[API] No authentication token found')
  return null
}

const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  console.log(`[API Request] ${options.method || 'GET'} ${API_URL}${endpoint}`);
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      console.error(`[API Error] ${response.status}:`, error)
      throw new Error(error.error || `Request failed with status ${response.status}`)
    }

    return response.json()
  } catch (err) {
    console.error('[API Catch Error]:', err)
    throw err
  }
}

export const api = {
  produits: {
    getAll: async () => {
      return apiRequest('/api/admin/products')
    },
    getById: async (id: string) => {
      return apiRequest(`/api/admin/products/${id}`)
    },
    create: async (product: Record<string, unknown>) => {
      return apiRequest('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(product),
      })
    },
    update: async (id: string, updates: Record<string, unknown>) => {
      return apiRequest(`/api/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
    },
    delete: async (id: string) => {
      return apiRequest(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })
    },
  },

  clients: {
    getAll: async () => {
      return apiRequest('/api/admin/users')
    },
    getById: async (id: string) => {
      return apiRequest(`/api/admin/users/${id}`)
    },
    create: async (clientData: Record<string, unknown>) => {
      return apiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(clientData),
      })
    },
    update: async (id: string, updates: Record<string, unknown>) => {
      return apiRequest(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
    },
    delete: async (id: string) => {
      return apiRequest(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })
    },
  },

  orders: {
    getAll: async () => {
      return apiRequest('/api/admin/orders')
    },
    updateStatus: async (id: string, status: string) => {
      return apiRequest(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
    },
    delete: async (id: string) => {
      return apiRequest(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      })
    },
    updateDeliveryDate: async (id: string, delivery_date: string) => {
      return apiRequest(`/api/admin/orders/${id}/delivery-date`, {
        method: 'PUT',
        body: JSON.stringify({ delivery_date }),
      })
    },
  },

  images: {
    upload: async (file: File, productId?: string) => {
      const formData = new FormData()
      formData.append('file', file)
      if (productId) formData.append('productId', productId)

      const response = await fetch(`${API_URL}/api/admin/upload/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(error.error || 'Upload failed')
      }

      return response.json()
    },
  },
}
