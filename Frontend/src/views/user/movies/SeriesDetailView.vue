<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

// UI / trailer / tabs
const showTrailer = ref(false)
const trailerSrc = ref('')
const activeTab = ref('overview')

// basic movie/series state (use same shape as MovieDetailView)
const movie = ref({
  id: null,
  title: '',
  tagline: '',
  description: '',
  backdrop: '',
  poster: '',
  rating: 0,
  voteCount: 0,
  releaseDate: '',
  duration: '',
  trailerKey: '',
  categoriesRaw: [],
  genres: [],
  countries: [],
  languages: [],
  director: '',
  budget: '',
  boxOffice: '',
  status: '',
  ageRating: '',
  productionCompanies: [],
  cast: [],
  reviews: [],
  similar: []
})

const loading = ref(false)
const loadingSimilar = ref(false)

// episodes / seasons
const seasons = ref([])
const selectedSeason = ref(1)
const episodes = ref([])
const epPage = ref(1)
const epLimit = ref(24)

// review form state (copied)
const userRating = ref(5)
const userComment = ref('')
const submittingReview = ref(false)

// auth / user
const isAuthenticated = computed(() => !!(localStorage.getItem('token') || api.defaults.headers.common['Authorization']))
const currentUser = ref(null)
const currentUserId = ref(null)

const fetchCurrentUser = async () => {
  try {
    if (!isAuthenticated.value) { currentUser.value = null; currentUserId.value = null; return }
    const res = await api.get('/users/me')
    const u = res?.data?.data || res?.data || null
    currentUser.value = u
    currentUserId.value = u?._id || u?.id || null
  } catch (e) {
    console.error(e)
    currentUser.value = null
    currentUserId.value = null
  }
}

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

const extractYouTubeId = (urlOrId) => {
  if (!urlOrId) return ''
  const s = String(urlOrId)
  if (/^[0-9A-Za-z_-]{11}$/.test(s)) return s
  const m = s.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  return m ? m[1] : ''
}

const normalizeMovie = (m) => {
  if (!m) return {}
  let trailerKey = m.trailerKey || m.trailer?.key || m.trailerUrl || m.trailer_link || m.trailer || ''
  if (!trailerKey && Array.isArray(m.videos)) {
    const t = m.videos.find(v => /trailer/i.test(v.type || v.name || ''))
    if (t) trailerKey = t.key || t.videoId || t.source || t.url
  }
  trailerKey = extractYouTubeId(trailerKey)

  let ratingVal = ''
  let voteCnt = 0
  if (m.rating && typeof m.rating === 'object') {
    ratingVal = m.rating.average != null ? Number(m.rating.average).toFixed(1) : ''
    voteCnt = m.rating.count || 0
  } else if (m.rating != null) {
    ratingVal = String(m.rating)
  }

  const categoriesRaw = Array.isArray(m.categories) ? m.categories.map(c => (typeof c === 'object' ? ({ id: c._id || c.id, name: c.name || c.title, slug: c.slug }) : ({ id: null, name: c }))) : []

  const genres = categoriesRaw.length ? categoriesRaw.map(c => c.name) : (Array.isArray(m.genres) ? m.genres : [])

  const rawCast = Array.isArray(m.actors) ? m.actors : (Array.isArray(m.cast) ? m.cast : [])
  const cast = rawCast.map(a => {
    if (!a) return { id: null, name: '', character: '', image: '' }
    if (typeof a === 'string' || typeof a === 'number') return { id: a, name: '', character: '', image: '' }
    const id = a._id || a.id || a.actorId || null
    const name = a.name || a.fullName || a.title || ''
    const character = a.character || a.role || a.as || ''
    const image = getMediaUrl(a.image || a.photoUrl || a.avatar || a.photo || '')
    return { id, name, character, image }
  })

  const similar = Array.isArray(m.similar) ? m.similar.map(s => ({
    id: s._id || s.id,
    title: s.title || s.name,
    poster: getMediaUrl(s.poster || s.posterUrl || s.thumbnail),
    year: s.year || (s.releaseDate ? new Date(s.releaseDate).getFullYear() : ''),
    rating: (s.rating && typeof s.rating === 'object') ? (s.rating.average ?? '') : (s.rating ?? '')
  })) : []

  return {
    ...m,
    id: m._id || m.id || m.movieId || null,
    poster: getMediaUrl(m.poster || m.posterUrl || m.thumbnail),
    backdrop: getMediaUrl(m.backdrop || m.backdropUrl),
    trailerKey,
    rating: ratingVal,
    voteCount: Number(m.voteCount || voteCnt || 0),
    genres,
    countries: Array.isArray(m.countries) ? m.countries : (m.country ? [m.country] : []),
    cast,
    reviews: m.reviews || [],
    similar,
    categoriesRaw
  }
}

const fetchCastDetails = async (castArr) => {
  try {
    const ids = (castArr || []).filter(c => c && (c.id || c._id) && !c.name).map(c => c.id || c._id)
    if (!ids.length) return
    const reqs = ids.map(id => api.get(`/actors/${id}`).then(r => r?.data?.data || r?.data).catch(() => null))
    const results = await Promise.all(reqs)
    movie.value.cast = movie.value.cast.map(c => {
      if (!c || !c.id) return c
      const found = results.find(r => r && (r._id === c.id || r.id === c.id))
      if (found) {
        return {
          id: found._id || found.id,
          name: found.name || found.fullName || '',
          character: c.character || '',
          image: getMediaUrl(found.photoUrl || found.photo || found.avatar || found.image || '')
        }
      }
      return c
    })
  } catch (e) {
    console.error(e)
  }
}

const fetchCountriesIfNeeded = async (countriesArr) => {
  try {
    const ids = (countriesArr || []).filter(c => c && typeof c === 'string' && /^[0-9a-fA-F]{24}$/.test(c))
    if (!ids.length) return
    const reqs = ids.map(id => api.get(`/countries/${id}`).then(r => r?.data?.data || r?.data).catch(() => null))
    const results = await Promise.all(reqs)
    movie.value.countries = movie.value.countries.map(c => {
      if (typeof c === 'string' && /^[0-9a-fA-F]{24}$/.test(c)) {
        const found = results.find(r => r && (r._id === c || r.id === c))
        return found ? (found.name || found.title || c) : c
      }
      return c
    })
  } catch (e) { 
    console.error(e)}
}

const fetchReviewsIfNeeded = async (movieId) => {
  try {
    if (!movieId) return
    // only skip fetching when we already have reviews AND none of them are episode-level
    if (Array.isArray(movie.value.reviews) && movie.value.reviews.length && movie.value.reviews.every(r => !r?.episode && !r?.episodeId)) return
    const res = await api.get(`/reviews/movie/${movieId}`, { params: { limit: 1000 } })
    const list = res?.data?.data || res?.data || []
    // keep only movie-level reviews (exclude episode reviews). Defensive: check several episode keys.
    movie.value.reviews = Array.isArray(list) ? list.filter(r => !r?.episode && !r?.episodeId && !r?.episode_id) : []
    if (res?.data?.ratingStats) {
      const stats = res.data.ratingStats
      movie.value.voteCount = stats.totalReviews ?? movie.value.voteCount
      if (typeof stats.averageRating !== 'undefined') movie.value.rating = stats.averageRating
    }
  } catch (e) { /* ignore */ 
    console.error(e)
  }
}

const fetchSimilarByCategories = async (categories) => {
  if (!categories || !categories.length) return
  loadingSimilar.value = true
  try {
    const catParam = categories.map(c => c.id || c.slug || c.name).filter(Boolean).join(',')
    const params = { limit: 24, sortBy: '-createdAt', type: 'series', category: catParam }
    const res = await api.get('/movies', { params })
    const list = res?.data?.data || []
    const myCats = new Set(categories.map(c => (c.id || c.name || c.slug).toString()))
    const filtered = list.filter(s => {
      const sCats = Array.isArray(s.categories) ? s.categories.map(sc => (typeof sc === 'object' ? (sc._id || sc.id || sc.name) : sc)) : (s.categories || [])
      return sCats.some(sc => myCats.has(String(sc)))
    })
    movie.value.similar = (filtered || []).slice(0, 12).map(s => ({
      id: s._id || s.id,
      title: s.title || s.name,
      poster: getMediaUrl(s.poster || s.posterUrl || s.thumbnail),
      year: s.year || (s.releaseDate ? new Date(s.releaseDate).getFullYear() : ''),
      rating: (s.rating && typeof s.rating === 'object') ? (s.rating.average ?? '') : (s.rating ?? '')
    }))
  } catch (err) { /* ignore */ 
    console.error(err)
  }
  finally { loadingSimilar.value = false }
}

const fetchEpisodes = async (movieId, season = 1) => {
  try {
    const res = await api.get(`/episodes/movie/${movieId}`, { params: { season, page: epPage.value, limit: epLimit.value }})
    episodes.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.error(e)
    episodes.value = []
  }
}

const openEpisode = (ep) => {
  router.push({ name: 'watch-series', params: { seriesId: movie.value.id, episodeId: ep._id || ep.id }})
}

const fetchMovie = async (id) => {
  if (!id) return
  loading.value = true
  try {
    const res = await api.get(`/movies/${id}`)
    const data = res?.data?.data || res?.data || null
    if (!data) { router.replace({ name: 'movies' }); return }
    const normalized = normalizeMovie(data)
    Object.assign(movie.value, normalized)
    // ensure any preloaded reviews do not include episode-level reviews
    if (Array.isArray(movie.value.reviews) && movie.value.reviews.length) {
      movie.value.reviews = movie.value.reviews.filter(r => !r?.episode && !r?.episodeId && !r?.episode_id)
    }
    await fetchCastDetails(movie.value.cast || [])
    await fetchCountriesIfNeeded(movie.value.countries || [])
    if ((!movie.value.similar || movie.value.similar.length === 0) && movie.value.categoriesRaw && movie.value.categoriesRaw.length) {
      fetchSimilarByCategories(movie.value.categoriesRaw)
    }
    await fetchReviewsIfNeeded(movie.value.id || id)
    // build seasons from movie.seasons / totalSeasons
    const sCount = movie.value.seasons || movie.value.totalSeasons || 1
    seasons.value = Array.from({ length: sCount }, (_, i) => i + 1)
    selectedSeason.value = 1
    await fetchEpisodes(movie.value.id || id, selectedSeason.value)
    await fetchCurrentUser()
    await updateFavoriteStatus()
  } catch (err) {
    console.error('fetchMovie error', err)
  } finally { loading.value = false }
}

const openTrailer = () => {
  const vid = extractYouTubeId(movie.value.trailerKey || movie.value.trailer || '')
  if (!vid) return
  trailerSrc.value = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`
  showTrailer.value = true
}
const closeTrailer = () => { showTrailer.value = false; trailerSrc.value = '' }

const watchSeries = async () => {
  const mid = movie.value.id || route.params.id
  if (!mid) return
  try {
    // lấy tập đầu tiên của series: season = selectedSeason (mặc định 1), limit=1, sort by episodeNumber asc
    const res = await api.get(`/episodes/movie/${mid}`, { params: { season: selectedSeason.value || 1, page: 1, limit: 1, sortBy: 'episodeNumber' }})
    const list = res?.data?.data || res?.data || []
    const first = Array.isArray(list) ? list[0] : null
    if (first && (first._id || first.id)) {
      router.push({ name: 'watch-series', params: { seriesId: mid, episodeId: first._id || first.id }})
    } else {
      // fallback: open series detail watch-movie route (if no episodes)
      router.push({ name: 'watch-movie', params: { id: mid }})
    }
  } catch (e) {
    console.error('watchSeries error', e)
    router.push({ name: 'watch-movie', params: { id: mid }})
  }
}

// reviews
const submitReview = async () => {
  if (!isAuthenticated.value) { router.push({ name: 'login', query: { redirect: route.fullPath } }); return }
  if (!movie.value.id && !route.params.id) return
  submittingReview.value = true
  try {
    const movieId = movie.value.id || route.params.id
    const body = { rating: Number(userRating.value), comment: userComment.value }
    const res = await api.post(`/reviews/movie/${movieId}`, body)
    if (res?.data?.data) {
      movie.value.reviews.unshift(res.data.data)
      userComment.value = ''
      userRating.value = 5
    } else {
      await fetchReviewsIfNeeded(movieId)
    }
  } catch (err) {
    if (err?.response?.status === 401) router.push({ name: 'login', query: { redirect: route.fullPath } })
  } finally { submittingReview.value = false }
}

const isFavorited = ref(false)
const updateFavoriteStatus = async () => {
  try {
    if (!isAuthenticated.value) { isFavorited.value = false; return }
    const res = await api.get('/users/me')
    const favs = res?.data?.data?.favorites || res?.data?.data?.favoriteMovies || []
    const mid = movie.value.id || route.params.id
    isFavorited.value = favs.some(f => String(f._id || f.id || f) === String(mid))
  } catch (e) { /* ignore */
    console.log(e)
   }
}
const toggleFavorite = async () => {
  if (!isAuthenticated.value) { router.push({ name: 'login', query: { redirect: route.fullPath } }); return }
  const mid = movie.value.id || route.params.id
  try {
    if (!isFavorited.value) await api.post(`/users/me/favorites/${mid}`)
    else await api.delete(`/users/me/favorites/${mid}`)
    isFavorited.value = !isFavorited.value
    await fetchMovie(mid)
  } catch (e) { /* ignore */ 
    console.log(e)
  }
}

// small helpers
const formattedReleaseDate = computed(() => {
  const d = movie.value.releaseDate || movie.value.year || ''
  if (!d) return ''
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return String(d)
  return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
})

onMounted(() => {
  const id = route.params.id
  if (id) fetchMovie(id)
})

// when season changes fetch episodes
watch(selectedSeason, (s) => {
  if (movie.value.id) fetchEpisodes(movie.value.id, s)
})
</script>

<template>
  <!-- same layout as MovieDetailView + Episodes tab -->
  <div class="bg-dark-900 min-h-screen pb-20">
    <div class="relative h-[60vh] overflow-hidden">
      <div class="absolute inset-0">
        <img :src="movie.backdrop" class="w-full h-full object-cover object-center" />
        <div class="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent"></div>
      </div>

      <div class="container relative h-full flex items-end py-12">
        <div class="flex flex-col md:flex-row gap-8 w-full">
          <div class="w-64 flex-shrink-0">
            <div class="rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl aspect-[2/3] bg-gray-800">
              <img :src="movie.poster" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="flex-1">
            <div class="flex flex-wrap gap-3 mb-2">
              <span v-for="genre in movie.genres" :key="genre" class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                {{ genre }}
              </span>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">{{ movie.title }}</h1>
            <p class="text-lg text-gray-300 italic mb-4">{{ movie.tagline }}</p>

            <div class="flex items-center gap-4 mb-6 text-sm text-gray-300 flex-wrap">
              <div class="flex items-center">
                <div class="flex items-center text-yellow-400 mr-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <span class="font-bold">{{ movie.rating }}</span>
                </div>
                <span class="text-gray-500">/5 ({{ Number(movie.voteCount || 0).toLocaleString() }} đánh giá)</span>
              </div>
              <div class="flex items-center"><span>{{ formattedReleaseDate }}</span></div>
              <div class="flex items-center"><span>{{ movie.totalEpisodes }} tập</span></div>
              <div class="flex items-center"><span>{{ movie.ageRating }}</span></div>
            </div>

            <div class="flex flex-wrap gap-4 mb-6">
              <button @click="watchSeries" class="btn-primary py-3 px-6 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                Xem phim
              </button>

              <button @click="openTrailer" class="btn-secondary py-3 px-6 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Xem Trailer
              </button>

              <button @click="toggleFavorite" :class="['py-3 px-6 flex items-center', isFavorited ? 'btn-primary' : 'btn-outline']">
                <svg class="w-5 h-5 mr-2" :fill="isFavorited ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                {{ isFavorited ? 'Đã yêu thích' : 'Yêu thích' }}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Trailer modal -->
    <div v-if="showTrailer" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click="closeTrailer">
      <div class="relative max-w-5xl w-full aspect-video rounded-xl overflow-hidden shadow-2xl" @click.stop>
        <button @click="closeTrailer" class="absolute top-3 right-3 z-50 bg-black/60 text-white p-2 rounded-full hover:bg-black/80">✕</button>
        <iframe v-if="trailerSrc" :src="trailerSrc" frameborder="0" class="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>

    <!-- Tabs -->
    <div class="container pt-6">
      <div class="flex border-b border-gray-800 mb-6 overflow-x-auto scrollbar-hide">
        <button @click="activeTab = 'overview'" :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'overview' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">Tổng quan</button>
        <button @click="activeTab = 'episodes'" :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'episodes' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">Tập</button>
        <button @click="activeTab = 'cast'" :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'cast' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">Diễn viên</button>
        <button @click="activeTab = 'reviews'" :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'reviews' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">Đánh giá <span class="text-gray-500">({{ movie.reviews.length }})</span></button>
        <button @click="activeTab = 'similar'" :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'similar' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">Phim tương tự</button>
      </div>

      <!-- Tab content -->
      <div>
        <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold text-white mb-4">Nội dung</h2>
            <p class="text-gray-300 leading-relaxed mb-8 text-lg">{{ movie.description }}</p>

            <h2 class="text-2xl font-bold text-white mb-4">Trailer chính thức</h2>
            <div v-if="movie.trailerKey" class="aspect-video rounded-xl overflow-hidden mb-8 bg-gray-800">
              <iframe :src="`https://www.youtube.com/embed/${movie.trailerKey}?rel=0`" frameborder="0" class="w-full h-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>

          <div>
            <div class="bg-dark-800 border border-gray-800 rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Thông tin</h2>
              <div class="space-y-4">
                <div class="flex justify-between"><span class="text-gray-400">Đạo diễn</span><span class="text-white">{{ movie.director }}</span></div>
                <div class="border-b border-gray-700"></div>
                <div class="flex justify-between"><span class="text-gray-400">Ngày phát hành</span><span class="text-white">{{ formattedReleaseDate }}</span></div>
                <div class="border-b border-gray-700"></div>
                <div class="flex justify-between"><span class="text-gray-400">Số tập</span><span class="text-white">{{ movie.totalEpisodes }} tập</span></div>
                <div class="border-b border-gray-700"></div>
                <div class="flex justify-between"><span class="text-gray-400">Quốc gia</span><span class="text-white">{{ movie.countries && movie.countries.length ? movie.countries.map(c => c.name || c).join(', ') : '' }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Episodes tab -->
        <div v-else-if="activeTab === 'episodes'">
          <div class="mb-4 flex items-center gap-4">
            <label class="text-gray-300">Mùa:</label>
            <div class="flex gap-2 flex-wrap">
              <button v-for="s in seasons" :key="s" @click="selectedSeason = s" :class="['px-3 py-1 rounded', selectedSeason === s ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-300']">S{{ s }}</button>
            </div>
          </div>

          <div class="flex flex-wrap items-start gap-2">
            <button 
              v-for="(ep, idx) in episodes" 
              :key="ep._id || ep.id" 
              class="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-md text-white font-semibold text-sm transition-colors"
              @click="openEpisode(ep)"
              :title="`Tập ${ep.episodeNumber || ep.number || (idx + 1)}`"
            >
              {{ ep.episodeNumber || ep.number || (idx + 1) }}
            </button>
          </div>
          <div v-if="!episodes.length" class="text-gray-500 py-6">Không có tập nào.</div>
        </div>

        <!-- Cast -->
        <div v-else-if="activeTab === 'cast'">
          <h2 class="text-2xl font-bold text-white mb-6">Diễn viên</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div v-for="actor in movie.cast" :key="actor.id" class="bg-dark-800 border border-gray-800 rounded-xl overflow-hidden group cursor-pointer">
              <div class="aspect-[2/3] overflow-hidden bg-gray-700">
                <img :src="actor.image || '/images/placeholder-actor.png'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div class="p-4">
                <h3 class="text-white font-medium truncate">{{ actor.name }}</h3>
                <p class="text-gray-400 text-sm truncate">{{ actor.character }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div v-else-if="activeTab === 'reviews'">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-white">Đánh giá</h2>
            <button v-if="!isAuthenticated" @click="$router.push({ name: 'login', query: { redirect: route.fullPath } })" class="btn-outline py-2 px-4">Đăng nhập để viết</button>
            <button v-else @click="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn-outline py-2 px-4">Viết đánh giá</button>
          </div>

          <div class="space-y-6 mb-6">
            <div v-for="review in movie.reviews" :key="review._id || review.id" class="relative bg-dark-800 border border-gray-800 rounded-xl p-6 overflow-hidden">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img v-if="review.user?.avatar" :src="getMediaUrl(review.user.avatar)" alt="avatar" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-primary-600 flex items-center justify-center text-white font-medium">
                    {{ (review.user?.fullName || review.author || 'U').charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-white font-medium">
                    {{ review.user?.fullName || review.author || 'Người dùng' }}
                    <span v-if="currentUserId && String(review.user?._id || review.user?.id) === String(currentUserId)" class=" text-xs text-primary-400">(bạn)</span>
                  </h4>
                  <p class="text-gray-400 text-sm">{{ new Date(review.updatedAt || review.date || review.createdAt).toLocaleDateString() }}</p>
                </div>
              </div>
              <p class="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">{{ review.comment || review.content }}</p>
              <!-- show rating badge only when review has rating -->
              <div v-if="review.rating !== undefined && review.rating !== null && review.rating !== ''" class="absolute top-4 right-4 flex items-center gap-3">
                <div class="flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full shadow-sm">
                  <svg class="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <span class="text-white font-semibold text-sm">{{ review.rating }}/5</span>
                </div>
              </div>
            </div>
            <div v-if="!movie.reviews || movie.reviews.length === 0" class="text-gray-500">Chưa có đánh giá nào.</div>
          </div>

          <div v-if="isAuthenticated" class="bg-dark-800 border border-gray-800 rounded-xl p-6 mb-6">
            <div class="mb-4">
              <label class="text-sm text-gray-300 block mb-2">Đánh giá của bạn</label>
              <div class="flex items-center gap-2">
                <div class="flex items-center">
                  <button v-for="n in 5" :key="n" type="button" @click="userRating = n" class="px-1">
                    <svg v-if="n <= userRating" class="w-6 h-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg v-else class="w-6 h-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </button>
                </div>
                <span class="text-gray-400">({{ userRating }})</span>
              </div>
            </div>
            <div class="mb-4">
              <label class="text-sm text-gray-300 block mb-2">Bình luận</label>
              <textarea v-model="userComment" rows="4" class="w-full bg-dark-700 text-black p-3 rounded resize-none" placeholder="Viết cảm nhận..."></textarea>
            </div>
            <div class="flex justify-end">
              <button @click="submitReview" :disabled="submittingReview" class="btn-primary py-2 px-4">{{ submittingReview ? 'Đang gửi...' : 'Gửi đánh giá' }}</button>
            </div>
          </div>
        </div>

        <!-- Similar -->
        <div v-else-if="activeTab === 'similar'">
          <h2 class="text-2xl font-bold text-white mb-6">Phim tương tự</h2>
          <div v-if="loadingSimilar" class="text-gray-400 py-8">Đang tải...</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div v-for="s in movie.similar" :key="s.id" class="movie-card group cursor-pointer" @click="$router.push({ name: 'movie-detail', params: { id: s.id } })">
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
                <img :src="s.poster" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span class="text-yellow-400 text-xs font-semibold">{{ s.rating }}</span>
                </div>
              </div>
              <div class="mt-2">
                <h3 class="text-white font-medium truncate">{{ s.title }}</h3>
                <p class="text-gray-400 text-sm">{{ s.year }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>