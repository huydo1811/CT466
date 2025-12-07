<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const series = ref(null)
const episodes = ref([])
const search = ref('')
const loadingSeries = ref(false)
const loadingEpisodes = ref(false)

const loadSeries = async () => {
  if (!id) return
  loadingSeries.value = true
  try {
    const res = await api.get(`/movies/${id}`)
    series.value = res?.data?.data || res?.data || null
  } catch (err) {
    console.error('load series failed', err)
    series.value = null
    alert(err?.response?.data?.message || 'Lỗi khi tải series')
  } finally {
    loadingSeries.value = false
  }
}

const loadEpisodes = async () => {
  if (!id) return
  loadingEpisodes.value = true
  try {
    const res = await api.get(`/episodes/movie/${id}`)
    episodes.value = res?.data?.data || res?.data || []
  } catch (err) {
    console.error('load episodes failed', err)
    episodes.value = []
  } finally {
    loadingEpisodes.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadSeries(), loadEpisodes()])
})

const episodesFiltered = computed(() => {
  const q = (search.value || '').trim().toLowerCase()
  return (episodes.value || [])
    .slice()
    .sort((a, b) => (a.season - b.season) || (a.episodeNumber - b.episodeNumber))
    .filter(ep => {
      if (!q) return true
      return (ep.title || '').toLowerCase().includes(q) || String(ep.episodeNumber).includes(q)
    })
})

const handleBack = () => router.push('/admin/series')
const handleEdit = () => {
  if (!series.value?._id && !series.value?.id) return alert('ID series không hợp lệ')
  const sid = series.value._id || series.value.id
  router.push(`/admin/series/edit/${sid}`)
}


const handleDeleteSeries = async () => {
  if (!confirm(`Xóa series "${series.value?.title}"?`)) return
  try {
    const sid = series.value._id || series.value.id
    await api.delete(`/movies/${sid}`)
    alert('Xóa series thành công')
    router.push('/admin/series')
  } catch (err) {
    console.error('delete series failed', err)
    alert(err?.response?.data?.message || 'Xóa thất bại')
  }
}


const formatDate = (d) => {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return dt.toLocaleDateString('vi-VN')
}

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https? :\/\//.test(u)) return u
  const apiBase = import.meta.env. VITE_API_BASE || 'http://localhost:3000/api'
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  return `${baseUrl}${u.startsWith('/') ?  u : '/' + u}`
}
</script>

<template>
  <div class="space-y-6 p-4 animate-fade-in">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">{{ series ? series.title : 'Series' }}
          <span v-if="series && series.year" class="text-slate-400 text-lg">({{ series.year }})</span>
        </h1>
        <div class="text-slate-400 mt-2">{{ series && series.categories ? (series.categories.map(c => c.name || c).join(', ')) : '' }}</div>
        <div v-if="series && series.slug" class="text-sm text-slate-400 mt-1">Slug: <span class="text-slate-200">{{ series.slug }}</span></div>
      </div>

      <div class="mt-3 sm:mt-0 flex flex-wrap items-center gap-2">
        <button @click="handleBack" class="px-3 py-2 bg-slate-700 rounded text-white text-sm">Quay lại</button>
        <button @click="handleEdit" class="px-3 py-2 bg-yellow-600 rounded text-white text-sm">Sửa</button>
        <button @click="handleDeleteSeries" class="px-3 py-2 bg-red-500 rounded text-white text-sm">Xóa</button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex flex-col items-start">
          <div class="w-full max-w-xs bg-slate-900 rounded overflow-hidden">
            <div class="w-full h-64 bg-slate-700 flex items-center justify-center text-slate-400">
              <template v-if="series && series.poster">
                <img :src="getMediaUrl(series.poster)" alt="poster" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                Poster
              </template>
            </div>
          </div>

          <div class="mt-4 text-sm text-slate-300 space-y-1">
            <div><strong>Đạo diễn:</strong> {{ series ? (series.director || '-') : '-' }}</div>
            <div><strong>Quốc gia:</strong> {{ series ? (series.country?.name || series.country || '-') : '-' }}</div>
            <div>
              <strong>Diễn viên:</strong>
              <div v-if="series && series.actors && series.actors.length" class="flex flex-wrap gap-2 mt-1">
                <span v-for="(a, idx) in series.actors" :key="idx" class="px-2 py-1 bg-slate-700 text-white rounded text-sm">{{ a.name || a }}</span>
              </div>
              <div v-else class="mt-1 text-slate-400">-</div>
            </div>
            <div>
              <strong>Trạng thái:</strong>
              <span :class="series && series.isPublished ? 'text-green-400' : 'text-red-400'">
                {{ series && series.isPublished ? 'Đã đăng' : 'Ẩn' }}
              </span>
            </div>
            <div v-if="series && series.seasons"><strong>Mùa:</strong> {{ series.seasons }}</div>
            <div v-if="series"><strong>Tổng tập:</strong> {{ series.totalEpisodes ?? '-' }}</div>
          </div>
        </div>

        <div class="md:col-span-2">
          <p class="text-slate-200 mb-3">{{ series ? (series.description || '') : '' }}</p>

          <div v-if="series && series.trailer" class="mb-4">
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
              <h4 class="text-sm text-slate-200 font-medium">Danh sách tập ({{ episodes.length }})</h4>
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ep in episodesFiltered" :key="ep._id || ep.id" class="hover:bg-slate-700/20">
                    <td class="px-4 py-3 text-slate-300">Mùa {{ ep.season }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ ep.episodeNumber }}</td>
                    <td class="px-4 py-3 text-white font-medium">{{ ep.title }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ ep.duration ? ep.duration + ' phút' : '-' }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ formatDate(ep.airDate) }}</td>

                  </tr>

                  <tr v-if="!loadingEpisodes && episodesFiltered.length === 0">
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