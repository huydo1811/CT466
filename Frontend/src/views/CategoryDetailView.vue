<template>
  <div class="bg-dark-900 min-h-screen pt-20 pb-16">
    <!-- Hero/Banner Section -->
    <div class="relative bg-gradient-to-b from-dark-800 to-dark-900 py-12 mb-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold text-white mb-2">
            Phim {{ categoryName }}
          </h1>
          <p class="text-gray-300 text-lg">
            Tất cả phim {{ categoryName.toLowerCase() }} hay nhất. Thưởng thức những tác phẩm đặc sắc nhất của thể loại này.
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
        <RouterLink to="/categories" class="hover:text-white">Thể loại</RouterLink>
        <svg class="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="text-white">{{ categoryName }}</span>
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

      <!-- Movies grid -->
      <div v-if="movies.length > 0" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 mb-8">
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
        <p class="text-gray-500 max-w-md mx-auto mb-6">Hiện chưa có phim nào thuộc thể loại này. Vui lòng thử lại sau.</p>
        <RouterLink to="/movies" class="btn-primary px-4 py-2">
          Xem tất cả phim
        </RouterLink>
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
const categorySlug = computed(() => route.params.slug)

// Lấy thông tin thể loại từ slug
const categoryName = ref('')
const categoryId = ref(null)

// Trạng thái sắp xếp
const sortBy = ref('latest')

// Phân trang
const currentPage = ref(1)
const totalPages = ref(1)
const moviesPerPage = 12
const totalMovies = ref(0)

// Danh sách phim theo thể loại
const movies = ref([])

// Danh sách thể loại (để mapping từ slug -> name)
const categories = [
  { id: 1, name: 'Hành động', slug: 'hanh-dong' },
  { id: 2, name: 'Tâm lý', slug: 'tam-ly' },
  { id: 3, name: 'Kinh dị', slug: 'kinh-di' },
  { id: 4, name: 'Hài', slug: 'hai' },
  { id: 5, name: 'Phiêu lưu', slug: 'phieu-luu' },
  { id: 6, name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong' },
  { id: 7, name: 'Hoạt hình', slug: 'hoat-hinh' }
]

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

// Lấy thông tin thể loại từ slug
function getCategoryInfo() {
  const category = categories.find(cat => cat.slug === categorySlug.value)
  if (category) {
    categoryName.value = category.name
    categoryId.value = category.id
    document.title = `Phim ${category.name}`
  } else {
    // Xử lý khi không tìm thấy thể loại
    router.replace('/categories')
  }
}

// Lấy danh sách phim theo thể loại
function fetchMovies() {
  // Trong thực tế, bạn sẽ gọi API ở đây với các tham số:
  // - categoryId: ID thể loại
  // - page: Trang hiện tại
  // - sortBy: Cách sắp xếp
  
  // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
  const allMovies = [
    { id: 1, title: 'Avengers: Endgame', poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', year: 2019, rating: 8.4, categories: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng'] },
    { id: 2, title: 'The Batman', poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', year: 2022, rating: 7.8, categories: ['Hành động', 'Phiêu lưu', 'Tâm lý'] },
    { id: 3, title: 'Joker', poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', year: 2019, rating: 8.2, categories: ['Tâm lý', 'Tội phạm'] },
    { id: 4, title: 'Dune', poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', year: 2021, rating: 7.9, categories: ['Phiêu lưu', 'Khoa học viễn tưởng'] },
    { id: 5, title: 'Top Gun: Maverick', poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', year: 2022, rating: 8.3, categories: ['Hành động', 'Phiêu lưu'] },
    { id: 6, title: 'Spider-Man: No Way Home', poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', year: 2021, rating: 8.2, categories: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng'] },
    { id: 7, title: 'Everything Everywhere All at Once', poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', year: 2022, rating: 7.9, categories: ['Phiêu lưu', 'Khoa học viễn tưởng', 'Hài'] },
    { id: 8, title: 'John Wick: Chapter 4', poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', year: 2023, rating: 7.8, categories: ['Hành động', 'Tội phạm'] }
  ]
  
  // Lọc phim theo thể loại
  const filteredMovies = allMovies.filter(movie => 
    movie.categories.some(cat => 
      cat.toLowerCase() === categoryName.value.toLowerCase()
    )
  )
  
  // Cập nhật state
  movies.value = filteredMovies
  totalMovies.value = filteredMovies.length
  totalPages.value = Math.ceil(totalMovies.value / moviesPerPage)
}

// Xử lý khi đổi trang
function goToPage(page) {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchMovies()
}

// Xem chi tiết phim
function viewMovieDetails(movieId) {
  router.push({ name: 'movie-detail', params: { id: movieId } })
}

// Khi component được tạo
onMounted(() => {
  getCategoryInfo()
  fetchMovies()
})

// Theo dõi thay đổi của route.params.slug
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    // Khi slug thay đổi, cập nhật lại dữ liệu
    getCategoryInfo()
    fetchMovies()
  }
}, { immediate: true })
</script>

<style scoped>
/* Thêm vào phần <style scoped> */
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
</style>