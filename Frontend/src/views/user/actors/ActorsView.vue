<template>
  <div class="bg-dark-900 min-h-screen pb-16">
    <!-- Hero/Banner Section -->
    <div class="relative bg-gradient-to-b from-dark-800 to-dark-900 py-12 mb-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold text-white mb-2">Diễn viên</h1>
          <p class="text-gray-300 text-lg">Khám phá các ngôi sao điện ảnh từ khắp nơi trên thế giới, từ những tài năng mới nổi đến các huyền thoại màn bạc với thông tin chi tiết và phim tiêu biểu.</p>
        </div>
      </div>
      <!-- Decorative element -->
      <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none">
        <svg width="400" height="150" viewBox="0 0 400 150" fill="none">
          <circle cx="300" cy="75" r="50" stroke="white" stroke-width="1" fill="none"/>
          <circle cx="300" cy="75" r="35" stroke="white" stroke-width="1" fill="none"/>
          <path d="M250,75 L350,75" stroke="white" stroke-width="1"/>
          <path d="M300,25 L300,125" stroke="white" stroke-width="1"/>
        </svg>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- Search and filters -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div class="relative lg:max-w-md w-full">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm diễn viên..."
            class="w-full bg-dark-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            @input="handleSearch"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Filters -->
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
          
          <!-- Sort dropdown -->
          <span class="text-gray-400 whitespace-nowrap">Sắp xếp:</span>
          <select 
            v-model="sortBy" 
            @change="applySorting"
            class="bg-dark-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="nameAZ">Tên A-Z</option>
            <option value="nameZA">Tên Z-A</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      <!-- Filter Modal -->
      <div 
        v-if="showFilters" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-start justify-center pt-20 pb-6 px-4"
        @click.self="showFilters = false"
      >
        <div class="bg-dark-800 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fadeIn">
          <div class="p-4 bg-gradient-to-r from-primary-600/50 to-red-600/50 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-white">Lọc diễn viên</h2>
            <button @click="showFilters = false" class="text-white hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Quốc gia -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Quốc tịch</label>
                <select 
                  v-model="filters.nationality" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả quốc tịch</option>
                  <option v-for="nationality in nationalities" :key="nationality._id || nationality.id" :value="nationality._id || nationality.id">
                    {{ nationality.name }}
                  </option>
                </select>
              </div>

              <!-- Thể loại -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Thể loại phim</label>
                <select 
                  v-model="filters.genre" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả thể loại</option>
                  <option v-for="genre in genres" :key="genre._id || genre.id" :value="genre._id || genre.id">
                    {{ genre.name }}
                  </option>
                </select>
              </div>

              <!-- Độ tuổi -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Độ tuổi</label>
                <select 
                  v-model="filters.ageRange" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả độ tuổi</option>
                  <option value="under30">Dưới 30</option>
                  <option value="30to50">Từ 30-50</option>
                  <option value="over50">Trên 50</option>
                </select>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3 mt-6">
              <button @click="applyFiltersAndClose" class="btn-primary py-2 px-4">
                Áp dụng
              </button>
              <button @click="resetFiltersAndClose" class="btn-outline py-2 px-4">
                Đặt lại
              </button>
              <button @click="showFilters = false" class="text-gray-400 hover:text-white ml-auto">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results count -->
      <div class="text-gray-300 mb-6">
        <span>Hiển thị <span class="text-white font-medium">{{ (currentPage - 1) * actorsPerPage + 1 }}-{{ Math.min(currentPage * actorsPerPage, totalActors) }}</span> 
        trên <span class="text-white font-medium">{{ totalActors }}</span> diễn viên</span>
      </div>

      <!-- Actors grid -->
      <div v-if="actors.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-8">
        <div 
          v-for="actor in actors" 
          :key="actor.id" 
          class="group cursor-pointer"
          @click="viewActorDetails(actor)"
        >
          <div class="relative overflow-hidden rounded-xl aspect-[3/4] bg-dark-800">
            <img 
              :src="actor.photo" 
              :alt="actor.name" 
              class="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
            />
            
            <!-- Nationality badge -->
            <div class="absolute top-2 right-2">
              <span class="px-2 py-1 text-xs font-medium rounded-lg bg-black/70 backdrop-blur-sm text-white">
                {{ actor.nationality }}
              </span>
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
              <div class="p-4 w-full">
                <button class="w-full py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm transition">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <h3 class="text-white font-medium group-hover:text-primary-500 transition">{{ actor.name }}</h3>
            <p class="text-gray-400 text-sm truncate">{{ actor.knownFor }}</p>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="bg-dark-800 border border-gray-700 rounded-xl p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-400 mb-2">Không tìm thấy diễn viên nào</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">Không có diễn viên nào phù hợp với tìm kiếm hoặc bộ lọc của bạn. Vui lòng thử lại với từ khóa khác.</p>
        <button @click="resetSearch" class="btn-primary px-4 py-2">
          Xóa bộ lọc
        </button>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
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
import { useRouter } from 'vue-router'
import api from '@/services/api' // axios instance

const router = useRouter()
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  

  const apiBase = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:3000/api'
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  
  return `${baseUrl}${u.startsWith('/') ? u : '/' + u}`
}


const hasActiveFilters = computed(() => {
  return ! !(
    filters.value.nationality ||
    filters.value.ageRange ||
    filters.value. genre
  )
})

// UI state
const searchQuery = ref('')
let _searchTimeout = null

const filters = ref({
  nationality: '',
  ageRange: '',
  genre: ''
})

// removed gender filter from model

const sortBy = ref('popular')
const showFilters = ref(false)

// server-side paging
const currentPage = ref(1)
const totalPages = ref(1)
// rename to actorsPerPage to match template usage and avoid NaN
const actorsPerPage = ref(20)
const totalActors = ref(0)

const actors = ref([])

// lookup lists from backend
const nationalities = ref([])
const genres = ref([])

// helper: build query params for list endpoint
const buildParams = () => {
  const params = {
    page: currentPage.value,
    limit: actorsPerPage.value
  }
  if (searchQuery.value?.trim()) params.search = searchQuery.value.trim()

  // send both id and slug/alias variants (increase chance backend will accept one)
  if (filters.value.nationality) {
    params.nationality = filters.value.nationality       // slug or id
    params.nationalityId = filters.value.nationality     // id fallback
  }
  if (filters.value.genre) {
    params.genre = filters.value.genre
    params.genreId = filters.value.genre
  }
  if (filters.value.ageRange) params.ageRange = filters.value.ageRange

  // send both names for sort as some backends expect 'sort', others 'sortBy'
  const mapped = mapSortOption(sortBy.value)
  params.sort = mapped
  params.sortBy = mapped
  return params
}

const mapSortOption = (opt) => {
  switch (opt) {
    case 'popular': return '-popularity'    // adjust if backend expects different field
    case 'nameAZ': return 'name'
    case 'nameZA': return '-name'
    case 'newest': return '-createdAt'
    default: return '-createdAt'
  }
}

const normalizeActor = (a) => {
  return {
    ... a,
    id: a._id || a.id,
    photo: getMediaUrl(a.photoUrl || a.photo || ''),  
    knownFor: (a.knownFor && Array.isArray(a.knownFor) ? a.knownFor.slice(0,2).map(x => x.title || x.name).join(', ') : (a.knownFor || ''))
  }
}

const fetchNationalities = async () => {
  try {
    const res = await api.get('/countries')
    nationalities.value = (res?.data?.data || res?.data || [])
  } catch (e) {
    console.warn('fetchNationalities failed', e)
    nationalities.value = []
  }
}

const fetchGenres = async () => {
  try {
    const res = await api.get('/categories')
    genres.value = (res?.data?.data || res?.data || [])
  } catch (e) {
    console.warn('fetchGenres failed', e)
    genres.value = []
  }
}

const fetchActors = async () => {
  try {
    const params = buildParams()
    const res = await api.get('/actors', { params })
    const body = res?.data || {}
    const arr = body.data || []
    actors.value = (arr || []).map(normalizeActor)
    const pg = body.pagination || {}
    totalActors.value = Number(pg.totalItems ?? actors.value.length)
    totalPages.value = Number(pg.totalPages ?? Math.max(1, Math.ceil(totalActors.value / actorsPerPage.value)))
    currentPage.value = Number(pg.page ?? currentPage.value)
  } catch (err) {
    console.error('fetchActors error', err)
    actors.value = []
    totalActors.value = 0
    totalPages.value = 1
    currentPage.value = 1
  }
}
 
// pagination controls
function goToPage(page) {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchActors()
}
 
// pageArray computed for pagination buttons
const pageArray = computed(() => {
  const result = []
  const total = Number(totalPages.value) || 1
  const current = Number(currentPage.value) || 1
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      result.push(i)
    } else if (i === current - 2 || i === current + 2) {
      result.push('...')
    }
  }
  // remove duplicate '...' entries
  return result.filter((v, idx, arr) => !(v === '...' && arr[idx - 1] === '...'))
})
 
// helper used by template's "Xóa bộ lọc" button
function resetSearch() {
  searchQuery.value = ''
  resetFilters()
}
 
// debounced search handler
function handleSearch() {
  if (_searchTimeout) clearTimeout(_searchTimeout)
  _searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchActors()
  }, 350)
}

// apply filters (server-side)
function applyFilters() {
  currentPage.value = 1
  fetchActors()
}

function resetFilters() {
  filters.value = { nationality: '', ageRange: '', genre: '' }
  currentPage.value = 1
  fetchActors()
}

function applyFiltersAndClose() {
  applyFilters()
  showFilters.value = false
}

function resetFiltersAndClose() {
  resetFilters()
  showFilters.value = false
}

function applySorting() {
  currentPage.value = 1
  fetchActors()
}

function slugify(s = '') {
  return String(s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function viewActorDetails(actorOrId) {
  if (!actorOrId) return
  const slug = (typeof actorOrId === 'string')
    ? actorOrId
    : (actorOrId.slug || actorOrId._id || actorOrId.id || slugify(actorOrId.name || ''))
  if (!slug) return
  router.push({ name: 'actor-detail', params: { slug } })
}

onMounted(async () => {
  await Promise.all([fetchNationalities(), fetchGenres()])
  fetchActors()
})

// react to immediate nationality change
watch(() => filters.value.nationality, () => {
  currentPage.value = 1
  fetchActors()
})
</script>

<style scoped>
/* Tùy chỉnh select */
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

/* Animation cho modal */
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>