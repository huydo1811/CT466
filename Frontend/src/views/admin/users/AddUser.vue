<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white">Thêm người dùng</h2>
      <button @click="back" class="text-slate-300">Quay lại</button>
    </div>

    <div class="bg-slate-800 p-4 rounded">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input v-model="form.username" placeholder="Username" class="px-3 py-2 bg-slate-900 rounded" />
        <input v-model="form.email" placeholder="Email" class="px-3 py-2 bg-slate-900 rounded" />
        <input v-model="form.fullName" placeholder="Họ tên" class="px-3 py-2 bg-slate-900 rounded" />
        <select v-model="form.role" class="px-3 py-2 bg-slate-900 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input v-model="form.password" type="password" placeholder="Mật khẩu" class="px-3 py-2 bg-slate-900 rounded" />
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button @click="back" class="px-3 py-2 bg-slate-700 rounded">Hủy</button>
        <button @click="save" :disabled="loading" class="px-3 py-2 bg-emerald-600 rounded text-white">
          {{ loading ? 'Đang tạo...' : 'Tạo' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'

const router = useRouter()
const loading = ref(false)
const form = ref({ username:'', email:'', fullName:'', role:'user', password:'' })

const back = () => router.back()

const save = async () => {
  if (!form.value.username || !form.value.fullName) {
    return alert('Nhập username và họ tên')
  }
  loading.value = true
  try {
    // backend expects passwordHash (existing admin form used this field)
    const payload = {
      username: form.value.username,
      email: form.value.email,
      fullName: form.value.fullName,
      role: form.value.role,
      passwordHash: form.value.password || undefined
    }
    // ensure auth header if token exists
    const token = localStorage.getItem('token')
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const res = await api.post('/users', payload)
    if (res?.data?.success) {
      alert('Tạo user thành công')
      router.push({ name: 'admin.users' })
    } else {
      const msg = res?.data?.message || 'Tạo user thất bại'
      alert(msg)
    }
  } catch (err) {
    console.error('Add user error', err)
    const msg = err?.response?.data?.message || err.message || 'Lỗi server'
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>