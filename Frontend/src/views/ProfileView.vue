<template>
  <div class="min-h-screen bg-dark-900 pt-20 pb-16">
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
              <img :src="user.avatar" alt="Avatar" class="w-full h-full object-cover" />
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
        <div class="p-6">
          <!-- Personal Information Tab -->
          <div v-if="activeTab === 'personal'" class="animate-fadeIn">
            <h2 class="text-xl font-semibold text-white mb-6">Thông tin cá nhân</h2>
            
            <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-400 mb-1">Họ tên</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Họ tên của bạn"
                />
              </div>
              
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Số điện thoại"
                />
              </div>
              
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-400 mb-1">Ngày sinh</label>
                <input 
                  v-model="form.birthdate" 
                  type="date" 
                  class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-400 mb-1">Giới thiệu</label>
                <textarea 
                  v-model="form.bio" 
                  rows="4"
                  class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Viết đôi điều về bản thân..."
                ></textarea>
              </div>
              
              <div class="col-span-2">
                <div class="flex items-center justify-between">
                  <button 
                    type="submit" 
                    class="btn-primary px-6 py-3"
                    :disabled="isUpdating"
                  >
                    <span v-if="isUpdating">Đang cập nhật...</span>
                    <span v-else>Cập nhật thông tin</span>
                  </button>
                  
                  <button 
                    type="button" 
                    class="text-gray-400 hover:text-white"
                    @click="resetForm"
                  >
                    Hủy thay đổi
                  </button>
                </div>
              </div>
            </form>
            
            <!-- Change Password Section -->
            <div class="mt-12 pt-8 border-t border-gray-700">
              <h2 class="text-xl font-semibold text-white mb-6">Thay đổi mật khẩu</h2>
              
              <form @submit.prevent="updatePassword" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Mật khẩu hiện tại</label>
                  <input 
                    v-model="passwordForm.current" 
                    type="password" 
                    class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                
                <div class="col-span-1"></div>
                
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Mật khẩu mới</label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.new" 
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button 
                      type="button" 
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                    >
                      <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Xác nhận mật khẩu mới</label>
                  <input 
                    v-model="passwordForm.confirm" 
                    type="password" 
                    class="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                
                <div class="col-span-2">
                  <button 
                    type="submit" 
                    class="btn-primary px-6 py-3"
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
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-white">Lịch sử xem phim</h2>
              <button class="text-gray-400 hover:text-white text-sm flex items-center" @click="clearHistory">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa lịch sử
              </button>
            </div>
            
            <div v-if="watchHistory.length > 0">
              <div v-for="item in watchHistory" :key="item.id" class="flex items-center py-4 border-b border-gray-700">
                <div class="w-16 h-24 rounded overflow-hidden flex-shrink-0">
                  <img :src="item.poster" :alt="item.title" class="w-full h-full object-cover" />
                </div>
                
                <div class="ml-4 flex-1">
                  <RouterLink :to="{ name: 'movie-detail', params: { id: item.id } }" class="text-white hover:text-primary-500 font-medium">
                    {{ item.title }}
                  </RouterLink>
                  <div class="text-sm text-gray-500 mb-2">
                    <span>{{ item.year }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ item.duration }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm">
                      <span class="text-gray-400 mr-2">Đã xem:</span>
                      <span class="text-gray-300">{{ formatDate(item.watchedAt) }}</span>
                    </div>
                    
                    <div class="flex items-center">
                      <RouterLink :to="{ name: 'watch-movie', params: { id: item.id } }" class="text-sm text-primary-500 hover:text-primary-400 mr-4">
                        <span class="flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                          </svg>
                          Xem lại
                        </span>
                      </RouterLink>
                      
                      <button @click="removeFromHistory(item.id)" class="text-gray-500 hover:text-gray-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Progress Bar -->
                  <div class="mt-2 bg-dark-900 h-1 rounded-full overflow-hidden">
                    <div 
                      class="bg-primary-500 h-full" 
                      :style="{ width: `${item.progress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-12 bg-dark-900/50 rounded-xl border border-gray-800">
              <svg class="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 class="text-gray-400 text-lg font-medium mb-2">Chưa có lịch sử xem</h3>
              <p class="text-gray-600 max-w-md mx-auto mb-6">Bạn chưa xem phim nào. Hãy khám phá bộ sưu tập phim của chúng tôi.</p>
              <RouterLink to="/" class="btn-primary px-6 py-2">
                Khám phá phim
              </RouterLink>
            </div>
          </div>
          
          <!-- Favorites Tab -->
          <div v-if="activeTab === 'favorites'" class="animate-fadeIn">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-white">Phim yêu thích</h2>
            </div>
            
            <div v-if="favorites.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              <div v-for="movie in favorites" :key="movie.id" class="movie-card group relative">
                <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
                  <img 
                    :src="movie.poster" 
                    :alt="movie.title" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span class="text-yellow-400 text-xs font-semibold">{{ movie.rating }}</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                    <div class="p-4 w-full">
                      <RouterLink 
                        :to="{ name: 'movie-detail', params: { id: movie.id } }" 
                        class="w-full py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm transition block text-center"
                      >
                        Xem chi tiết
                      </RouterLink>
                    </div>
                  </div>

                  <!-- Remove from favorites button -->
                  <button 
                    @click="removeFromFavorites(movie.id)" 
                    class="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div class="mt-2">
                  <h3 class="text-white font-medium truncate cursor-pointer hover:text-primary-500" @click="router.push({ name: 'movie-detail', params: { id: movie.id } })">
                    {{ movie.title }}
                  </h3>
                  <div class="flex items-center justify-between">
                    <p class="text-gray-400 text-sm">{{ movie.year }}</p>
                    <div class="text-xs text-gray-500">
                      {{ movie.categories[0] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-12 bg-dark-900/50 rounded-xl border border-gray-800">
              <svg class="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 class="text-gray-400 text-lg font-medium mb-2">Chưa có phim yêu thích</h3>
              <p class="text-gray-600 max-w-md mx-auto mb-6">Bạn chưa thêm phim nào vào danh sách yêu thích. Hãy khám phá và đánh dấu những bộ phim bạn yêu thích.</p>
              <RouterLink to="/" class="btn-primary px-6 py-2">
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

const router = useRouter()
const avatarInput = ref(null)

// Tab navigation
const activeTab = ref('personal')
const tabs = [
  { 
    id: 'personal', 
    name: 'Thông tin cá nhân',
    icon: markRaw({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      `
    })
  },
  { 
    id: 'history', 
    name: 'Lịch sử xem',
    icon: markRaw({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `
    })
  },
  { 
    id: 'favorites', 
    name: 'Phim yêu thích',
    icon: markRaw({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      `
    })
  }
]

// Mock user data (Trong thực tế sẽ được lấy từ API)
const user = ref({
  id: 1,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar: 'https://i.pravatar.cc/300?img=8',
  phone: '0912345678',
  birthdate: '1995-05-15',
  bio: 'Là một người yêu thích điện ảnh, đặc biệt các thể loại hành động và khoa học viễn tưởng.',
  createdAt: '2022-10-15T08:30:00Z',
  role: 'member',
  stats: {
    watched: 48,
    favorites: 15,
    ratings: 27,
    comments: 8
  }
})

// Form data
const form = reactive({
  name: '',
  email: '',
  phone: '',
  birthdate: '',
  bio: ''
})

// Password form
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// UI States
const isUpdating = ref(false)
const isUpdatingPassword = ref(false)
const isDeletingAccount = ref(false)
const confirmDeleteAccount = ref(false)
const showPassword = ref(false)

// Mock watch history data
const watchHistory = ref([
  {
    id: 101,
    title: 'Spider-Man: No Way Home',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    year: 2021,
    duration: '148 min',
    watchedAt: '2023-08-15T14:30:00Z',
    progress: 100
  },
  {
    id: 102,
    title: 'The Batman',
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    year: 2022,
    duration: '176 min',
    watchedAt: '2023-08-10T20:15:00Z',
    progress: 85
  },
  {
    id: 103,
    title: 'Dune',
    poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    year: 2021,
    duration: '155 min',
    watchedAt: '2023-07-28T19:00:00Z',
    progress: 100
  }
])

// Mock favorites data
const favorites = ref([
  {
    id: 201,
    title: 'Avatar: The Way of Water',
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    rating: 7.6,
    year: 2022,
    categories: ['Khoa học viễn tưởng', 'Phiêu lưu']
  },
  {
    id: 202,
    title: 'John Wick: Chapter 4',
    poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    rating: 7.8,
    year: 2023,
    categories: ['Hành động', 'Tội phạm']
  },
  {
    id: 203,
    title: 'Everything Everywhere All at Once',
    poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    rating: 7.9,
    year: 2022,
    categories: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng']
  },
  {
    id: 204,
    title: 'Top Gun: Maverick',
    poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    rating: 8.3,
    year: 2022,
    categories: ['Hành động', 'Kịch tính']
  }
])

// Initialize form data from user
function resetForm() {
  form.name = user.value.name
  form.email = user.value.email
  form.phone = user.value.phone
  form.birthdate = user.value.birthdate
  form.bio = user.value.bio
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

// Avatar upload
function triggerAvatarUpload() {
  avatarInput.value.click()
}

function uploadAvatar(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Trong môi trường thực tế, bạn sẽ upload file lên server
  // Ở đây chỉ đơn giản tạo một URL tạm thời để hiển thị
  const reader = new FileReader()
  reader.onload = (e) => {
    user.value.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

// Update profile
async function updateProfile() {
  isUpdating.value = true
  
  // Giả lập API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Cập nhật dữ liệu người dùng
  user.value.name = form.name
  user.value.phone = form.phone
  user.value.birthdate = form.birthdate
  user.value.bio = form.bio
  
  isUpdating.value = false
  // Hiển thị thông báo thành công (có thể thêm vào sau)
}

// Update password
async function updatePassword() {
  // Validate password
  if (passwordForm.new !== passwordForm.confirm) {
    alert('Mật khẩu xác nhận không khớp')
    return
  }
  
  if (!passwordForm.current || !passwordForm.new) {
    alert('Vui lòng nhập đầy đủ thông tin')
    return
  }
  
  isUpdatingPassword.value = true
  
  // Giả lập API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Reset form
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
  
  isUpdatingPassword.value = false
  // Hiển thị thông báo thành công (có thể thêm vào sau)
}

// History management
function removeFromHistory(id) {
  watchHistory.value = watchHistory.value.filter(item => item.id !== id)
}

function clearHistory() {
  if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử xem?')) {
    watchHistory.value = []
  }
}

// Favorites management
function removeFromFavorites(id) {
  favorites.value = favorites.value.filter(item => item.id !== id)
}


async function deleteAccount() {
  isDeletingAccount.value = true
  
  // Giả lập API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isDeletingAccount.value = false
  confirmDeleteAccount.value = false
  
  // Đăng xuất và đưa người dùng về trang chủ
  router.push({ name: 'home' })
}

onMounted(() => {
  // Initialize form with user data
  resetForm()
  // Set document title
  document.title = `Tài khoản của ${user.value.name}`
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