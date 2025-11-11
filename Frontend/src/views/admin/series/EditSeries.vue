<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
 
const route = useRoute()
const router = useRouter()
const id = route.params.id

const loading = ref(false)
const saving = ref(false)
const episodesLoading = ref(false)

const categories = ref([])
const countries = ref([])
const actors = ref([])

// temp selects for adding category/actor (fix v-model error)
const newCategorySelect = ref('')
const newActorSelect = ref('')

const addCategoryFromSelect = () => {
  const v = newCategorySelect.value
  if (v && !form.categories.includes(v)) form.categories.push(v)
  newCategorySelect.value = ''
}

const addActorFromSelect = () => {
  const v = newActorSelect.value
  if (v && !form.actors.includes(v)) form.actors.push(v)
  newActorSelect.value = ''
}

// remove handlers
const removeCategory = (cid) => {
  form.categories = form.categories.filter(c => c !== cid)
}

const removeActor = (aid) => {
  form.actors = form.actors.filter(a => a !== aid)
}

// form for series
const form = reactive({
  _id: '',
  title: '',
  slug: '',          
  description: '',
  director: '',
  country: '',
  categories: [],
  actors: [],
  posterFile: null,
  posterUrl: '',
  backdropFile: null,
  backdropUrl: '',
  trailer: '',
  isPublished: false,
  isFeatured: false,
  isHot: false,
  totalEpisodes: 0,
  seasons: 1
})

// episodes list (from DB)
const episodes = ref([])

// episode editor state
const showEpisodeModal = ref(false)
const editingEpisode = ref(null) // null => create
const epDraft = reactive({
  _id: null,
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
const thumbPreview = ref(null)
const videoPreview = ref(null)
const backdropPreview = ref(null)

const _revoke = () => {
  if (thumbPreview.value) { try { URL.revokeObjectURL(thumbPreview.value) } catch{
    console.error('Failed to revoke thumbnail URL')
  }; thumbPreview.value = null }
  if (videoPreview.value) { try { URL.revokeObjectURL(videoPreview.value) } catch{
    console.error('Failed to revoke video URL')
  }; videoPreview.value = null }
  if (backdropPreview.value) { try { URL.revokeObjectURL(backdropPreview.value) } catch { 
    console.error('Failed to revoke backdrop URL')
  } ; backdropPreview.value = null }
}
onBeforeUnmount(_revoke)

// helpers
const loadOptions = async () => {
  try {
    const [cRes, coRes, aRes] = await Promise.all([
      api.get('/categories'),
      api.get('/countries'),
      api.get('/actors')
    ])
    categories.value = (cRes?.data?.data || cRes?.data || [])
    countries.value = (coRes?.data?.data || coRes?.data || [])
    actors.value = (aRes?.data?.data || aRes?.data || [])
  } catch (e) {
    console.warn('load options failed', e)
  }
}

const loadMovie = async () => {
  if (!id) { alert('Movie id missing'); return }
  loading.value = true
  try {
    const res = await api.get(`/movies/${id}`)
    const m = res?.data?.data || res?.data
    if (!m) throw new Error('Không tìm thấy series')
    form._id = m._id || m.id
    form.title = m.title || ''
    form.slug = m.slug || ''    // <-- populate slug
    form.description = m.description || ''
    form.director = m.director || ''
    form.country = m.country ? (m.country._id || m.country._id || m.country) : (m.country || '')
    form.categories = Array.isArray(m.categories) ? m.categories.map(c => c._id || c.id || c) : (m.categories || [])
    form.actors = Array.isArray(m.actors) ? m.actors.map(a => a._id || a.id || a) : (m.actors || [])
    form.posterUrl = m.poster || ''
    form.backdropUrl = m.backdrop || ''
    form.trailer = m.trailer || ''
    form.isPublished = !!m.isPublished
    form.isFeatured = !!m.isFeatured
    form.isHot = !!m.isHot
    form.totalEpisodes = m.totalEpisodes ?? 0
    form.seasons = m.seasons ?? 1
  } catch (err) {
    console.error(err)
    alert(err?.response?.data?.message || err.message || 'Load series failed')
  } finally {
    loading.value = false
  }
}

const loadEpisodes = async () => {
  episodesLoading.value = true
  try {
    const res = await api.get(`/episodes/movie/${id}`)
    episodes.value = (res?.data?.data || res?.data || []).map(e => ({
      ...e,
      _id: e._id || e.id,
      airDate: e.airDate ? (new Date(e.airDate)) : null
    }))
  } catch (err) {
    console.error('load episodes failed', err)
    episodes.value = []
  } finally {
    episodesLoading.value = false
  }
}

onMounted(async () => {
  await loadOptions()
  await loadMovie()
  await loadEpisodes()
})

// Poster change
const onPosterChange = (e) => {
  const f = e.target.files?.[0] || null
  form.posterFile = f
  if (f) {
    try { form.posterUrl = URL.createObjectURL(f) } catch {
      console.error('Failed to create poster URL')
    }
  }
}

const onBackdropChange = (e) => {
  const f = e.target.files?.[0] || null
  form.backdropFile = f
  if (f) {
    try { backdropPreview.value = URL.createObjectURL(f); form.backdropUrl = backdropPreview.value } catch {
      backdropPreview.value = null
    }
  }
}

// add helper to normalize
const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

// Episode modal actions
const openAddEpisode = () => {
  editingEpisode.value = null
  Object.assign(epDraft, {
    _id: null, season: 1, episodeNumber: 1, title: '', duration: '', airDate: '', description: '', videoUrl: '', thumbnailFile: null, videoFile: null, isPublished: true
  })
  _revoke()
  showEpisodeModal.value = true
}
const openEditEpisode = (ep) => {
  editingEpisode.value = ep
  Object.assign(epDraft, {
    _id: ep._id || ep.id,
    season: ep.season,
    episodeNumber: ep.episodeNumber,
    title: ep.title,
    duration: ep.duration,
    airDate: ep.airDate ? new Date(ep.airDate).toISOString().slice(0,10) : '',
    description: ep.description || '',
    videoUrl: ep.videoUrl || '',
    thumbnailFile: null,
    videoFile: null,
    isPublished: ep.isPublished ?? true
  })
  _revoke()
  // set preview urls from existing urls
  if (ep.thumbnail) thumbPreview.value = ep.thumbnail
  if (ep.videoUrl) videoPreview.value = ep.videoUrl
  showEpisodeModal.value = true
}

const onEpThumbnailChange = (e) => {
  const f = e.target.files?.[0] || null
  epDraft.thumbnailFile = f
  if (thumbPreview.value) { try { URL.revokeObjectURL(thumbPreview.value) } catch{
    console.error('Failed to revoke thumbnail URL')
  } }
  thumbPreview.value = f ? URL.createObjectURL(f) : null
}
const onEpVideoChange = (e) => {
  const f = e.target.files?.[0] || null
  epDraft.videoFile = f
  if (videoPreview.value) { try { URL.revokeObjectURL(videoPreview.value) } catch{
    console.error('Failed to revoke video URL')
  } }
  videoPreview.value = f ? URL.createObjectURL(f) : null
  if (f) epDraft.videoUrl = ''
}

// API: save series (PUT)
const saveSeries = async () => {
  if (!form.title || !form.description) return alert('Vui lòng nhập tiêu đề và mô tả')
  saving.value = true
  try {
    const fd = new FormData()
    fd.append('title', form.title)
    if (form.slug) fd.append('slug', form.slug)
    fd.append('description', form.description)
    fd.append('director', form.director || '')
    fd.append('trailer', form.trailer || '')
    fd.append('country', form.country || '')
    fd.append('type', 'series')
    fd.append('totalEpisodes', String(form.totalEpisodes || 0))
    fd.append('seasons', String(form.seasons || 1))
    fd.append('isPublished', form.isPublished ? 'true' : 'false')
    fd.append('isFeatured', form.isFeatured ? 'true' : 'false')
    fd.append('isHot', form.isHot ? 'true' : 'false')
    form.categories.forEach(id => fd.append('categories[]', id))
    form.actors.forEach(id => fd.append('actors[]', id))
    if (form.posterFile) fd.append('poster', form.posterFile)
    if (form.backdropFile) fd.append('backdrop', form.backdropFile)

    // axios will set Content-Type with boundary automatically
    await api.put(`/movies/${id}`, fd)
    alert('Cập nhật series thành công')
    await loadMovie()
  } catch (err) {
    console.error('save series failed', err)
    alert(err?.response?.data?.message || 'Lưu thất bại')
  } finally {
    saving.value = false
  }
}

// API: create / update episode
const saveEpisode = async () => {
  if (!epDraft.title) return alert('Tên tập là bắt buộc')
  if (!epDraft.episodeNumber || epDraft.episodeNumber < 1) return alert('Số tập không hợp lệ')
  if (!epDraft.season || epDraft.season < 1) return alert('Số mùa không hợp lệ')

  const fd = new FormData()
  fd.append('movie', id)
  fd.append('season', String(epDraft.season))
  fd.append('episodeNumber', String(epDraft.episodeNumber))
  fd.append('title', epDraft.title)
  fd.append('description', epDraft.description || '')
  if (epDraft.duration) fd.append('duration', String(epDraft.duration))
  if (epDraft.airDate) fd.append('airDate', epDraft.airDate)
  fd.append('isPublished', epDraft.isPublished ? 'true' : 'false')

  if (epDraft.videoFile) fd.append('video', epDraft.videoFile)
  else if (epDraft.videoUrl) fd.append('videoUrl', epDraft.videoUrl)

  if (epDraft.thumbnailFile) fd.append('thumbnail', epDraft.thumbnailFile)

  try {
    if (editingEpisode.value && epDraft._id) {
      await api.put(`/episodes/${epDraft._id}`, fd)
      alert('Cập nhật tập thành công')
    } else {
      await api.post('/episodes', fd)
      alert('Tạo tập thành công')
    }
    showEpisodeModal.value = false
    _revoke()
    await loadEpisodes()
    // update totalEpisodes on series UI (optional)
    form.totalEpisodes = episodes.value.length
  } catch (err) {
    console.error('save episode failed', err)
    alert(err?.response?.data?.message || 'Lưu tập thất bại')
  }
}

const deleteEpisode = async (ep) => {
  if (!confirm(`Xóa tập S${ep.season}E${ep.episodeNumber} — ${ep.title}?`)) return
  try {
    await api.delete(`/episodes/${ep._id || ep.id}`)
    alert('Xóa thành công')
    await loadEpisodes()
    form.totalEpisodes = episodes.value.length
  } catch (err) {
    console.error('delete ep failed', err)
    alert(err?.response?.data?.message || 'Xóa thất bại')
  }
}

const cancel = () => router.back()
</script>

<template>
  <div class="space-y-6 p-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Sửa Series</h1>
        <p class="text-slate-400 text-sm">Chỉnh sửa thông tin series và quản lý tập</p>
      </div>
      <div class="flex gap-2">
        <button @click="cancel" class="px-4 py-2 bg-slate-700 rounded text-white">Hủy</button>
        <button @click="saveSeries" :disabled="saving" class="px-4 py-2 bg-emerald-600 rounded text-white">{{ saving ? 'Đang lưu...' : 'Lưu' }}</button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Tên Series</label>
            <input v-model="form.title" type="text" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Slug (tùy chọn)</label>
            <input v-model="form.slug" type="text" placeholder="ví dụ: mua-do" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
            <p class="text-xs text-slate-400 mt-1">Để trống để backend tự sinh từ tiêu đề.</p>
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Mô tả</label>
            <textarea v-model="form.description" rows="5" class="w-full bg-slate-700 px-3 py-2 rounded text-white"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-300 mb-1">Đạo diễn</label>
              <input v-model="form.director" type="text" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
            </div>
            <div>
              <label class="block text-sm text-slate-300 mb-1">Quốc gia</label>
              <select v-model="form.country" class="w-full bg-slate-700 px-3 py-2 rounded text-white">
                <option value="">Chọn quốc gia</option>
                <option v-for="c in countries" :key="c._id || c.id" :value="c._id || c.id">{{ c.name || c.title }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-300 mb-1">Thể loại</label>
              <div class="flex gap-2 flex-wrap mb-2">
                <span v-for="cid in form.categories" :key="cid" class="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 text-white rounded-full text-sm">
                  <span>{{ (categories.find(x => x._id === cid || x.id === cid)?.name) || cid }}</span>
                  <button type="button" @click="removeCategory(cid)" class="text-xs text-red-400 hover:text-red-300" title="Xóa">×</button>
                </span>
              </div>
              <select v-model="newCategorySelect" @change="addCategoryFromSelect" class="w-full bg-slate-700 px-3 py-2 rounded text-white">
                <option value="">Thêm thể loại...</option>
                <option v-for="c in categories" :key="c._id || c.id" :value="c._id || c.id">{{ c.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-slate-300 mb-1">Diễn viên</label>
              <div class="flex gap-2 flex-wrap mb-2">
                <span v-for="aid in form.actors" :key="aid" class="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 text-white rounded-full text-sm">
                  <span>{{ (actors.find(x => x._id === aid || x.id === aid)?.name) || aid }}</span>
                  <button type="button" @click="removeActor(aid)" class="text-xs text-red-400 hover:text-red-300" title="Xóa">×</button>
                </span>
              </div>
              <select v-model="newActorSelect" @change="addActorFromSelect" class="w-full bg-slate-700 px-3 py-2 rounded text-white">
                <option value="">Thêm diễn viên...</option>
                <option v-for="a in actors" :key="a._id || a.id" :value="a._id || a.id">{{ a.name }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label class="inline-flex items-center"><input type="checkbox" v-model="form.isPublished" class="mr-2" /> <span class="text-slate-300">Đăng</span></label>
            <label class="inline-flex items-center"><input type="checkbox" v-model="form.isFeatured" class="mr-2" /> <span class="text-slate-300">Nổi bật</span></label>
            <label class="inline-flex items-center"><input type="checkbox" v-model="form.isHot" class="mr-2" /> <span class="text-slate-300">Hot</span></label>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Poster</label>
            <input type="file" accept="image/*" @change="onPosterChange" class="w-full text-sm text-white" />
            <div v-if="form.posterUrl" class="mt-3">
              <img :src="getMediaUrl(form.posterUrl)" class="w-full h-48 object-cover rounded" />
            </div>
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Backdrop (banner)</label>
            <input type="file" accept="image/*" @change="onBackdropChange" class="w-full text-sm text-white" />
            <div v-if="backdropPreview" class="mt-3">
              <img :src="backdropPreview" class="w-full h-28 object-cover rounded" />
            </div>
            <div v-else-if="form.backdropUrl" class="mt-3">
              <img :src="getMediaUrl(form.backdropUrl)" class="w-full h-28 object-cover rounded" />
            </div>
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Trailer URL</label>
            <input v-model="form.trailer" type="url" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
          </div>

          <div class="bg-slate-900/30 p-3 rounded">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm text-slate-200 font-medium">Danh sách tập</h4>
              <div>
                <button @click="openAddEpisode" class="px-2 py-1 bg-blue-600 text-white rounded text-sm mr-2">Thêm tập</button>
              </div>
            </div>

            <div v-if="episodesLoading" class="text-slate-400">Đang tải tập...</div>
            <ul class="space-y-2 max-h-64 overflow-auto">
              <li v-for="ep in episodes" :key="ep._id" class="flex items-center justify-between p-2 bg-slate-800 rounded">
                <div class="text-sm text-slate-200">{{ 'S' + ep.season + ' · T' + ep.episodeNumber + ' — ' + ep.title }}</div>
                <div class="flex items-center gap-2">
                  <button @click="openEditEpisode(ep)" class="text-yellow-300">Sửa</button>
                  <button @click="deleteEpisode(ep)" class="text-red-400">Xóa</button>
                </div>
              </li>
              <li v-if="!episodesLoading && episodes.length===0" class="text-slate-400 text-sm">Chưa có tập nào</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Episode modal -->
    <div v-if="showEpisodeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="bg-slate-900 rounded-lg w-full max-w-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-white font-medium">{{ editingEpisode ? 'Sửa tập' : 'Thêm tập' }}</div>
          <button @click="showEpisodeModal=false" class="text-slate-300">Đóng</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Mùa</label>
            <input v-model.number="epDraft.season" type="number" min="1" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Số tập</label>
            <input v-model.number="epDraft.episodeNumber" type="number" min="1" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm text-slate-300 mb-1">Tên tập</label>
            <input v-model="epDraft.title" type="text" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Thời lượng (phút)</label>
            <input v-model.number="epDraft.duration" type="number" min="1" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Ngày phát sóng</label>
            <input v-model="epDraft.airDate" type="date" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm text-slate-300 mb-1">Thumbnail</label>
            <input type="file" accept="image/*" @change="onEpThumbnailChange" class="w-full text-sm text-white mb-2" />
            <div v-if="thumbPreview" class="mt-2"><img :src="thumbPreview" class="w-48 h-28 object-cover rounded" /></div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm text-slate-300 mb-1">Video (file hoặc URL)</label>
            <input type="file" accept="video/*" @change="onEpVideoChange" class="w-full text-sm text-white mb-2" />
            <div v-if="videoPreview" class="mt-2"><video :src="videoPreview" controls class="w-full h-40 object-cover rounded"></video></div>
            <input v-model="epDraft.videoUrl" type="url" placeholder="Hoặc dán Video URL" class="w-full bg-slate-700 px-3 py-2 rounded text-white mt-2" />
          </div>

          <div class="md:col-span-2 flex justify-end gap-2 mt-2">
            <button @click="showEpisodeModal=false" class="px-4 py-2 bg-slate-700 rounded">Hủy</button>
            <button @click="saveEpisode" class="px-4 py-2 bg-blue-600 text-white rounded">{{ editingEpisode ? 'Cập nhật' : 'Tạo' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
.animate-fade-in { animation: fade-in .3s ease-out; }
</style>