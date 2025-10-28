<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()
const id = route.params.id || 's1'

// mock data (replace with real fetch when backend ready)
const mockSeriesList = [
  {
    id: 's1',
    title: 'Breaking Bad',
    description: 'Demo description for Breaking Bad',
    director: 'Vince Gilligan',
    country: 'ct1',
    categories: ['cat1'],
    actors: ['a1'],
    posterFileName: '',
    trailer: '',
    isPublished: true,
    isFeatured: false,
    isHot: false,
    episodes: [
      { id: 1, season: 1, episodeNumber: 1, title: 'Pilot', duration: 58, airDate: '2008-01-20', videoUrl: '' },
      { id: 2, season: 1, episodeNumber: 2, title: "Cat's in the Bag...", duration: 48, airDate: '2008-01-27', videoUrl: '' }
    ]
  },
  {
    id: 's2',
    title: 'Stranger Things',
    description: 'Demo description for Stranger Things',
    director: 'Duffer Brothers',
    country: 'ct1',
    categories: ['cat2'],
    actors: ['a2'],
    posterFileName: '',
    trailer: '',
    isPublished: true,
    isFeatured: true,
    isHot: false,
    episodes: []
  }
]

// mock options
const categories = ref([{ id: 'cat1', name: 'Hành động' }, { id: 'cat2', name: 'Khoa học viễn tưởng' }])
const countries = ref([{ id: 'ct1', name: 'Mỹ' }, { id: 'ct2', name: 'Nhật Bản' }])
const actors = ref([{ id: 'a1', name: 'Bryan Cranston' }, { id: 'a2', name: 'Winona Ryder' }])

// form model
const form = reactive({
  id: '',
  title: '',
  description: '',
  director: '',
  country: '',
  categories: [],
  actors: [],
  posterFile: null,
  posterFileName: '',
  trailer: '',
  isPublished: false,
  isFeatured: false,
  isHot: false
})

// episodes list (editable)
const episodes = ref([])

// episode editor (for add or edit)
const editingEpisode = ref(null)
const episodeDraft = reactive({
  id: null,
  season: 1,
  episodeNumber: 1,
  title: '',
  duration: '',
  airDate: '',
  videoUrl: '',
  videoFile: null,
  videoFileName: ''
})

// UI helpers
const categorySearch = ref('')
const actorSearch = ref('')
const filteredCategories = computed(() => categories.value.filter(c => c.name.toLowerCase().includes(categorySearch.value.toLowerCase())))
const filteredActors = computed(() => actors.value.filter(a => a.name.toLowerCase().includes(actorSearch.value.toLowerCase())))

onMounted(() => {
  // load mock series by id
  const s = mockSeriesList.find(x => x.id === id) || mockSeriesList[0]
  form.id = s.id
  form.title = s.title
  form.description = s.description
  form.director = s.director
  form.country = s.country
  form.categories = [...(s.categories || [])]
  form.actors = [...(s.actors || [])]
  form.trailer = s.trailer || ''
  form.isPublished = !!s.isPublished
  form.isFeatured = !!s.isFeatured
  form.isHot = !!s.isHot
  form.posterFile = null
  form.posterFileName = s.posterFileName || ''
  episodes.value = (s.episodes || []).map(e => ({ ...e }))
})

// handlers
const onPosterChange = (e) => {
  const f = e.target.files?.[0] || null
  form.posterFile = f
  form.posterFileName = f ? f.name : ''
}

const openAddEpisode = () => {
  editingEpisode.value = null
  Object.assign(episodeDraft, { id: null, season: 1, episodeNumber: 1, title: '', duration: '', airDate: '', videoUrl: '', videoFile: null, videoFileName: '' })
  showEpisodeModal.value = true
}

const openEditEpisode = (ep) => {
  editingEpisode.value = ep
  Object.assign(episodeDraft, {
    id: ep.id,
    season: ep.season,
    episodeNumber: ep.episodeNumber,
    title: ep.title,
    duration: ep.duration,
    airDate: ep.airDate,
    videoUrl: ep.videoUrl || '',
    videoFile: null,
    videoFileName: ep.videoFileName || ''
  })
  showEpisodeModal.value = true
}

const onEpisodeFileChange = (e) => {
  const f = e.target.files?.[0] || null
  episodeDraft.videoFile = f
  episodeDraft.videoFileName = f ? f.name : ''
  if (episodeDraft.videoFile) episodeDraft.videoUrl = ''
}

const saveEpisode = () => {
  if (!episodeDraft.title) { alert('Tên tập là bắt buộc'); return }
  if (editingEpisode.value) {
    Object.assign(editingEpisode.value, {
      season: Number(episodeDraft.season),
      episodeNumber: Number(episodeDraft.episodeNumber),
      title: episodeDraft.title,
      duration: episodeDraft.duration ? Number(episodeDraft.duration) : null,
      airDate: episodeDraft.airDate || null,
      videoUrl: episodeDraft.videoFile ? URL.createObjectURL(episodeDraft.videoFile) : (episodeDraft.videoUrl || ''),
      videoFileName: episodeDraft.videoFileName || ''
    })
  } else {
    const nextId = (episodes.value.reduce((m, e) => Math.max(m, e.id || 0), 0) || 0) + 1
    episodes.value.push({
      id: nextId,
      season: Number(episodeDraft.season),
      episodeNumber: Number(episodeDraft.episodeNumber),
      title: episodeDraft.title,
      duration: episodeDraft.duration ? Number(episodeDraft.duration) : null,
      airDate: episodeDraft.airDate || null,
      videoUrl: episodeDraft.videoFile ? URL.createObjectURL(episodeDraft.videoFile) : (episodeDraft.videoUrl || ''),
      videoFileName: episodeDraft.videoFileName || ''
    })
  }
  showEpisodeModal.value = false
}

const deleteEpisode = (ep) => {
  if (confirm(`Xóa tập "${ep.title}"?`)) episodes.value = episodes.value.filter(e => e.id !== ep.id)
}

const toggleCategory = (c) => {
  if (form.categories.includes(c.id)) form.categories = form.categories.filter(x => x !== c.id)
  else form.categories.push(c.id)
}
const toggleActor = (a) => {
  if (form.actors.includes(a.id)) form.actors = form.actors.filter(x => x !== a.id)
  else form.actors.push(a.id)
}

const showEpisodeModal = ref(false)

const submit = () => {
  if (!form.title) { alert('Tên series là bắt buộc'); return }
  const payload = {
    ...form,
    episodes: episodes.value.map(e => ({ ...e }))
  }
  console.log('Edit series payload (UI-only):', payload)
  alert('Lưu seriesthành công')
  router.push('/admin/series')
}

const cancel = () => router.back()
</script>

<template>
  <div class="space-y-6 p-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Sửa Series</h1>
        <p class="text-slate-400 text-sm">Chỉnh sửa thông tin series & quản lý tập </p>
      </div>
      <div class="flex gap-2">
        <button @click="cancel" class="px-4 py-2 bg-slate-700 rounded text-white">Hủy</button>
        <button @click="submit" class="px-4 py-2 bg-emerald-600 rounded text-white">Lưu</button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tên Series</label>
            <input v-model="form.title" type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
            <textarea v-model="form.description" rows="6" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Đạo diễn</label>
              <input v-model="form.director" type="text" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Quốc gia</label>
              <select v-model="form.country" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                <option value="">Chọn quốc gia</option>
                <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <!-- categories & actors (search/toggle) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Thể loại</label>
              <input v-model="categorySearch" placeholder="Tìm thể loại..." class="w-full bg-slate-700 px-3 py-2 rounded mb-2 text-white" />
              <div class="flex gap-2 flex-wrap mb-3">
                <span v-for="id in form.categories" :key="id" class="px-3 py-1 bg-slate-700 text-white rounded-full text-sm">
                  {{ categories.find(c => c.id === id)?.name || id }}
                </span>
              </div>
              <ul class="max-h-36 overflow-auto bg-slate-800/20 rounded p-1">
                <li v-for="c in filteredCategories" :key="c.id" class="p-2 hover:bg-slate-700 cursor-pointer" @click.prevent="toggleCategory(c)">
                  <input type="checkbox" :checked="form.categories.includes(c.id)" class="mr-2" /> {{ c.name }}
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Diễn viên</label>
              <input v-model="actorSearch" placeholder="Tìm diễn viên..." class="w-full bg-slate-700 px-3 py-2 rounded mb-2 text-white" />
              <div class="flex gap-2 flex-wrap mb-3">
                <span v-for="id in form.actors" :key="id" class="px-3 py-1 bg-slate-700 text-white rounded-full text-sm">
                  {{ actors.find(a => a.id === id)?.name || id }}
                </span>
              </div>
              <ul class="max-h-36 overflow-auto bg-slate-800/20 rounded p-1">
                <li v-for="a in filteredActors" :key="a.id" class="p-2 hover:bg-slate-700 cursor-pointer" @click.prevent="toggleActor(a)">
                  <input type="checkbox" :checked="form.actors.includes(a.id)" class="mr-2" /> {{ a.name }}
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center gap-4 mt-2">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.isPublished" class="mr-2" />
              <span class="text-slate-300">Đăng</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.isFeatured" class="mr-2" />
              <span class="text-slate-300">Nổi bật</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.isHot" class="mr-2" />
              <span class="text-slate-300">Hot</span>
            </label>
          </div>
        </div>

        <!-- right column: poster, trailer, episodes -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Poster</label>
            <input type="file" accept="image/*" @change="onPosterChange" class="w-full text-sm text-white" />
            <div v-if="form.posterFileName" class="mt-3 text-sm text-slate-200">File: {{ form.posterFileName }}</div>
            <div v-if="form.posterFile" class="mt-3">
              <img :src="URL.createObjectURL(form.posterFile)" class="w-full h-48 object-cover rounded" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Trailer URL</label>
            <input v-model="form.trailer" type="url" placeholder="https://www.youtube.com/..." class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
          </div>

          <div class="bg-slate-900/30 p-3 rounded">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm text-slate-200 font-medium">Danh sách tập</h4>
              <button @click="openAddEpisode" class="px-2 py-1 bg-blue-600 text-white rounded text-sm">Thêm tập</button>
            </div>
            <ul class="space-y-2 max-h-48 overflow-auto">
              <li v-for="ep in episodes" :key="ep.id" class="flex items-center justify-between p-2 bg-slate-800 rounded">
                <div class="text-sm text-slate-200">{{ 'S' + ep.season + ' · T' + ep.episodeNumber + ' — ' + ep.title }}</div>
                <div class="flex items-center gap-3">
                  <button @click="openEditEpisode(ep)" class="text-yellow-300 hover:text-yellow-200 p-2 rounded transition-colors" title="Sửa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button v-if="ep.videoUrl" @click.prevent="() => window.open(ep.videoUrl, '_blank')" class="text-blue-400 hover:text-blue-300 p-2 rounded transition-colors" title="Xem">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button @click="deleteEpisode(ep)" class="text-red-400 hover:text-red-300 p-2 rounded transition-colors" title="Xóa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-7 0h10a1 1 0 011 1v0a1 1 0 01-1 1H6a1 1 0 01-1-1v0a1 1 0 011-1z" />
                    </svg>
                  </button>                </div>
              </li>
              <li v-if="episodes.length === 0" class="text-slate-400 text-sm">Chưa có tập nào</li>
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
          <button @click="showEpisodeModal = false" class="text-slate-300">Đóng</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Mùa</label>
            <input v-model.number="episodeDraft.season" type="number" min="1" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Số tập</label>
            <input v-model.number="episodeDraft.episodeNumber" type="number" min="1" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-slate-300 mb-1">Tên tập</label>
            <input v-model="episodeDraft.title" type="text" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Thời lượng (phút)</label>
            <input v-model="episodeDraft.duration" type="number" min="1" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Ngày phát sóng</label>
            <input v-model="episodeDraft.airDate" type="date" class="w-full bg-slate-800 px-3 py-2 rounded text-white" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm text-slate-300 mb-1">Video (chọn file hoặc nhập URL)</label>
            <input type="file" accept="video/*" @change="onEpisodeFileChange" class="w-full text-sm text-white mb-2" />
            <div v-if="episodeDraft.videoFileName" class="text-sm text-slate-200 mb-2">File: {{ episodeDraft.videoFileName }}</div>
            <input v-model="episodeDraft.videoUrl" type="url" placeholder="Hoặc dán Video URL" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
          </div>

          <div class="md:col-span-2 flex justify-end gap-2 mt-2">
            <button @click="showEpisodeModal = false" class="px-4 py-2 bg-slate-700 rounded">Hủy</button>
            <button @click="saveEpisode" class="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
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