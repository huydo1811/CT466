<script setup>
import { RouterLink } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
const searchActive = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)


// Fake search results
watch(searchQuery, (query) => {
  if (query.length < 2) {
    showResults.value = false
    return
  }
  
  // Demo search results
  searchResults.value = [
    { id: 1, title: 'Spider-Man: No Way Home', poster: 'https://image.tmdb.org/t/p/w92/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', year: 2021 },
    { id: 2, title: 'Spider-Man: Homecoming', poster: 'https://image.tmdb.org/t/p/w92/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg', year: 2017 },
    { id: 3, title: 'The Amazing Spider-Man', poster: 'https://image.tmdb.org/t/p/w92/fSbqPbqXa7ePo8bcnZYN9AHv6zA.jpg', year: 2012 }
  ].filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()))
  
  showResults.value = true
})

// Handle form submission
function handleSearch(e) {
  e.preventDefault()
  if (searchQuery.value.trim()) {
    // Navigate to search page (implement actual search later)
    console.log(`Searching for: ${searchQuery.value}`)
    // router.push({ name: 'search', query: { q: searchQuery.value } })
    searchActive.value = false
    searchQuery.value = ''
    showResults.value = false
  }
}

// Thêm refs và listeners
const searchRef = ref(null)

// Close search results when clicking outside
function handleClickOutside(e) {
  if (searchRef.value && !searchRef.value.contains(e.target)) {
    showResults.value = false
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Data fake hiển thị ngay
const categories = ref([
  { id: 1, name: 'Hành động', slug: 'hanh-dong' },
  { id: 2, name: 'Tâm lý', slug: 'tam-ly' },
  { id: 3, name: 'Kinh dị', slug: 'kinh-di' },
  { id: 4, name: 'Hài', slug: 'hai' }
])

const countries = ref([
  { id: 'us', name: 'Mỹ', slug: 'us' },
  { id: 'kr', name: 'Hàn Quốc', slug: 'kr' },
  { id: 'jp', name: 'Nhật Bản', slug: 'jp' },
  { id: 'vn', name: 'Việt Nam', slug: 'vn' }
])
</script>

<template>
  <header class="fixed top-0 w-full z-50 bg-dark-900/95 backdrop-blur-md border-b border-gray-800/50">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center">
        <!-- Logo (left) -->
        <RouterLink to="/" class="flex items-center space-x-3 group flex-shrink-0 transform -translate-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
            <span class="text-white font-bold text-xl">C</span>
          </div>
          <div class="leading-tight hidden sm:block">
            <span class="text-2xl font-bold text-gradient">ChillFilm</span>
            <span class="text-gray-400 text-xs block">Xem phim cực chill</span>
          </div>
        </RouterLink>

        <!-- Desktop Nav (center) -->
        <div class="hidden lg:flex items-center mx-auto space-x-6 pl-2">
          <RouterLink to="/" exact-active-class="nav-link-active" class="nav-link">
            <span>Trang chủ</span><div class="nav-underline"></div>
          </RouterLink>

          <RouterLink to="/movies" active-class="nav-link-active" class="nav-link">
            <span>Phim điện ảnh</span><div class="nav-underline"></div>
          </RouterLink>

          <RouterLink to="/series" active-class="nav-link-active" class="nav-link">
            <span>Phim bộ</span><div class="nav-underline"></div>
          </RouterLink>

          <!-- Thể loại dropdown -->
          <div class="relative group">
            <button type="button" class="nav-link flex items-center">
              <span>Thể loại</span>
              <svg class="w-4 h-4 ml-1 text-gray-400 group-hover:text-white transition" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.107l3.71-3.877a.75.75 0 111.08 1.04l-4.24 4.43a.75.75 0 01-1.08 0l-4.24-4.43a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
              <div class="nav-underline"></div>
            </button>
            <!-- Panel -->
            <div class="absolute left-0 top-full w-56 rounded-xl border border-gray-800 bg-dark-900/95 backdrop-blur-md shadow-2xl opacity-0 scale-95 pointer-events-none transition duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto z-50">
              <ul class="py-2 max-h-80 overflow-y-auto">
                <li v-for="c in categories" :key="c.id">
                  <RouterLink :to="{ name: 'category', params: { slug: c.slug } }" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                    {{ c.name }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Quốc gia dropdown -->
          <div class="relative group">
            <button type="button" class="nav-link flex items-center">
              <span>Quốc gia</span>
              <svg class="w-4 h-4 ml-1 text-gray-400 group-hover:text-white transition" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.107l3.71-3.877a.75.75 0 111.08 1.04l-4.24 4.43a.75.75 0 01-1.08 0l-4.24-4.43a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
              <div class="nav-underline"></div>
            </button>
            <div class="absolute left-0 top-full w-56 rounded-xl border border-gray-800 bg-dark-900/95 backdrop-blur-md shadow-2xl opacity-0 scale-95 pointer-events-none transition duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto z-50">
              <ul class="py-2 max-h-80 overflow-y-auto">
                <li v-for="n in countries" :key="n.id">
                  <RouterLink :to="{ name: 'country', params: { slug: n.slug } }" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                    {{ n.name }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>

          <RouterLink to="/actors" active-class="nav-link-active" class="nav-link">
            <span>Diễn viên</span><div class="nav-underline"></div>
          </RouterLink>
        </div>

        <!-- Search & Actions (right) -->
        <div class="hidden lg:flex items-center space-x-3 ml-auto">
          <!-- Search Bar -->
          <div ref="searchRef" class="relative w-60">
            <div class="flex items-center">
              <input
                v-model="searchQuery"
                class="w-full bg-gray-800/70 text-white rounded-l-xl px-4 py-2 pl-9 outline-none focus:ring-1 focus:ring-primary-500 h-10"
                placeholder="Tìm kiếm..."
              />
              <button 
                @click="handleSearch"
                class="bg-primary-600 hover:bg-primary-700 text-white rounded-r-xl h-10 px-3 flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <!-- Search Results Dropdown -->
            <div 
              v-if="showResults && searchResults.length > 0" 
              class="absolute right-0 w-80 top-full mt-2 bg-dark-800/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              <div class="p-3 border-b border-gray-700 text-sm text-gray-400">
                Kết quả tìm kiếm
              </div>
              <ul>
                <li v-for="result in searchResults" :key="result.id" class="border-b border-gray-700/50 last:border-0">
                  <a href="#" class="flex items-center p-3 hover:bg-gray-700/30 transition">
                    <img :src="result.poster" :alt="result.title" class="w-10 h-15 object-cover rounded" />
                    <div class="ml-3">
                      <div class="text-white font-medium">{{ result.title }}</div>
                      <div class="text-xs text-gray-400">{{ result.year }}</div>
                    </div>
                  </a>
                </li>
              </ul>
              <div class="p-3 text-center border-t border-gray-700">
                <a href="#" class="text-sm text-primary-400 hover:text-primary-300">
                  Xem tất cả kết quả
                </a>
              </div>
            </div>
          </div>

          <RouterLink to="/login" class="btn-outline px-4 py-2 text-sm">Đăng nhập</RouterLink>
          <RouterLink to="/register" class="btn-primary px-4 py-2 text-sm">Đăng ký</RouterLink>
        </div>

        <!-- Rest of mobile stuff -->
        <!-- ...existing mobile code... -->
      </div>
      
      <!-- Mobile Search (full-width, under logo) -->
      <div class="lg:hidden mt-2">
        <div ref="searchRef" class="relative">
          <div class="flex items-center">
            <input
              v-model="searchQuery"
              class="w-full bg-gray-800/70 text-white rounded-l-xl px-4 py-2 pl-9 outline-none focus:ring-1 focus:ring-primary-500 h-10"
              placeholder="Tìm kiếm..."
            />
            <button 
              @click="handleSearch"
              class="bg-primary-600 hover:bg-primary-700 text-white rounded-r-xl h-10 px-3 flex items-center justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <!-- Mobile Search Results -->
          <div 
            v-if="showResults && searchResults.length > 0" 
            class="absolute left-0 right-0 top-full mt-2 bg-dark-800/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl z-50"
          >
            <div class="p-3 border-b border-gray-700 text-sm text-gray-400">
              Kết quả tìm kiếm
            </div>
            <ul>
              <li v-for="result in searchResults" :key="result.id" class="border-b border-gray-700/50 last:border-0">
                <a href="#" class="flex items-center p-3 hover:bg-gray-700/30 transition">
                  <img :src="result.poster" :alt="result.title" class="w-10 h-15 object-cover rounded" />
                  <div class="ml-3">
                    <div class="text-white font-medium">{{ result.title }}</div>
                    <div class="text-xs text-gray-400">{{ result.year }}</div>
                  </div>
                </a>
              </li>
            </ul>
            <div class="p-3 text-center border-t border-gray-700">
              <a href="#" class="text-sm text-primary-400 hover:text-primary-300">
                Xem tất cả kết quả
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-show="isMobile" class="lg:hidden mt-4 pb-4 border-t border-gray-800 animate-fade-in">
        <div class="flex flex-col space-y-2 pt-4">
          <RouterLink to="/" exact-active-class="nav-link-active" class="mobile-nav-link">Trang chủ</RouterLink>
          <RouterLink to="/movies" class="mobile-nav-link">Phim điện ảnh</RouterLink>
          <RouterLink to="/series" class="mobile-nav-link">Phim bộ</RouterLink>

          <div class="text-gray-400 px-4 mt-2 text-xs uppercase">Thể loại</div>
          <RouterLink v-for="c in categories" :key="c.id" :to="{ name: 'category', params: { slug: c.slug } }" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
            {{ c.name }}
          </RouterLink>

          <div class="text-gray-400 px-4 mt-3 text-xs uppercase">Quốc gia</div>
          <RouterLink v-for="n in countries" :key="n.id" :to="{ name: 'country', params: { slug: n.slug } }" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md">
            {{ n.name }}
          </RouterLink>
          
          <div class="flex space-x-3 mt-4 px-4">
            <RouterLink to="/login" class="btn-outline flex-1 text-center py-2 text-sm">Đăng nhập</RouterLink>
            <RouterLink to="/register" class="btn-primary flex-1 text-center py-2 text-sm">Đăng ký</RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav-link { @apply relative text-gray-300 hover:text-white font-medium transition-all duration-300 py-2; }
.nav-underline { @apply absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-red-600 transition-all duration-300 group-hover:w-full; }
.nav-link-active { @apply text-white; }
.nav-link-active .nav-underline { @apply w-full; }
.mobile-nav-link { @apply text-gray-300 hover:text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200; }
.animate-fade-in { animation: fadeIn 0.25s ease-out; }
@keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
.text-gradient { @apply bg-gradient-to-r from-primary-500 to-red-600 bg-clip-text text-transparent; }
</style>