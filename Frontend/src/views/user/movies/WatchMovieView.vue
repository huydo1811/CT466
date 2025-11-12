<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

// UI / player states
const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(100)
const videoQuality = ref('1080p')
const showControls = ref(true)
const controlsTimeout = ref(null)
const videoContainer = ref(null)
const videoPlayer = ref(null)
const isLoading = ref(true)

// movie + reviews
const movie = ref({
  id: null,
  title: '',
  poster: '',
  description: '',
  duration: '',
  videoSrc: '',
  videoUrl: '',
  qualities: ['1080p','720p','480p','360p'],
  genres: [],
  cast: [],
  reviews: [],
  related: []
})

const loading = ref(false)

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
    console.warn('fetchCurrentUser failed', e)
    currentUser.value = null
    currentUserId.value = null
  }
}

// helpers
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

const extractYouTubeId = (s) => {
  if (!s) return ''
  if (/^[0-9A-Za-z_-]{11}$/.test(s)) return s
  const m = String(s).match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  return m ? m[1] : ''
}

// normalize movie payload (map videoUrl, poster, cast, reviews)
const normalizeMovie = (m) => {
  if (!m) return {}
  const trailerKey = extractYouTubeId(m.trailerKey || m.trailer || m.trailerUrl || m.trailer_link || '')
  const poster = getMediaUrl(m.poster || m.posterUrl || m.thumbnail)
  const backdrop = getMediaUrl(m.backdrop || m.backdropUrl)
  const videoSrc = m.videoUrl || m.videoSrc || ''
  const castRaw = Array.isArray(m.cast) ? m.cast : (Array.isArray(m.actors) ? m.actors : [])
  const cast = castRaw.map(a => {
    if (!a) return { id: null, name: '', character: '', image: '' }
    if (typeof a === 'string' || typeof a === 'number') return { id: a, name: '', character: '', image: '' }
    return {
      id: a._id || a.id || null,
      name: a.name || a.fullName || '',
      character: a.character || a.role || '',
      image: getMediaUrl(a.image || a.photo || a.avatar)
    }
  })
  return {
    ...m,
    id: m._id || m.id || null,
    poster,
    backdrop,
    trailerKey,
    videoSrc,
    videoUrl: videoSrc,
    cast,
    reviews: m.reviews || [],
    genres: Array.isArray(m.genres) ? m.genres : []
  }
}

// fetch reviews if backend didn't include reviews in movie object
const fetchReviewsIfNeeded = async (movieId) => {
  try {
    if (!movieId) return
    if (Array.isArray(movie.value.reviews) && movie.value.reviews.length) return
    const res = await api.get(`/reviews/movie/${movieId}`, { params: { limit: 1000 } })
    const list = res?.data?.data || res?.data || []
    movie.value.reviews = list
  } catch (e) {
    console.warn('fetchReviewsIfNeeded failed', e)
    movie.value.reviews = movie.value.reviews || []
  }
}

const relatedList = computed(() => {
  const arr = Array.isArray(movie.value.related) ? movie.value.related : []
  return arr.filter(rel => rel && (rel.slug || rel.id || rel._id)).slice(0, 12)
})

// slug-only fetch wrapper
const fetchMovieBySlug = async (slug) => {
  if (!slug) return
  loading.value = true
  try {
    const res = await api.get(`/movies/slug/${encodeURIComponent(slug)}`)
    const data = res?.data?.data || res?.data || null
    if (!data) { router.replace({ name: 'movies' }); return }
    const normalized = normalizeMovie(data)
    Object.assign(movie.value, normalized)
    await fetchReviewsIfNeeded(movie.value.id || '')
    // fetch related by genres
    await fetchRelatedMovies(movie.value)
  } catch (err) {
    console.error('fetchMovie error', err)
  } finally {
    loading.value = false
  }
}

// favorite + review actions
const isFavorited = ref(false)
const updateFavoriteStatus = async () => {
  try {
    if (!isAuthenticated.value) { isFavorited.value = false; return }
    const res = await api.get('/users/me')
    const favs = res?.data?.data?.favorites || res?.data?.data?.favoriteMovies || []
    const mid = movie.value.id // require real ObjectId populated by fetchMovieBySlug
    isFavorited.value = mid ? favs.some(f => String(f._id || f.id || f) === String(mid)) : false
  } catch (e) {
    console.warn('updateFavoriteStatus failed', e)
  }
}

const toggleFavorite = async () => {
  if (!isAuthenticated.value) { router.push({ name: 'login', query: { redirect: route.fullPath } }); return }
  const mid = movie.value.id
  if (!mid) return
  try {
    if (!isFavorited.value) {
      await api.post(`/users/me/favorites/${mid}`)
      isFavorited.value = true
    } else {
      await api.delete(`/users/me/favorites/${mid}`)
      isFavorited.value = false
    }
    // refresh current movie by slug to keep UI consistent
    await fetchMovieBySlug(movie.value.slug || route.params.slug)
  } catch (e) {
    console.error('toggleFavorite failed', e)
  }
}

// review form
const userRating = ref(5)
const userComment = ref('')
const submittingReview = ref(false)

const submitReview = async () => {
  if (!isAuthenticated.value) { router.push({ name: 'login', query: { redirect: route.fullPath } }); return }
  if (!movie.value.id) return
  submittingReview.value = true
  try {
    const movieId = movie.value.id
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
    console.error('submitReview error', err)
    if (err?.response?.status === 401) router.push({ name: 'login', query: { redirect: route.fullPath } })
  } finally {
    submittingReview.value = false
  }
}

async function incrementMovieViewOnce(movieId, ttlMinutes = 60) {
  if (!movieId) return
  try {
    const key = `viewed_movie_${movieId}`
    const last = Number(localStorage.getItem(key) || 0)
    const now = Date.now()
    if (last && (now - last) < (ttlMinutes * 60 * 1000)) return
    await api.post(`/movies/${movieId}/view`)
    localStorage.setItem(key, String(now))
  } catch (e) {
    console.warn('incrementMovieView failed', e)
  }
}

/* thay thế togglePlay để gọi increment khi bắt đầu play */
function togglePlay() {
  const video = videoPlayer.value
  if (!video) return
  if (video.paused) {
    video.play()
    isPlaying.value = true
    // gọi increment 1 lần khi bắt đầu phát — ưu tiên movie.value.id (ObjectId)
    const mid = movie.value.id || movie.value._id || movie.value.slug
    if (mid) incrementMovieViewOnce(mid, 60)
  } else {
    video.pause()
    isPlaying.value = false
  }
}
function toggleMute() { const video = videoPlayer.value; if (!video) return; video.muted = !video.muted; isMuted.value = video.muted }
function toggleFullscreen() { if (!document.fullscreenElement) { videoContainer.value.requestFullscreen(); isFullscreen.value = true } else { document.exitFullscreen(); isFullscreen.value = false } }
function handleVolumeChange(e) { const video = videoPlayer.value; if (!video) return; volume.value = e.target.value; video.volume = volume.value / 100; isMuted.value = video.volume === 0 }
function seekVideo(e) { const video = videoPlayer.value; if (!video) return; const rect = e.target.getBoundingClientRect(); const pos = (e.clientX - rect.left) / rect.width; video.currentTime = pos * video.duration }
function hideControls() { if (controlsTimeout.value) clearTimeout(controlsTimeout.value); controlsTimeout.value = setTimeout(() => { if (isPlaying.value) showControls.value = false }, 3000) }
function showControlsOnMove() { showControls.value = true; hideControls() }
function changeQuality(quality) { videoQuality.value = quality; const currentPlaybackPosition = videoPlayer.value?.currentTime || 0; isLoading.value = true; setTimeout(() => { videoPlayer.value.currentTime = currentPlaybackPosition; isLoading.value = false; togglePlay() }, 800) }

function onLoadedMetadata() { duration.value = videoPlayer.value.duration; isLoading.value = false }
function onTimeUpdate() { currentTime.value = videoPlayer.value.currentTime }
function onVideoEnded() { isPlaying.value = false }

// progress computed
const progressPercentage = computed(() => {
  if (!duration.value || duration.value === 0) return 0
  return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
})

// helper: format seconds -> mm:ss / hh:mm:ss
const formatTime = (s) => {
  const sec = Number(s) || 0
  const hrs = Math.floor(sec / 3600)
  const mins = Math.floor((sec % 3600) / 60)
  const secs = Math.floor(sec % 60)
  if (hrs > 0) return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const timeDisplay = computed(() => {
  return `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`
})

// pointer seek (drag) state
let seeking = false

const startSeek = (ev) => {
  seeking = true
  // initial position update
  onPointerMove(ev)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}

const onPointerMove = (ev) => {
  if (!seeking || !ev) return
  // find progress bar element from event.currentTarget if available, fallback to querySelector
  const bar = (ev.currentTarget && ev.currentTarget.closest) ? ev.currentTarget : document.querySelector('.movie-progress-bar') || ev.currentTarget
  const rect = (bar && bar.getBoundingClientRect) ? bar.getBoundingClientRect() : { left: 0, width: window.innerWidth }
  const clientX = ev.clientX || (ev.touches && ev.touches[0] && ev.touches[0].clientX) || 0
  const pos = Math.min(Math.max(0, clientX - rect.left), rect.width)
  const pct = rect.width > 0 ? (pos / rect.width) : 0
  if (videoPlayer.value && typeof videoPlayer.value.duration === 'number' && !isNaN(videoPlayer.value.duration)) {
    videoPlayer.value.currentTime = pct * videoPlayer.value.duration
    // update reactive time immediately
    currentTime.value = videoPlayer.value.currentTime
  }
}

const onPointerUp = () => {
  seeking = false
  window.removeEventListener('pointermove', onPointerMove)
}

// related movies fetch
const fetchRelatedMovies = async (movieObj) => {
  try {
    if (!movieObj) return
    const genres = Array.isArray(movieObj.genres) ? movieObj.genres.filter(Boolean) : []
    if (!genres.length) {
      movie.value.related = []
      return
    }
    const params = { genres: genres.join(','), limit: 12 }
    const res = await api.get('/movies', { params })
    const items = res?.data?.data || res?.data || []
    // normalize and exclude current movie
    const related = (Array.isArray(items) ? items : (items.items || [])).filter(m => (m._id || m.id) !== (movieObj.id || movieObj._id)).slice(0, 12).map(m => ({
      id: m._id || m.id,
      title: m.title || m.name || '',
      poster: (m.poster && (/^https?:\/\//.test(m.poster) ? m.poster : `${window.location.origin}${m.poster}`)) || (m.thumbnail ? `${window.location.origin}${m.thumbnail}` : ''),
      year: m.year || m.releaseYear || '',
      duration: m.duration || m.length || ''
    }))
    movie.value.related = related
  } catch (e) {
    console.warn('fetchRelatedMovies failed', e)
    movie.value.related = movie.value.related || []
  }
}

// lifecycle
onMounted(async () => {
  const slug = route.params.slug
  // load movie first (by slug) so we have real movie.id, then fetch reviews/favorites
  if (slug) {
    await fetchMovieBySlug(slug)
    await updateFavoriteStatus()
    // now that movie.value.id is set, fetch reviews by real id
    if (movie.value?.id || movie.value?._id) {
      await fetchReviewsIfNeeded(movie.value.id || movie.value._id)
    }
  } else {
    // still ensure user loaded for favorite UI
    await fetchCurrentUser()
    await updateFavoriteStatus()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', () => {})
  if (controlsTimeout.value) clearTimeout(controlsTimeout.value)
  // remove any pointer listeners left
  window.removeEventListener('pointermove', onPointerMove)
})

watch(() => route.params.slug, (newSlug) => { 
  if (newSlug) {
    void fetchMovieBySlug(newSlug).then(() => updateFavoriteStatus())
  }
})
watch(isAuthenticated, (v) => { 
  if (v) {
    fetchCurrentUser().then(() => updateFavoriteStatus())
  } else { currentUser.value = null; currentUserId.value = null; isFavorited.value = false }
})
</script>

<template>
  <div class="bg-dark-900 min-h-screen pb-10">
    <!-- Player section -->
    <div class="relative bg-black">
      <div 
        ref="videoContainer" 
        class="relative w-full aspect-video max-h-[85vh]"
        @mousemove="showControlsOnMove"
        @mouseleave="showControls = false"
        :class="{'cursor-none': !showControls && isPlaying}"
      >
        <!-- Video element -->
        <video 
          ref="videoPlayer"
          class="w-full h-full object-contain bg-black"
          @click="togglePlay"
          @loadedmetadata="onLoadedMetadata"
          @timeupdate="onTimeUpdate"
          @ended="onVideoEnded"
          @pause="isPlaying = false"
          @play="isPlaying = true"
          :src="movie.videoSrc"
        ></video>
        
        <!-- Loading overlay -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/70">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
        
        <!-- Play/Pause big button overlay (shown briefly when toggling) -->
        <div 
          v-if="!isLoading" 
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
          :class="{'opacity-0': !showControls || isLoading}"
        >
          <button class="w-20 h-20 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-opacity">
            <svg v-if="isPlaying" class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
            <svg v-else class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
          </button>
        </div>
        
        <!-- Video controls (bottom bar) -->
        <div 
          v-if="!isLoading"
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300"
          :class="{'opacity-0': !showControls && isPlaying}"
        >
          <!-- Progress bar -->
          <div class="mb-2 relative">
            <div class="text-xs text-gray-300 mb-2 text-right pr-1 select-none" v-if="showControls">
              {{ timeDisplay }}
            </div>
            <div 
              class="h-1.5 bg-gray-600/50 rounded-full cursor-pointer movie-progress-bar relative"
              @click="seekVideo"
              @pointerdown.prevent="startSeek"
            >
              <div class="h-full bg-primary-500 rounded-full relative" :style="`width: ${progressPercentage}%`">
                <div class="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full"></div>
              </div>

              <!-- floating time label over thumb -->
              <div
                v-if="showControls"
                class="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 bg-black/80 text-xs text-white rounded"
                :style="`left: ${Math.max(6, Math.min(94, progressPercentage))}%`"
              >
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </div>
            </div>
          </div>
          
          <!-- Controls row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Play/Pause -->
              <button @click="togglePlay" class="text-white hover:text-primary-400 transition">
                <svg v-if="isPlaying" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
                <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
              </button>
              
              <!-- Volume -->
              <div class="flex items-center space-x-2">
                <button @click="toggleMute" class="text-white hover:text-primary-400 transition">
                  <svg v-if="isMuted" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                  </svg>
                  <svg v-else-if="volume.value === 0" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
                  </svg>
                  <svg v-else-if="volume.value < 50" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                  </svg>
                  <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                  </svg>
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  v-model="volume" 
                  @input="handleVolumeChange"
                  class="w-20 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                >
              </div>
              
              <!-- Time display -->
              <span class="text-white text-sm hidden sm:block">{{ timeDisplay }}</span>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Quality selector -->
              <div class="relative group">
                <button class="text-white hover:text-primary-400 transition text-sm px-2 py-1 rounded-md bg-gray-800/50">
                  {{ videoQuality }} <span class="text-xs">▼</span>
                </button>
                <div class="absolute bottom-full mb-2 right-0 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div class="py-2 min-w-[80px]">
                    <button 
                      v-for="quality in movie.qualities" 
                      :key="quality" 
                      @click="changeQuality(quality)"
                      class="w-full px-4 py-1.5 text-sm text-left hover:bg-primary-500/20 transition"
                      :class="{'text-primary-500': quality === videoQuality, 'text-white': quality !== videoQuality}"
                    >
                      {{ quality }}
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Fullscreen toggle -->
              <button @click="toggleFullscreen" class="text-white hover:text-primary-400 transition">
                <svg v-if="isFullscreen" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" />
                </svg>
                <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7,14H5V19H10V17H7V14M5,10H7V7H10V5H5V10M17,17H14V19H19V14H17V17M14,5V7H17V10H19V5H14Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-6">
      <!-- Movie info -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-1">{{ movie.title }}</h1>
            <div class="flex items-center flex-wrap gap-3">
              <span class="text-gray-400">{{ movie.year }}</span>
              <span class="text-gray-400">{{ movie.duration }} phút</span>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="genre in movie.genres" 
                  :key="genre"
                  class="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full"
                >
                  {{ genre }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <button @click="toggleFavorite" :class="['py-3 px-6 flex items-center', isFavorited ? 'btn-primary' : 'btn-outline']">
              <svg class="w-5 h-5 mr-2" :fill="isFavorited ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              {{ isFavorited ? 'Đã yêu thích' : 'Yêu thích' }}
            </button>
            <RouterLink 
              v-if="movie && (movie.slug || movie.id)"
              :to="{ name: 'movie-detail', params: { slug: movie.slug || movie.id } }" 
              class="btn-outline px-3 py-1 sm:px-5 sm:py-2 flex items-center text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Thông tin phim
            </RouterLink>
            <span v-else class="btn-outline px-3 py-1 sm:px-5 sm:py-2 text-sm sm:text-base text-gray-400">Thông tin phim</span>
          </div>
        </div>
        
        <!-- Description -->
        <p class="text-gray-300 mt-4">{{ movie.description }}</p>
      </div>
      
      <!-- Episode selector (if series) -->
      <div v-if="isSeries" class="mb-8">
        <h2 class="text-xl font-bold text-white mb-4">Các tập phim</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button 
            v-for="(ep, index) in movie.episodes" 
            :key="index"
            class="bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 transition"
          >
            Tập {{ index + 1 }}
          </button>
        </div>
      </div>
      
      <!-- Comments section -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-white mb-4">Bình luận ({{ movie.reviews.length }})</h2>
        
         <!-- Comment form -->
         <div class="bg-dark-800 border border-gray-700 rounded-xl p-4 mb-6">
          <form @submit.prevent="submitReview">
            <textarea 
              v-model="userComment"
              rows="3"
              placeholder="Viết bình luận của bạn..."
              class="w-full bg-dark-700 text-black border border-gray-700/60 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            ></textarea>
            <div class="flex justify-end mt-3">
              <button 
                type="submit"
                class="btn-primary px-5 py-2 flex items-center"
                :disabled="!userComment.trim() || submittingReview"
              >
                {{ submittingReview ? 'Đang gửi...' : 'Gửi bình luận' }}
              </button>
            </div>
          </form>
        </div>
        
         <!-- Comments list -->
         <div class="space-y-4">
          <div v-for="comment in movie.reviews" :key="comment._id || comment.id" class="bg-dark-800 border border-gray-700 rounded-xl p-4">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-primary-600/80 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {{ String(comment.user?.fullName || comment.author || comment.user || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="ml-3 flex-1">
                <div class="flex justify-between items-center mb-1">
                  <div>
                    <h4 class="text-white font-medium">
                      {{ comment.user?.fullName || comment.author || comment.user || 'Người dùng' }}
                      <span v-if="currentUserId && String(comment.user?._id || comment.user?.id) === String(currentUserId)" class="ml-2 text-xs text-primary-400">(bạn)</span>
                    </h4>
                    <p class="text-gray-400 text-xs">{{ new Date(comment.createdAt || comment.date || comment.time).toLocaleString() }}</p>
                  </div>
                </div>
                <p class="text-gray-300 mt-1">{{ comment.comment || comment.content || '' }}</p>
                <div class="mt-2 flex items-center text-gray-500 text-sm">
                  <button class="flex items-center hover:text-primary-400">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span>{{ comment.likes || 0 }}</span>
                  </button>
                  <button class="ml-4 hover:text-primary-400">Trả lời</button>
                </div>
              </div>
            </div>
          </div>
         </div>
      </div>
      
      <!-- Related movies -->
      <div>
        <h2 class="text-xl font-bold text-white mb-4">Phim tương tự</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <RouterLink 
            v-for="rel in relatedList" 
            :key="rel.id || rel._id || rel.slug"
            :to="{ name: 'movie-detail', params: { slug: rel.slug || rel._id || rel.id } }"
            class="movie-card group"
          >
             <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
               <img :src="rel.poster || rel.thumbnail || rel.image" :alt="rel.title || rel.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
               <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white">
                 {{ rel.duration || rel.length }}
               </div>
             </div>
             <div class="mt-2">
               <h3 class="text-white font-medium truncate">{{ rel.title || rel.name }}</h3>
               <p class="text-gray-400 text-sm">{{ rel.year }}</p>
             </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Chrome */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  margin-top: -6px;
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  border: none;
}

/* Hide video controls */
video::-webkit-media-controls {
  display: none !important;
}
</style>