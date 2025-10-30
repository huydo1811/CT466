import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 10000
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api