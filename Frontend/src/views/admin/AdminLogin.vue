<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900">
    <div class="w-full max-w-md p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h1 class="text-2xl font-bold text-white mb-4">Đăng nhập Admin</h1>

      <form @submit.prevent="onSubmit" class="space-y-3">
        <div>
          <label class="text-sm text-slate-300">Tên đăng nhập</label>
          <input v-model="username" type="text" class="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" />
        </div>

        <div>
          <label class="text-sm text-slate-300">Mật khẩu</label>
          <input v-model="password" type="password" class="w-full mt-1 p-2 rounded bg-slate-900 text-slate-100" />
        </div>

        <div class="flex items-center justify-between">
          <button type="submit" :disabled="loading" class="btn-primary px-4 py-2">
            {{ loading ? 'Đang...' : 'Đăng nhập' }}
          </button>
          <RouterLink to="/" class="text-sm text-slate-400 hover:underline">Về trang chính</RouterLink>
        </div>

        <div v-if="error" class="text-sm text-red-400 mt-2">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const router = useRouter()
const auth = useAuthStore()

async function onSubmit () {
  error.value = null

  // simple client validation
  if (!username.value?.trim() || !password.value) {
    error.value = 'Nhập tên đăng nhập và mật khẩu'
    return
  }

  loading.value = true
  try {
    // build payload matching backend contract
    // if backend expects "passwordHash" send it under that key (server will hash/compare)
    const payload = {
      username: username.value.trim(),
      passwordHash: password.value
      // or: password: password.value  <-- use this if backend expects "password"
    }

    // debug log (dev only)
    console.log('login payload', payload)

    await auth.login(payload)

    // after successful login, auth store should contain user/token
    if (auth.user?.role === 'admin') {
      const redirect = router.currentRoute.value.query.redirect || '/admin'
      router.push(redirect)
    } else {
      // not admin -> cleanup and show error
      auth.logout()
      error.value = 'Tài khoản không có quyền quản trị'
    }
  } catch (err) {
    // show server message if present
    const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message
    console.error('Login failed:', err?.response?.data || err)
    error.value = serverMsg || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* optional styling */
</style>