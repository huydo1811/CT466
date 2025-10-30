<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center p-4">
    <!-- Card Container -->
    <div class="w-full max-w-md bg-dark-800/90 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
      <!-- Split Design -->
      <div class="relative overflow-hidden p-8">
        <!-- Header Gradient Bar -->
        <div class="h-2 bg-gradient-to-r from-primary-600 via-red-500 to-primary-600"></div>
        
        <div class="p-8">
          <!-- Logo & Title -->
          <div class="flex items-center justify-center mb-8">
            <RouterLink to="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <span class="text-white font-bold text-xl">C</span>
              </div>
              <span class="text-2xl font-bold text-gradient">ChillFilm</span>
            </RouterLink>
          </div>
          
          <h1 class="text-2xl font-bold text-center text-white mb-2">Đăng nhập</h1>
          <p class="text-gray-400 text-center mb-6">Chào mừng bạn trở lại ChillFilm</p>
          
          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Username -->
            <div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <!-- icon -->
                </div>
                <input
                  type="text"
                  v-model="form.username"
                  placeholder="Tên đăng nhập"
                  class="w-full bg-dark-700 text-black border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <p v-if="errors.username" class="mt-1.5 text-sm text-red-400">{{ errors.username }}</p>
            </div>
            
            <!-- Password -->
            <div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                <input
                  type="password"
                  v-model="form.password"
                  placeholder="Mật khẩu"
                  class="w-full bg-dark-700 text-black border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <p v-if="errors.password" class="mt-1.5 text-sm text-red-400">{{ errors.password }}</p>
            </div>            
            <!-- Submit button -->
            <div>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full relative overflow-hidden group bg-gradient-to-r from-primary-600 to-red-600 hover:from-primary-500 hover:to-red-500 text-white font-medium rounded-xl py-3.5 transition-all shadow-lg hover:shadow-primary-600/40"
              >
                <span v-if="isSubmitting">Đang xử lý...</span>
                <span v-else>Đăng nhập</span>
              </button>
            </div>
          </form>
          
          <!-- Google Login -->
          <div class="mt-6 relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700/60"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-2 bg-dark-800 text-gray-400 text-sm">hoặc</span>
            </div>
          </div>
          
          <!-- Google sign-in placeholder (GSI button only) -->
          <div class="mt-5">
            <div id="googleSignInButton" class="w-full flex items-center justify-center"></div>
          </div>
          
          <!-- Register link -->
          <div class="text-center mt-7">
            <p class="text-gray-400 text-sm">
              Chưa có tài khoản? 
              <RouterLink to="/register" class="text-primary-400 font-medium">Đăng ký ngay</RouterLink>
            </p>
          </div>

          <p v-if="errorMsg" class="text-red-400 text-sm mt-3 text-center">{{ errorMsg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const form = ref({ username: '', password: '', rememberMe: false })
const errors = ref({})
const isSubmitting = ref(false)
const errorMsg = ref(null)

const router = useRouter()
const auth = useAuthStore()
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// new flag
const googleAvailable = ref(false)

function handleGoogleCredentialResponse(response) {
  if (!response?.credential) return
  isSubmitting.value = true
  auth.googleLogin({ credential: response.credential })
    .then(() => {
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    })
    .catch(err => {
      console.error('Google login failed', err?.response?.data || err)
      errorMsg.value = err?.response?.data?.message || 'Đăng nhập bằng Google thất bại'
    })
    .finally(() => (isSubmitting.value = false))
}

onMounted(() => {
  const initGoogle = () => {
    if (!window.google || !googleClientId) return
    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse
      })
      const el = document.getElementById('googleSignInButton')
      if (el) window.google.accounts.id.renderButton(el, { theme: 'outline', size: 'large' })
      googleAvailable.value = true // mark available so fallback hides
    } catch (e) {
      console.warn('Google init failed', e)
    }
  }

  // poll until google script loads; only init once
  const timer = setInterval(() => {
    if (window.google) {
      clearInterval(timer)
      initGoogle()
    }
  }, 200)
  setTimeout(() => clearInterval(timer), 5000)
})


async function handleSubmit() {
  errors.value = {}
  errorMsg.value = null
  if (!form.value.username?.trim()) errors.value.username = 'Vui lòng nhập tên đăng nhập'
  if (!form.value.password) errors.value.password = 'Vui lòng nhập mật khẩu'
  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  try {
    await auth.login({ username: form.value.username.trim(), passwordHash: form.value.password })
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    errorMsg.value = err?.response?.data?.message || err?.message || 'Đăng nhập thất bại'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg,var(--tw-gradient-from,#06b6d4),#ef4444);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>