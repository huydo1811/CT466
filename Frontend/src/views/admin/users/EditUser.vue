<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white">Sửa người dùng</h2>
      <button @click="$router.back()" class="text-slate-300">Quay lại</button>
    </div>

    <div class="bg-slate-800 p-4 rounded space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input v-model="form.username" readonly placeholder="Username" class="px-3 py-2 bg-slate-900 rounded"/>
        <input v-model="form.email" placeholder="Email" class="px-3 py-2 bg-slate-900 rounded" />
        <input v-model="form.fullName" placeholder="Họ tên" class="px-3 py-2 bg-slate-900 rounded" />
        <select v-model="form.role" class="px-3 py-2 bg-slate-900 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="p-3 bg-slate-900 rounded">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div class="text-sm text-slate-300">Reset mật khẩu</div>
            <div class="text-xs text-slate-400">Nhấn Reset để đặt mật khẩu về <strong>123456</strong></div>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <input
              v-model="newPassword"
              type="password"
              placeholder="Mật khẩu mới (nếu muốn tự nhập)"
              class="px-3 py-2 bg-slate-800 rounded w-full sm:w-auto"
            />
            <button
              @click="resetPassword"
              :disabled="pwLoading"
              class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white w-full sm:w-auto"
            >
              {{ pwLoading ? 'Đang xử lý...' : 'Reset' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="metaLastLogin" class="text-sm text-slate-400">Đăng nhập lần cuối: {{ metaLastLogin }}</div>

      <div class="flex justify-end gap-2">
        <button @click="$router.back()" class="px-3 py-2 bg-slate-700 rounded">Hủy</button>
        <button @click="save" :disabled="loading" class="px-3 py-2 bg-emerald-600 rounded text-white">
          {{ loading ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api.js'

const route = useRoute()
const router = useRouter()

const form = ref({ id: null, username:'', email:'', fullName:'', role:'user', status:'active', lastLogin: null })
const newPassword = ref('')
const loading = ref(false)
const pwLoading = ref(false)

const token = localStorage.getItem('token') || ''
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`

// formatted last login
const metaLastLogin = computed(() => {
  if (!form.value.lastLogin) return ''
  try {
    const d = new Date(form.value.lastLogin)
    if (isNaN(d)) return form.value.lastLogin
    return d.toLocaleString('vi-VN')
  } catch {
    return form.value.lastLogin
  }
})

const loadUser = async () => {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const res = await api.get(`/users/${id}`)
    // support backend returning either res.data.data or res.data.user
    const user = res?.data?.data || res?.data?.user || res?.data
    if (user) {
      form.value = {
        id: user._id || user.id || id,
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        role: user.role || 'user',
        status: user.status || 'active',
        lastLogin: user.lastLogin || user.updatedAt || null
      }
    } else {
      alert('Không tìm thấy user')
      router.back()
    }
  } catch (err) {
    console.error('loadUser error', err)
    alert('Tải người dùng thất bại')
    router.back()
  } finally {
    loading.value = false
  }
}

onMounted(loadUser)

const save = async () => {
  if (!form.value.id) return alert('ID user không hợp lệ')
  loading.value = true
  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      fullName: form.value.fullName,
      role: form.value.role,
      status: form.value.status
    }
    await api.put(`/users/${form.value.id}`, payload)
    alert('Cập nhật user thành công')
    router.back()
  } catch (err) {
    console.error('save user error', err)
    const msg = err?.response?.data?.message || 'Lưu thất bại'
    alert(msg)
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (!form.value.id) return alert('ID user không hợp lệ')
  // If user entered a password, use it; otherwise confirm reset to 123456
  let passwordToSet = newPassword.value && newPassword.value.trim() ? newPassword.value.trim() : '123456'
  if (!newPassword.value) {
    if (!confirm(`Đặt lại mật khẩu của "${form.value.username}" về "${passwordToSet}"?`)) return
  }
  pwLoading.value = true
  try {
    // backend in this project accepts passwordHash on update
    await api.put(`/users/${form.value.id}`, { passwordHash: passwordToSet })
    alert('Mật khẩu đã được đặt lại')
    newPassword.value = ''
  } catch (err) {
    console.error('resetPassword error', err)
    const msg = err?.response?.data?.message || 'Reset mật khẩu thất bại'
    alert(msg)
  } finally {
    pwLoading.value = false
  }
}
</script>

<style scoped>
</style>