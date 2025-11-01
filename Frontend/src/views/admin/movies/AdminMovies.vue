<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const loading = ref(false)

const page = ref(1)
const perPage = ref(8)

const movies = ref([]) // current page items from server
const pagination = ref({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: perPage.value })

const searchQuery = ref('')
// selected values will hold ids (or empty string)
const selectedCategory = ref('')
const selectedCountry = ref('')

/* new: lists from API */
const categories = ref([])
const countries = ref([])

let _searchTimeout = null

const fetchMovies = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: perPage.value,
      search: searchQuery.value?.trim() || undefined,
      // send ids for category/country if selected
      category: selectedCategory.value || undefined,
      country: selectedCountry.value || undefined,
    }
    const res = await api.get('/movies', { params })
    const body = res?.data || {}
    const arr = body.data || []

    // normalize each movie for template
    movies.value = (arr || []).map(m => {
      const id = m._id || m.id
      // categories -> readable string (if populated)
      let categoryStr = ''
      if (Array.isArray(m.categories) && m.categories.length) {
        categoryStr = m.categories.map(c => (c && (c.name || c._id || c.id))).filter(Boolean).join(', ')
      } else if (m.category) {
        categoryStr = (m.category.name || m.category)
      } else if (m.categories && typeof m.categories === 'string') {
        categoryStr = m.categories
      }

      // country -> name if populated
      const countryStr = m.country ? (m.country.name || m.country) : ''

      return {
        ...m,
        id,
        category: categoryStr,
        country: countryStr,
        views: m.viewCount ?? m.views ?? 0,
        status: m.isPublished ? 'Hoạt động' : 'Ẩn',
        createdAt: m.createdAt
      }
    })

    const p = body.pagination || {}
    pagination.value = {
      currentPage: p.currentPage ?? page.value,
      totalPages: p.totalPages ?? 1,
      totalItems: p.totalItems ?? (movies.value.length || 0),
      itemsPerPage: p.itemsPerPage ?? perPage.value
    }
    page.value = pagination.value.currentPage
  } catch (err) {
    console.error('fetchMovies error', err)
    movies.value = []
    pagination.value = { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: perPage.value }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // load initial lists and movies
  try {
    const [catRes, countryRes] = await Promise.all([
      api.get('/categories'),
      api.get('/countries')
    ])
    // normalize to { id, name }
    categories.value = (catRes?.data?.data || catRes?.data || []).map(c => ({ id: c._id || c.id, name: c.name }))
    countries.value = (countryRes?.data?.data || countryRes?.data || []).map(c => ({ id: c._id || c.id, name: c.name || c.title || c.code }))
  } catch (e) {
    console.warn('load filter lists failed', e)
  }
  await fetchMovies()
})

// debounce realtime search
watch(searchQuery, () => {
  clearTimeout(_searchTimeout)
  _searchTimeout = setTimeout(() => {
    page.value = 1
    fetchMovies()
  }, 350)
})

// react to filters immediately
watch([selectedCategory, selectedCountry], () => {
  page.value = 1
  fetchMovies()
})

// computed helpers used by template
const total = computed(() => pagination.value.totalItems ?? 0)
const pages = computed(() => Math.max(1, pagination.value.totalPages ?? 1))

const handleAddMovie = () => router.push('/admin/movies/add')
const handleEditMovie = (movie) => router.push(`/admin/movies/edit/${movie._id || movie.id}`)
const handleViewMovie = (movie) => router.push(`/admin/movies/${movie._id || movie.id}`)

const handleDeleteMovie = async (movie) => {
  if (!confirm(`Bạn có chắc muốn xóa phim "${movie.title}"?`)) return
  try {
    await api.delete(`/movies/${movie._id || movie.id}`)
    await fetchMovies()
  } catch (err) {
    console.error('delete movie error', err)
    alert(err?.response?.data?.message || 'Xóa thất bại')
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedCountry.value = ''
  page.value = 1
  fetchMovies()
}

const prev = () => {
  if (page.value > 1) { page.value = Math.max(1, page.value - 1); fetchMovies() }
}
const next = () => {
  if (page.value < pages.value) { page.value = Math.min(pages.value, page.value + 1); fetchMovies() }
}

const formatNumber = (num) => num?.toLocaleString('vi-VN') || '0'
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Quản lý phim điện ảnh</h1>
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

    <!-- Filters (dynamic categories/countries) -->
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
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Quốc gia</label>
          <select
            v-model="selectedCountry"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả</option>
            <option v-for="co in countries" :key="co.id" :value="co.id">{{ co.name }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="resetFilters"
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
                <div class="text-lg font-semibold text-white">{{ movie.title }}</div>
             </td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-slate-300">{{ movie.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-slate-300">{{ movie.country }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-slate-300">{{ formatNumber(movie.views) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="movie.status === 'Hoạt động' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'"
                  class="px-2 py-1 text-sm rounded-full"
                >
                  {{ movie.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <!-- nút xem chi tiết -->
                  <button
                    @click="handleViewMovie(movie)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Xem chi tiết"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button 
                    @click="handleEditMovie(movie)"
                    class="text-yellow-400 hover:text-yellow-300 transition-colors"
                    title="Sửa"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDeleteMovie(movie)"
                    class="text-red-400 hover:text-red-300 transition-colors"
                    title="Xóa"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
         <tfoot>
            <tr>
              <td colspan="8" class="px-6 py-3 bg-slate-900/40">
                <div class="flex items-center justify-between">
                  <div class="text-slate-400 text-sm">Tổng: {{ total }}</div>
                  <div class="flex items-center gap-2">
                    <button :disabled="page<=1" @click="prev" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Prev</button>
                    <div class="px-3 py-1 bg-slate-800 rounded text-slate-200">{{ page }} / {{ pages }}</div>
                    <button :disabled="page>=pages" @click="next" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
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