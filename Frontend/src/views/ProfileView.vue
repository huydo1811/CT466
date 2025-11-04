<template>
  <div class="min-h-screen bg-dark-900 pb-16">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-primary-600/30 to-red-600/30 h-48"></div>
    
    <!-- Main Profile Content -->
    <div class="container mx-auto px-4 -mt-24">
      <div class="bg-dark-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
        <!-- Profile Header -->
        <div class="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <!-- Avatar with Upload Option -->
          <div class="relative group">
            <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary-500">
              <img :src="getMediaUrl(user.avatar)" alt="Avatar" class="w-full h-full object-cover" />
            </div>
            <div class="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer" @click="triggerAvatarUpload">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" ref="avatarInput" class="hidden" @change="uploadAvatar" accept="image/*" />
            </div>
          </div>
          
          <!-- User Information -->
          <div class="flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ user.name }}</h1>
            <p class="text-gray-400 mb-2">{{ user.email }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>Thành viên từ {{ formatDate(user.createdAt) }}</span>
              <span>•</span>
              <span>{{ user.role === 'admin' ? 'Quản trị viên' : 'Thành viên' }}</span>
            </div>
            
            <!-- Stats -->
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <div class="text-xs text-gray-500">Đã xem</div>
                  <div class="text-white font-medium">{{ user.stats.watched }} phim</div>
                </div>
              </div>
              
              <div class="flex items-center">
                <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <div class="text-xs text-gray-500">Yêu thích</div>
                  <div class="text-white font-medium">{{ user.stats.favorites }} phim</div>
                </div>
              </div>
              
              <div class="flex items-center">
                <div class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <div class="text-xs text-gray-500">Đánh giá</div>
                  <div class="text-white font-medium">{{ user.stats.ratings }} đánh giá</div>
                </div>
              </div>
              
              <div class="flex items-center">
                <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <div class="text-xs text-gray-500">Bình luận</div>
                  <div class="text-white font-medium">{{ user.stats.comments }} bình luận</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabs Navigation -->
        <div class="border-b border-gray-700">
          <div class="container flex overflow-x-auto scrollbar-hide">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 whitespace-nowrap border-b-2 font-medium text-sm focus:outline-none',
                activeTab === tab.id 
                  ? 'border-primary-500 text-primary-500' 
                  : 'border-transparent text-gray-400 hover:text-white'
              ]"
            >
              <div class="flex items-center">
                <component :is="tab.icon" class="w-5 h-5 mr-2" />
                {{ tab.name }}
              </div>
            </button>
          </div>
        </div>
        
        <!-- Tab Content -->
<!-- Tab Content -->
<div class="p-4 sm:p-6">
  <!-- Personal Information Tab -->
  <div v-if="activeTab === 'personal'" class="animate-fadeIn">
    <h2 class="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Thông tin cá nhân</h2>
    
    <form @submit.prevent="updateProfile" class="grid grid-cols-1 gap-4 sm:gap-6">
      <div class="col-span-1">
        <label class="block text-sm font-medium text-gray-400 mb-1">Họ tên</label>
        <input 
          v-model="form.name" 
          type="text" 
          class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Họ tên của bạn"
        />
      </div>
      
      <div class="col-span-1">
        <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
        <input 
          v-model="form.email" 
          type="email" 
          class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Email của bạn"
          disabled
        />
        <p class="mt-1 text-xs text-gray-500">Email không thể thay đổi.</p>
      </div>
      
      <div class="col-span-1">
        <label class="block text-sm font-medium text-gray-400 mb-1">Số điện thoại</label>
        <input 
          v-model="form.phone" 
          type="text" 
          class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Số điện thoại"
        />
      </div>
      
      <div class="col-span-1">
        <label class="block text-sm font-medium text-gray-400 mb-1">Ngày sinh</label>
        <input 
          v-model="form.birthdate" 
          type="date" 
          class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      
      <div class="col-span-1">
        <label class="block text-sm font-medium text-gray-400 mb-1">Giới thiệu</label>
        <textarea 
          v-model="form.bio" 
          rows="3" sm:rows="4"
          class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Viết đôi điều về bản thân..."
        ></textarea>
      </div>
      
      <div class="col-span-1">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button 
            type="submit" 
            class="btn-primary px-4 py-2 sm:px-6 sm:py-3"
            :disabled="isUpdating"
          >
            <span v-if="isUpdating">Đang cập nhật...</span>
            <span v-else>Cập nhật thông tin</span>
          </button>
          
          <button 
            type="button" 
            class="text-gray-400 hover:text-white text-sm"
            @click="resetForm"
          >
            Hủy thay đổi
          </button>
        </div>
      </div>
    </form>
    
    <!-- Change Password Section -->
    <div v-if="!user.googleId" class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700">
      <h2 class="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Thay đổi mật khẩu</h2>
      
      <form @submit.prevent="updatePassword" class="grid grid-cols-1 gap-4 sm:gap-6">
        <!-- ... giữ nguyên form password, thêm responsive padding ... -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-400 mb-1">Mật khẩu hiện tại</label>
          <input 
            v-model="passwordForm.current" 
            type="password" 
            class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>
        
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-400 mb-1">Mật khẩu mới</label>
          <div class="relative">
            <input 
              v-model="passwordForm.new" 
              :type="showPassword ? 'text' : 'password'"
              class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nhập mật khẩu mới"
            />
            <!-- ... giữ nguyên toggle password ... -->
          </div>
        </div>
        
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-400 mb-1">Xác nhận mật khẩu mới</label>
          <input 
            v-model="passwordForm.confirm" 
            type="password" 
            class="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
        
        <div class="col-span-1">
          <button 
            type="submit" 
            class="btn-primary px-4 py-2 sm:px-6 sm:py-3"
            :disabled="isUpdatingPassword"
          >
            <span v-if="isUpdatingPassword">Đang cập nhật...</span>
            <span v-else>Thay đổi mật khẩu</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  
  <!-- Watch History Tab -->
  <div v-if="activeTab === 'history'" class="animate-fadeIn">
    <div class="flex items-center justify-between mb-4 sm:mb-6">
      <h2 class="text-lg sm:text-xl font-semibold text-white">Lịch sử xem phim</h2>
      <button class="text-gray-400 hover:text-white text-xs sm:text-sm flex items-center" @click="clearHistory">
        <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Xóa lịch sử
      </button>
    </div>
    
    <div v-if="watchHistory.length > 0">
      <div v-for="item in watchHistory" :key="item.id" class="flex items-center py-3 sm:py-4 border-b border-gray-700">
        <div class="w-12 h-18 sm:w-16 sm:h-24 rounded overflow-hidden flex-shrink-0">
          <img :src="item.poster" :alt="item.title" class="w-full h-full object-cover" />
        </div>
        
        <div class="ml-3 sm:ml-4 flex-1">
          <RouterLink :to="{ name: 'movie-detail', params: { id: item.id } }" class="text-white hover:text-primary-500 font-medium text-sm sm:text-base">
            {{ item.title }}
          </RouterLink>
          <div class="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
            <span>{{ item.year }}</span>
            <span class="mx-1">•</span>
            <span>{{ item.duration }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center text-xs sm:text-sm">
              <span class="text-gray-400 mr-1 sm:mr-2">Đã xem:</span>
              <span class="text-gray-300">{{ formatDate(item.watchedAt) }}</span>
            </div>
            
            <div class="flex items-center">
              <RouterLink :to="{ name: 'watch-movie', params: { id: item.id } }" class="text-xs sm:text-sm text-primary-500 hover:text-primary-400 mr-2 sm:mr-4">
                <span class="flex items-center">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  Xem lại
                </span>
              </RouterLink>
              
              <button @click="removeFromHistory(item.id)" class="text-gray-500 hover:text-gray-300">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-1 sm:mt-2 bg-dark-900 h-1 rounded-full overflow-hidden">
            <div 
              class="bg-primary-500 h-full" 
              :style="{ width: `${item.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-8 sm:py-12 bg-dark-900/50 rounded-xl border border-gray-800">
      <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 class="text-gray-400 text-base sm:text-lg font-medium mb-2">Chưa có lịch sử xem</h3>
      <p class="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">Bạn chưa xem phim nào. Hãy khám phá bộ sưu tập phim của chúng tôi.</p>
      <RouterLink to="/" class="btn-primary px-4 py-2 sm:px-6 sm:py-2">
        Khám phá phim
      </RouterLink>
    </div>
  </div>
  
  <!-- Favorites Tab -->
  <div v-if="activeTab === 'favorites'" class="animate-fadeIn">
    <div class="flex items-center justify-between mb-4 sm:mb-6">
      <h2 class="text-lg sm:text-xl font-semibold text-white">Phim yêu thích</h2>
    </div>
    
    <div v-if="favorites.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
      <!-- ... giữ nguyên grid favorites ... -->
    </div>
    
    <div v-else class="text-center py-8 sm:py-12 bg-dark-900/50 rounded-xl border border-gray-800">
      <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <h3 class="text-gray-400 text-base sm:text-lg font-medium mb-2">Chưa có phim yêu thích</h3>
      <p class="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">Bạn chưa thêm phim nào vào danh sách yêu thích. Hãy khám phá và đánh dấu những bộ phim bạn yêu thích.</p>
      <RouterLink to="/" class="btn-primary px-4 py-2 sm:px-6 sm:py-2">
        Khám phá phim
      </RouterLink>
    </div>
  </div>
</div>
      </div>
    </div>
    
    <!-- Delete Account Confirmation Modal -->
    <div v-if="confirmDeleteAccount" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div class="bg-dark-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full animate-fadeIn">
        <h3 class="text-xl font-bold text-white mb-2">Xóa tài khoản?</h3>
        <p class="text-gray-400 mb-6">Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
        
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button 
            @click="confirmDeleteAccount = false" 
            class="btn-outline py-2 px-5 sm:order-1"
          >
            Hủy
          </button>
          <button 
            @click="deleteAccount" 
            class="btn-danger py-2 px-5 sm:order-2"
            :disabled="isDeletingAccount"
          >
            <span v-if="isDeletingAccount">Đang xử lý...</span>
            <span v-else>Xóa vĩnh viễn</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const avatarInput = ref(null)

// Tab navigation
const activeTab = ref('personal')
const tabs = [
  { id: 'personal', name: 'Thông tin cá nhân', icon: markRaw({ template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>` }) },
  { id: 'history', name: 'Lịch sử xem', icon: markRaw({ template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }) },
  { id: 'favorites', name: 'Phim yêu thích', icon: markRaw({ template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>` }) }
]

// user + form state
// safe default to avoid null access in template
const user = ref({
  _id: null,
  name: '',
  fullName: '',
  email: '',
  avatar: '',
  phone: '',
  birthdate: null,
  bio: '',
  createdAt: null,
  role: 'user',
  googleId: null,
  stats: { watched:0, favorites:0, ratings:0, comments:0 },
  history: [],
  favorites: []
})

const form = reactive({ name: '', email: '', phone: '', birthdate: '', bio: '' })
const passwordForm = reactive({ current: '', new: '', confirm: '' })
const isUpdating = ref(false)
const isUpdatingPassword = ref(false)
const isDeletingAccount = ref(false)
const confirmDeleteAccount = ref(false)
const showPassword = ref(false)

// watchHistory & favorites now loaded from backend
const watchHistory = ref([])
const favorites = ref([])

function resetForm() {
  form.name = user.value?.fullName || user.value?.name || ''
  form.email = user.value?.email || ''
  form.phone = user.value?.phone || ''
  form.birthdate = user.value?.birthdate ? new Date(user.value.birthdate).toISOString().slice(0,10) : ''
  form.bio = user.value?.bio || ''
}

const loadProfile = async () => {
  try {
    // use auth/profile endpoint (see Backend/app/controllers/authController.js -> getProfile)
    const res = await api.get('/auth/profile')
    const u = res?.data?.data || res?.data || null
    if (u) {
      user.value = u
      // history stored on user model (see Backend/app/models/User.js -> history subdocs)
      watchHistory.value = Array.isArray(u.history) ? u.history.map(h => ({
        id: h._id || h.id,
        title: h.title || h.movieTitle || '',
        poster: h.poster || h.moviePoster || '',
        year: h.year || '',
        duration: h.duration || '',
        watchedAt: h.watchedAt || h.createdAt || null,
        progress: h.progress ?? 0
      })) : []
      // favorites if available from API
      favorites.value = Array.isArray(u.favorites) ? u.favorites : (u.favoriteMovies || [])
      resetForm()
    }
  } catch (err) {
    console.error('load profile failed', err)
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

// Avatar upload
function triggerAvatarUpload() { avatarInput.value.click() }
let avatarFile = null
function uploadAvatar(event) {
  const file = event.target.files?.[0]
  if (!file) return
  avatarFile = file
  const reader = new FileReader()
  reader.onload = (e) => { if (!user.value) user.value = {}; user.value.avatar = e.target.result }
  reader.readAsDataURL(file)
}

// Update profile (unchanged, still uses /users/me PUT)
async function updateProfile() {
  isUpdating.value = true
  try {
    if (avatarFile) {
      const fd = new FormData()
      fd.append('fullName', form.name)
      fd.append('phone', form.phone || '')
      fd.append('birthdate', form.birthdate || '')
      fd.append('bio', form.bio || '')
      fd.append('avatar', avatarFile)
      const res = await api.put('/users/me', fd)
      user.value = res?.data?.data || user.value
      avatarFile = null
    } else {
      const payload = { fullName: form.name, phone: form.phone, birthdate: form.birthdate, bio: form.bio, avatar: user.value?.avatar }
      const res = await api.put('/users/me', payload)
      user.value = res?.data?.data || user.value
    }
    resetForm()
    alert('Cập nhật thành công')
  } catch (e) {
    console.error('update profile failed', e)
    alert(e?.response?.data?.message || 'Cập nhật thất bại')
  } finally { isUpdating.value = false }
}

// Update password (unchanged)
async function updatePassword() {
  if (passwordForm.new !== passwordForm.confirm) { alert('Mật khẩu xác nhận không khớp'); return }
  if (!passwordForm.current || !passwordForm.new) { alert('Vui lòng nhập đầy đủ thông tin'); return }
  isUpdatingPassword.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  passwordForm.current = passwordForm.new = passwordForm.confirm = ''
  isUpdatingPassword.value = false
}

// History management: call backend endpoints if available, fallback to local update
async function removeFromHistory(id) {
  try {
    // support DELETE /users/me/history/:id
    await api.delete(`/users/me/history/${id}`)
    watchHistory.value = watchHistory.value.filter(item => (item.id || item._id) !== id)
  } catch (err) {
    console.warn('removeFromHistory API failed, falling back to client-side filter', err)
    watchHistory.value = watchHistory.value.filter(item => (item.id || item._id) !== id)
  }
}

async function clearHistory() {
  if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử xem?')) return
  try {
    // support DELETE /users/me/history (bulk)
    await api.delete('/users/me/history')
    watchHistory.value = []
  } catch (err) {
    console.warn('clearHistory API failed, falling back to client-side clear', err)
    watchHistory.value = []
  }
}

// Delete account (unchanged)
async function deleteAccount() {
  isDeletingAccount.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isDeletingAccount.value = false
  confirmDeleteAccount.value = false
  router.push({ name: 'home' })
}

// helper to normalize urls
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

onMounted(async () => {
  await loadProfile()
  document.title = `Tài khoản của ${user.value?.fullName || user.value?.name || 'người dùng'}`
})
</script>

<style scoped>
/* Các style hiện tại giữ nguyên */

/* Thêm style cho input fields */
input, textarea {
  background-color: #1f2937 !important; /* dark-800 */
  color: #fff;
}

/* Style đặc biệt cho input date */
input[type="date"] {
  background-color: #1f2937 !important; 
  color-scheme: dark;
}

/* Đổi màu cho placeholder */
::placeholder {
  color: #9ca3af;
  opacity: 0.6;
}

/* Đổi màu khi focus */
input:focus, textarea:focus {
  background-color: #111827 !important; /* dark-900 */
}

/* Style khi disabled */
input:disabled {
  background-color: #374151 !important; /* dark-600 */
  cursor: not-allowed;
  opacity: 0.8;
}

/* Custom toggle switch styling */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #374151;
  transition: .3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}

input:checked + .slider {
  background-color: #4F46E5;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Fade in animation */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hide scrollbar for WebKit browsers */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge, Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Button Styles */
.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition;
}

/* Movie card hover effect */
.movie-card:hover .rating {
  opacity: 0;
}
</style>