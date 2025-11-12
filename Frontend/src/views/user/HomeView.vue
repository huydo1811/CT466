<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/services/api'

const heroMovie = ref(null)
const latestMovies = ref([])      // type=movie
const latestSeries = ref([])      // type=series (thêm mới)
const trendingMovies = ref([])    // type=movie
const weekTop = ref([])
const monthTop = ref([])
const popularCategories = ref([])
const popularActors = ref([])
const editorCollections = ref([]) 
const stats = ref({ movies: 0, series: 0, views: 0, users: 0 })
const statDisplay = ref({ movies: 0, series: 0, views: 0, users: 0 })

const activePeriod = ref('week')
const rankedMovies = computed(() => activePeriod.value === 'week' ? weekTop.value : monthTop.value)

const categoriesTab = ref([])
const selectedCategory = ref('')
const categoryMovies = ref([])

// ========== Helpers ==========
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

const slugify = (s='') => String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')

const movieLink = (m) => {
  const slug = m?.slug || slugify(m?.title) || m?.id
  const type = m?.type || 'movie'
  return type === 'series' 
    ? { name: 'series-detail', params: { slug } } 
    : { name: 'movie-detail', params: { slug } }
}

const actorLink = (a) => ({ name: 'actor-detail', params: { slug: a.slug || a.id } })

const categoryLink = (c) => ({ name: 'category-detail', params: { slug: c.slug } })

// ========== Fetch Functions ==========
const fetchHero = async () => {
  try {
    const res = await api.get('/movies/hero')
    const m = res?.data?.data
    if (m) {
      heroMovie.value = {
        id: m._id || m.id,
        slug: m.slug || slugify(m.title),
        type: m.type,
        title: m.title,
        description: m.description,
        backdrop: getMediaUrl(m.backdrop),
        poster: getMediaUrl(m.poster),
        rating: m.rating?.average ?? m.rating ?? 0,
        year: m.year,
        duration: m.duration ? `${m.duration} phút` : '',
        genres: (m.categories || []).map(c => c.name)
      }
    }
  } catch (e) {
    console.warn('fetchHero failed', e)
  }
}

const fetchLatest = async () => {
  try {
    // Fetch movies (type=movie)
    const resMovies = await api.get('/movies/latest?limit=12&type=movie')
    latestMovies.value = (resMovies?.data?.data || []).map(m => ({
      id: m._id || m.id,
      slug: m.slug || slugify(m.title),
      type: m.type,
      title: m.title,
      poster: getMediaUrl(m.poster),
      rating: m.rating?.average ?? m.rating ?? 0,
      year: m.year
    }))

    // Fetch series (type=series)
    const resSeries = await api.get('/movies/latest?limit=12&type=series')
    latestSeries.value = (resSeries?.data?.data || []).map(m => ({
      id: m._id || m.id,
      slug: m.slug || slugify(m.title),
      type: m.type,
      title: m.title,
      poster: getMediaUrl(m.poster),
      rating: m.rating?.average ?? m.rating ?? 0,
      year: m.year
    }))
  } catch (e) {
    console.warn('fetchLatest failed', e)
  }
}

const fetchTrending = async () => {
  try {
    // Chỉ lấy phim lẻ (type=movie) cho trending
    const res = await api.get('/movies/hot?limit=12&type=movie')
    trendingMovies.value = (res?.data?.data || []).map(m => ({
      id: m._id || m.id,
      slug: m.slug || slugify(m.title),
      type: m.type,
      title: m.title,
      poster: getMediaUrl(m.poster),
      rating: m.rating?.average ?? m.rating ?? 0,
      year: m.year
    }))
  } catch (e) {
    console.warn('fetchTrending failed', e)
  }
}

const fetchRanking = async () => {
  try {
    const [wRes, mRes] = await Promise.all([
      api.get('/movies/ranking?period=week&limit=5&type=movie'),
      api.get('/movies/ranking?period=month&limit=5&type=movie')
    ])
    weekTop.value = (wRes?.data?.data || []).map(m => ({
      id: m._id,
      slug: m.slug || slugify(m.title),
      type: m.type,
      title: m.title,
      poster: getMediaUrl(m.poster),
      rating: m.rating?.average ?? 0,
      year: m.year
    }))
    monthTop.value = (mRes?.data?.data || []).map(m => ({
      id: m._id,
      slug: m.slug || slugify(m.title),
      type: m.type,
      title: m.title,
      poster: getMediaUrl(m.poster),
      rating: m.rating?.average ?? 0,
      year: m.year
    }))
  } catch (e) {
    console.warn('fetchRanking failed', e)
  }
}

const fetchCategoriesForTabs = async () => {
  try {
    // Lấy top 5 categories có movieCount cao nhất
    const res = await api.get('/categories?withCount=true&limit=5')
    categoriesTab.value = (res?.data?.data || []).map(c => ({
      name: c.name,
      slug: c.slug,
      id: c._id
    }))
    if (categoriesTab.value.length) {
      selectedCategory.value = categoriesTab.value[0].slug
      await fetchCategoryMovies(selectedCategory.value)
    }
  } catch (e) {
    console.warn('fetchCategoriesForTabs failed', e)
  }
}

const fetchCategoryMovies = async (slug) => {
  try {
    const res = await api.get(`/movies?category=${slug}&limit=6&sortBy=-viewCount&type=movie`)
    categoryMovies.value = (res?.data?.data || []).map(m => ({
      id: m._id,
      slug: m.slug || slugify(m.title),
      type: m.type,
      title: m.title,
      poster: getMediaUrl(m.poster),
      rating: m.rating?.average ?? 0,
      year: m.year
    }))
  } catch (e) {
    console.warn('fetchCategoryMovies failed', e)
  }
}

const fetchPopularCategories = async () => {
  try {
    // Lấy top 6 categories có nhiều phim nhất
    const res = await api.get('/categories?withCount=true&limit=6')
    popularCategories.value = (res?.data?.data || []).map(c => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      count: c.movieCount || 0,
      image: getMediaUrl(c.image || c.cover || '')
    }))
  } catch (e) {
    console.warn('fetchPopularCategories failed', e)
  }
}

const fetchPopularActors = async () => {
  try {
    const res = await api.get('/actors?sort=popular&limit=6')
    popularActors.value = (res?.data?.data || []).map(a => ({
      id: a._id,
      slug: a.slug,
      name: a.name,
      avatar: getMediaUrl(a.photoUrl || a.avatar || '')
    }))
  } catch (e) {
    console.warn('fetchPopularActors failed', e)
  }
}

const fetchEditorCollections = async () => {
  editorCollections.value = []
}

const fetchStats = async () => {
  try {
    const res = await api.get('/movies/stats')
    const d = res?.data?.data || {}
    stats.value = {
      movies: d.totalMovies || 0,
      series: d.totalSeries || 0,
      views: d.totalViews || 0,
      users: d.totalUsers || 0
    }
    Object.entries(stats.value).forEach(([k, v]) => animateStat(k, v))
  } catch (e) {
    console.warn('fetchStats failed', e)
  }
}

function animateStat(key, to) {
  const duration = 800
  const step = Math.max(1, Math.floor(to / 60))
  const timer = setInterval(() => {
    statDisplay.value[key] += step
    if (statDisplay.value[key] >= to) {
      statDisplay.value[key] = to
      clearInterval(timer)
    }
  }, duration / Math.ceil(to / step))
}

// ========== Lifecycle ==========
onMounted(async () => {
  await Promise.all([
    fetchHero(),
    fetchLatest(),
    fetchTrending(),
    fetchRanking(),
    fetchCategoriesForTabs(),
    fetchPopularCategories(),
    fetchPopularActors(),
    fetchEditorCollections(),
    fetchStats()
  ])
})

watch(() => selectedCategory.value, (slug) => {
  if (slug) fetchCategoryMovies(slug)
})
</script>

<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Hero Section -->
    <section v-if="heroMovie" class="relative min-h-[80vh] flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          :src="heroMovie.backdrop"
          :alt="heroMovie.title"
          class="w-full h-full object-cover object-[72%_center]"  
        />
        <div class="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>
        <div class="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-black/30 to-transparent pointer-events-none"></div>
        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-900/90 to-transparent pointer-events-none"></div>
      </div>

      <div class="relative z-10 container">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-3 mb-6">
            <span class="px-3 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full animate-pulse">
              HERO
            </span>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{{ heroMovie.rating }}</span>
              </span>
              <span>•</span>
              <span>{{ heroMovie.year }}</span>
              <span v-if="heroMovie.duration">•</span>
              <span v-if="heroMovie.duration">{{ heroMovie.duration }}</span>
            </div>
          </div>

          <h1 class="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            {{ heroMovie.title }}
          </h1>

          <p class="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
            {{ heroMovie.description }}
          </p>

          <div class="flex flex-wrap gap-2 mb-8">
            <span 
              v-for="genre in heroMovie.genres" 
              :key="genre"
              class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
            >
              {{ genre }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink 
              :to="movieLink(heroMovie)" 
              class="btn-primary text-lg px-8 py-4 shadow-glow"
            >
              <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Xem ngay
            </RouterLink>
            
            <RouterLink 
              :to="movieLink(heroMovie)" 
              class="btn-secondary text-lg px-8 py-4 glass"
            >
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Thông tin thêm
            </RouterLink>
            
            <button class="btn-outline text-lg px-8 py-4">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Yêu thích
            </button>
          </div>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div class="animate-bounce">
          <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Latest Movies Section (chỉ phim lẻ) -->
    <section class="py-16 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Phim lẻ mới nhất</h1>
            <p class="text-sm text-gray-400">Những bộ phim hot nhất hiện tại</p>
          </div>
          <RouterLink :to="{ name: 'movies' }" class="btn-outline py-2 px-4 text-sm sm:text-base">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>

        <!-- Carousel mobile + Grid PC (same pattern as before) -->
        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:hidden">
          <div class="flex gap-4">
            <RouterLink v-for="movie in latestMovies" :key="movie.id" :to="movieLink(movie)" class="movie-card group flex-shrink-0 w-40">
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-gray-800">
                <img 
                  :src="movie.poster"
                  :alt="movie.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span class="text-yellow-400 text-xs font-semibold">{{ movie.rating }}</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="text-white font-semibold text-xs mb-1 truncate">{{ movie.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ movie.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {{ movie.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <div class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink v-for="movie in latestMovies" :key="movie.id" :to="movieLink(movie)" class="movie-card group">
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-48 bg-gray-800">
              <img 
                :src="movie.poster"
                :alt="movie.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute inset-0 flex items-center justify-center">
                  <button class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-primary-600">
                    <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>

                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-semibold text-sm mb-1 truncate">{{ movie.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ movie.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {{ movie.rating }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                <span class="text-yellow-400 text-xs font-semibold">{{ movie.rating }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Latest Series Section (thêm mới - phim bộ) -->
    <section class="py-16 bg-gradient-to-b from-dark-800 to-dark-900">
      <div class="container">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Phim bộ mới nhất</h1>
            <p class="text-sm text-gray-400">Những series đáng xem nhất</p>
          </div>
          <RouterLink :to="{ name: 'series' }" class="btn-outline py-2 px-4 text-sm sm:text-base">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>

        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:hidden">
          <div class="flex gap-4">
            <RouterLink v-for="s in latestSeries" :key="s.id" :to="movieLink(s)" class="movie-card group flex-shrink-0 w-40">
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-gray-800">
                <img :src="s.poster" :alt="s.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span class="text-yellow-400 text-xs font-semibold">{{ s.rating }}</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="text-white font-semibold text-xs mb-1 truncate">{{ s.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ s.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {{ s.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <div class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink v-for="s in latestSeries" :key="s.id" :to="movieLink(s)" class="movie-card group">
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-48 bg-gray-800">
              <img :src="s.poster" :alt="s.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute inset-0 flex items-center justify-center">
                  <button class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-primary-600">
                    <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-semibold text-sm mb-1 truncate">{{ s.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ s.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {{ s.rating }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                <span class="text-yellow-400 text-xs font-semibold">{{ s.rating }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Trending Movies Section (unchanged - chỉ phim lẻ) -->
    <section class="py-12 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Xu hướng</h1>
            <p class="text-sm text-gray-400">Phim đang được xem nhiều nhất (3 ngày)</p>
          </div>
          <RouterLink :to="{ name: 'movies', query: { trending: 'true' } }" class="btn-outline py-2 px-4 text-sm sm:text-base">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>

        <div class="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          <RouterLink 
            v-for="(movie, index) in trendingMovies" 
            :key="movie.id"
            :to="movieLink(movie)"
            class="movie-card group flex-shrink-0 relative"
          >
            <div class="absolute -left-4 -top-2 z-10">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {{ index + 1 }}
              </div>
            </div>

            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-40 bg-gray-800">
              <img 
                :src="movie.poster"
                :alt="movie.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="text-white font-semibold text-xs mb-1 truncate">{{ movie.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ movie.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {{ movie.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Ranking (unchanged - chỉ phim lẻ) -->
    <section class="py-12 bg-gradient-to-b from-dark-800 to-dark-900">
      <div class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Bảng xếp hạng</h1>
            <p class="text-sm text-gray-400">Top phim theo tuần hoặc tháng</p>
          </div>
          <div class="inline-flex rounded-xl bg-gray-800/60 p-1 border border-gray-700">
            <button
              :class="['px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm', activePeriod==='week' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white']"
              @click="activePeriod='week'">Tuần</button>
            <button
              :class="['px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm', activePeriod==='month' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white']"
              @click="activePeriod='month'">Tháng</button>
          </div>
        </div>
        
        <!-- Carousel cho mobile -->
        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:hidden">
          <div class="flex gap-4">
            <RouterLink 
              v-for="(m,i) in rankedMovies" 
              :key="m.id"
              :to="movieLink(m)"
              class="movie-card group flex-shrink-0 relative w-48"
            >
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-gray-800">
                <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div class="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/70 text-white text-sm font-bold grid place-items-center">{{ i+1 }}</div>
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div class="text-white text-xs font-semibold truncate">{{ m.title }}</div>
                  <div class="text-gray-300 text-xs flex justify-between">
                    <span>{{ m.year }}</span>
                    <span class="text-yellow-400">★ {{ m.rating }}</span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
        
        <!-- Grid cho PC -->
        <div class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink 
            v-for="(m,i) in rankedMovies" 
            :key="m.id"
            :to="movieLink(m)"
            class="movie-card group relative"
          >
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-48 bg-gray-800">
              <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/70 text-white text-sm font-bold grid place-items-center">{{ i+1 }}</div>
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div class="text-white text-sm font-semibold truncate">{{ m.title }}</div>
                <div class="text-gray-300 text-xs flex justify-between">
                  <span>{{ m.year }}</span>
                  <span class="text-yellow-400">★ {{ m.rating }}</span>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- Explore by Category (unchanged - chỉ phim lẻ) -->
    <section class="py-12 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Khám phá theo thể loại</h1>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="c in categoriesTab" :key="c.slug"
            :class="['px-4 py-2 rounded-lg text-sm border', selectedCategory===c.slug ? 'bg-primary-600 border-primary-500 text-white' : 'border-gray-700 text-gray-300 hover:bg-gray-800']"
            @click="selectedCategory=c.slug">
            {{ c.name }}
          </button>
        </div>

        <!-- Carousel cho mobile -->
        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:hidden">
          <div class="flex gap-4">
            <RouterLink 
              v-for="m in categoryMovies" 
              :key="m.id"
              :to="movieLink(m)"
              class="movie-card group flex-shrink-0 w-40"
            >
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-gray-800">
                <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div class="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                  <span class="text-yellow-400 text-xs font-semibold">{{ m.rating }}</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div class="text-white text-sm font-semibold truncate">{{ m.title }}</div>
                  <div class="text-gray-300 text-xs">{{ m.year }}</div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Grid cho PC -->
        <div class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink 
            v-for="m in categoryMovies" 
            :key="m.id"
            :to="movieLink(m)"
            class="movie-card group"
          >
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-48 bg-gray-800">
              <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                <span class="text-yellow-400 text-xs font-semibold">{{ m.rating }}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div class="text-white text-sm font-semibold truncate">{{ m.title }}</div>
                <div class="text-gray-300 text-xs">{{ m.year }}</div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- Popular Categories (unchanged) -->
    <section class="py-12 bg-gradient-to-b from-dark-800 to-dark-900">
      <div class="container">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Khám phá thể loại</h1>
            <p class="text-sm text-gray-400">Tìm phim yêu thích theo thể loại</p>
          </div>
          <RouterLink :to="{ name: 'categories' }" class="btn-outline py-2 px-4 text-sm sm:text-base">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink 
            v-for="category in popularCategories" 
            :key="category.id"
            :to="categoryLink(category)"
            class="relative rounded-xl overflow-hidden aspect-[2/3] w-40 group"
          >
            <img 
              v-if="category.image"
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
              <span class="text-gray-400 text-xs">No Image</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-white text-lg font-bold">{{ category.name }}</h3>
              <p class="text-gray-300 text-sm">{{ category.count }} phim</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Popular Actors (unchanged) -->
    <section class="py-12 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Diễn viên nổi bật</h1>
            <p class="text-sm text-gray-400">Theo dõi các gương mặt được yêu thích</p>
          </div>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          <RouterLink 
            v-for="a in popularActors" 
            :key="a.id"
            :to="actorLink(a)"
            class="flex-shrink-0 w-40"
          >
            <div class="relative w-40 h-40 rounded-full overflow-hidden ring-2 ring-gray-800 hover:ring-primary-600 transition">
              <img 
                v-if="a.avatar"
                :src="a.avatar" 
                :alt="a.name" 
                class="w-full h-full object-cover" 
                loading="lazy" 
              />
              <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
                <span class="text-gray-400 text-xs">No Avatar</span>
              </div>
            </div>
            <div class="mt-3 text-center text-white font-medium truncate">{{ a.name }}</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats (unchanged) -->
    <section class="py-16 bg-gradient-to-r from-primary-500/10 via-red-500/10 to-primary-500/10">
      <div class="container grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.movies.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Phim lẻ</div>
        </div>
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.series.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Phim bộ</div>
        </div>
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.views.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Lượt xem</div>
        </div>
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.users.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Người dùng</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
