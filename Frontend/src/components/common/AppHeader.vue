<script setup>


import { RouterLink } from 'vue-router'
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
 

 const isMobileView = ref(false)
 const mobileOpen = ref(false)
 const searchActive = ref(false)
 const searchQuery = ref('')
 const searchResults = ref([])
 const showResults = ref(false)

 // ref cho container nav để detect click outside
 const navRef = ref(null)

 // Thay vì 1 searchRef chung, dùng 2 ref riêng
 const searchRefDesktop = ref(null)
 const searchRefMobile = ref(null)

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

 // Close search results when clicking outside
 function handleClickOutside(e) {
   const path = e.composedPath ? e.composedPath() : (e.path || []);
   const clickedInsideNav = navRef.value && (navRef.value.contains(e.target) || path.includes(navRef.value))

   const clickedInsideSearchDesktop = searchRefDesktop.value && (searchRefDesktop.value.contains(e.target) || path.includes(searchRefDesktop.value))
   const clickedInsideSearchMobile = searchRefMobile.value && (searchRefMobile.value.contains(e.target) || path.includes(searchRefMobile.value))
   const clickedInsideSearch = clickedInsideSearchDesktop || clickedInsideSearchMobile

   if (!clickedInsideSearch) {
     showResults.value = false
   }

   if (!clickedInsideNav && mobileOpen.value) {
     mobileOpen.value = false
   }

   // close profile menu if click outside
   const clickedInsideProfile = path.includes(profileBtnRef?.value)
   if (!clickedInsideProfile) showProfileMenu.value = false
 }

 // Check mobile view
 function checkMobileView() {
   isMobileView.value = window.innerWidth < 1024
   // nếu chuyển sang desktop thì đóng menu mobile
   if (!isMobileView.value) mobileOpen.value = false
 }

 // Add and remove event listeners
 onMounted(() => {
   checkMobileView()
   window.addEventListener('resize', checkMobileView)
   document.addEventListener('click', handleClickOutside)
  // load categories & countries
  fetchCategories()
  fetchCountries()
 })
 
 onUnmounted(() => {
   window.removeEventListener('resize', checkMobileView)
   document.removeEventListener('click', handleClickOutside)
 })

 // categories & countries loaded from API
 const categories = ref([])
 const countries = ref([])

 const getMediaUrl = (u) => {
   if (!u) return ''
   if (/^data:|^https?:\/\//.test(u)) return u
   return `${window.location.origin}${u}`
 }

 const fetchCategories = async () => {
   try {
     const res = await api.get('/categories')
     const data = res?.data?.data || res?.data || []
     categories.value = Array.isArray(data) ? data : []
   } catch (e) {
     console.warn('fetch categories failed', e)
     // fallback minimal list
     categories.value = [
       { _id: '1', name: 'Hành động', slug: 'hanh-dong' },
       { _id: '2', name: 'Tâm lý', slug: 'tam-ly' },
       { _id: '3', name: 'Hài', slug: 'hai' }
     ]
   }
 }

 const fetchCountries = async () => {
   try {
     const res = await api.get('/countries')
     const data = res?.data?.data || res?.data || []
     countries.value = Array.isArray(data) ? data : []
   } catch (e) {
     console.warn('fetch countries failed', e)
     // fallback
     countries.value = [
       { _id: 'vn', name: 'Việt Nam', slug: 'vn', flag: 'https://flagcdn.com/w80/vn.png' },
       { _id: 'us', name: 'Mỹ', slug: 'us', flag: 'https://flagcdn.com/w80/us.png' }
     ]
   }
 }
 
 const router = useRouter()
 const auth = useAuthStore()
 const showProfileMenu = ref(false)

 // profile button ref
 const profileBtnRef = ref(null)

 function goToProfile() {
   showProfileMenu.value = false
   router.push('/profile')
 }

 function logout() {
   auth.logout()
   showProfileMenu.value = false
   router.push('/')
 }

 // computed name/initial for avatar
 const userInitial = computed(() => {
   const name = auth.user?.fullName || auth.user?.name || auth.user?.username || ''
   return name ? name.trim().charAt(0).toUpperCase() : 'C'
 })
</script>
 
<template>
  <header class="fixed top-0 w-full z-50 bg-dark-900/95 backdrop-blur-md border-b border-gray-800/50">
    <nav ref="navRef" class="container mx-auto px-4 py-4">
      <div class="flex items-center">
        <RouterLink to="/" class="flex items-center space-x-3 group flex-shrink-0 transform -translate-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
            <span class="text-white font-bold text-xl">C</span>
          </div>
          <div class="leading-tight ml-2">
            <span class="text-lg sm:text-2xl font-bold text-gradient">ChillFilm</span>
            <span class="text-gray-400 text-xs hidden sm:block">Xem phim cực chill</span>
          </div>
        </RouterLink>

        <!-- Mobile Menu Toggle Button -->
        <button 
          @click="mobileOpen = !mobileOpen" 
          class="ml-auto lg:hidden rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
          aria-label="Toggle menu"
        >
          <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Desktop Nav (center) -->
        <div class="hidden lg:flex items-center mx-auto space-x-6 pl-2 text-base">
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
                <li v-for="c in categories" :key="c._id || c.id">
                  <RouterLink :to="{ name: 'category-detail', params: { slug: c.slug } }" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
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
            
            <!-- Panel -->
            <div class="absolute left-0 top-full w-56 rounded-xl border border-gray-800 bg-dark-900/95 backdrop-blur-md shadow-2xl opacity-0 scale-95 pointer-events-none transition duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto z-50">
              <ul class="py-2 max-h-80 overflow-y-auto">
                 <li v-for="c in countries" :key="c.id">
                   <RouterLink 
                     :to="{ name: 'country', params: { slug: c.slug } }" 
                     class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                   >
                    <img 
                      v-if="c.flag" 
                      :src="getMediaUrl(c.flag)" 
                      :alt="c.name" 
                      class="w-5 h-3 mr-2 object-cover"
                    />
                     {{ c.name }}
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
          <!-- Desktop Search: ref -> searchRefDesktop -->
          <div ref="searchRefDesktop" class="relative w-60">
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

          <!-- Auth area -->
          <div v-if="!auth.isAuthenticated" class="flex items-center gap-4">
            <RouterLink to="/login" class="btn-outline px-4 py-2 text-sm">Đăng nhập</RouterLink>
            <RouterLink to="/register" class="btn-primary px-4 py-2 text-sm">Đăng ký</RouterLink>
          </div>

          <div v-else class="relative">
            <button
              ref="profileBtnRef"
              @click="showProfileMenu = !showProfileMenu"
              class="bg-gray-800/40 hover:bg-gray-800 p-1.5 rounded-full"
              aria-label="Profile menu"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-red-600 flex items-center justify-center text-white font-semibold">
                {{ userInitial }}
              </div>
            </button>

            <div v-show="showProfileMenu" class="absolute right-0 mt-2 w-44 bg-dark-800/95 border border-gray-700 rounded-xl shadow-lg z-50">
              <button @click="goToProfile" class="w-full text-left px-4 py-2  text-slate-200 text-lg hover:bg-gray-800/60">Hồ sơ cá nhân</button>
              <button @click="logout" class="w-full text-left px-4 py-2  text-slate-200 text-lg hover:bg-gray-800/60">Đăng xuất</button>
            </div>
          </div>
        </div>

      </div>
      
      <div class="lg:hidden mt-2">
        <div ref="searchRefMobile" class="relative">
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
      
      <!-- Mobile Menu (overlay, scrollable) -->
      <div
        v-show="mobileOpen"
        class="lg:hidden absolute left-0 right-0 top-full mt-0 z-40"
      >
        <div
          class="bg-dark-900/95 border-t border-gray-800 p-4 max-h-[calc(100vh-64px)] overflow-y-auto rounded-b-xl shadow-xl"
          style="-webkit-overflow-scrolling: touch;"
        >
          <div class="flex flex-col space-y-2">
            <RouterLink to="/" exact-active-class="nav-link-active" class="mobile-nav-link" @click="mobileOpen = false">Trang chủ</RouterLink>
            <RouterLink to="/movies" class="mobile-nav-link" @click="mobileOpen = false">Phim điện ảnh</RouterLink>
            <RouterLink to="/series" class="mobile-nav-link" @click="mobileOpen = false">Phim bộ</RouterLink>

            <div class="text-gray-400 px-4 mt-2 text-xs uppercase">Thể loại</div>
            <RouterLink
              v-for="c in categories"
              :key="c.id"
              :to="{ name: 'category-detail', params: { slug: c.slug } }"
              class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
              @click="mobileOpen = false"
            >
              {{ c.name }}
            </RouterLink>

            <div class="text-gray-400 px-4 mt-3 text-xs uppercase">Quốc gia</div>
            <div class="grid grid-cols-2 gap-1">
              <RouterLink
                v-for="n in countries"
                :key="n._id || n.id"
                :to="{ name: 'country', params: { slug: n.slug } }"
                class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
                @click="mobileOpen = false"
              >
                <img
                  v-if="n.flag"
                  :src="getMediaUrl(n.flag)"
                  :alt="n.name"
                  class="w-4 h-3 mr-1.5 object-cover"
                />
                <span class="truncate">{{ n.name }}</span>
              </RouterLink>
              <RouterLink to="/actors" class="mobile-nav-link" @click="mobileOpen = false">Diễn viên</RouterLink>
            </div>

            <div class="flex space-x-3 mt-4 px-4">
              <RouterLink v-if="!auth.isAuthenticated" to="/login" class="btn-outline flex-1 text-center py-2 text-sm" @click="mobileOpen = false">Đăng nhập</RouterLink>
              <RouterLink v-if="!auth.isAuthenticated" to="/register" class="btn-primary flex-1 text-center py-2 text-sm" @click="mobileOpen = false">Đăng ký</RouterLink>

              <button v-if="auth.isAuthenticated" @click="goToProfile" class="btn-outline flex-1 text-center py-2 text-sm">Hồ sơ</button>
              <button v-if="auth.isAuthenticated" @click="logout" class="btn-primary flex-1 text-center py-2 text-sm">Đăng xuất</button>
            </div>
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
img.flag {
  box-shadow: 0 0 1px rgba(0,0,0,0.5);
  border-radius: 1px;
}
@keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
.text-gradient { @apply bg-gradient-to-r from-primary-500 to-red-600 bg-clip-text text-transparent; }
</style>