<template>
  <div class="space-y-6 animate-fade-in p-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
            <h2 class="text-2xl font-bold text-white">Diễn viên</h2>
            <p class="text-slate-400 text-sm mt-1">
            Quản lý diễn viên — thêm, sửa, xóa và tải ảnh.
            </p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <input
            v-model="q"
            placeholder="Tìm tên hoặc quốc tịch..."
            class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none w-full sm:w-auto"
            />
            <select
            v-model="filterStatus"
            class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto"
            >
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="hidden">Ẩn</option>
            </select>
            <button
            @click="openAdd"
            class="px-3 py-2 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded w-full sm:w-auto"
            >
            Thêm diễn viên
            </button>
        </div>
    </div>


    <div class="bg-slate-800/50 border border-slate-700/40 rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px]">
          <thead class="text-slate-400 text-xs bg-slate-700/50">
            <tr>
              <th class="px-4 py-3 text-left">Tên</th>
              <th class="px-4 py-3 text-left">Sinh</th>
              <th class="px-4 py-3 text-left">Quốc tịch</th>
              <th class="px-4 py-3 text-left">Trạng thái</th>
              <th class="px-4 py-3 text-left">Ngày tạo</th>
              <th class="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-6 text-slate-400">Đang tải...</td>
            </tr>

            <tr v-else-if="!filtered.length">
              <td colspan="6" class="px-4 py-6 text-slate-400">Không có kết quả.</td>
            </tr>

            <tr v-for="a in pagedActors" :key="a.id" class="hover:bg-slate-700/30">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img :src="a.photoUrl || '/placeholder-avatar.png'" alt="photo" class="w-10 h-10 rounded object-cover" />
                  <div>
                    <div class="text-sm font-medium text-white">{{ a.name }}</div>
                    <div class="text-xs text-slate-400">{{ a.bio ? (a.bio.slice(0,60) + (a.bio.length>60? '…':'')) : '' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-200">{{ formatBirth(a.birthDate) }}</td>
              <td class="px-4 py-3 text-slate-200">{{ a.nationality || '-' }}</td>
              <td class="px-4 py-3">
                <span :class="a.isActive ? 'text-emerald-400' : 'text-rose-400'">{{ a.isActive ? 'Hoạt động' : 'Ẩn' }}</span>
              </td>
              <td class="px-4 py-3 text-slate-200">{{ formatDate(a.createdAt) }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEdit(a)" class="text-yellow-300 hover:text-yellow-200 p-2 rounded" title="Sửa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="remove(a)" class="text-red-400 hover:text-red-300 p-2 rounded" title="Xóa">
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
              <td colspan="6" class="px-4 py-3 bg-slate-900/40">
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

    <!-- modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-2xl bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div class="text-white font-medium">{{ editing ? 'Sửa diễn viên' : 'Thêm diễn viên' }}</div>
          <button @click="closeModal" class="text-slate-300 hover:text-white px-2">Đóng</button>
        </div>

        <div class="p-4 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-slate-300">Tên</label>
              <input v-model="form.name" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Quốc tịch</label>
              <input list="countries-list" v-model="form.nationality" placeholder="Chọn hoặc gõ để tìm..." class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
              <datalist id="countries-list">
                <option v-for="c in countries" :key="c.code" :value="c.name"></option>
              </datalist>
            </div>
            <div>
              <label class="text-sm text-slate-300">Ngày sinh</label>
              <input type="date" v-model="form.birthDate" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Trạng thái</label>
              <select v-model="form.isActive" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                <option :value="true">Hoạt động</option>
                <option :value="false">Ẩn</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-sm text-slate-300">Tiểu sử</label>
            <textarea v-model="form.bio" rows="4" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200"></textarea>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-36 h-36 bg-slate-800 rounded overflow-hidden flex items-center justify-center border border-slate-700">
              <img v-if="form.photoUrl" :src="form.photoUrl" class="w-full h-full object-cover" />
              <div v-else class="text-slate-400 text-xs px-2 text-center">Không có ảnh</div>
            </div>

            <div class="flex-1">
              <label class="text-sm text-slate-300">Tải ảnh (jpg/png)</label>
              <input @change="handleFile" type="file" accept="image/*" class="block mt-2 text-slate-300" />
              <div class="text-slate-400 text-xs mt-2">Hoặc dán URL vào đây</div>
              <input v-model="form.photoUrl" placeholder="https://..." class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
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

const USE_MOCK = true
const loading = ref(true)
const q = ref('')
const filterStatus = ref('')
const page = ref(1)
const perPage = ref(8)

const actors = ref([])

// thêm countries
const countries = ref([])
const mockCountries = () => ([
  { code: 'US', name: 'United States' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' }
])

const fetchCountries = async () => {
  try {
    if (USE_MOCK) countries.value = mockCountries()
    else {
      const res = await fetch('/api/admin/countries')
      if (!res.ok) throw new Error('Fetch failed')
      countries.value = await res.json()
      // normalize to {code, name} if backend returns different shape
      countries.value = countries.value.map(c => ({ code: c.code || c.iso || '', name: c.name || c.title || '' }))
    }
  } catch (e) {
    console.warn('load countries failed', e)
    countries.value = []
  }
}

// --- added: missing refs / fetchActors ---
const showModal = ref(false)
const editing = ref(false)
const form = ref({
  id: null,
  name: '',
  bio: '',
  birthDate: '',
  photoUrl: '',
  nationality: '',
  isActive: true,
  createdAt: ''
})

const mockActors = () => ([
  { id: 'a1', name: 'Robert Downey Jr.', bio: 'Actor', birthDate: '1965-04-04', photoUrl: 'https://i.pravatar.cc/150?img=1', nationality: 'USA', isActive: true, createdAt: '2020-01-01' },
  { id: 'a2', name: 'Scarlett Johansson', bio: 'Actor', birthDate: '1984-11-22', photoUrl: 'https://i.pravatar.cc/150?img=2', nationality: 'USA', isActive: true, createdAt: '2020-02-10' },
  { id: 'a3', name: 'Ngô Thanh Vân', bio: 'Actor/Producer', birthDate: '1979-11-26', photoUrl: 'https://i.pravatar.cc/150?img=3', nationality: 'Vietnam', isActive: true, createdAt: '2021-03-20' }
])

const fetchActors = async () => {
  loading.value = true
  try {
    if (USE_MOCK) {
      actors.value = mockActors()
    } else {
      const res = await fetch('/api/admin/actors')
      if (!res.ok) throw new Error('Fetch failed')
      actors.value = await res.json()
    }
  } catch (e) {
    console.warn('load actors failed', e)
    actors.value = []
  } finally {
    loading.value = false
  }
}
// --- end added --- 

onMounted(() => {
  fetchActors()
  fetchCountries()
})

const filtered = computed(() => {
  let list = actors.value.slice()
  if (q.value) {
    const t = q.value.toLowerCase().trim()
    list = list.filter(a => (a.name||'').toLowerCase().includes(t) || (a.nationality||'').toLowerCase().includes(t))
  }
  if (filterStatus.value === 'active') list = list.filter(a => a.isActive)
  if (filterStatus.value === 'hidden') list = list.filter(a => !a.isActive)
  return list
})

const total = computed(() => filtered.value.length)
const pages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
const pagedActors = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

watch([q, filterStatus], () => { page.value = 1 })

const openAdd = () => {
  editing.value = false
  form.value = { id: null, name: '', bio: '', birthDate: '', photoUrl: '', nationality: '', isActive: true, createdAt: '' }
  showModal.value = true
}
const openEdit = (a) => {
  editing.value = true
  form.value = { ...a }
  showModal.value = true
}
const closeModal = () => { showModal.value = false }

const handleFile = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => { form.value.photoUrl = reader.result }
  reader.readAsDataURL(f)
}

const save = () => {
  if (!form.value.name) { alert('Nhập tên diễn viên'); return }
  if (editing.value) {
    const idx = actors.value.findIndex(x => x.id === form.value.id)
    if (idx >= 0) actors.value.splice(idx, 1, { ...form.value })
  } else {
    const id = 'a' + Date.now()
    actors.value.unshift({ id, createdAt: new Date().toISOString().slice(0,10), ...form.value })
  }
  closeModal()
}

const remove = (a) => {
  if (!confirm(`Xóa diễn viên "${a.name}"?`)) return
  actors.value = actors.value.filter(x => x.id !== a.id)
}

const formatDate = (d) => {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return dt.toLocaleDateString('vi-VN')
}
const formatBirth = (d) => {
  if (!d) return '-'
  try { return new Date(d).toLocaleDateString('vi-VN') } catch { return d }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }
</style>