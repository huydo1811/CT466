<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const episodes = ref([
  {
    id: 1,
    movieTitle: 'Breaking Bad',
    episodeNumber: 1,
    season: 1,
    title: 'Pilot',
    duration: 58,
    views: 50000,
    status: 'Hoạt động'
  },
  {
    id: 2,
    movieTitle: 'Breaking Bad',
    episodeNumber: 2,
    season: 1,
    title: 'Cat\'s in the Bag...',
    duration: 48,
    views: 45000,
    status: 'Hoạt động'
  },
  {
    id: 3,
    movieTitle: 'Stranger Things',
    episodeNumber: 1,
    season: 1,
    title: 'Chapter One: The Vanishing of Will Byers',
    duration: 47,
    views: 80000,
    status: 'Hoạt động'
  },
  {
    id: 4,
    movieTitle: 'Stranger Things',
    episodeNumber: 2,
    season: 1,
    title: 'Chapter Two: The Weirdo on Maple Street',
    duration: 55,
    views: 75000,
    status: 'Hoạt động'
  },
  {
    id: 5,
    movieTitle: 'The Crown',
    episodeNumber: 1,
    season: 1,
    title: 'Wolferton Splash',
    duration: 58,
    views: 30000,
    status: 'Hoạt động'
  }
])

const searchQuery = ref('')
const selectedSeries = ref('')

const filteredEpisodes = computed(() => {
  let filtered = episodes.value

  if (searchQuery.value) {
    filtered = filtered.filter(episode => 
      episode.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      episode.movieTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedSeries.value) {
    filtered = filtered.filter(episode => episode.movieTitle === selectedSeries.value)
  }

  return filtered
})

const uniqueSeries = computed(() => {
  const series = [...new Set(episodes.value.map(e => e.movieTitle))]
  return series
})

const handleAddEpisode = () => {
  router.push('/admin/episodes/add')
}

const handleEditEpisode = (episode) => {
  router.push(`/admin/episodes/edit/${episode.id}`)
}

const handleDeleteEpisode = (episode) => {
  if (confirm(`Bạn có chắc muốn xóa tập "${episode.title}"?`)) {
    episodes.value = episodes.value.filter(e => e.id !== episode.id)
  }
}

const formatNumber = (num) => {
  return num.toLocaleString('vi-VN')
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Quản lý tập phim</h1>
        <p class="text-slate-400">Quản lý tập phim cho series</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button 
          @click="handleAddEpisode"
          class="btn-primary px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm tập mới
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Tìm kiếm</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tên tập hoặc series..."
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Series</label>
          <select
            v-model="selectedSeries"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả</option>
            <option v-for="series in uniqueSeries" :key="series" :value="series">{{ series }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="() => { searchQuery = ''; selectedSeries = '' }"
            class="w-full bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Xóa bộ lọc
          </button>
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
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tập</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Mùa</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tên tập</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Thời lượng</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lượt xem</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="episode in filteredEpisodes" :key="episode.id" class="hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ episode.movieTitle }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ episode.episodeNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ episode.season }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{{ episode.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ episode.duration }} phút</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ formatNumber(episode.views) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="episode.status === 'Hoạt động' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ episode.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="handleEditEpisode(episode)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDeleteEpisode(episode)"
                    class="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
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