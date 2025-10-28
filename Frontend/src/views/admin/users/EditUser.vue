<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white">Sửa người dùng</h2>
      <button @click="$router.back()" class="text-slate-300">Quay lại</button>
    </div>

    <div class="bg-slate-800 p-4 rounded space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input v-model="form.username" placeholder="Username" class="px-3 py-2 bg-slate-900 rounded" />
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
                <div class="text-xs text-slate-400">Nhập mật khẩu mới để đặt lại</div>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <input
                    v-model="newPassword"
                    type="password"
                    placeholder="Mật khẩu mới"
                    class="px-3 py-2 bg-slate-800 rounded w-full sm:w-auto"
                />
                <button
                    @click="resetPassword"
                    class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white w-full sm:w-auto"
                >
                    Reset
                </button>
            </div>
        </div>
    </div>
      <div class="flex justify-end gap-2">
        <button @click="$router.back()" class="px-3 py-2 bg-slate-700 rounded">Hủy</button>
        <button @click="save" class="px-3 py-2 bg-emerald-600 rounded text-white">Lưu</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const form = ref({ id: null, username:'', email:'', fullName:'', role:'user', status:'active' })
const newPassword = ref('')

onMounted(() => {
  const id = route.params.id
  // TODO: load user by id from API; using mock for now
  if (id === 'u3') form.value = { id:'u3', username:'charlie', email:'', fullName:'Charlie Tran', role:'user', status:'banned' }
  else form.value = { id, username:'alice01', email:'alice@example.com', fullName:'Alice Nguyen', role:'user', status:'active' }
})

const save = () => {
  // TODO: call API to save
  alert('Lưu user (mock)')
  history.back()
}

const resetPassword = () => {
  if (!newPassword.value) return alert('Nhập mật khẩu mới')
  // TODO: API call to reset
  alert('Mật khẩu đã được đặt lại (mock)')
  newPassword.value = ''
}
</script>