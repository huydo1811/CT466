<script setup>
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

// form model for series (basic info only)
const seriesForm = reactive({
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

// option lists loaded from backend
const categories = ref([])
const countries = ref([])
const actors = ref([])

const categorySearch = ref('')
const actorSearch = ref('')

const normalize = (arr = []) => (arr || []).map(it => ({ ...it, id: it._id || it.id }))

const filteredCategories = computed(() =>
  categories.value
    .filter(c => c.name && c.name.toLowerCase().includes(categorySearch.value.toLowerCase()))
    .filter(c => !seriesForm.categories.includes(c.id))
)
const filteredActors = computed(() =>
  actors.value
    .filter(a => a.name && a.name.toLowerCase().includes(actorSearch.value.toLowerCase()))
    .filter(a => !seriesForm.actors.includes(a.id))
)

const selectedCategories = ref([])
const selectedActors = ref([])

// poster preview + revoke
const posterPreview = ref(null)
// backdrop preview + revoke
const backdropPreview = ref(null)
const _revokePoster = () => {
  if (posterPreview.value) {
    try { URL.revokeObjectURL(posterPreview.value) } catch {
      // ignore
    }
    posterPreview.value = null
  }
}
const _revokeBackdrop = () => {
  if (backdropPreview.value) {
    try { URL.revokeObjectURL(backdropPreview.value) } catch { 
      // ignore
    }
    backdropPreview.value = null
  }
}
onBeforeUnmount(() => { _revokePoster(); _revokeBackdrop() })

onMounted(async () => {
  try {
    const [catRes, countryRes, actorRes] = await Promise.all([
      api.get('/categories'),
      api.get('/countries'),
      api.get('/actors')
    ])
    categories.value = normalize(catRes?.data?.data || catRes?.data || [])
    countries.value = normalize(countryRes?.data?.data || countryRes?.data || [])
    actors.value = normalize(actorRes?.data?.data || actorRes?.data || [])
    selectedCategories.value = []
    selectedActors.value = []
  } catch (err) {
    console.warn('Load option lists failed', err)
    categories.value = []
    countries.value = []
    actors.value = []
  }
})

const onPosterChange = (e) => {
  const f = e.target.files?.[0] || null
  _revokePoster()
  seriesForm.posterFile = f
  if (f) {
    try { posterPreview.value = URL.createObjectURL(f) } catch { posterPreview.value = null }
  } else {
    seriesForm.posterFile = null
  }
}

const onBackdropChange = (e) => {
  const f = e.target.files?.[0] || null
  _revokeBackdrop()
  seriesForm.backdropFile = f
  if (f) {
    try { backdropPreview.value = URL.createObjectURL(f) } catch { backdropPreview.value = null }
  } else {
    seriesForm.backdropFile = null
  }
}

const addCategory = (cat) => {
  if (!seriesForm.categories.includes(cat.id)) {
    seriesForm.categories.push(cat.id)
    selectedCategories.value.push(cat)
  }
}
const removeCategory = (id) => {
  seriesForm.categories = seriesForm.categories.filter(c => c !== id)
  selectedCategories.value = selectedCategories.value.filter(c => c.id !== id)
}

const addActor = (a) => {
  if (!seriesForm.actors.includes(a.id)) {
    seriesForm.actors.push(a.id)
    selectedActors.value.push(a)
  }
}
const removeActor = (id) => {
  seriesForm.actors = seriesForm.actors.filter(a => a !== id)
  selectedActors.value = selectedActors.value.filter(a => a.id !== id)
}

const handleSubmit = async () => {
  try {
    if (!seriesForm.title || !seriesForm.description) {
      alert('Vui lòng nhập tên và mô tả series.')
      return
    }

    const fd = new FormData()
    fd.append('title', seriesForm.title)
    if (seriesForm.slug) fd.append('slug', seriesForm.slug)
    fd.append('description', seriesForm.description)
    fd.append('director', seriesForm.director || '')
    fd.append('trailer', seriesForm.trailer || '')
    fd.append('country', seriesForm.country || '')
    fd.append('type', 'series')
    fd.append('totalEpisodes', String(seriesForm.totalEpisodes || 0))
    fd.append('seasons', String(seriesForm.seasons || 1)) // <-- gửi seasons
    fd.append('isPublished', seriesForm.isPublished ? 'true' : 'false')
    fd.append('isFeatured', seriesForm.isFeatured ? 'true' : 'false')
    fd.append('isHot', seriesForm.isHot ? 'true' : 'false')

    seriesForm.categories.forEach(id => fd.append('categories[]', id))
    seriesForm.actors.forEach(id => fd.append('actors[]', id))

    if (seriesForm.posterFile) fd.append('poster', seriesForm.posterFile)
    if (seriesForm.backdropFile) fd.append('backdrop', seriesForm.backdropFile)

    // send to /movies as before
    await api.post('/movies', fd, { headers: { 'Content-Type': 'multipart/form-data' } })

    _revokePoster()
    _revokeBackdrop()
    alert('Tạo series thành công')
    router.push('/admin/series')
  } catch (err) {
    console.error('create series failed', err)
    alert(err?.response?.data?.message || 'Lỗi khi tạo series')
  }
}

const handleCancel = () => {
  _revokePoster()
  _revokeBackdrop()
  router.go(-1)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Thêm Series mới</h1>
      </div>
      <div class="flex items-center gap-3">
        <button @click="handleCancel" class="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg">Hủy</button>
        <button @click="handleSubmit" class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg">Lưu</button>
      </div>
    </div>

    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tên Series</label>
            <input v-model="seriesForm.title" type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Slug (tùy chọn)</label>
            <input v-model="seriesForm.slug" placeholder="ví dụ: mua-do" class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            <p class="text-xs text-slate-400 mt-1">Để trống để backend tự sinh từ tiêu đề.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
            <textarea v-model="seriesForm.description" rows="6" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Đạo diễn</label>
              <input v-model="seriesForm.director" type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Quốc gia</label>
              <select v-model="seriesForm.country" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                <option value="">Chọn quốc gia</option>
                <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Số tập</label>
              <input v-model.number="seriesForm.totalEpisodes" type="number" min="0" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Số mùa</label>
              <input v-model.number="seriesForm.seasons" type="number" min="1" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div class="flex items-center gap-4 mt-2">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="seriesForm.isPublished" class="mr-2" />
              <span class="text-slate-300">Đăng ngay</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="seriesForm.isFeatured" class="mr-2" />
              <span class="text-slate-300">Nổi bật</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="seriesForm.isHot" class="mr-2" />
              <span class="text-slate-300">Hot</span>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Ngày phát hành</label>
            <input v-model="seriesForm.releaseDate" type="date" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
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
            <div v-else-if="seriesForm.posterUrl" class="mt-3">
              <img :src="seriesForm.posterUrl" class="w-full h-48 object-cover rounded" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Backdrop (banner)</label>
            <input type="file" accept="image/*" @change="onBackdropChange" class="w-full text-sm text-white" />
            <div v-if="backdropPreview" class="mt-3">
              <img :src="backdropPreview" class="w-full h-28 object-cover rounded" />
            </div>
            <div v-else-if="seriesForm.backdropUrl" class="mt-3">
              <img :src="seriesForm.backdropUrl" class="w-full h-28 object-cover rounded" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Trailer URL</label>
            <input v-model="seriesForm.trailer" type="url" placeholder="https://www.youtube.com/embed/..." class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
.animate-fade-in { animation: fade-in .5s ease-out }
</style>