<script setup>
import { ref,  computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// Mock movies (Movie model fields used: id, title)
const movies = ref([
  { id: 'm1', title: 'Breaking Bad' },
  { id: 'm2', title: 'Stranger Things' },
  { id: 'm3', title: 'The Crown' }
])

// Episodes mock (Episode model fields used)
const episodes = ref([
  {
    id: 1,
    movieId: 'm1',
    episodeNumber: 1,
    season: 1,
    title: 'Pilot',
    duration: 58,
    views: 50000,
    isPublished: true,
    videoUrl: 'https://cdn.example.com/breakingbad/s1e1.mp4',
    airDate: '2008-01-20'
  },
  {
    id: 2,
    movieId: 'm1',
    episodeNumber: 2,
    season: 1,
    title: "Cat's in the Bag...",
    duration: 48,
    views: 45000,
    isPublished: true,
    videoUrl: 'https://cdn.example.com/breakingbad/s1e2.mp4',
    airDate: '2008-01-27'
  },
  {
    id: 3,
    movieId: 'm2',
    episodeNumber: 1,
    season: 1,
    title: 'Chapter One: The Vanishing of Will Byers',
    duration: 47,
    views: 80000,
    isPublished: true,
    videoUrl: 'https://cdn.example.com/stranger/s1e1.mp4',
    airDate: '2016-07-15'
  }
])

const searchQuery = ref('')
const selectedMovie = ref('')
const selectedSeason = ref('')

const filteredEpisodes = computed(() => {
  let filtered = episodes.value.slice().sort((a,b) => {
    if (a.movieId === b.movieId) {
      if (a.season === b.season) return a.episodeNumber - b.episodeNumber
      return a.season - b.season
    }
    return a.movieId.localeCompare(b.movieId)
  })

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(ep =>
      ep.title.toLowerCase().includes(q) ||
      (getMovieTitle(ep.movieId) || '').toLowerCase().includes(q)
    )
  }

  if (selectedMovie.value) {
    filtered = filtered.filter(ep => ep.movieId === selectedMovie.value)
  }

  if (selectedSeason.value) {
    filtered = filtered.filter(ep => String(ep.season) === String(selectedSeason.value))
  }

  return filtered
})

const uniqueSeries = computed(() => {
  return movies.value.map(m => ({ id: m.id, title: m.title }))
})

const uniqueSeasons = computed(() => {
  const s = [...new Set(episodes.value.map(e => e.season))]
  return s.sort((a,b) => a-b)
})

function getMovieTitle(movieId) {
  const m = movies.value.find(x => x.id === movieId)
  return m ? m.title : 'N/A'
}

const formatNumber = (num) => num.toLocaleString('vi-VN')
const formatDate = (d) => {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return dt.toLocaleDateString('vi-VN')
}

const handleEditEpisode = (episode) => {
  router.push(`/admin/series/edit/${episode.id}`)
}

const handleDeleteEpisode = (episode) => {
  if (confirm(`Bạn có chắc muốn xóa tập "${episode.title}"?`)) {
    // Call API to delete
    episodes.value = episodes.value.filter(e => e.id !== episode.id)
  }
}

// thêm hàm xem chi tiết
const handleViewEpisode = (episode) => {
  router.push(`/admin/series/${episode.id}`)
}

const handleAddSeries = () => {
  router.push('/admin/series/add')
}

const handleAddEpisode = () => {
  router.push('/admin/series/add-episode')
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Quản lý tập phim</h1>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-3">
        <button 
          @click="handleAddSeries"
          class="btn-primary px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm bộ mới
        </button>
        <button 
          @click="handleAddEpisode"
          class="btn-primary px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm tập mới
        </button>
      </div>
      
    </div>

    <!-- Filters -->
    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Tìm kiếm</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tên tập hoặc series..."
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Series</label>
          <select v-model="selectedMovie" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
            <option value="">Tất cả</option>
            <option v-for="m in uniqueSeries" :key="m.id" :value="m.id">{{ m.title }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Mùa</label>
          <select v-model="selectedSeason" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
            <option value="">Tất cả</option>
            <option v-for="s in uniqueSeasons" :key="s" :value="s">Mùa {{ s }}</option>
          </select>
        </div>

        <div class="flex items-end">
          <button @click="() => { searchQuery = ''; selectedMovie = ''; selectedSeason = '' }" class="w-full bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg">Xóa bộ lọc</button>
        </div>
      </div>
    </div>

    <!-- Episodes Table -->
    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-700/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Series</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Mùa</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tập</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tên tập</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Thời lượng</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lượt xem</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="episode in filteredEpisodes" :key="episode.id" class="hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ getMovieTitle(episode.movieId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">Mùa {{ episode.season }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ episode.episodeNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{{ episode.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ formatDate(episode.airDate) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ formatNumber(episode.views) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="episode.isPublished ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'" class="px-2 py-1 text-xs rounded-full">
                  {{ episode.isPublished ? 'Đã đăng' : 'Ẩn' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <!-- nút xem chi tiết -->
                    <button
                      @click="handleViewEpisode(episode)"
                      class="text-slate-300 hover:text-white transition-colors"
                      title="Xem chi tiết"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <button 
                      @click="handleEditEpisode(episode)"
                      class="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Sửa"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="handleDeleteEpisode(episode)"
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
            <tr v-if="filteredEpisodes.length === 0">
              <td colspan="9" class="px-6 py-6 text-center text-slate-400">Không có tập nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.5s ease-out; }
</style>