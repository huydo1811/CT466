<template>
  <div class="bg-dark-900 min-h-screen pb-16">
    <!-- Hero/Banner Section -->
    <div class="relative bg-gradient-to-b from-dark-800 to-dark-900 py-12 mb-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3 mb-3">
            <img 
              v-if="country.flag" 
              :src="country.flag" 
              :alt="country.name" 
              class="w-8 h-6 object-cover rounded shadow-lg"
            />
            <h1 class="text-4xl font-bold text-white">
              Phim {{ country.name }}
            </h1>
          </div>
          <p class="text-gray-300 text-lg">
            Khám phá những bộ phim hay nhất đến từ {{ country.name }}. Đắm chìm trong nền điện ảnh đa dạng và phong phú với những tác phẩm đặc sắc nhất.
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="container mx-auto px-4 mb-6">
      <div class="flex items-center text-sm text-gray-400">
        <RouterLink to="/" class="hover:text-white">Trang chủ</RouterLink>
        <svg class="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="text-white">Phim {{ country.name }}</span>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- Sort and results info -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div class="text-gray-300">
          Hiển thị <span class="text-white font-medium">{{ (currentPage - 1) * moviesPerPage + 1 }}-{{ Math.min(currentPage * moviesPerPage, totalMovies) }}</span> 
          trên <span class="text-white font-medium">{{ totalMovies }}</span> phim
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Nút filter -->
          <button 
            @click="showFilters = !showFilters" 
            class="flex items-center bg-dark-800 text-white border border-gray-700 rounded-lg px-3 py-2 hover:bg-dark-700 transition"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
            <span v-if="hasActiveFilters" class="ml-2 w-2 h-2 rounded-full bg-primary-500"></span>
          </button>
          
          <span class="text-gray-400 whitespace-nowrap">Sắp xếp:</span>
          <select 
            v-model="sortBy" 
            @change="fetchMovies()"
            class="bg-dark-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
          >
            <option value="latest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="nameAZ">Tên A-Z</option>
            <option value="nameZA">Tên Z-A</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="popularity">Phổ biến nhất</option>
          </select>
        </div>
      </div>

      <!-- Filter Modal/Offcanvas -->
      <div 
        v-if="showFilters" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-start justify-center pt-20 pb-6 px-4"
        @click.self="showFilters = false"
      >
        <div class="bg-dark-800 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fadeIn">
          <div class="p-4 bg-gradient-to-r from-primary-600/50 to-red-600/50 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-white">Bộ lọc phim {{ country.name }}</h2>
            <button @click="showFilters = false" class="text-white hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Thể loại -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Thể loại</label>
                <select 
                  v-model="filters.category" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả thể loại</option>
                  <option v-for="category in categories" :key="category.id" :value="category.slug">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Năm -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Năm phát hành</label>
                <select 
                  v-model="filters.year" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả các năm</option>
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>

              <!-- Đánh giá tối thiểu -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Đánh giá tối thiểu</label>
                <div class="flex items-center">
                  <input 
                    type="range" 
                    v-model="filters.minRating" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  >
                  <span class="ml-2 text-white">{{ filters.minRating }}</span>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3 mt-6">
              <button @click="applyFiltersAndClose()" class="btn-primary py-2 px-4">
                Áp dụng
              </button>
              <button @click="resetFiltersAndClose()" class="btn-outline py-2 px-4">
                Đặt lại
              </button>
              <button @click="showFilters = false" class="text-gray-400 hover:text-white ml-auto">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Movies grid -->
      <div v-if="movies.length > 0" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-8">
        <div v-for="movie in movies" :key="movie.id" class="movie-card group">
          <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
            <img 
              :src="movie.poster" 
              :alt="movie.title" 
              @error="e => e.target.src = '/images/fallback-poster.jpg'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              @click="viewMovieDetails(movie.id)" 
            />
            <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span class="text-yellow-400 text-xs font-semibold">{{ movie.rating }}</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
              <div class="p-4 w-full">
                <button 
                  @click="viewMovieDetails(movie.id)" 
                  class="w-full py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <h3 class="text-white font-medium truncate cursor-pointer hover:text-primary-500" @click="viewMovieDetails(movie.id)">{{ movie.title }}</h3>
            <div class="flex items-center justify-between">
              <p class="text-gray-400 text-sm">{{ movie.year }}</p>
              <div class="text-xs text-gray-500">
                {{ movie.categories[0] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="bg-dark-800 border border-gray-700 rounded-xl p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-400 mb-2">Không tìm thấy phim nào</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">Không có phim nào phù hợp với các bộ lọc bạn đã chọn. Vui lòng thử điều chỉnh bộ lọc.</p>
        <button @click="resetFilters()" class="btn-primary px-4 py-2">
          Đặt lại bộ lọc
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="movies.length > 0" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="['px-3 py-2 rounded-lg', 
              currentPage === 1 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-300 hover:bg-dark-700 hover:text-white']"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            v-for="page in pageArray"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-4 py-2 rounded-lg', 
              page === currentPage 
                ? 'bg-primary-600 text-white' 
                : page === '...' 
                  ? 'text-gray-500 cursor-default' 
                  : 'text-gray-300 hover:bg-dark-700 hover:text-white'
            ]"
          >
            {{ page }}
          </button>
          
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="['px-3 py-2 rounded-lg', 
              currentPage === totalPages 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-300 hover:bg-dark-700 hover:text-white']"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Tham số từ URL
const countrySlug = computed(() => route.params.slug)

// State variables
const country = ref({
  name: '',
  slug: '',
  flag: ''
})
const movies = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalMovies = ref(0)
const moviesPerPage = 12
const showFilters = ref(false)

// Sort and filter options
const sortBy = ref('latest')
const filters = ref({
  category: '',
  year: '',
  minRating: 0
})

// Computed property to check if any filter is active
const hasActiveFilters = computed(() => {
  return filters.value.category !== '' || 
         filters.value.year !== '' || 
         filters.value.minRating > 0
})

// Data sources
const categories = [
  { id: 1, name: 'Hành động', slug: 'hanh-dong' },
  { id: 2, name: 'Tâm lý', slug: 'tam-ly' },
  { id: 3, name: 'Kinh dị', slug: 'kinh-di' },
  { id: 4, name: 'Hài', slug: 'hai' },
  { id: 5, name: 'Phiêu lưu', slug: 'phieu-luu' },
  { id: 6, name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong' },
  { id: 7, name: 'Hoạt hình', slug: 'hoat-hinh' }
]

const countries = [
  { id: 'us', name: 'Mỹ', slug: 'us', flag: 'https://flagcdn.com/w80/us.png' },
  { id: 'kr', name: 'Hàn Quốc', slug: 'kr', flag: 'https://flagcdn.com/w80/kr.png' },
  { id: 'jp', name: 'Nhật Bản', slug: 'jp', flag: 'https://flagcdn.com/w80/jp.png' },
  { id: 'vn', name: 'Việt Nam', slug: 'vn', flag: 'https://flagcdn.com/w80/vn.png' },
  { id: 'cn', name: 'Trung Quốc', slug: 'cn', flag: 'https://flagcdn.com/w80/cn.png' },
  { id: 'tw', name: 'Đài Loan', slug: 'tw', flag: 'https://flagcdn.com/w80/tw.png' },
  { id: 'th', name: 'Thái Lan', slug: 'th', flag: 'https://flagcdn.com/w80/th.png' },
  { id: 'uk', name: 'Anh', slug: 'uk', flag: 'https://flagcdn.com/w80/gb.png' }
]

const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]

// Tính toán các trang hiển thị trong phân trang
const pageArray = computed(() => {
  const result = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 || 
      i === totalPages.value || 
      (i >= currentPage.value - 1 && i <= currentPage.value + 1)
    ) {
      result.push(i)
    } else if (i === currentPage.value - 2 || i === currentPage.value + 2) {
      result.push('...')
    }
  }
  return result
})

// Lấy thông tin quốc gia từ slug
function getCountryInfo() {
  const foundCountry = countries.find(c => c.slug === countrySlug.value)
  if (foundCountry) {
    country.value = foundCountry
    document.title = `Phim ${foundCountry.name} - Tên website của bạn`
  } else {
    // Nếu không tìm thấy quốc gia, chuyển về trang chủ
    router.replace('/')
  }
}

// Lấy danh sách phim theo quốc gia
function fetchMovies() {
  // Trong thực tế, bạn sẽ gọi API ở đây với các tham số:
  // - countrySlug: Quốc gia
  // - page: Trang hiện tại
  // - sortBy: Cách sắp xếp
  // - filters: Các bộ lọc
  
  // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
  const allMovies = [
    { id: 1, title: 'Avengers: Endgame', poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', year: 2019, rating: 8.4, categories: ['Hành động', 'Phiêu lưu'], country: 'us' },
    { id: 2, title: 'The Batman', poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', year: 2022, rating: 7.8, categories: ['Hành động', 'Phiêu lưu'], country: 'us' },
    { id: 3, title: 'Parasite', poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', year: 2019, rating: 8.5, categories: ['Tâm lý', 'Hài'], country: 'kr' },
    { id: 4, title: 'Squid Game', poster: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', year: 2021, rating: 7.8, categories: ['Hành động', 'Tâm lý'], country: 'kr' },
    { id: 5, title: 'Your Name', poster: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg', year: 2016, rating: 8.4, categories: ['Hoạt hình', 'Tâm lý'], country: 'jp' },
    { id: 6, title: 'Drive My Car', poster: 'https://image.tmdb.org/t/p/w500/7plCxXjMQKNHU71bjzcPS4xFt8H.jpg', year: 2021, rating: 7.6, categories: ['Tâm lý'], country: 'jp' },
    { id: 7, title: 'Bố Già', poster: 'https://image.tmdb.org/t/p/w500/1ULvY1hIx7xDmZ5YzYOIwLAoUxV.jpg', year: 2021, rating: 8.0, categories: ['Hài', 'Tâm lý'], country: 'vn' },
    { id: 8, title: 'The Farewell', poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', year: 2019, rating: 7.6, categories: ['Tâm lý', 'Hài'], country: 'cn' },
    { id: 9, title: 'Crouching Tiger, Hidden Dragon', poster: 'https://image.tmdb.org/t/p/w500/7JUEzlCGiXCDMEgLcmcKXBEzSKL.jpg', year: 2000, rating: 7.9, categories: ['Hành động', 'Phiêu lưu'], country: 'cn' },
    { id: 10, title: 'Bad Genius', poster: 'https://image.tmdb.org/t/p/w500/mWuFbQrXyLk8kSRieDBP2mLGiwd.jpg', year: 2017, rating: 7.6, categories: ['Tâm lý', 'Tội phạm'], country: 'th' },
    { id: 11, title: '1917', poster: 'https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg', year: 2019, rating: 8.3, categories: ['Chiến tranh', 'Hành động'], country: 'uk' },
    { id: 12, title: 'The King\'s Speech', poster: 'https://image.tmdb.org/t/p/w500/i6uCF71JkxVXQVSNb6sQ6ARLU3m.jpg', year: 2010, rating: 7.9, categories: ['Tâm lý', 'Lịch sử'], country: 'uk' }
  ]
  
  // Lọc phim theo quốc gia và các bộ lọc khác
  let filteredMovies = allMovies.filter(movie => movie.country === country.value.slug)
  
  // Áp dụng các bộ lọc
  if (filters.value.category) {
    filteredMovies = filteredMovies.filter(movie => 
      movie.categories.some(cat => 
        categories.find(c => c.slug === filters.value.category)?.name === cat
      )
    )
  }
  
  if (filters.value.year) {
    filteredMovies = filteredMovies.filter(movie => movie.year === parseInt(filters.value.year))
  }
  
  if (filters.value.minRating > 0) {
    filteredMovies = filteredMovies.filter(movie => movie.rating >= filters.value.minRating)
  }
  
  // Sắp xếp phim
  switch(sortBy.value) {
    case 'latest':
      filteredMovies.sort((a, b) => b.year - a.year)
      break
    case 'oldest':
      filteredMovies.sort((a, b) => a.year - b.year)
      break
    case 'nameAZ':
      filteredMovies.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'nameZA':
      filteredMovies.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'rating':
      filteredMovies.sort((a, b) => b.rating - a.rating)
      break
    case 'popularity':
      // Trong thực tế, sẽ có trường popularity riêng
      filteredMovies.sort((a, b) => b.rating - a.rating)
      break
  }
  
  // Cập nhật state
  movies.value = filteredMovies
  totalMovies.value = filteredMovies.length
  totalPages.value = Math.max(1, Math.ceil(totalMovies.value / moviesPerPage))
  
  // Đảm bảo currentPage nằm trong phạm vi hợp lệ
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
}

// Xử lý khi đổi trang
function goToPage(page) {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchMovies()
  // Cuộn lên đầu trang
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Xem chi tiết phim
function viewMovieDetails(movieId) {
  router.push({ name: 'movie-detail', params: { id: movieId } })
}

// Áp dụng bộ lọc
function applyFilters() {
  currentPage.value = 1
  fetchMovies()
}

// Reset bộ lọc
function resetFilters() {
  filters.value = {
    category: '',
    year: '',
    minRating: 0
  }
  applyFilters()
}

// Áp dụng bộ lọc và đóng modal
function applyFiltersAndClose() {
  applyFilters()
  showFilters.value = false
}

// Reset bộ lọc và đóng modal
function resetFiltersAndClose() {
  resetFilters()
  showFilters.value = false
}

// Theo dõi thay đổi của route.params.slug
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    getCountryInfo()
    fetchMovies()
  }
}, { immediate: true })

onMounted(() => {
  getCountryInfo()
  fetchMovies()
})
</script>

<style scoped>
/* Styling cho select element */
select {
  background-color: #1f2937 !important; /* bg-dark-700 */
  color: white !important;
  appearance: none; /* Loại bỏ mũi tên mặc định */
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Các tùy chọn trong dropdown */
select option {
  background-color: #1f2937 !important;
  color: white !important;
}

/* Styling cho slider */
input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 5px;
  background: #4f46e5;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/* Animation cho modal */
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>