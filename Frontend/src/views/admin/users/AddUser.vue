<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white">Thêm người dùng</h2>
      <button @click="$router.back()" class="text-slate-300">Quay lại</button>
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
        <button @click="$router.back()" class="px-3 py-2 bg-slate-700 rounded">Hủy</button>
        <button @click="save" class="px-3 py-2 bg-emerald-600 rounded text-white">Tạo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({ username:'', email:'', fullName:'', role:'user', password:'' })
const save = () => {
  if (!form.value.username || !form.value.fullName) return alert('Nhập username và họ tên')
  // TODO: call API
  alert('Tạo user (mock)')
  history.back()
}
</script>