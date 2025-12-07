<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const movie = ref(null)
const loading = ref(true)
const error = ref(null)
const showTrailer = ref(false)

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  return `${baseUrl}${u.startsWith('/') ? u : '/' + u}`
}

const mockMovie = (idVal = id) => ({
  id: idVal ?? 'demo-1',
  title: 'Avengers: Endgame (Demo)',
  description: 'Đây là dữ liệu demo phục vụ giao diện. Thay bằng dữ liệu thực khi backend sẵn sàng.',
  poster: '',
  trailer: 'https://www.youtube.com/embed/TCGx7qf2Yxc',
  video: '',
  categoryNames: ['Hành động', 'Khoa học viễn tưởng'],
  countryName: 'Mỹ',
  releaseDate: '2019-04-26',
  year: 2019,
  duration: 181,
  director: 'Anthony & Joe Russo',
  cast: [{ id: 'a1', name: 'Robert Downey Jr.' }, { id: 'a2', name: 'Chris Evans' }],
  type: 'movie',
  isPublished: true,
  isFeatured: false,
  isHot: false,
  episodes: []
})

// nếu muốn tắt mock đổi thành false
const USE_MOCK = false

const fetchMovie = async () => {
  if (USE_MOCK) {
    error.value = null
    movie.value = mockMovie()
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  try {
    // sử dụng axios instance để kèm auth/header baseURL
    const res = await api.get(`/movies/${id}`)
    const data = res?.data?.data || res?.data || {}

    movie.value = {
      id: data._id ?? data.id ?? id,
      title: data.title ?? '',
      description: data.description ?? '',
      poster: data.poster ?? data.posterUrl ?? '',
      trailer: data.trailer ?? '',
      video: data.videoUrl ?? data.video ?? '',
      categoryNames: (data.categories || []).map(c => (c?.name ?? c)),
      countryName: (data.country?.name ?? data.country) || '',
      releaseDate: data.releaseDate ? (data.releaseDate.split?.('T')[0] || data.releaseDate) : '',
      year: data.year ?? '',
      duration: data.duration ?? '',
      director: data.director ?? '',
      cast: (data.actors || data.cast || []).map(a => {
        if (!a) return a
        if (typeof a === 'string') return { id: a, name: a }
        return { id: a._id ?? a.id, name: a.name ?? a.fullName ?? a.title ?? '' }
      }),
      type: data.type ?? 'movie',
      isPublished: !!data.isPublished,
      isFeatured: !!data.isFeatured,
      isHot: !!data.isHot,
      episodes: data.episodes ?? []
    }
  } catch (err) {
    console.warn('Fetch movie failed, using demo data:', err)
    error.value = 'Không thể kết nối backend — đang hiển thị dữ liệu demo'
    movie.value = mockMovie()
  } finally {
    loading.value = false
  }
}

onMounted(fetchMovie)

const posterSrc = computed(() => getMediaUrl(movie.value?.poster) || '/placeholder-portrait.png')

const trailerEmbed = computed(() => {
  const t = movie.value?.trailer || ''
  if (!t) return ''
  try {
    const u = new URL(t, window.location.href)
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      if (u.pathname.includes('/embed/')) return u.href
    }
    if (u.hostname.includes('youtu.be')) {
      const vid = u.pathname.slice(1)
      if (vid) return `https://www.youtube.com/embed/${vid}`
    }
  } catch (err) {
    console.warn('Invalid trailer URL:', t, err)
  }
  return t
})

const goEdit = () => {
  if (!movie.value?.id) return
  router.push(`/admin/movies/edit/${movie.value.id}`)
}
const goBack = () => router.push('/admin/movies')

const handleDelete = async () => {
  if (!movie.value?.id) { alert('Phim chưa được tải'); return }
  if (!confirm('Bạn có chắc muốn xóa phim này?')) return
  try {
    await api.delete(`/movies/${movie.value.id}`)
    alert('Xóa thành công')
    router.push('/admin/movies')
  } catch (err) {
    console.error(err)
    alert('Xóa thất bại: ' + (err?.response?.data?.message || err.message || ''))
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
<div class="flex flex-col md:flex-row items-start md:items-center justify-between">
  <div>
    <h1 class="text-2xl font-bold text-white" v-if="!loading">{{ movie?.title }}</h1>
    <div v-if="!loading" class="text-slate-400 mt-1">
      <span v-if="movie?.categoryNames?.length">{{ movie.categoryNames.join(',') }} • </span>
      {{ movie?.countryName }} • {{ movie?.releaseDate || movie?.year }}
    </div>
  </div>

  <div class="flex items-center space-x-2 mt-3 md:mt-0">
    <button @click="goBack" class="px-2 py-1 md:px-3 md:py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm md:text-base">Quay lại</button>
    <button @click="goEdit" class="px-2 py-1 md:px-3 md:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm md:text-base">Sửa</button>
    <button @click="handleDelete" class="px-2 py-1 md:px-3 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm md:text-base">Xóa</button>
  </div>
</div>

    <div v-if="loading" class="text-slate-400">Đang tải thông tin phim...</div>
    <div v-else-if="error" class="text-red-400">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 bg-slate-800/40 p-4 rounded-lg border border-slate-700">
        <img :src="posterSrc" alt="poster" class="w-full h-72 object-cover rounded-md shadow-md" />        <div class="mt-4 space-y-3">
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-slate-700 text-slate-200 text-xs rounded">Thời lượng: {{ movie.duration }} phút</span>
            <span class="px-2 py-1 bg-slate-700 text-slate-200 text-xs rounded">Loại: {{ movie.type === 'movie' ? 'Phim điện ảnh' : 'Series' }}</span>
            <span v-if="movie.isFeatured" class="px-2 py-1 bg-amber-700 text-amber-100 text-xs rounded">Nổi bật</span>
            <span v-if="movie.isHot" class="px-2 py-1 bg-red-700 text-red-100 text-xs rounded">Hot</span>
          </div>

          <div>
            <h4 class="text-sm text-slate-300 mb-2">Diễn viên</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="a in movie.cast" :key="a.id" class="px-3 py-1 bg-slate-700/60 text-white rounded-full text-sm">
                {{ a.name }}
              </span>
            </div>
          </div>

          <div class="mt-3">
            <button v-if="movie.trailer" @click="showTrailer = true" class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Xem trailer</button>
            <a v-else class="block text-xs text-slate-400 mt-1">Không có trailer</a>
          </div>

          <div v-if="movie.video" class="mt-3 text-sm text-slate-300">
            <div>File phim:</div>
              <a :href="getMediaUrl(movie.video)" target="_blank" class="text-blue-400 hover:underline break-all">
                {{ movie.video }}</a>
            </div>
        </div>
      </div>

      <div class="md:col-span-2 bg-slate-800/40 p-6 rounded-lg border border-slate-700">
        <h3 class="text-lg font-semibold text-white mb-2">Mô tả</h3>
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">{{ movie.description }}</p>

        <div v-if="movie.type === 'series' && movie.episodes?.length" class="mt-6">
          <h4 class="text-white font-medium mb-2">Danh sách tập</h4>
          <ul class="space-y-2">
            <li v-for="ep in movie.episodes" :key="ep.id" class="p-3 bg-slate-700/30 rounded flex justify-between items-center">
              <div>
                <div class="text-sm text-white font-medium">S{{ ep.season }} · Tập {{ ep.episodeNumber }} — {{ ep.title }}</div>
                <div class="text-xs text-slate-300">Thời lượng: {{ ep.duration }} phút</div>
              </div>
              <div>
                <button @click="$router.push(`/admin/episodes/edit/${ep.id}`)" class="text-blue-400 hover:text-blue-300">Sửa</button>
              </div>
            </li>
          </ul>
        </div>

        <div class="mt-6">
          <h4 class="text-sm text-slate-300 mb-2">Thông tin khác</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <div><strong>Đạo diễn:</strong> {{ movie.director }}</div>
            <div><strong>Quốc gia:</strong> {{ movie.countryName }}</div>
            <div><strong>Thể loại:</strong> <span v-if="movie.categoryNames?.length">{{ movie.categoryNames.join(', ') }}</span></div>
            <div><strong>Ngày phát hành:</strong> {{ movie.releaseDate || movie.year }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trailer modal -->
    <div v-if="showTrailer" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-slate-900 rounded-lg max-w-4xl w-full mx-4 overflow-hidden">
        <div class="flex justify-between items-center p-3 border-b border-slate-700">
          <div class="text-white font-medium">Trailer</div>
          <button @click="showTrailer = false" class="text-slate-300 px-3 py-1 hover:text-white">Đóng</button>
        </div>
        <div class="w-full aspect-video">
          <iframe
            v-if="trailerEmbed"
            :src="trailerEmbed"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <div v-else class="p-6 text-slate-300">Không thể phát trailer.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .25s ease-out; }
</style>