import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 30000,
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  
  console.log('API Request:', cfg.baseURL + cfg.url)
  
  return cfg
})

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