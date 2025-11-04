<template>
  <div class="space-y-6 p-2 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-white">Banner</h2>
        <p class="text-slate-400 text-sm mt-1">
          Quản lý banner / quảng bá — thêm, sửa, kích hoạt, đặt lịch và ưu tiên.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <input
          v-model="q"
          placeholder="Tìm theo tiêu đề..."
          class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto focus:outline-none"
        />
        <select
          v-model="posFilter"
          class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto"
        >
          <option value="">Tất cả vị trí</option>
          <option v-for="p in positions" :key="p" :value="p">{{ p }}</option>
        </select>
        <button
          @click="openAdd"
          class="px-3 py-2 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded w-full sm:w-auto"
        >
          Thêm banner
        </button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px]">
          <thead class="text-slate-400 text-xs bg-slate-700/50">
            <tr>
              <th class="px-4 py-3 text-left">Ảnh</th>
              <th class="px-4 py-3 text-left">Tiêu đề</th>
              <th class="px-4 py-3 text-left">Vị trí</th>
              <th class="px-4 py-3 text-left">Ưu tiên</th>
              <th class="px-4 py-3 text-left">Thời gian</th>
              <th class="px-4 py-3 text-left">Trạng thái</th>
              <th class="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-700/40">
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-6 text-slate-400">Đang tải...</td>
            </tr>

            <tr v-else-if="!paged.length">
              <td colspan="7" class="px-4 py-6 text-slate-400">Không có banner.</td>
            </tr>

            <tr v-for="b in paged" :key="b.id" class="hover:bg-slate-700/20">
              <td class="px-4 py-3">
                <img :src="getMediaUrl(b.mobileImage || b.image)" alt="banner" class="w-32 h-12 object-cover rounded" />
              </td>
              <td class="px-4 py-3">
                <div class="font-medium text-white">{{ b.title }}</div>
                <div class="text-xs text-slate-400">{{ b.subtitle }}</div>
              </td>
              <td class="px-4 py-3 text-slate-200">{{ b.position }}</td>
              <td class="px-4 py-3 text-slate-200">{{ b.priority }}</td>
              <td class="px-4 py-3 text-slate-200">
                <div class="text-xs">{{ formatDate(b.startDate) }} → {{ b.endDate ? formatDate(b.endDate) : '∞' }}</div>
              </td>
              <td class="px-4 py-3">
                <button @click="toggleActive(b)" :class="b.isActive ? 'text-emerald-400' : 'text-rose-400'">
                  {{ b.isActive ? 'Kích hoạt' : 'Tắt' }}
                </button>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEdit(b)" class="text-yellow-300 hover:text-yellow-200 p-2 rounded" title="Sửa">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button @click="remove(b)" class="text-red-400 hover:text-red-300 p-2 rounded" title="Xóa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>                   
                  </button>
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td colspan="7" class="px-4 py-3 bg-slate-900/40">
                <div class="flex items-center justify-between">
                  <div class="text-slate-400 text-sm">Tổng: {{ total }}</div>
                  <div class="flex items-center gap-2">
                    <button :disabled="page<=1" @click="page = Math.max(1, page-1)" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Prev</button>
                    <div class="px-3 py-1 bg-slate-800 rounded text-slate-200">{{ page }} / {{ pages }}</div>
                    <button :disabled="page>=pages" @click="page = Math.min(pages, page+1)" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- modal add/edit -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-auto bg-black/50 p-4">
      <div class="mx-auto w-full max-w-3xl bg-slate-900 rounded-lg border border-slate-700 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div class="sticky top-0 bg-slate-900/90 backdrop-blur px-4 py-3 border-b border-slate-700 z-10">
          <div class="flex items-center justify-between">
            <div class="text-white font-medium">{{ editing ? 'Sửa banner' : 'Thêm banner' }}</div>
            <button @click="closeModal" class="text-slate-300 hover:text-white px-2">Đóng</button>
          </div>
        </div>

        <div class="p-4 space-y-4 pb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-slate-300">Tiêu đề</label>
              <input v-model="form.title" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Vị trí</label>
              <select v-model="form.position" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                <option v-for="p in positions" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>

            <div>
              <label class="text-sm text-slate-300">Phụ đề</label>
              <input v-model="form.subtitle" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Ưu tiên</label>
              <input type="number" v-model.number="form.priority" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-slate-300">Hình (desktop)</label>
              <input @change="handleImage($event, 'image')" type="file" accept="image/*" class="block mt-2 text-slate-300" />
              <div v-if="preview.image" class="mt-2"><img :src="preview.image" class="w-full h-28 object-cover rounded" /></div>
            </div>
            <div>
              <label class="text-sm text-slate-300">Hình (mobile)</label>
              <input @change="handleImage($event, 'mobileImage')" type="file" accept="image/*" class="block mt-2 text-slate-300" />
              <div v-if="preview.mobileImage" class="mt-2"><img :src="preview.mobileImage" class="w-full h-28 object-cover rounded" /></div>
            </div>
          </div>

          <div>
            <label class="text-sm text-slate-300">Link URL (tùy chọn)</label>
            <input v-model="form.linkUrl" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            <div class="text-xs text-slate-400 mt-1">Chọn link nội bộ (movie/category) bằng linkType + targetId nếu cần.</div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-slate-300">Ngày bắt đầu</label>
              <input type="date" v-model="form.startDate" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Ngày kết thúc</label>
              <input type="date" v-model="form.endDate" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="closeModal" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Hủy</button>
            <button @click="save" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">{{ editing ? 'Lưu' : 'Tạo' }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const q = ref('')
const posFilter = ref('')
const page = ref(1)
const perPage = ref(8)

const positions = ['hero', 'secondary', 'sidebar', 'footer']
const banners = ref([])

const showModal = ref(false)
const editing = ref(false)
const form = ref({
  id: null,
  title: '',
  subtitle: '',
  image: '',
  mobileImage: '',
  linkUrl: '',
  linkType: 'none',
  targetId: null,
  position: 'hero',
  priority: 0,
  isActive: true,
  startDate: '',
  endDate: ''
})

const files = ref({ image: null, mobileImage: null })
const preview = ref({ image: '', mobileImage: '' })

const fetchBanners = async () => {
  loading.value = true
  try {
    const res = await api.get('/banners') // adjust endpoint if different
    const data = res?.data?.data || res?.data || []
    banners.value = data.map(b => ({
      id: b._id || b.id,
      ...b
    }))
  } catch (e) {
    console.error('Error fetching banners:', e)
    banners.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchBanners)

const filtered = computed(() => {
  let list = banners.value.slice().sort((a,b) => (b.priority||0) - (a.priority||0))
  if (q.value) {
    const t = q.value.toLowerCase().trim()
    list = list.filter(x => (x.title||'').toLowerCase().includes(t) || (x.subtitle||'').toLowerCase().includes(t))
  }
  if (posFilter.value) list = list.filter(x => x.position === posFilter.value)
  return list
})

const total = computed(() => filtered.value.length)
const pages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

watch([q, posFilter], () => { page.value = 1 })

const openAdd = () => {
  editing.value = false
  form.value = { id: null, title:'', subtitle:'', image:'', mobileImage:'', linkUrl:'', linkType:'none', targetId:null, position:'hero', priority:0, isActive:true, startDate:'', endDate:'' }
  files.value = { image: null, mobileImage: null }
  preview.value = { image: '', mobileImage: '' }
  showModal.value = true
}

const openEdit = (b) => {
  editing.value = true
  form.value = { ...b }
  files.value = { image: null, mobileImage: null }
  preview.value = { image: getMediaUrl(b.image), mobileImage: getMediaUrl(b.mobileImage) }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  // revoke objectURLs
  if (preview.value.image && preview.value.image.startsWith('blob:')) URL.revokeObjectURL(preview.value.image)
  if (preview.value.mobileImage && preview.value.mobileImage.startsWith('blob:')) URL.revokeObjectURL(preview.value.mobileImage)
}

const handleImage = (e, key) => {
  const f = e.target.files?.[0] || null
  files.value[key] = f
  if (preview.value[key] && preview.value[key].startsWith('blob:')) URL.revokeObjectURL(preview.value[key])
  preview.value[key] = f ? URL.createObjectURL(f) : ''
}

const save = async () => {
  if (!form.value.title || (!form.value.image && !files.value.image)) return alert('Cần có tiêu đề và hình ảnh')
  try {
    const fd = new FormData()
    fd.append('title', form.value.title)
    fd.append('subtitle', form.value.subtitle || '')
    fd.append('position', form.value.position || 'hero')
    fd.append('priority', String(form.value.priority || 0))
    fd.append('linkUrl', form.value.linkUrl || '')
    fd.append('startDate', form.value.startDate || '')
    fd.append('endDate', form.value.endDate || '')
    fd.append('isActive', String(!!form.value.isActive))

    if (files.value.image) fd.append('image', files.value.image)
    if (files.value.mobileImage) fd.append('mobileImage', files.value.mobileImage)

    if (editing.value && form.value.id) {
      // update
      await api.put(`/banners/${form.value.id}`, fd) // backend should accept multipart
      await fetchBanners()
      closeModal()
    } else {
      // create
      await api.post('/banners', fd)
      await fetchBanners()
      closeModal()
    }
  } catch (err) {
    console.error('save banner failed', err)
    alert(err?.response?.data?.message || 'Lưu banner thất bại')
  }
}

const remove = async (b) => {
  if (!confirm(`Xóa banner "${b.title}"?`)) return
  try {
    await api.delete(`/banners/${b.id}`)
    await fetchBanners()
  } catch (err) {
    console.error('delete banner failed', err)
    alert(err?.response?.data?.message || 'Xóa thất bại')
  }
}

const toggleActive = async (b) => {
  try {
    // simple toggle via update; backend may provide specific route
    await api.put(`/banners/${b.id}`, { isActive: !b.isActive })
    await fetchBanners()
  } catch (err) {
    console.error('toggle active failed', err)
    alert('Cập nhật trạng thái thất bại')
  }
}

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^https?:\/\//.test(u)) return u
  return `${window.location.origin}${u}`
}

const formatDate = (d) => {
  if (!d) return '-'
  try { const dt = new Date(d); if (isNaN(dt)) return d; return dt.toLocaleDateString('vi-VN') } catch { return d }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }
</style>