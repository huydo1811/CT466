import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 300000,
})
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api