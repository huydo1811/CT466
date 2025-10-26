<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id || 's1'

const mockSeriesList = [
  {
    id: 's1',
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine producer struggles with morality and family.',
    director: 'Vince Gilligan',
    country: 'Mỹ',
    categories: ['Hành động', 'Tâm lý'],
    actors: ['Bryan Cranston', 'Aaron Paul'],
    poster: '',
    posterFileName: '',
    trailer: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    year: 2008,
    isPublished: true,
    episodes: [
      { id: 1, season: 1, episodeNumber: 1, title: 'Pilot', duration: 58, airDate: '2008-01-20', videoUrl: '' },
      { id: 2, season: 1, episodeNumber: 2, title: "Cat's in the Bag...", duration: 48, airDate: '2008-01-27', videoUrl: '' }
    ]
  },
  {
    id: 's2',
    title: 'Stranger Things',
    description: 'Kids fight supernatural forces in a small American town.',
    director: 'The Duffer Brothers',
    country: 'Mỹ',
    categories: ['Khoa học viễn tưởng', 'Kinh dị'],
    actors: ['Winona Ryder', 'David Harbour'],
    poster: '',
    trailer: '',
    year: 2016,
    isPublished: true,
    episodes: []
  }
]

const series = ref(null)
const search = ref('')

onMounted(() => {
  series.value = mockSeriesList.find(s => s.id === id) || mockSeriesList[0]
})

const episodesFiltered = computed(() => {
  if (!series.value) return []
  const q = search.value.trim().toLowerCase()
  return series.value.episodes
    .slice()
    .sort((a,b) => (a.season - b.season) || (a.episodeNumber - b.episodeNumber))
    .filter(ep => !q || `${ep.title}`.toLowerCase().includes(q) || String(ep.episodeNumber).includes(q))
})

const handleBack = () => router.push('/admin/series')
const handleEdit = () => router.push(`/admin/series/edit/${series.value.id}`)
const handleAddEpisode = () => router.push({ name: 'admin.episodes.add', query: { seriesId: series.value.id } })
const handleDeleteSeries = () => {
  if (confirm(`Xóa series "${series.value.title}"?`)) {
    // UI-only: pretend deleted and go back to list
    alert('Series đã xóa.')
    router.push('/admin/series')
  }
}
const openVideo = (ep) => {
  if (!ep?.videoUrl) { alert('Không có video demo cho tập này'); return }
  window.open(ep.videoUrl, '_blank')
}
const formatDate = (d) => { if (!d) return '-' ; const dt = new Date(d); if (isNaN(dt)) return d; return dt.toLocaleDateString('vi-VN') }
</script>

<template>
  <div class="space-y-6 p-6 animate-fade-in">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">{{ series?.title }} <span v-if="series" class="text-slate-400 text-lg">({{ series.year }})</span></h1>
        <div class="text-slate-400 mt-2">{{ series?.categories?.join(', ') }}</div>
      </div>

      <div class="flex items-center gap-3">
        <button @click="handleBack" class="px-4 py-2 bg-slate-700 rounded text-white">Quay lại</button>
        <button @click="handleEdit" class="px-4 py-2 bg-yellow-600 rounded text-white">Sửa</button>
        <button @click="handleAddEpisode" class="px-4 py-2 bg-blue-600 rounded text-white">Thêm tập</button>
        <button @click="handleDeleteSeries" class="px-4 py-2 bg-red-500 rounded text-white">Xóa</button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex flex-col items-start">
          <div class="w-full max-w-xs bg-slate-900 rounded overflow-hidden">
            <div class="w-full h-64 bg-slate-700 flex items-center justify-center text-slate-400">
              <template v-if="series?.poster">
                <img :src="series.poster" alt="poster" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                Poster
              </template>
            </div>
          </div>
          <div class="mt-4 text-sm text-slate-300 space-y-1">
            <div><strong>Đạo diễn:</strong> {{ series?.director || '-' }}</div>
            <div><strong>Quốc gia:</strong> {{ series?.country || '-' }}</div>
            <div>
              <strong>Diễn viên:</strong>
              <div v-if="series?.actors?.length" class="flex flex-wrap gap-2 mt-1">
                <span v-for="(a, idx) in series.actors" :key="idx" class="px-2 py-1 bg-slate-700 text-white rounded text-sm">
                  {{ a }}
                </span>
              </div>
              <div v-else class="mt-1 text-slate-400">-</div>
            </div>
            <div><strong>Trạng thái:</strong> <span :class="series?.isPublished ? 'text-green-400' : 'text-red-400'">{{ series?.isPublished ? 'Đã đăng' : 'Ẩn' }}</span></div>
          </div>
        </div>

        <div class="md:col-span-2">
          <p class="text-slate-200 mb-3">{{ series?.description }}</p>

          <div v-if="series?.trailer" class="mb-4">
            <h4 class="text-sm text-slate-200 mb-2">Trailer</h4>
            <div class="aspect-w-16 aspect-h-9 bg-black rounded overflow-hidden">
              <iframe
                v-if="series.trailer.includes('youtube') || series.trailer.includes('youtu.be')"
                :src="series.trailer.includes('youtube') ? series.trailer.replace('watch?v=', 'embed/') : series.trailer"
                frameborder="0"
                allowfullscreen
                class="w-full h-full"
              ></iframe>
              <div v-else class="w-full h-full flex items-center justify-center text-slate-400">Preview not available for this URL</div>
            </div>
          </div>

          <div class="bg-slate-900/20 p-3 rounded">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm text-slate-200 font-medium">Danh sách tập ({{ series?.episodes?.length || 0 }})</h4>
              <input v-model="search" placeholder="Tìm tập..." class="bg-slate-800 px-3 py-1 rounded text-sm text-white" />
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-800/40">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs text-slate-300">Mùa</th>
                    <th class="px-4 py-2 text-left text-xs text-slate-300">Tập</th>
                    <th class="px-4 py-2 text-left text-xs text-slate-300">Tên</th>
                    <th class="px-4 py-2 text-left text-xs text-slate-300">Thời lượng</th>
                    <th class="px-4 py-2 text-left text-xs text-slate-300">Ngày</th>
                    <th class="px-4 py-2 text-left text-xs text-slate-300">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ep in episodesFiltered" :key="ep.id" class="hover:bg-slate-700/20">
                    <td class="px-4 py-3 text-slate-300">Mùa {{ ep.season }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ ep.episodeNumber }}</td>
                    <td class="px-4 py-3 text-white font-medium">{{ ep.title }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ ep.duration ? ep.duration + ' phút' : '-' }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ formatDate(ep.airDate) }}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <button @click="() => openVideo(ep)" class="p-2 rounded hover:bg-slate-700/30 text-blue-400" title="Xem video">Xem</button>
                        <button @click="() => router.push(`/admin/episodes/edit/${ep.id}`)" class="p-2 rounded hover:bg-yellow-700/10 text-yellow-300" title="Sửa">Sửa</button>
                        <button @click="() => { if(confirm('Xóa tập này?')) { series.episodes = series.episodes.filter(x => x.id !== ep.id) } }" class="p-2 rounded hover:bg-red-700/10 text-red-400" title="Xóa">Xóa</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="episodesFiltered.length === 0">
                    <td colspan="6" class="px-4 py-6 text-center text-slate-400">Không có tập nào</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-w-16 { position: relative; width: 100%; }
.aspect-h-9 { padding-top: 56.25%; } /* 9/16 = 56.25% */
.aspect-w-16 iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
@keyframes fade-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
.animate-fade-in { animation: fade-in .25s ease-out; }
</style>