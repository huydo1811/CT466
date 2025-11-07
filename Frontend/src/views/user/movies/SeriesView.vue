<template>
  <div class="bg-dark-900 min-h-screen pb-16">
    <!-- Hero/Banner Section -->
    <div class="relative bg-gradient-to-b from-dark-800 to-dark-900 py-12 mb-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold text-white mb-2">Phim bộ</h1>
          <p class="text-gray-300 text-lg">Khám phá bộ sưu tập phim bộ đa dạng từ khắp nơi trên thế giới. Theo dõi các series phim hot nhất và đắm chìm trong những câu chuyện hấp dẫn.</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- Sort and results info -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div class="text-gray-300">
          Hiển thị <span class="text-white font-medium">{{ (currentPage - 1) * seriesPerPage + 1 }}-{{ Math.min(currentPage * seriesPerPage, totalSeries) }}</span> 
          trên <span class="text-white font-medium">{{ totalSeries }}</span> phim
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            @click="showFilters = !showFilters" 
            class="text-sm sm:text-base px-2 py-1 sm:px-3 sm:py-2 flex items-center bg-dark-800 text-white border border-gray-700 rounded-lg hover:bg-dark-700 transition"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
            <span v-if="hasActiveFilters" class="ml-2 w-2 h-2 rounded-full bg-primary-500"></span>
          </button>
          
          <span class="text-gray-400 whitespace-nowrap">Sắp xếp:</span>
          <select 
            v-model="sortBy" 
            @change="applySorting"
            class="text-sm sm:text-base px-2 py-1 sm:px-3 sm:py-2 bg-dark-800 text-white border border-gray-700 rounded-lg focus:ring-1 focus:ring-primary-500"
          >
            <option value="createdAt">Mới nhất</option>
            <option value="releaseDate">Ngày phát hành</option>
            <option value="title">Tên A-Z</option>
            <option value="-rating.average">Đánh giá cao nhất</option>
            <option value="-viewCount">Phổ biến nhất</option>
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
            <h2 class="text-lg font-semibold text-white">Bộ lọc phim</h2>
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
                  <option v-for="category in categories" :key="category._id || category.id" :value="category._id || category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Quốc gia -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Quốc gia</label>
                <select 
                  v-model="filters.country" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả quốc gia</option>
                  <option v-for="country in countries" :key="country._id || country.id" :value="country._id || country.id">
                    {{ country.name }}
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
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3 mt-6">
              <button @click="applyFiltersAndClose" class="btn-primary py-2 px-4">Áp dụng</button>
              <button @click="resetFiltersAndClose" class="btn-outline py-2 px-4">Đặt lại</button>
              <button @click="showFilters = false" class="text-gray-400 hover:text-white ml-auto">Hủy</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Series grid -->
      <div v-if="!loading && series.length > 0" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 mb-8">
        <div v-for="item in series" :key="item._id || item.id" class="movie-card group">
          <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
            <img 
              :src="item.poster" 
              :alt="item.title" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              @click="viewSeriesDetails(item._id || item.id)"
            />
            <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span class="text-yellow-400 text-xs font-semibold">{{ item.rating?.average ?? item.rating }}</span>
            </div>
            
            <div class="absolute top-2 left-2">
              <span 
                :class="[ 'px-2 py-1 text-xs font-medium rounded-lg backdrop-blur-sm',
                  item.status === 'Đã hoàn thành' ? 'bg-green-500/70 text-white' : 
                  item.status === 'Đang cập nhật' ? 'bg-blue-500/70 text-white' : 'bg-orange-500/70 text-white' ]"
              >
                {{ item.status || (item.isPublished ? 'Đang cập nhật' : 'Đã ẩn') }}
              </span>
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
              <div class="p-4 w-full">
                <button 
                  @click="viewSeriesDetails(item._id || item.id)" 
                  class="w-full py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <h1 class="text-white text-xl font-medium truncate cursor-pointer hover:text-primary-500" @click="viewSeriesDetails(item._id || item.id)">{{ item.title }}</h1>
            <div class="flex items-center justify-between">
              <p class="text-gray-400 text-sm">{{ item.year }}</p>
              <div class="text-xs text-gray-500">
                {{ item.totalEpisodes || item.episodes || 0 }} tập
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-12 text-gray-400">Đang tải...</div>

      <div v-else-if="!loading && series.length === 0" class="bg-dark-800 border border-gray-700 rounded-xl p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-400 mb-2">Không tìm thấy phim nào</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">Không có phim nào phù hợp với các bộ lọc bạn đã chọn. Vui lòng thử điều chỉnh bộ lọc.</p>
        <button @click="resetFilters" class="btn-primary px-4 py-2">Đặt lại bộ lọc</button>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" :class="['px-3 py-2 rounded-lg', currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-dark-700 hover:text-white']">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button v-for="page in pageArray" :key="page" @click="goToPage(page)" :class="['px-4 py-2 rounded-lg', page === currentPage ? 'bg-primary-600 text-white' : (page === '...' ? 'text-gray-500 cursor-default' : 'text-gray-300 hover:bg-dark-700 hover:text-white')]">
            {{ page }}
          </button>
          
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" :class="['px-3 py-2 rounded-lg', currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-dark-700 hover:text-white']">
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
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

// Filters and sorting state
const filters = ref({ category: '', country: '', year: '' })
const sortBy = ref('createdAt')
const showFilters = ref(false)
const hasActiveFilters = computed(() => {
  return !!(filters.value.category || filters.value.country || filters.value.year)
})

// pagination
const currentPage = ref(1)
const seriesPerPage = ref(12)
const totalPages = ref(1)
const totalSeries = ref(0)
const loading = ref(false)

// data holders
const series = ref([])
const categories = ref([])
const countries = ref([])
const years = ref([])

// helper to normalize media urls
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories')
    categories.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.warn('fetch categories failed', e)
    categories.value = []
  }
}

const fetchCountries = async () => {
  try {
    const res = await api.get('/countries')
    countries.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.warn('fetch countries failed', e)
    countries.value = []
  }
}

const fetchSeries = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: seriesPerPage.value,
      type: 'series',
      sortBy: sortBy.value
    }
    if (filters.value.category) params.category = filters.value.category
    if (filters.value.country) params.country = filters.value.country
    if (filters.value.year) params.year = filters.value.year

    const res = await api.get('/movies', { params })
    const data = res?.data || {}
    series.value = (data?.data || []).map(m => ({
      ...m,
      poster: getMediaUrl(m.poster),
      _id: m._id || m.id
    }))
    totalSeries.value = data?.pagination?.totalItems ?? data?.pagination?.totalItems ?? (data?.pagination?.totalItems ?? 0)
    totalPages.value = data?.pagination?.totalPages ?? Math.max(1, Math.ceil((totalSeries.value || 0) / seriesPerPage.value))
  } catch (err) {
    console.error('fetchSeries failed', err)
    series.value = []
    totalSeries.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchSeries()
}

const resetFilters = () => {
  filters.value = { category: '', country: '', year: '' }
  applyFilters()
}

const applyFiltersAndClose = () => { applyFilters(); showFilters.value = false }
const resetFiltersAndClose = () => { resetFilters(); showFilters.value = false }

const applySorting = () => { currentPage.value = 1; fetchSeries() }

const goToPage = (page) => {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchSeries()
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

const viewSeriesDetails = (id) => router.push({ name: 'series-detail', params: { id } })

onMounted(async () => {
  // build years list
  const now = new Date().getFullYear()
  for (let y = now; y >= 1950; y--) years.value.push(y)

  await Promise.all([fetchCategories(), fetchCountries()])
  await fetchSeries()
})

// don't auto fetch on every filter model change — user must click Áp dụng
watch([() => filters.value.category, () => filters.value.country, () => filters.value.year], () => {
  // no-op
})
</script>

<style scoped>
select {
  background-color: #1f2937 !important;
  color: white !important;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
select option { background-color: #1f2937 !important; color: white !important; }
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
</style>