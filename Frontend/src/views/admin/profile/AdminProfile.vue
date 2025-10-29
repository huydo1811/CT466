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
           <input v-model="form.name" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" />
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
 
       <div class="flex justify-end gap-2">
         <button @click="loadProfile" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Hủy</button>
         <button @click="saveProfile" :disabled="savingProfile" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
           {{ savingProfile ? 'Đang lưu...' : 'Lưu thông tin' }}
         </button>
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
 
       <div class="flex justify-end gap-2">
         <button @click="clearPasswordFields" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Hủy</button>
         <button @click="changePassword" :disabled="changingPassword" class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-black rounded">
           {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
         </button>
       </div>
     </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const savingProfile = ref(false)
const changingPassword = ref(false)

const form = ref({
  username: '',
  name: '',
  email: '',
  role: '',
  avatar: '' // dataURL or url
})

const pwd = ref({
  current: '',
  new: '',
  confirm: ''
})

const loadProfile = async () => {
  try {
    // try API, fallback to mock
    const res = await fetch('/api/admin/profile')
    if (!res.ok) throw new Error('no-profile')
    const data = await res.json()
    const p = data?.profile || data || {}
    form.value.username = p.username || ''
    form.value.name = p.name || ''
    form.value.email = p.email || ''
    form.value.role = p.role || 'admin'
    form.value.avatar = p.avatar || ''
  } catch {
    // mock data
    form.value = { username: 'admin', name: 'Admin', email: 'admin@example.com', role: 'admin', avatar: '' }
  }
  clearPasswordFields()
}

onMounted(loadProfile)

const saveProfile = async () => {
  if (!form.value.name || !form.value.email) return alert('Nhập tên và email')
  savingProfile.value = true
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      avatar: form.value.avatar
    }
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      await new Promise(r => setTimeout(r, 400))
      alert('Lưu thông tin (mock)')
    } else {
      alert('Lưu thành công')
    }
  } catch (e) {
    console.warn(e)
    alert('Lưu thất bại (mock)')
  } finally {
    savingProfile.value = false
    loadProfile()
  }
}

const clearPasswordFields = () => {
  pwd.value.current = ''
  pwd.value.new = ''
  pwd.value.confirm = ''
}

const changePassword = async () => {
  if (!pwd.value.current || !pwd.value.new || !pwd.value.confirm) return alert('Điền đủ các trường mật khẩu')
  if (pwd.value.new !== pwd.value.confirm) return alert('Mật khẩu xác nhận không khớp')
  if (pwd.value.new.length < 6) return alert('Mật khẩu mới phải >= 6 ký tự')

  changingPassword.value = true
  try {
    const res = await fetch('/api/admin/profile/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: pwd.value.current, password: pwd.value.new })
    })
    if (!res.ok) {
      // mock fallback
      await new Promise(r => setTimeout(r, 500))
      alert('Đổi mật khẩu (mock) — nếu current đúng thì thành công')
    } else {
      alert('Đổi mật khẩu thành công')
    }
    clearPasswordFields()
  } catch (e) {
    console.warn(e)
    alert('Đổi mật khẩu thất bại (mock)')
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .18s ease-out; }
</style>