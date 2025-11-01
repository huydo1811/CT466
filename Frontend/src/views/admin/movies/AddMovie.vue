<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api' // axios instance with baseURL '/api' and auth

const router = useRouter()

// form model
const movieForm = reactive({
  title: '',
  description: '',
  categories: [],
  country: '',
  actors: [],
  director: '',
  duration: '',
  releaseDate: '',
  year: '',
  type: 'movie',
  posterFile: null,
  trailer: '',
  videoFile: null,
  isPublished: true,
  isFeatured: false,
  isHot: false
})

// option lists (load from API)
const categories = ref([])
const countries = ref([])
const actors = ref([])

// UI helpers
const actorSearch = ref('')
const categorySearch = ref('')

// previews (use object URLs and revoke old ones)
const posterPreview = ref(null)
const videoPreview = ref(null)

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

const selectedActors = ref([])
const selectedCategories = ref([])

onMounted(async () => {
  try {
    const [cRes, coRes, aRes] = await Promise.all([
      api.get('/categories'),
      api.get('/countries'),
      api.get('/actors')
    ])
    categories.value = normalizeList(cRes?.data?.data || cRes?.data || [])
    countries.value = normalizeList(coRes?.data?.data || coRes?.data || [])
    actors.value = normalizeList(aRes?.data?.data || aRes?.data || [])
  } catch (err) {
    console.warn('load options failed', err)
    categories.value = []
    countries.value = []
    actors.value = []
  }
})

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

onBeforeUnmount(() => {
  _revokePoster()
  _revokeVideo()
})

const onPosterChange = (e) => {
  const f = e.target.files?.[0] || null
  // revoke previous
  _revokePoster()
  movieForm.posterFile = f
  if (f) {
    try { posterPreview.value = URL.createObjectURL(f) } catch (err) { 
      console.error('create poster preview failed', err)
      posterPreview.value = null }
  }
}

const onVideoChange = (e) => {
  const f = e.target.files?.[0] || null
  // revoke previous
  _revokeVideo()
  movieForm.videoFile = f
  if (f) {
    try { videoPreview.value = URL.createObjectURL(f) } catch (err) { 
      console.error('create video preview failed', err)
      videoPreview.value = null }
  }
}

const addActor = (actor) => {
  const id = actor.id || actor._id || actor.id
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
  const id = cat.id || cat._id || cat.id
  if (!movieForm.categories.includes(id)) {
    movieForm.categories.push(id)
    selectedCategories.value.push({ id, name: cat.name })
  }
}

const removeCategory = (id) => {
  movieForm.categories = movieForm.categories.filter(c => c !== id)
  selectedCategories.value = selectedCategories.value.filter(c => c.id !== id)
}

const handleSubmit = async () => {
  try {
    if (!movieForm.title || !movieForm.description || !movieForm.director || !movieForm.releaseDate) {
      alert('Vui lòng điền đầy đủ: tiêu đề, mô tả, đạo diễn, ngày phát hành.')
      return
    }

    const fd = new FormData()
    fd.append('title', movieForm.title)
    fd.append('description', movieForm.description)
    fd.append('director', movieForm.director)
    fd.append('duration', movieForm.duration)
    fd.append('releaseDate', movieForm.releaseDate)
    fd.append('year', movieForm.year || new Date(movieForm.releaseDate).getFullYear())
    fd.append('type', movieForm.type)
    fd.append('trailer', movieForm.trailer || '')
    fd.append('country', movieForm.country || '')
    fd.append('isPublished', movieForm.isPublished ? 'true' : 'false')
    fd.append('isFeatured', movieForm.isFeatured ? 'true' : 'false')
    fd.append('isHot', movieForm.isHot ? 'true' : 'false')

    movieForm.categories.forEach(id => fd.append('categories[]', id))
    movieForm.actors.forEach(id => fd.append('actors[]', id))

    if (movieForm.posterFile) fd.append('poster', movieForm.posterFile)
    if (movieForm.videoFile) fd.append('video', movieForm.videoFile)

    await api.post('/movies', fd, { headers: { 'Content-Type': 'multipart/form-data' } })

    // revoke after upload
    _revokePoster()
    _revokeVideo()

    alert('Tạo phim thành công')
    router.push('/admin/movies')
  } catch (err) {
    console.error(err)
    alert(err?.response?.data?.message || 'Lỗi khi gửi dữ liệu')
  }
}

const handleCancel = () => {
  // revoke on cancel to free memory
  _revokePoster()
  _revokeVideo()
  router.go(-1)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Thêm phim mới</h1>
        <p class="text-slate-400">Thêm phim hoặc series mới vào hệ thống</p>
      </div>
      <button @click="handleCancel" class="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors">Hủy</button>
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
                <label class="block text-sm font-medium text-slate-300 mb-2">Năm (tùy chọn)</label>
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

            <!-- categories multi-select -->
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

            <!-- actors multi-select -->
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
            </div>
          </div>

          <!-- Right column: poster, trailer, video upload, preview -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Poster</label>
              <input type="file" accept="image/*" @change="onPosterChange" class="w-full text-sm text-white" />
              <div v-if="posterPreview" class="mt-3">
                <img :src="posterPreview" class="w-full h-48 object-cover rounded" />
              </div>
              <div v-else-if="movieForm.posterFile" class="mt-3">
                <!-- fallback if preview not set -->
                <img :src="URL.createObjectURL(movieForm.posterFile)" class="w-full h-48 object-cover rounded" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Trailer URL (YouTube embed link)</label>
              <input v-model="movieForm.trailer" type="url" placeholder="https://www.youtube.com/embed/..." class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">File phim (upload)</label>
              <input type="file" accept="video/*" @change="onVideoChange" class="w-full text-sm text-white" />
              <div v-if="movieForm.videoFile" class="mt-2 text-slate-300 text-sm">Chọn file: {{ movieForm.videoFile.name }}</div>
              <div v-if="videoPreview" class="mt-2">
                <video :src="videoPreview" controls class="w-full h-48 object-cover rounded bg-black"></video>
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="w-full btn-primary px-4 py-2 rounded">Tạo phim</button>
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