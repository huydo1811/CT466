<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const id = route.params.id

// form model (same fields as AddMovie)
const movieForm = reactive({
  title: '',
  slug: '',                    
  description: '',
  categories: [], // ids
  country: '',
  actors: [], // ids
  director: '',
  duration: '',
  releaseDate: '',
  year: '',
  type: 'movie',
  posterFile: null,
  posterUrl: '', // existing url or preview
  trailer: '',
  videoFile: null,
  videoUrl: '', // existing url or preview
  isPublished: true,
  isFeatured: false,
  isHot: false,
  isHero: false,
})

// option lists
const categories = ref([])
const countries = ref([])
const actors = ref([])

// UI helpers
const actorSearch = ref('')
const categorySearch = ref('')
const selectedActors = ref([]) // objects
const selectedCategories = ref([])

// previews (object URLs)
const posterPreview = ref(null)
const videoPreview = ref(null)
const backdropPreview = ref(null)

const normalizeList = (arr = []) => (arr || []).map(it => ({ ...it, id: it._id || it.id }))

const filteredActors = computed(() =>
  actors.value
    .filter(a => a.name && a.name.toLowerCase().includes(actorSearch.value.toLowerCase()))
    .filter(a => !movieForm.actors.includes(a.id))
)
const filteredCategories = computed(() =>
  categories.value
    .filter(c => c.name && c.name.toLowerCase().includes(categorySearch.value.toLowerCase()))
    .filter(c => !movieForm.categories.includes(c.id))
)

// revoke helpers
const _revokePoster = () => {
  if (posterPreview.value) {
    URL.revokeObjectURL(posterPreview.value)
    posterPreview.value = null
  }
}
const _revokeVideo = () => {
  if (videoPreview.value) {
    URL.revokeObjectURL(videoPreview.value)
    videoPreview.value = null
  }
}
onBeforeUnmount(() => { _revokePoster(); _revokeVideo(); if (backdropPreview.value) { URL.revokeObjectURL(backdropPreview.value); backdropPreview.value = null } })

// load lists and movie data
onMounted(async () => {
  try {
    const [catRes, countryRes, actorRes] = await Promise.all([
      api.get('/categories'),
      api.get('/countries'),
      api.get('/actors')
    ])
    categories.value = normalizeList(catRes?.data?.data || catRes?.data || [])
    countries.value = normalizeList(countryRes?.data?.data || countryRes?.data || [])
    actors.value = normalizeList(actorRes?.data?.data || actorRes?.data || [])
  } catch (e) {
    console.warn('load lists failed', e)
  }

  // fetch movie details (admin route requires auth header from api instance)
  try {
    const res = await api.get(`/movies/${id}`)
    const data = res?.data?.data || res?.data || {}
    // normalize fields
    movieForm.title = data.title || ''
    movieForm.slug = data.slug || ''    // <-- populate slug
    movieForm.description = data.description || ''
    movieForm.categories = (data.categories || []).map(c => c._id || c.id || c)
    movieForm.country = (data.country && (data.country._id || data.country.id)) || data.country || ''
    movieForm.actors = (data.actors || data.cast || []).map(a => a._id || a.id || a)
    movieForm.director = data.director || ''
    movieForm.duration = data.duration || ''
    movieForm.releaseDate = data.releaseDate ? data.releaseDate.split('T')[0] : (data.releaseDate || '')
    movieForm.year = data.year || ''
    movieForm.type = data.type || 'movie'
    movieForm.posterUrl = data.poster || data.posterUrl || ''
    movieForm.backdropUrl = data.backdrop || ''
    movieForm.trailer = data.trailer || ''
    movieForm.videoUrl = data.videoUrl || data.video || ''
    movieForm.isPublished = !!data.isPublished
    movieForm.isFeatured = !!data.isFeatured
    movieForm.isHot = !!data.isHot
    movieForm.isHero = !!data.isHero; 

    // populate selected objects for chips
    selectedActors.value = actors.value.filter(a => movieForm.actors.includes(a.id))
    selectedCategories.value = categories.value.filter(c => movieForm.categories.includes(c.id))
  } catch (err) {
    console.error('fetch movie failed', err)
  }
})

// file handlers
const onPosterChange = (e) => {
  const f = e.target.files?.[0] || null
  _revokePoster()
  movieForm.posterFile = f
  if (f) {
    try { posterPreview.value = URL.createObjectURL(f); movieForm.posterUrl = posterPreview.value } catch { posterPreview.value = null }
  }
}

const onVideoChange = (e) => {
  const f = e.target.files?.[0] || null
  _revokeVideo()
  movieForm.videoFile = f
  if (f) {
    try { videoPreview.value = URL.createObjectURL(f); movieForm.videoUrl = videoPreview.value } catch { videoPreview.value = null }
  }
}

const onBackdropChange = (e) => {
  const f = e.target.files?.[0] || null
  if (backdropPreview.value) { URL.revokeObjectURL(backdropPreview.value); backdropPreview.value = null }
  movieForm.backdropFile = f
  if (f) {
    try { backdropPreview.value = URL.createObjectURL(f); movieForm.backdropUrl = backdropPreview.value } catch { backdropPreview.value = null }
  }
}

// multi-select helpers
const addActor = (actor) => {
  const id = actor.id || actor._id || actor
  if (!movieForm.actors.includes(id)) {
    movieForm.actors.push(id)
    selectedActors.value.push({ id, name: actor.name })
  }
}
const removeActor = (id) => {
  movieForm.actors = movieForm.actors.filter(a => a !== id)
  selectedActors.value = selectedActors.value.filter(a => a.id !== id)
}

const addCategory = (cat) => {
  const id = cat.id || cat._id || cat
  if (!movieForm.categories.includes(id)) {
    movieForm.categories.push(id)
    selectedCategories.value.push({ id, name: cat.name })
  }
}
const removeCategory = (id) => {
  movieForm.categories = movieForm.categories.filter(c => c !== id)
  selectedCategories.value = selectedCategories.value.filter(c => c.id !== id)
}

// submit update
const handleSubmit = async () => {
  try {
    if (!movieForm.title || !movieForm.description) {
      alert('Vui lòng điền tên và mô tả.')
      return
    }

    const fd = new FormData()
    fd.append('title', movieForm.title)
    if (movieForm.slug) fd.append('slug', movieForm.slug)
    fd.append('description', movieForm.description)
    fd.append('director', movieForm.director)
    fd.append('duration', movieForm.duration)
    fd.append('releaseDate', movieForm.releaseDate)
    fd.append('year', movieForm.year || '')
    fd.append('type', movieForm.type)
    fd.append('trailer', movieForm.trailer || '')
    fd.append('country', movieForm.country || '')
    fd.append('isPublished', movieForm.isPublished ? 'true' : 'false')
    fd.append('isFeatured', movieForm.isFeatured ? 'true' : 'false')
    fd.append('isHot', movieForm.isHot ? 'true' : 'false')
    fd.append('isHero', movieForm.isHero ? 'true' : 'false'); 
    movieForm.categories.forEach(id => fd.append('categories[]', id))
    movieForm.actors.forEach(id => fd.append('actors[]', id))

    if (movieForm.posterFile) fd.append('poster', movieForm.posterFile)
    if (movieForm.backdropFile) fd.append('backdrop', movieForm.backdropFile)
    if (movieForm.videoFile) fd.append('video', movieForm.videoFile)

    await api.put(`/movies/${id}`, fd)

    // revoke previews
    _revokePoster(); _revokeVideo()

    alert('Cập nhật thành công')
    router.push('/admin/movies')
  } catch (err) {
    console.error('update failed', err)
    alert(err?.response?.data?.message || 'Cập nhật thất bại')
  }
}

const handleCancel = () => {
  _revokePoster(); _revokeVideo()
  router.go(-1)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Sửa phim</h1>
        <p class="text-slate-400">Cập nhật thông tin phim</p>
      </div>
      <button @click="handleCancel" class="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg">Hủy</button>
    </div>

    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Tên phim</label>
              <input v-model="movieForm.title" type="text" required class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Slug (tùy chọn)</label>
              <input v-model="movieForm.slug" type="text" placeholder="ví dụ: mua-do" class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white" />
              <p class="text-xs text-slate-400 mt-1">Nếu để trống, backend sẽ tự sinh từ tiêu đề.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
              <textarea v-model="movieForm.description" rows="6" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Đạo diễn</label>
                <input v-model="movieForm.director" type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Thời lượng (phút)</label>
                <input v-model="movieForm.duration" type="number" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Ngày phát hành</label>
                <input v-model="movieForm.releaseDate" type="date" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Năm (tùy)</label>
                <input v-model="movieForm.year" type="number" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Loại</label>
                <select v-model="movieForm.type" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                  <option value="movie">Phim điện ảnh</option>
                  <option value="series">Series</option>
                  <option value="anime">Anime</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Quốc gia</label>
                <select v-model="movieForm.country" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                  <option value="">Chọn quốc gia</option>
                  <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
            </div>

            <!-- categories -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Thể loại</label>
              <div class="flex gap-2 flex-wrap mb-2">
                <span v-for="c in selectedCategories" :key="c.id" class="px-3 py-1 bg-slate-700 text-white rounded-full text-sm">
                  {{ c.name }} <button @click.prevent="removeCategory(c.id)" class="ml-2 text-red-400">×</button>
                </span>
              </div>
              <input v-model="categorySearch" placeholder="Tìm thể loại..." class="w-full bg-slate-700 px-3 py-2 rounded mb-2 text-white" />
              <ul class="max-h-40 overflow-auto bg-slate-800/20 rounded">
                <li v-for="c in filteredCategories" :key="c.id" class="p-2 hover:bg-slate-700 cursor-pointer" @click.prevent="addCategory(c)">{{ c.name }}</li>
              </ul>
            </div>

            <!-- actors -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Diễn viên</label>
              <div class="flex gap-2 flex-wrap mb-2">
                <span v-for="a in selectedActors" :key="a.id" class="px-3 py-1 bg-slate-700 text-white rounded-full text-sm">
                  {{ a.name }} <button @click.prevent="removeActor(a.id)" class="ml-2 text-red-400">×</button>
                </span>
              </div>
              <input v-model="actorSearch" placeholder="Tìm diễn viên..." class="w-full bg-slate-700 px-3 py-2 rounded mb-2 text-white" />
              <ul class="max-h-40 overflow-auto bg-slate-800/20 rounded">
                <li v-for="a in filteredActors" :key="a.id" class="p-2 hover:bg-slate-700 cursor-pointer" @click.prevent="addActor(a)">{{ a.name }}</li>
              </ul>
              <div class="text-xs text-slate-400 mt-1">Nếu diễn viên chưa có, thêm ở trang Diễn viên.</div>
            </div>

            <div class="flex items-center gap-4 mt-2">
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="movieForm.isPublished" class="mr-2" />
                <span class="text-slate-300">Đăng ngay</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="movieForm.isFeatured" class="mr-2" />
                <span class="text-slate-300">Nổi bật</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="movieForm.isHot" class="mr-2" />
                <span class="text-slate-300">Hot</span>
              </label>
              <label class="inline-flex items-center"> 
                <input type="checkbox" v-model="movieForm.isHero" class="mr-2" />
                <span class="text-slate-300">Hero (Banner đầu trang)</span>
              </label>
            </div>
          </div>

          <!-- right column -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Poster</label>
              <input type="file" accept="image/*" @change="onPosterChange" class="w-full text-sm text-white" />
              <div v-if="posterPreview" class="mt-3">
                <img :src="posterPreview" class="w-full h-48 object-cover rounded" />
              </div>
              <div v-else-if="movieForm.posterUrl" class="mt-3">
                <img :src="movieForm.posterUrl" class="w-full h-48 object-cover rounded" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Backdrop (ảnh banner)</label>
              <input type="file" accept="image/*" @change="onBackdropChange" class="w-full text-sm text-white" />
              <div v-if="backdropPreview" class="mt-3">
                <img :src="backdropPreview" class="w-full h-28 object-cover rounded" />
              </div>
              <div v-else-if="movieForm.backdropUrl" class="mt-3">
                <img :src="movieForm.backdropUrl" class="w-full h-28 object-cover rounded" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Trailer URL (YouTube embed)</label>
              <input v-model="movieForm.trailer" type="url" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">File phim (upload)</label>
              <input type="file" accept="video/*" @change="onVideoChange" class="w-full text-sm text-white" />
              <div v-if="videoPreview" class="mt-2">
                <video :src="videoPreview" controls class="w-full h-48 object-cover rounded bg-black"></video>
              </div>
              <div v-else-if="movieForm.videoUrl" class="mt-2 text-slate-300 text-sm">Hiện tại: <a :href="movieForm.videoUrl" target="_blank" class="text-blue-300 underline">Xem file</a></div>
            </div>

            <div class="mt-4">
              <button type="submit" class="w-full btn-primary px-4 py-2 rounded">Lưu thay đổi</button>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button type="button" @click="handleCancel" class="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
.animate-fade-in { animation: fade-in .5s ease-out }
</style>