<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock data - chỉ phim điện ảnh
const movies = ref([
  {
    id: 1,
    title: 'Avengers: Endgame',
    category: 'Hành động',
    country: 'Mỹ',
    views: 150000,
    status: 'Hoạt động',
    createdAt: '2024-01-15',
    type: 'movie'
  },
  {
    id: 2,
    title: 'The Dark Knight',
    category: 'Hành động',
    country: 'Mỹ',
    views: 120000,
    status: 'Hoạt động',
    createdAt: '2024-01-10',
    type: 'movie'
  },
  {
    id: 3,
    title: 'Spider-Man: No Way Home',
    category: 'Hành động',
    country: 'Mỹ',
    views: 180000,
    status: 'Hoạt động',
    createdAt: '2024-01-20',
    type: 'movie'
  },
  {
    id: 4,
    title: 'Parasite',
    category: 'Kinh dị',
    country: 'Hàn Quốc',
    views: 95000,
    status: 'Hoạt động',
    createdAt: '2024-01-05',
    type: 'movie'
  },
  {
    id: 5,
    title: 'The Conjuring',
    category: 'Kinh dị',
    country: 'Mỹ',
    views: 140000,
    status: 'Không hoạt động',
    createdAt: '2024-01-12',
    type: 'movie'
  }
])

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedCountry = ref('')

const handleAddMovie = () => {
  router.push('/admin/movies/add')
}

const handleEditMovie = (movie) => {
  router.push(`/admin/movies/edit/${movie.id}`)
}

const handleDeleteMovie = (movie) => {
  if (confirm(`Bạn có chắc muốn xóa phim "${movie.title}"?`)) {
    // Call API to delete
    movies.value = movies.value.filter(m => m.id !== movie.id)
  }
}

// thêm hàm xem chi tiết
const handleViewMovie = (movie) => {
  router.push(`/admin/movies/${movie.id}`)
}

const formatNumber = (num) => {
  return num.toLocaleString('vi-VN')
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Quản lý phim</h1>
        <p class="text-slate-400">Quản lý tất cả phim trong hệ thống</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button 
          @click="handleAddMovie"
          class="btn-primary px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm phim mới
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Tìm kiếm</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tên phim..."
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Thể loại</label>
          <select
            v-model="selectedCategory"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả</option>
            <option value="Hành động">Hành động</option>
            <option value="Hài hước">Hài hước</option>
            <option value="Kinh dị">Kinh dị</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Quốc gia</label>
          <select
            v-model="selectedCountry"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả</option>
            <option value="Mỹ">Mỹ</option>
            <option value="Hàn Quốc">Hàn Quốc</option>
            <option value="Trung Quốc">Trung Quốc</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="() => { searchQuery = ''; selectedCategory = ''; selectedCountry = '' }"
            class="w-full bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Movies Table -->
    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-700/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tên phim</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Thể loại</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Quốc gia</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lượt xem</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="movie in movies" :key="movie.id" class="hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">{{ movie.title }}</div>
                <div class="text-sm text-slate-400">{{ movie.createdAt }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ movie.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ movie.country }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ formatNumber(movie.views) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="movie.status === 'Hoạt động' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ movie.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <!-- nút xem chi tiết -->
                  <button
                    @click="handleViewMovie(movie)"
                    class="text-slate-300 hover:text-white transition-colors"
                    title="Xem chi tiết"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button 
                    @click="handleEditMovie(movie)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDeleteMovie(movie)"
                    class="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>