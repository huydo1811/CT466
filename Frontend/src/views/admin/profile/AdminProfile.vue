<template>
  <div class="p-2 space-y-4 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Hồ sơ quản trị</h1>
        <p class="text-slate-400 text-sm mt-1">Cập nhật thông tin cơ bản và đổi mật khẩu.</p>
      </div>
    </div>

    <!-- profile form -->
    <div class="bg-slate-800 p-4 rounded border border-slate-700 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm text-slate-300">Tên đầy đủ</label>
          <input v-model="form.fullName" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" />
        </div>

        <div>
          <label class="text-sm text-slate-300">Email</label>
          <input v-model="form.email" type="email" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" />
        </div>

        <div>
          <label class="text-sm text-slate-300">Tên đăng nhập</label>
          <input v-model="form.username" disabled class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-400 cursor-not-allowed" />
        </div>

        <div>
          <label class="text-sm text-slate-300">Vai trò</label>
          <input v-model="form.role" disabled class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-400 cursor-not-allowed" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm text-emerald-400" v-if="msg">{{ msg }}</div>
        <div class="text-sm text-red-400" v-if="err">{{ err }}</div>
        <div class="flex justify-end gap-2">
          <button @click="loadProfile" :disabled="savingProfile" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Hủy</button>
          <button @click="saveProfile" :disabled="savingProfile" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
            {{ savingProfile ? 'Đang lưu...' : 'Lưu thông tin' }}
          </button>
        </div>
      </div>
    </div>

    <!-- change password -->
    <div class="bg-slate-800 p-4 rounded border border-slate-700 mt-4 space-y-3">
      <h3 class="text-sm text-slate-300">Đổi mật khẩu</h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="sm:col-span-1">
          <label class="text-sm text-slate-400">Mật khẩu hiện tại</label>
          <input v-model="pwd.current" type="password" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" />
        </div>

        <div>
          <label class="text-sm text-slate-400">Mật khẩu mới</label>
          <input v-model="pwd.new" type="password" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" />
        </div>

        <div>
          <label class="text-sm text-slate-400">Xác nhận mật khẩu</label>
          <input v-model="pwd.confirm" type="password" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm text-emerald-400" v-if="pwdMsg">{{ pwdMsg }}</div>
        <div class="text-sm text-red-400" v-if="pwdErr">{{ pwdErr }}</div>
        <div class="flex justify-end gap-2">
          <button @click="clearPasswordFields" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Hủy</button>
          <button @click="changePassword" :disabled="changingPassword" class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-black rounded">
            {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

const savingProfile = ref(false)
const changingPassword = ref(false)

const form = ref({
  username: '',
  fullName: '',
  email: '',
  role: '',
  avatar: ''
})

const pwd = ref({
  current: '',
  new: '',
  confirm: ''
})

const msg = ref('')
const err = ref('')
const pwdMsg = ref('')
const pwdErr = ref('')

const loadProfile = async () => {
  msg.value = err.value = ''
  try {
    const res = await api.get('/auth/profile')
    const data = res?.data?.data || res?.data || {}
    const p = data.user || data || {}
    form.value.username = p.username || p.userName || ''
    form.value.fullName = p.fullName || p.name || ''
    form.value.email = p.email || ''
    form.value.role = p.role || ''
    form.value.avatar = p.avatar || ''
  } catch (error) {
    console.warn('loadProfile error', error)
    err.value = error?.response?.data?.message || 'Không tải được hồ sơ'
  }
  clearPasswordFields()
}

onMounted(loadProfile)

const saveProfile = async () => {
  if (!form.value.fullName || !form.value.email) {
    err.value = 'Nhập tên và email'
    return
  }
  savingProfile.value = true
  err.value = msg.value = ''

  try {
    const payload = {
      fullName: form.value.fullName,
      email: form.value.email,
      avatar: form.value.avatar
    }
    const res = await api.put('/auth/profile', payload)

    if (res?.data?.success) {
      msg.value = 'Lưu thành công'
      const user = res.data.data?.user || res.data.data || null

      if (user) {
        console.log('auth (store) before setUser:', auth, 'typeof setUser:', typeof auth?.setUser)

        if (typeof auth?.setUser === 'function') {
          auth.setUser(user)
        } else {
          console.warn('auth.setUser is not a function — fallback to localStorage')
          localStorage.setItem('user', JSON.stringify(user))
          if (auth && typeof auth === 'object') {
            try { auth.user = user } catch (errAssign) { 
              console.error('Failed to assign auth.user:', errAssign)
            }
          }
        }
      } else {
        await loadProfile()
      }
    } else {
      err.value = res?.data?.message || 'Lưu thất bại'
    }
  } catch (error) {
    console.error('saveProfile error', error)
    err.value = error?.response?.data?.message || error.message || 'Lưu thất bại'
  } finally {
    savingProfile.value = false
  }
}

const clearPasswordFields = () => {
  pwd.value.current = ''
  pwd.value.new = ''
  pwd.value.confirm = ''
  pwdMsg.value = ''
  pwdErr.value = ''
}

const changePassword = async () => {
  pwdMsg.value = pwdErr.value = ''
  if (!pwd.value.current || !pwd.value.new || !pwd.value.confirm) {
    pwdErr.value = 'Điền đủ các trường mật khẩu'
    return
  }
  if (pwd.value.new !== pwd.value.confirm) {
    pwdErr.value = 'Mật khẩu xác nhận không khớp'
    return
  }
  if (pwd.value.new.length < 6) {
    pwdErr.value = 'Mật khẩu mới phải >= 6 ký tự'
    return
  }

  changingPassword.value = true
  try {
    const payload = { currentPassword: pwd.value.current, newPassword: pwd.value.new }
    const res = await api.post('/auth/change-password', payload)
    if (res?.data?.success) {
      pwdMsg.value = 'Đổi mật khẩu thành công'
      clearPasswordFields()
    } else {
      pwdErr.value = res?.data?.message || 'Đổi mật khẩu thất bại'
    }
  } catch (error) {
    console.error('changePassword error', error)
    pwdErr.value = error?.response?.data?.message || error.message || 'Đổi mật khẩu thất bại'
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .18s ease-out; }
</style>