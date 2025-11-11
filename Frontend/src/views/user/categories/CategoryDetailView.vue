<template>
  <div class="bg-dark-900 min-h-screen pb-16">
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
            @change="applySorting()"
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
              @click="viewMovieDetails(movie)" 
            />
            <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span class="text-yellow-400 text-xs font-semibold">{{ movie.ratingDisplay }}</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
              <div class="p-4 w-full">
                <button 
                  @click="viewMovieDetails(movie)" 
                  class="w-full py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <h1 class="text-white text-xl font-medium truncate cursor-pointer hover:text-primary-500" @click="viewMovieDetails(movie)">{{ movie.title }}</h1>
            <div class="flex items-center justify-between">
              <p class="text-gray-400 text-sm">{{ movie.year }}</p>
              <div class="text-xs text-gray-500">
                {{ movie.categoryLabel }}
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
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

// Tham số từ URL
const categorySlug = computed(() => route.params.slug)

// State
const categoryName = ref('')
const categoryId = ref(null)

// Trạng thái sắp xếp
const sortBy = ref('createdAt')

// Phân trang
const currentPage = ref(1)
const totalPages = ref(1)
const moviesPerPage = 12
const totalMovies = ref(0)

// Danh sách phim theo thể loại
const movies = ref([])

const loading = ref(false)
 
// helper to normalize media urls
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

const pageArray = computed(() => {
  const result = []
  const total = totalPages.value || 1
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= currentPage.value - 1 && i <= currentPage.value + 1)) {
      result.push(i)
    } else if (i === currentPage.value - 2 || i === currentPage.value + 2) {
      result.push('...')
    }
  }
  return result
})

// Fetch category by slug from backend
const fetchCategory = async (slug) => {
  try {
    const res = await api.get(`/categories/slug/${encodeURIComponent(slug)}`)
    const c = res?.data?.data
    if (!c) throw new Error('Category not found')
    categoryName.value = c.name
    categoryId.value = c._id || c.id
    document.title = `Phim ${categoryName.value}`
    return true
  } catch (err) {
    console.error('fetchCategory failed', err)
    // redirect back to categories list if not found
    router.replace('/categories')
    return false
  }
}

// thêm hàm map sort và applySorting
const mapSortOption = (opt) => {
  switch (opt) {
    case 'latest': return '-createdAt'
    case 'oldest': return 'createdAt'
    case 'nameAZ': return 'title'
    case 'nameZA': return '-title'
    case 'rating': return '-rating.average' // hoặc '-rating' tùy backend
    case 'popularity': return '-viewCount'
    default: return '-createdAt'
  }
}

const applySorting = () => {
  currentPage.value = 1
  fetchMovies(1)
}

// Fetch movies by category id
const fetchMovies = async (page = 1) => {
  if (!categoryId.value) return
  loading.value = true
  try {
    const params = {
      page,
      limit: moviesPerPage,
      category: categoryId.value,
      sortBy: mapSortOption(sortBy.value)
    }
    const res = await api.get('/movies', { params })
    const data = res?.data || {}
    const list = data?.data || []
    movies.value = list.map(m => {
      // normalize rating: backend may provide { average, count } or plain number
      let ratingDisplay = ''
      if (m.rating && typeof m.rating === 'object') {
        ratingDisplay = (m.rating.average != null) ? Number(m.rating.average).toFixed(1) : ''
      } else if (m.rating != null) {
        ratingDisplay = String(m.rating)
      }

      // normalize categories: could be array of names or array of objects
      let catLabel = ''
      if (Array.isArray(m.categories) && m.categories.length) {
        const first = m.categories[0]
        catLabel = (typeof first === 'object') ? (first.name || first.title || '') : first
      }

      return {
        ...m,
        poster: getMediaUrl(m.poster),
        id: m._id || m.id,
        ratingDisplay,
        categoryLabel: catLabel
      }
    })
    totalMovies.value = data?.pagination?.totalItems ?? 0
    totalPages.value = data?.pagination?.totalPages ?? Math.max(1, Math.ceil((totalMovies.value || 0) / moviesPerPage))
  } catch (err) {
    console.error('fetchMovies failed', err)
    movies.value = []
    totalMovies.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// Xử lý khi đổi trang
function goToPage(page) {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchMovies(page)
}

// Xem chi tiết phim — chấp nhận object hoặc id string
function viewMovieDetails(itemOrId) {
  if (!itemOrId) return
  let id = itemOrId
  let type = null
  if (typeof itemOrId === 'object' && itemOrId !== null) {
    id = itemOrId._id || itemOrId.id
    type = itemOrId.type || itemOrId.contentType || (itemOrId.totalEpisodes ? 'series' : 'movie')
  }
  if (!id) { console.error('Missing id for viewMovieDetails', itemOrId); return }
  const t = String(type || '').toLowerCase()
  const routeName = (t === 'series' || t === 'tv') ? 'series-detail' : 'movie-detail'
  const slug = (typeof itemOrId === 'object') ? (itemOrId.slug || id) : id
  router.push({ name: routeName, params: { slug } })
}

// Khi component được tạo / slug thay đổi
const loadCategoryAndMovies = async () => {
  const slug = categorySlug.value
  if (!slug) return router.replace('/categories')
  const ok = await fetchCategory(slug)
  if (ok) await fetchMovies(currentPage.value)
}

onMounted(loadCategoryAndMovies)

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    currentPage.value = 1
    await loadCategoryAndMovies()
  }
})
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