<script setup>
import { ref, computed, onMounted, onBeforeUnmount} from 'vue'



// Player states
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

// Movie data (sẽ thay bằng API call sau)
const movie = ref({
  id: 1,
  title: "Spider-Man: No Way Home",
  year: 2021,
  poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man. The spell goes horribly wrong and shatters the multiverse, bringing in monstrous villains that could destroy the world.",
  duration: "148 phút",
  videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  genres: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
  
  // Episodes (nếu là phim bộ)
  episodes: [],
  
  // Chất lượng video
  qualities: ['1080p', '720p', '480p', '360p'],
  
  // Phim liên quan
  related: [
    { id: 202, title: "Spider-Man: Homecoming", poster: "https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg", year: 2017, duration: "133 phút" },
    { id: 203, title: "Spider-Man: Far From Home", poster: "https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg", year: 2019, duration: "129 phút" },
    { id: 204, title: "The Amazing Spider-Man", poster: "https://image.tmdb.org/t/p/w500/fSbqPbqXa7ePo8bcnZYN9AHv6zA.jpg", year: 2012, duration: "136 phút" },
    { id: 205, title: "Spider-Man", poster: "https://image.tmdb.org/t/p/w500/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg", year: 2002, duration: "121 phút" },
    { id: 201, title: "Doctor Strange in the Multiverse of Madness", poster: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg", year: 2022, duration: "126 phút" },
  ]
})

// Comments
const comments = ref([
  { id: 1, user: "MarvelFan", avatar: null, content: "Phim hay quá! Cảnh hành động đỉnh cao.", time: "2 giờ trước", likes: 24 },
  { id: 2, user: "SpideyLover", avatar: null, content: "Tom Holland là Spider-Man hay nhất từ trước đến nay!", time: "5 giờ trước", likes: 15 },
  { id: 3, user: "MovieCritic", avatar: null, content: "Cốt truyện rất thú vị, kết hợp nhiều vũ trụ Marvel khác nhau một cách mượt mà.", time: "1 ngày trước", likes: 42 },
])

// Comment form
const commentForm = ref({
  content: ''
})

// Kiểm tra có phải là phim bộ không
const isSeries = computed(() => movie.value.episodes && movie.value.episodes.length > 0)

// Format time (mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Computed time display
const timeDisplay = computed(() => {
  return `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`
})

// Progress percentage
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Player functions
function togglePlay() {
  const video = videoPlayer.value
  if (!video) return
  
  if (video.paused) {
    video.play()
    isPlaying.value = true
  } else {
    video.pause()
    isPlaying.value = false
  }
}

function toggleMute() {
  const video = videoPlayer.value
  if (!video) return
  
  video.muted = !video.muted
  isMuted.value = video.muted
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoContainer.value.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function handleVolumeChange(e) {
  const video = videoPlayer.value
  if (!video) return
  
  volume.value = e.target.value
  video.volume = volume.value / 100
  if (video.volume === 0) {
    isMuted.value = true
  } else {
    isMuted.value = false
  }
}

function seekVideo(e) {
  const video = videoPlayer.value
  if (!video) return
  
  const rect = e.target.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  video.currentTime = pos * video.duration
}

function hideControls() {
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  
  controlsTimeout.value = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

function showControlsOnMove() {
  showControls.value = true
  hideControls()
}

function changeQuality(quality) {
  // Trong thực tế, bạn sẽ thay đổi src của video dựa vào quality
  videoQuality.value = quality
  const currentPlaybackPosition = videoPlayer.value.currentTime
  
  // Giả lập thay đổi nguồn video
  isLoading.value = true
  setTimeout(() => {
    // videoPlayer.value.src = `${movie.value.videoSrc.replace('.mp4', '')}_${quality}.mp4`
    videoPlayer.value.currentTime = currentPlaybackPosition
    isLoading.value = false
    togglePlay()
  }, 1000)
}

// Video event listeners
function onLoadedMetadata() {
  duration.value = videoPlayer.value.duration
  isLoading.value = false
}

function onTimeUpdate() {
  currentTime.value = videoPlayer.value.currentTime
}

function onVideoEnded() {
  isPlaying.value = false
}

function submitComment() {
  if (!commentForm.value.content.trim()) return
  
  // Normally you'd send this to an API
  comments.value.unshift({
    id: Date.now(),
    user: "You",
    avatar: null,
    content: commentForm.value.content,
    time: "Vừa xong",
    likes: 0
  })
  
  commentForm.value.content = ''
}

// Keypress handlers for player
function handleKeyPress(e) {
  if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
    togglePlay()
    e.preventDefault()
  } else if (e.key === 'm' || e.key === 'M') {
    toggleMute()
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen()
  } else if (e.key === 'ArrowRight') {
    videoPlayer.value.currentTime += 10
  } else if (e.key === 'ArrowLeft') {
    videoPlayer.value.currentTime -= 10
  } else if (e.key === 'ArrowUp') {
    volume.value = Math.min(100, volume.value + 5)
    videoPlayer.value.volume = volume.value / 100
  } else if (e.key === 'ArrowDown') {
    volume.value = Math.max(0, volume.value - 5)
    videoPlayer.value.volume = volume.value / 100
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
  
  // Fake loading delay
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress)
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
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
          <div 
            class="h-1.5 bg-gray-600/50 rounded-full cursor-pointer mb-4"
            @click="seekVideo"
          >
            <div class="h-full bg-primary-500 rounded-full relative" :style="`width: ${progressPercentage}%`">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full"></div>
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
              <span class="text-gray-400">{{ movie.duration }}</span>
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
          <div class="flex space-x-3">
            <button class="btn-outline px-5 py-2 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              Yêu thích
            </button>
            <button class="btn-outline px-5 py-2 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              Chia sẻ
            </button>
            <RouterLink 
              :to="{ name: 'movie-detail', params: { id: movie.id } }" 
              class="btn-outline px-5 py-2 flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Thông tin phim
            </RouterLink>
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
        <h2 class="text-xl font-bold text-white mb-4">Bình luận ({{ comments.length }})</h2>
        
        <!-- Comment form -->
        <div class="bg-dark-800 border border-gray-700 rounded-xl p-4 mb-6">
          <form @submit.prevent="submitComment">
            <textarea 
              v-model="commentForm.content"
              rows="3"
              placeholder="Viết bình luận của bạn..."
              class="w-full bg-dark-700 text-white border border-gray-700/60 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            ></textarea>
            <div class="flex justify-end mt-3">
              <button 
                type="submit"
                class="btn-primary px-5 py-2 flex items-center"
                :disabled="!commentForm.content.trim()"
              >
                Gửi bình luận
              </button>
            </div>
          </form>
        </div>
        
        <!-- Comments list -->
        <div class="space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="bg-dark-800 border border-gray-700 rounded-xl p-4">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-primary-600/80 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {{ comment.user.charAt(0).toUpperCase() }}
              </div>
              <div class="ml-3 flex-1">
                <div class="flex justify-between items-center mb-1">
                  <div>
                    <h4 class="text-white font-medium">{{ comment.user }}</h4>
                    <p class="text-gray-400 text-xs">{{ comment.time }}</p>
                  </div>
                </div>
                <p class="text-gray-300 mt-1">{{ comment.content }}</p>
                <div class="mt-2 flex items-center text-gray-500 text-sm">
                  <button class="flex items-center hover:text-primary-400">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span>{{ comment.likes }}</span>
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
            v-for="movie in movie.related" 
            :key="movie.id"
            :to="{ name: 'movie-detail', params: { id: movie.id } }"
            class="movie-card group"
          >
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
              <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white">
                {{ movie.duration }}
              </div>
            </div>
            <div class="mt-2">
              <h3 class="text-white font-medium truncate">{{ movie.title }}</h3>
              <p class="text-gray-400 text-sm">{{ movie.year }}</p>
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