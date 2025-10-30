import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  getters: {
    isAuthenticated: state => !!state.token
  },
  actions: {
    async register(payload) {
      const res = await api.post('/auth/register', payload)
      if (res?.data?.token) {
        this.token = res.data.token
        localStorage.setItem('token', this.token)
      }
      this.user = res?.data?.user || res?.data?.data || null
      localStorage.setItem('user', JSON.stringify(this.user))
      return res
    },
    async login(payload) {
      try {
        const res = await api.post('/auth/login', payload)
        if (res?.data?.token) {
          this.token = res.data.token
          localStorage.setItem('token', this.token)
        }
        this.user = res?.data?.user || res?.data?.data || null
        localStorage.setItem('user', JSON.stringify(this.user))
        return res
      } catch (err) {
        console.error('login error response:', err?.response?.data)
        throw err
      }
    },
    async fetchProfile() {
      if (!this.token) return null
      try {
        // endpoint tùy backend: /auth/profile hoặc /users/me
        const res = await api.get('/auth/profile')
        this.user = res?.data?.data || res?.data?.user || res?.data || null
        localStorage.setItem('user', JSON.stringify(this.user))
        return this.user
      } catch (err) {
        console.error('fetchProfile failed', err?.response?.data || err)
        throw err
      }
    },
    logout() {
      try { api.post('/auth/logout').catch(()=>{}) } catch(e){
        console.error('Logout request failed', e)
      }

      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (api.defaults && api.defaults.headers && api.defaults.headers.common) {
        delete api.defaults.headers.common.Authorization
      }
    },
    async googleLogin(payload) {
      try {
        const res = await api.post('/auth/google', payload)
        if (res?.data?.token) {
          this.token = res.data.token
          localStorage.setItem('token', this.token)
        }
        this.user = res?.data?.data || res?.data?.user || null
        localStorage.setItem('user', JSON.stringify(this.user))
        return res
      } catch (err) {
        console.error('googleLogin error', err?.response?.data || err)
        throw err
      }
    }
  }
})