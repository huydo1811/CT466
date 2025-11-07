<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

// player state
const videoPlayer = ref(null)
const videoContainer = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isLoading = ref(true)
const volume = ref(100)
const showControls = ref(true)
const controlsTimeout = ref(null)
const videoQuality = ref('1080p')

// episode / series
const episode = ref(null)
const series = ref(null)
const episodes = ref([])
const epPage = ref(1)
const epLimit = ref(1000) // load many episodes for selector

// helpers
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  const baseRaw = api?.defaults?.baseURL || ''
  const base = baseRaw ? baseRaw.replace(/\/api\/?$/i, '') : window.location.origin
  return `${base}${u.startsWith('/') ? u : '/' + u}`
}

const videoSrc = computed(() => getMediaUrl(episode.value?.videoUrl || episode.value?.video || ''))
const currentEpisodeId = computed(() => episode.value?._id || episode.value?.id || null)

// fetch functions
const fetchEpisode = async (id) => {
  isLoading.value = true
  try {
    const res = await api.get(`/episodes/${id}`)
    episode.value = res?.data?.data || res?.data || null

    let movieId = null
    if (episode.value?.movie) {
      movieId = (typeof episode.value.movie === 'object') ? (episode.value.movie._id || episode.value.movie.id) : episode.value.movie
    }

    if (movieId) {
      if (typeof episode.value.movie === 'object') series.value = episode.value.movie
      else {
        const m = await api.get(`/movies/${movieId}`)
        series.value = m?.data?.data || m?.data || null
      }
      await fetchEpisodesForSeries(movieId, episode.value?.season || 1)
    }
    await fetchReviewsForEpisode(episode.value?._id || episode.value?.id)
  } catch (e) {
    console.error('fetchEpisode error', e)
    episode.value = null
  } finally {
    isLoading.value = false
  }
}

const fetchEpisodesForSeries = async (movieId, season = 1) => {
  try {
    if (!movieId) return
    const mid = (typeof movieId === 'object') ? (movieId._id || movieId.id) : movieId
    if (!mid) return
    const res = await api.get(`/episodes/movie/${mid}`, { params: { season, page: epPage.value, limit: epLimit.value, sortBy: 'episodeNumber' }})
    episodes.value = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : [])
  } catch (e) {
    console.error('fetchEpisodesForSeries error', e)
    episodes.value = []
  }
}

// reviews per episode
const reviews = ref([])
const fetchReviewsForEpisode = async (eid) => {
  reviews.value = []
  if (!eid) return
  try {
    const res = await api.get(`/reviews/episode/${eid}`)
    reviews.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.error('fetchReviewsForEpisode error', e)
    // fallback: some backends keep episode reviews under movie reviews; ignore silently
    reviews.value = []
  }
}

// review form / user state
const isAuthenticated = computed(() => !!(localStorage.getItem('token') || api.defaults.headers.common['Authorization']))
const currentUserId = ref(null)
const myComment = ref('')
const submittingReview = ref(false)
const submitError = ref(null)

const fetchCurrentUser = async () => {
  try {
    if (!isAuthenticated.value) { currentUserId.value = null; return }
    const res = await api.get('/users/me')
    const u = res?.data?.data || res?.data || null
    currentUserId.value = u?._id || u?.id || null
  } catch (e) { 
    console.error('fetchCurrentUser error', e)
    currentUserId.value = null }
}

const submitEpisodeReview = async () => {
  submitError.value = null
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath }})
    return
  }
  if (!episode.value) return
  const eid = episode.value._id || episode.value.id
  if (!eid) return
  try {
    submittingReview.value = true
    const res = await api.post(`/reviews/episode/${eid}`, { comment: String(myComment.value || '').trim() })
    if (res?.data?.data) {
      // add to top
      reviews.value.unshift(res.data.data)
      myComment.value = ''
    } else {
      await fetchReviewsForEpisode(eid)
    }
  } catch (e) {
    submitError.value = e?.response?.data?.message || 'Lỗi gửi đánh giá'
    console.error('submitEpisodeReview error', e)
  } finally {
    submittingReview.value = false
  }
}

// playback controls
const togglePlay = () => {
  const v = videoPlayer.value
  if (!v) return
  if (v.paused) { v.play(); isPlaying.value = true }
  else { v.pause(); isPlaying.value = false }
}
const toggleMute = () => { const v = videoPlayer.value; if (!v) return; v.muted = !v.muted; isMuted.value = v.muted }
const toggleFullscreen = () => { if (!document.fullscreenElement) { videoContainer.value.requestFullscreen(); isFullscreen.value = true } else { document.exitFullscreen(); isFullscreen.value = false } }

const handleVolumeChange = (e) => {
  const v = videoPlayer.value
  if (!v) return
  volume.value = Number(e.target.value)
  v.volume = volume.value / 100
  isMuted.value = v.volume === 0
}

const onLoadedMetadata = () => { duration.value = videoPlayer.value.duration; isLoading.value = false }
const onTimeUpdate = () => { currentTime.value = videoPlayer.value.currentTime }
const onVideoEnded = () => { isPlaying.value = false }

// seek logic (pointer)
let seeking = false
const startSeek = (ev) => {
  seeking = true
  onPointerMove(ev)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}
const onPointerMove = (ev) => {
  if (!seeking || !ev) return
  const bar = document.querySelector('.series-progress-bar')
  const rect = bar?.getBoundingClientRect?.() || { left: 0, width: window.innerWidth }
  const clientX = ev.clientX || (ev.touches && ev.touches[0] && ev.touches[0].clientX) || 0
  const pos = Math.min(Math.max(0, clientX - rect.left), rect.width)
  const pct = rect.width > 0 ? (pos / rect.width) : 0
  if (videoPlayer.value && typeof videoPlayer.value.duration === 'number' && !isNaN(videoPlayer.value.duration)) {
    videoPlayer.value.currentTime = pct * videoPlayer.value.duration
    currentTime.value = videoPlayer.value.currentTime
  }
}
const onPointerUp = () => { seeking = false; window.removeEventListener('pointermove', onPointerMove) }
const seekVideo = (e) => {
  const el = e.currentTarget || e.target
  const rect = el.getBoundingClientRect()
  const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0
  const pos = Math.min(Math.max(0, clientX - rect.left), rect.width)
  const pct = rect.width > 0 ? (pos / rect.width) : 0
  if (videoPlayer.value && typeof videoPlayer.value.duration === 'number' && !isNaN(videoPlayer.value.duration)) {
    videoPlayer.value.currentTime = pct * videoPlayer.value.duration
    currentTime.value = videoPlayer.value.currentTime
  }
}

// UI helpers
const formatTime = (s) => {
  const sec = Number(s) || 0
  const hrs = Math.floor(sec / 3600)
  const mins = Math.floor((sec % 3600) / 60)
  const secs = Math.floor(sec % 60)
  if (hrs > 0) return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
  return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
}
const progressPercentage = computed(() => {
  if (!duration.value || duration.value === 0) return 0
  return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
})
const timeDisplay = computed(() => `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`)

function hideControls() {
  if (controlsTimeout.value) clearTimeout(controlsTimeout.value)
  controlsTimeout.value = setTimeout(() => { if (isPlaying.value) showControls.value = false }, 3000)
}
function showControlsOnMove() { showControls.value = true; hideControls() }

// episode actions: favorite for episode (frontend attempts same endpoint as movies)
const isFavorited = ref(false)
const updateEpisodeFavorite = async () => {
  try {
    if (!episode.value) { isFavorited.value = false; return }
    const res = await api.get('/users/me')
    const favs = res?.data?.data?.favorites || res?.data?.data?.favoriteMovies || []
    const eid = episode.value._id || episode.value.id
    isFavorited.value = favs.some(f => String(f._id || f.id || f) === String(eid))
  } catch (e) { isFavorited.value = false
    console.error('updateEpisodeFavorite error', e)
  }
}

// play episode (navigate)
const playEpisode = (ep) => {
  const id = ep._id || ep.id
  if (!id) return
  router.push({ name: 'watch-series', params: { seriesId: ep.movie || series.value?.id, episodeId: id }})
}

// watch handlers
watch(episode, async (ep) => {
  await nextTick()
  const v = videoPlayer.value
  if (!v) return
  v.pause()
  v.src = videoSrc.value || ''
  try { v.load() } catch (e) {
    console.error('video load error', e)
  }
  try { await v.play(); isPlaying.value = true } catch (e) { 
    isPlaying.value = false 
    console.error('video play error', e)}
  // update favorite/reviews state
  updateEpisodeFavorite()
  await fetchReviewsForEpisode(ep?._id || ep?.id)
})

// route params
onMounted(() => {
  const eid = route.params.episodeId || route.params.id
  if (eid) fetchEpisode(eid)
  else {
    const seriesId = route.params.seriesId || route.params.movieId
    if (seriesId) fetchEpisodesForSeries(seriesId, 1)
  }
  void fetchCurrentUser()
})
watch(() => route.params.episodeId, (v) => { if (v) fetchEpisode(v) })
</script>

<template>
  <div class="bg-dark-900 min-h-screen pb-10">
    <div class="relative bg-black">
      <div
        ref="videoContainer"
        class="relative w-full aspect-video max-h-[85vh]"
        @mousemove="showControlsOnMove"
        @mouseleave="showControls = false"
        :class="{'cursor-none': !showControls && isPlaying}"
      >
        <video
          ref="videoPlayer"
          class="w-full h-full object-contain bg-black"
          :src="videoSrc"
          @click="togglePlay"
          @loadedmetadata="onLoadedMetadata"
          @timeupdate="onTimeUpdate"
          @ended="onVideoEnded"
        ></video>

        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/70">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <div v-if="!isLoading" class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <div class="mb-2 relative">
            <div class="text-xs text-gray-300 mb-2 text-right pr-1 select-none" v-if="showControls">{{ timeDisplay }}</div>
            <div class="h-1.5 bg-gray-600/50 rounded-full cursor-pointer series-progress-bar" @click="seekVideo" @pointerdown.prevent="startSeek">
              <div class="h-full bg-primary-500 rounded-full" :style="`width:${progressPercentage}%`"></div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button @click="togglePlay" class="text-white hover:text-primary-400 transition">
                <svg v-if="isPlaying" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M14,19H18V5H14M6,19H10V5H6V19Z"/></svg>
                <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
              </button>

              <div class="flex items-center space-x-2">
                <button @click="toggleMute" class="text-white hover:text-primary-400 transition">
                  <svg v-if="isMuted" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/></svg>
                  <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9Z"/></svg>
                </button>
                <input type="range" min="0" max="100" :value="volume" @input="handleVolumeChange" class="w-28 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer">
              </div>

              <span class="text-white text-sm hidden sm:block">{{ timeDisplay }}</span>
            </div>

            <div class="flex items-center space-x-4">
              <div class="relative group">
                <button class="text-white hover:text-primary-400 transition text-sm px-2 py-1 rounded-md bg-gray-800/50">{{ videoQuality }} <span class="text-xs">▼</span></button>
                <div class="absolute bottom-full mb-2 right-0 bg-gray-800/95 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div class="py-2 min-w-[80px]">
                    <button v-for="q in ['1080p','720p','480p']" :key="q" @click="videoQuality = q" class="w-full px-4 py-1.5 text-sm text-left hover:bg-primary-500/20 transition" :class="{'text-primary-500': q === videoQuality, 'text-white': q !== videoQuality}">{{ q }}</button>
                  </div>
                </div>
              </div>

              <button @click="toggleFullscreen" class="text-white hover:text-primary-400 transition">
                <svg v-if="isFullscreen" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/></svg>
                <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7,14H5V19H10V17H7V14M5,10H7V7H10V5H5V10M17,17H14V19H19V14H17V17M14,5V7H17V10H19V5H14Z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container py-6">
      <div class="flex items-center justify-between gap-4 mt-6 mb-2">
        <h1 class="text-2xl sm:text-3xl font-bold text-white m-0 flex-1">
          {{ series?.title || 'Đang tải...' }} <span class="text-xl font-medium text-gray-300">- Tập {{ episode?.episodeNumber || episode?.number || '-' }}</span>
        </h1>
        <div class="flex-shrink-0">
          <RouterLink
            :to="{ name: 'series-detail', params: { id: series?._id || series?.id || episode?.movie } }"
            class="btn-outline px-3 py-1 sm:px-5 sm:py-2 flex items-center text-sm sm:text-base"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Thông tin series
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="container py-2">
      <h1 class="text-xl text-white mb-4">Danh sách tập</h1>
      <div class="mb-6">
        <div class="flex flex-wrap items-start gap-2">
          <button v-for="(ep, idx) in episodes" :key="ep._id || ep.id" @click="playEpisode(ep)"
            :title="`Tập ${ep.episodeNumber || ep.number || (idx + 1)}`"
            :class="[
              'w-10 h-10 flex items-center justify-center rounded-md text-white font-semibold text-sm transition-colors',
              currentEpisodeId === (ep._id || ep.id) ? 'bg-gray-600 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'
            ]"
          >
            {{ ep.episodeNumber || ep.number || (idx + 1) }}
          </button>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-bold text-white mb-4">Bình luận ({{ reviews.length }})</h2>

        <!-- Review form (per-episode) -->
        <div class="bg-dark-800 border border-gray-700 rounded-xl p-4 mb-6">
          <form @submit.prevent="submitEpisodeReview">
            <div class="flex items-center gap-3 mb-3">
              <div class="ml-auto text-sm text-gray-400" v-if="!isAuthenticated">Bạn cần <RouterLink :to="{name:'login'}" class="text-primary-400">đăng nhập</RouterLink> để bình luận</div>
              <button class="btn-primary px-4 py-2" :disabled="submittingReview || !isAuthenticated">{{ submittingReview ? 'Đang gửi...' : 'Gửi bình luận' }}</button>
            </div>
            <textarea v-model="myComment" rows="3" placeholder="Viết nhận xét..." class="w-full bg-dark-900 text-white p-3 rounded mb-2"></textarea>
            <div v-if="submitError" class="text-red-400 text-sm">{{ submitError }}</div>
          </form>
        </div>

        <!-- Reviews list -->
        <div class="space-y-4">
          <div v-for="comment in reviews" :key="comment._id || comment.id" class="bg-dark-800 border border-gray-700 rounded-xl p-4">
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
                  <!-- episode comments: no rating for episode -->
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
          <div v-if="reviews.length === 0" class="text-gray-500">Chưa có đánh giá cho tập này.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.series-progress-bar { height: 6px; border-radius: 9999px; }
</style>