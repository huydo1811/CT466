<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// form model
const movieForm = reactive({
  title: '',
  description: '',
  categories: [], // array of category ids
  country: '', // country id
  actors: [], // array of actor ids
  director: '',
  duration: '', // minutes
  releaseDate: '', // yyyy-mm-dd
  year: '', // optional (will be set by backend from releaseDate)
  type: 'movie', // movie | series | anime
  posterFile: null, // File
  trailer: '', // url
  videoFile: null, // File (videoUrl backend)
  isPublished: true,
  isFeatured: false,
  isHot: false
})

// option lists (load from API in onMounted)
const categories = ref([])
const countries = ref([])
const actors = ref([])

// UI helpers for actor/category multi-select (simple)
const actorSearch = ref('')
const filteredActors = computed(() =>
  actors.value.filter(a => a.name.toLowerCase().includes(actorSearch.value.toLowerCase()))
)

const categorySearch = ref('')
const filteredCategories = computed(() =>
  categories.value.filter(c => c.name.toLowerCase().includes(categorySearch.value.toLowerCase()))
)

const selectedActors = ref([]) // { id, name }
const selectedCategories = ref([]) // { id, name }

onMounted(async () => {
  // TODO: replace mocks with real API calls
  // const res = await fetch('/api/categories'); categories.value = await res.json()
  categories.value = [{ id: 'cat1', name: 'Hành động' }, { id: 'cat2', name: 'Kinh dị' }]
  countries.value = [{ id: 'ct1', name: 'Mỹ' }, { id: 'ct2', name: 'Hàn Quốc' }]
  actors.value = [
    { id: 'a1', name: 'Robert Downey Jr.' },
    { id: 'a2', name: 'Chris Evans' },
    { id: 'a3', name: 'Scarlett Johansson' }
  ]
})

const onPosterChange = (e) => {
  const f = e.target.files[0]
  movieForm.posterFile = f || null
}

const onVideoChange = (e) => {
  const f = e.target.files[0]
  movieForm.videoFile = f || null
}

const addActor = (actor) => {
  if (!movieForm.actors.includes(actor.id)) {
    movieForm.actors.push(actor.id)
    selectedActors.value.push(actor)
  }
}

const removeActor = (id) => {
  movieForm.actors = movieForm.actors.filter(a => a !== id)
  selectedActors.value = selectedActors.value.filter(a => a.id !== id)
}

const addCategory = (cat) => {
  if (!movieForm.categories.includes(cat.id)) {
    movieForm.categories.push(cat.id)
    selectedCategories.value.push(cat)
  }
}

const removeCategory = (id) => {
  movieForm.categories = movieForm.categories.filter(c => c !== id)
  selectedCategories.value = selectedCategories.value.filter(c => c.id !== id)
}

const handleSubmit = async () => {
  try {
    // basic validation
    if (!movieForm.title || !movieForm.description || !movieForm.director || !movieForm.releaseDate) {
      alert('Vui lòng điền đầy đủ: tiêu đề, mô tả, đạo diễn, ngày phát hành.')
      return
    }
    if (!movieForm.posterFile || !movieForm.videoFile) {
      if (!confirm('Poster hoặc file phim chưa chọn. Tiếp tục gửi?')) {
        return
      }
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

    // arrays
    movieForm.categories.forEach(id => fd.append('categories[]', id))
    movieForm.actors.forEach(id => fd.append('actors[]', id))

    // files
    if (movieForm.posterFile) fd.append('poster', movieForm.posterFile)
    if (movieForm.videoFile) fd.append('video', movieForm.videoFile)

    // send to backend (adjust URL to your API)
    const res = await fetch('/api/admin/movies', {
      method: 'POST',
      body: fd
      // headers not needed for FormData
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Lỗi server' }))
      alert('Tạo phim thất bại: ' + (err.message || res.statusText))
      return
    }

    alert('Tạo phim thành công')
    router.push('/admin/movies')
  } catch (err) {
    console.error(err)
    alert('Lỗi khi gửi dữ liệu')
  }
}

const handleCancel = () => {
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
              <div v-if="movieForm.posterFile" class="mt-3">
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