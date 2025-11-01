<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const seriesList = ref([]) // từ backend (movies?type=series)

const form = reactive({
  movie: route.query.seriesId || '', // field name 'movie' theo backend
  season: 1,
  episodeNumber: 1,
  title: '',
  duration: '',
  airDate: '',
  description: '',
  videoUrl: '',
  thumbnailFile: null,
  videoFile: null,
  isPublished: true
})

// previews
const thumbnailPreview = ref(null)
const videoPreview = ref(null)

const _revokePreview = () => {
  if (thumbnailPreview.value) { try { URL.revokeObjectURL(thumbnailPreview.value) } catch{
    console.error('Failed to revoke thumbnail URL')
  }; thumbnailPreview.value = null }
  if (videoPreview.value) { try { URL.revokeObjectURL(videoPreview.value) } catch{
    console.error('Failed to revoke video URL')
  }; videoPreview.value = null }
}
onBeforeUnmount(_revokePreview)

// load series list
const loadSeries = async () => {
  try {
    const res = await api.get('/movies', { params: { type: 'series', limit: 200 } })
    const body = res?.data || {}
    const arr = body.data || []
    // normalize: support populated or id-only
    seriesList.value = (arr || []).map(m => ({
      id: m._id || m.id,
      title: m.title,
      seasons: m.seasons || 1,
      poster: m.poster || m.posterUrl || ''
    }))
    if (!form.movie && seriesList.value.length) form.movie = seriesList.value[0].id
  } catch (err) {
    console.warn('load series failed', err)
    seriesList.value = []
  }
}

onMounted(loadSeries)

// file handlers
const onThumbnailChange = (e) => {
  const f = e.target.files?.[0] || null
  form.thumbnailFile = f
  if (thumbnailPreview.value) { try { URL.revokeObjectURL(thumbnailPreview.value) } catch{
    console.error('Failed to revoke thumbnail URL')
  } }
  thumbnailPreview.value = f ? URL.createObjectURL(f) : null
}

const onVideoFileChange = (e) => {
  const f = e.target.files?.[0] || null
  form.videoFile = f
  if (videoPreview.value) { try { URL.revokeObjectURL(videoPreview.value) } catch{
    console.error('Failed to revoke video URL')
  } }
  videoPreview.value = f ? URL.createObjectURL(f) : null
  if (form.videoFile) form.videoUrl = '' // prefer uploaded file
}

// submit -> FormData upload
const submit = async () => {
  if (!form.movie) return alert('Vui lòng chọn series.')
  if (!form.title) return alert('Vui lòng nhập tên tập.')
  if (!form.episodeNumber || form.episodeNumber < 1) return alert('Số tập không hợp lệ.')
  if (!form.season || form.season < 1) return alert('Số mùa không hợp lệ.')
  // backend Episode model currently yêu cầu duration và airDate
  if (!form.duration) return alert('Vui lòng nhập thời lượng (phút).')
  if (!form.airDate) return alert('Vui lòng chọn ngày phát sóng.')

  const fd = new FormData()
  fd.append('movie', form.movie)
  fd.append('season', String(form.season))
  fd.append('episodeNumber', String(form.episodeNumber))
  fd.append('title', form.title)
  fd.append('description', form.description || '')
  fd.append('duration', String(form.duration))
  fd.append('airDate', form.airDate)
  fd.append('isPublished', form.isPublished ? 'true' : 'false')

  // video: prefer file upload, otherwise send videoUrl
  if (form.videoFile) {
    fd.append('video', form.videoFile)
  } else if (form.videoUrl) {
    fd.append('videoUrl', form.videoUrl)
  }

  if (form.thumbnailFile) fd.append('thumbnail', form.thumbnailFile)

  loading.value = true
  try {
    await api.post('/episodes', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    _revokePreview()
    alert('Tạo tập thành công')
    router.push('/admin/series')
  } catch (err) {
    console.error('create episode failed', err)
    alert(err?.response?.data?.message || 'Tạo tập thất bại')
  } finally {
    loading.value = false
  }
}

const cancel = () => router.back()
</script>

<template>
  <div class="space-y-6 p-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Thêm tập mới</h1>
        <p class="text-slate-400 text-sm">Chọn series để thêm tập</p>
      </div>
      <div class="flex gap-2">
        <button @click="cancel" class="px-4 py-2 bg-slate-700 rounded text-white">Hủy</button>
        <button @click="submit" :disabled="loading" class="px-4 py-2 bg-emerald-600 rounded text-white">
          {{ loading ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-slate-300 mb-1">Series</label>
          <select v-model="form.movie" class="w-full bg-slate-700 px-3 py-2 rounded text-white">
            <option value="">-- Chọn series --</option>
            <option v-for="s in seriesList" :key="s.id" :value="s.id">{{ s.title }} ({{ s.seasons }} mùa)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Mùa</label>
          <input v-model.number="form.season" type="number" min="1" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Số tập</label>
          <input v-model.number="form.episodeNumber" type="number" min="1" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Thời lượng (phút)</label>
          <input v-model.number="form.duration" type="number" min="1" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm text-slate-300 mb-1">Tên tập</label>
          <input v-model="form.title" type="text" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Ngày phát sóng</label>
          <input v-model="form.airDate" type="date" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm text-slate-300 mb-1">Mô tả (tùy chọn)</label>
          <textarea v-model="form.description" rows="3" class="w-full bg-slate-700 px-3 py-2 rounded text-white"></textarea>
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Ảnh thumbnail</label>
          <input type="file" accept="image/*" @change="onThumbnailChange" class="w-full text-sm text-white mb-2" />
          <div v-if="thumbnailPreview" class="mt-2">
            <img :src="thumbnailPreview" class="w-48 h-28 object-cover rounded" />
          </div>
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Video (file hoặc URL)</label>
          <input type="file" accept="video/*" @change="onVideoFileChange" class="w-full text-sm text-white mb-2" />
          <div v-if="videoPreview" class="mt-2">
            <video :src="videoPreview" controls class="w-full h-40 object-cover rounded"></video>
          </div>
          <div class="mt-2">
            <label class="block text-xs text-slate-400 mb-1">Hoặc nhập Video URL</label>
            <input v-model="form.videoUrl" type="url" placeholder="https://..." class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
          </div>
        </div>

        <div class="md:col-span-2 flex items-center gap-4 mt-2">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="form.isPublished" class="mr-2" />
            <span class="text-slate-300">Đăng ngay</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
.animate-fade-in { animation: fade-in .3s ease-out; }
</style>