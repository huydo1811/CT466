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
          
          <h1 class="text-2xl font-bold text-center text-white mb-2">Đăng nhập</h1>
          <p class="text-gray-400 text-center mb-6">Chào mừng bạn trở lại ChillFilm</p>
          
          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Username -->
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
                  class="w-full bg-dark-700 text-white border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
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
            
            <!-- Password -->
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
                  class="w-full bg-dark-700 text-white border border-gray-700/60 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
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
            
            <!-- Remember me & Forgot password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  v-model="form.rememberMe"
                  class="w-4 h-4 rounded-md border-gray-600 bg-dark-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-800 focus:ring-offset-1"
                />
                <label for="remember-me" class="ml-2 text-sm text-gray-300">
                  Ghi nhớ đăng nhập
                </label>
              </div>

            </div>
            
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
          
          <div class="mt-5">
            <button type="button" class="w-full flex items-center justify-center px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium transition group">
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span class="group-hover:translate-x-1 transition-transform">Đăng nhập với Google</span>
            </button>
          </div>
          
          <!-- Register link -->
          <div class="text-center mt-7">
            <p class="text-gray-400 text-sm">
              Chưa có tài khoản? 
              <RouterLink to="/register" class="text-primary-400 hover:text-primary-300 font-medium hover:underline transition">Đăng ký ngay</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Form data
const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

// Form validation
const errors = ref({})
const isSubmitting = ref(false)

function handleSubmit() {
  errors.value = {}
  
  // Validate form
  if (!form.value.username) {
    errors.value.username = 'Vui lòng nhập tên đăng nhập'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
  }
  
  // If form valid, submit
  if (Object.keys(errors.value).length === 0) {
    isSubmitting.value = true
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login submitted:', form.value)
      isSubmitting.value = false
      // You would redirect or show success here
    }, 1000)
  }
}
</script>

<style scoped>
.text-gradient {
  @apply bg-gradient-to-r from-primary-500 to-red-600 bg-clip-text text-transparent;
}
</style>