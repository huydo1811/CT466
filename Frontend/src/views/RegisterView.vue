<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center p-4">
    <!-- Card Container -->
    <div class="w-full max-w-md bg-dark-800/90 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
      <!-- Split Design -->
      <div class="relative overflow-hidden">
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
          
          <h1 class="text-2xl font-bold text-center text-white mb-2">Tạo tài khoản</h1>
          <p class="text-gray-400 text-center mb-6">Tham gia cộng đồng yêu phim ChillFilm</p>
          
          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="fullName"
                  v-model="form.fullName"
                  class="w-full bg-dark-700 text-black border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  :class="{'border-red-500/70 focus:ring-red-500': errors.fullName}"
                  placeholder="Họ tên"
                />
              </div>
              <p v-if="errors.fullName" class="mt-1.5 text-sm text-red-400 flex items-center">
                <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.fullName }}
              </p>
            </div>
            
            <!-- Tên đăng nhập -->
            <div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  v-model="form.username"
                  class="w-full bg-dark-700 text-black border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  :class="{'border-red-500/70 focus:ring-red-500': errors.username}"
                  placeholder="Tên đăng nhập"
                />
              </div>
              <p v-if="errors.username" class="mt-1.5 text-sm text-red-400 flex items-center">
                <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.username }}
              </p>
            </div>
            
            <!-- Password  -->
            <div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  class="w-full bg-dark-700 text-black border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  :class="{'border-red-500/70 focus:ring-red-500': errors.password}"
                  placeholder="Mật khẩu"
                />
              </div>
              <p v-if="errors.password" class="mt-1.5 text-sm text-red-400 flex items-center">
                <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.password }}
              </p>
            </div>

            <!-- Confirm Password -->
            <div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  class="w-full bg-dark-700 text-black border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  :class="{'border-red-500/70 focus:ring-red-500': errors.confirmPassword}"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
              <p v-if="errors.confirmPassword" class="mt-1.5 text-sm text-red-400 flex items-center">
                <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.confirmPassword }}
              </p>
            </div>
            
            <!-- Terms and conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  v-model="form.agreeTerms"
                  class="w-4 h-4 rounded-md border-gray-600 bg-dark-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-800 focus:ring-offset-1"
                />
              </div>
              <label for="agreeTerms" class="ml-2 text-sm text-gray-300" :class="{'text-red-400': errors.agreeTerms}">
                Tôi đồng ý với <RouterLink to="/terms" class="text-primary-400 hover:text-primary-300 hover:underline">Điều khoản sử dụng</RouterLink>
              </label>
            </div>
            <p v-if="errors.agreeTerms" class="mt-1 text-sm text-red-400 flex items-center">
              <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.agreeTerms }}
            </p>
            
            <!-- Submit button -->
            <div class="pt-2">
              <button
                type="submit"
                class="w-full relative overflow-hidden group bg-gradient-to-r from-primary-600 to-red-600 hover:from-primary-500 hover:to-red-500 text-white font-medium rounded-xl py-3.5 transition-all shadow-lg hover:shadow-primary-600/40"
                :disabled="isSubmitting"
              >
                <!-- Animation overlay -->
                <span class="absolute inset-0 w-full h-full scale-0 rounded-xl opacity-0 group-hover:opacity-20 group-hover:scale-100 bg-white transition-all duration-500 ease-out"></span>
                
                <span v-if="isSubmitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
                <span v-else>Đăng ký</span>
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
          
          <!-- GSI placeholder (same as LoginView) -->
          <div class="mt-5">
            <div id="googleSignInButton" class="w-full flex items-center justify-center"></div>
          </div>
          
          <!-- Login link -->
          <div class="text-center mt-7">
            <p class="text-gray-400 text-sm">
              Đã có tài khoản? 
              <RouterLink to="/login" class="text-primary-400 hover:text-primary-300 font-medium hover:underline transition">Đăng nhập</RouterLink>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

 const form = ref({
   fullName: '',
   username: '',
   password: '',
   confirmPassword: '',
   agreeTerms: false
 })
 
// Form validation
const errors = ref({})
const isSubmitting = ref(false)
const router = useRouter()
const auth = useAuthStore()

// Google sign-in support (same behaviour as LoginView)
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const googleAvailable = ref(false)
const errorMsg = ref(null)

function handleGoogleCredentialResponse(response) {
  if (!response?.credential) return
  isSubmitting.value = true
  auth.googleLogin({ credential: response.credential })
    .then(() => {
      // after google login (backend creates user if not exists) redirect to home
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    })
    .catch(err => {
      console.error('Google register/login failed', err?.response?.data || err)
      if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
        errorMsg.value = 'Không kết nối tới server. Khởi động backend (http://localhost:3000).'
      } else {
        errorMsg.value = err?.response?.data?.message || 'Đăng nhập bằng Google thất bại'
      }
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
      googleAvailable.value = true
    } catch (e) {
      console.warn('Google init failed', e)
    }
  }

  const timer = setInterval(() => {
    if (window.google) {
      clearInterval(timer)
      initGoogle()
    }
  }, 200)
  setTimeout(() => clearInterval(timer), 5000)
})

function validatePassword(password) {
  return password.length >= 6
}
 
async function handleSubmit() {
  errors.value = {}
  errorMsg.value = null
  
  // Validate form
  if (!form.value.fullName) {
    errors.value.fullName = 'Vui lòng nhập họ tên'
  } else if (form.value.fullName.length < 2) {
    errors.value.fullName = 'Họ tên phải có ít nhất 2 ký tự'
  }
  
  if (!form.value.username) {
    errors.value.username = 'Vui lòng nhập tên đăng nhập'
  } else if (form.value.username.length < 3) {
    errors.value.username = 'Tên đăng nhập phải có ít nhất 3 ký tự'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
  } else if (!validatePassword(form.value.password)) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
  }
  
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Vui lòng nhập lại mật khẩu'
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu nhập lại không khớp'
  }
  
  if (!form.value.agreeTerms) {
    errors.value.agreeTerms = 'Vui lòng đồng ý với điều khoản sử dụng'
  }
  
  // If form valid, submit
  if (Object.keys(errors.value).length === 0) {
     isSubmitting.value = true
     try {
      // send password under key "passwordHash" because backend expects passwordHash
      const payload = {
        username: form.value.username,
        passwordHash: form.value.password,
        fullName: form.value.fullName
      }

      await auth.register(payload)
      alert('Đăng ký thành công')
      router.push('/login')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi đăng ký'
      alert(msg)
    } finally {
      isSubmitting.value = false
    }
   }
 }
</script>

<style scoped>
.text-gradient {
  @apply bg-gradient-to-r from-primary-500 to-red-600 bg-clip-text text-transparent;
}
</style>