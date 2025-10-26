<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

/*
  LƯU Ý: UI demo only — chưa kết nối backend.
*/

const router = useRouter()

// form model for series
const seriesForm = reactive({
  title: '',
  description: '',
  categories: [],
  country: '',
  actors: [],
  director: '',
  posterFile: null,
  trailer: '', // youtube url or embed
  isPublished: true,
  isFeatured: false,
  isHot: false,
  type: 'series'
})

// mock option lists
const categories = ref([])
const countries = ref([])
const actors = ref([])

// UI helpers (same UX as AddMovie)
const categorySearch = ref('')
const actorSearch = ref('')

const filteredCategories = computed(() =>
  categories.value.filter(c => c.name.toLowerCase().includes(categorySearch.value.toLowerCase()))
)
const filteredActors = computed(() =>
  actors.value.filter(a => a.name.toLowerCase().includes(actorSearch.value.toLowerCase()))
)

const selectedCategories = ref([]) // objects
const selectedActors = ref([]) // objects

// episode draft list for this series (UI-only)
const episodes = ref([])


onMounted(() => {
  // mock data
  categories.value = [{ id: 'cat1', name: 'Hành động' }, { id: 'cat2', name: 'Hài' }]
  countries.value = [{ id: 'ct1', name: 'Mỹ' }, { id: 'ct2', name: 'Nhật Bản' }]
  actors.value = [{ id: 'a1', name: 'Diễn viên A' }, { id: 'a2', name: 'Diễn viên B' }]

  // initialize selected lists if seriesForm already has ids (defensive)
  selectedCategories.value = categories.value.filter(c => seriesForm.categories.includes(c.id))
  selectedActors.value = actors.value.filter(a => seriesForm.actors.includes(a.id))
})

const onPosterChange = (e) => {
  const f = e.target.files[0]
  seriesForm.posterFile = f || null
}

// category / actor add/remove keep ids + selected object lists (like AddMovie)
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

const handleSubmit = () => {
  // UI-only: validate minimal and show collected data in console
  if (!seriesForm.title || !seriesForm.description) {
    alert('Vui lòng nhập tên và mô tả series.')
    return
  }
  const payload = {
    ...seriesForm,
    episodes: episodes.value.map(e => ({ ...e }))
  }
  console.log('Series create payload (UI-only):', payload)
  alert('Tạo series (demo) thành công — kiểm tra console.')
  router.push('/admin/series')
}

const handleCancel = () => router.go(-1)
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Thêm Series mới</h1>
      </div>
      <div class="flex items-center gap-3">
        <button @click="handleCancel" class="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg">Hủy</button>
        <button @click="handleSubmit" class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg">Lưu </button>
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

          <!-- categories / actors -->
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
        </div>

        <!-- right column -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Poster</label>
            <input type="file" accept="image/*" @change="onPosterChange" class="w-full text-sm text-white" />
            <div v-if="seriesForm.posterFile" class="mt-3">
              <img :src="URL.createObjectURL(seriesForm.posterFile)" class="w-full h-48 object-cover rounded" />
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