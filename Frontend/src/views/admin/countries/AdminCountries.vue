<script setup>
import { ref, computed, onMounted } from 'vue'


// mock data / toggle to false to hook API later
const USE_MOCK = true

const countries = ref([])
const loading = ref(true)
const q = ref('')
const page = ref(1)
const perPage = ref(12)

// modal / form
const showModal = ref(false)
const editing = ref(false)
const form = ref({
  id: null,
  name: '',
  code: '',
  slug: '',
  flag: '' // data URL or remote url
})

// simple pagination
const total = computed(() => countries.value.length)
const pages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
const paged = computed(() => {
  const list = filtered.value
  const start = (page.value - 1) * perPage.value
  return list.slice(start, start + perPage.value)
})

// search filter
const filtered = computed(() => {
  if (!q.value) return countries.value
  const t = q.value.toLowerCase().trim()
  return countries.value.filter(c => (c.name || '').toLowerCase().includes(t) || (c.code || '').toLowerCase().includes(t))
})

// mock loader
const mockCountries = () => ([
  { id: 'c1', name: 'United States', code: 'US', slug: 'united-states', flag: 'https://flagcdn.com/us.svg', createdAt: '2020-01-01', isActive: true },
  { id: 'c2', name: 'Vietnam', code: 'VN', slug: 'vietnam', flag: 'https://flagcdn.com/vn.svg', createdAt: '2020-05-10', isActive: true },
  { id: 'c3', name: 'Japan', code: 'JP', slug: 'japan', flag: 'https://flagcdn.com/jp.svg', createdAt: '2021-03-20', isActive: true },
])

const fetchCountries = async () => {
  loading.value = true
  try {
    if (USE_MOCK) {
      countries.value = mockCountries()
    } else {
      const res = await fetch('/api/admin/countries')
      if (!res.ok) throw new Error('Fetch failed')
      countries.value = await res.json()
    }
  } catch (err) {
    console.warn('Load countries failed:', err)
    countries.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchCountries)

// modal helpers
const openAdd = () => {
  editing.value = false
  form.value = { id: null, name: '', code: '', slug: '', flag: '' }
  showModal.value = true
}
const openEdit = (c) => {
  editing.value = true
  form.value = { ...c }
  showModal.value = true
}
const closeModal = () => { showModal.value = false }

// simple slugify
const slugify = (s='') => s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')

// file -> dataURL
const handleFile = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => { form.value.flag = reader.result }
  reader.readAsDataURL(f)
}

const save = () => {
  if (!form.value.name) { alert('Nhập tên quốc gia'); return }
  if (!form.value.code) { alert('Nhập mã (ISO)'); return }
  form.value.slug = form.value.slug || slugify(form.value.name)
  if (editing.value) {
    const idx = countries.value.findIndex(x => x.id === form.value.id)
    if (idx >= 0) countries.value.splice(idx, 1, { ...form.value })
    else countries.value.unshift({ ...form.value })
  } else {
    const id = 'c' + Date.now()
    countries.value.unshift({ id, createdAt: new Date().toISOString().slice(0,10), isActive: true, ...form.value })
  }
  closeModal()
}

const remove = (c) => {
  if (!confirm(`Xóa quốc gia "${c.name}"?`)) return
  countries.value = countries.value.filter(x => x.id !== c.id)
}

</script>

<template>
  <div class="space-y-6 animate-fade-in p-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-white">Quốc gia</h2>
        <p class="text-slate-400 text-sm mt-1">Quản lý danh sách quốc gia — thêm, sửa, xóa và tải ảnh lá cờ.</p>
      </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <input
                v-model="q"
                placeholder="Tìm kiếm tên hoặc mã..."
                class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none w-full sm:w-auto"
            />
            <button
                @click="openAdd"
                class="px-2.5 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded 
                    sm:px-3 sm:py-2 sm:text-sm 
                    md:px-4 md:py-2.5 md:text-base">
                Thêm quốc gia
            </button>
        </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px]">
          <thead class="text-slate-400 text-sm">
            <tr>
              <th class="px-4 py-3 text-left">Tên</th>
              <th class="px-4 py-3 text-left">Mã</th>
              <th class="px-4 py-3 text-left">Cờ</th>
              <th class="px-4 py-3">Trạng thái</th>
              <th class="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/40">
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-6 text-slate-400">Đang tải...</td>
            </tr>
            <tr v-else-if="!filtered.length">
              <td colspan="5" class="px-4 py-6 text-slate-400">Không có kết quả.</td>
            </tr>

            <tr v-for="c in paged" :key="c.id" class="hover:bg-slate-700/20">
              <td class="px-4 py-3">
                <div class="font-medium text-white">{{ c.name }}</div>
                <div class="text-xs text-slate-400 mt-1">Slug: {{ c.slug }}</div>
              </td>
              <td class="px-4 py-3 text-slate-200">{{ c.code }}</td>
              <td class="px-4 py-3">
                <img :src="c.flag || '/placeholder-flag.png'" alt="flag" class="w-10 h-6 object-cover rounded" />
              </td>
              <td class="px-4 py-3 text-center">
                <span :class="c.isActive ? 'text-emerald-400' : 'text-rose-400'">{{ c.isActive ? 'Hoạt động' : 'Ẩn' }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEdit(c)" class="text-yellow-300 hover:text-yellow-200 p-2 rounded" title="Sửa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="remove(c)" class="text-red-400 hover:text-red-300 p-2 rounded" title="Xóa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>                 
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- pagination -->
      <div class="flex items-center justify-between px-4 py-3 bg-slate-900/40">
        <div class="text-slate-400 text-sm">Tổng: {{ total }}</div>
        <div class="flex items-center gap-2">
          <button :disabled="page<=1" @click="page = Math.max(1, page-1)" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Prev</button>
          <div class="px-3 py-1 bg-slate-800 rounded text-slate-200">{{ page }} / {{ pages }}</div>
          <button :disabled="page>=pages" @click="page = Math.min(pages, page+1)" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-2xl bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div class="text-white font-medium">{{ editing ? 'Sửa quốc gia' : 'Thêm quốc gia' }}</div>
          <button @click="closeModal" class="text-slate-300 hover:text-white px-2">Đóng</button>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-slate-300">Tên</label>
              <input v-model="form.name" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Mã (ISO)</label>
              <input v-model="form.code" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Slug</label>
              <input v-model="form.slug" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Trạng thái</label>
              <select v-model="form.isActive" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                <option :value="true">Hoạt động</option>
                <option :value="false">Ẩn</option>
              </select>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-36 h-24 bg-slate-800 rounded overflow-hidden flex items-center justify-center border border-slate-700">
              <img v-if="form.flag" :src="form.flag" class="w-full h-full object-cover" />
              <div v-else class="text-slate-400 text-xs px-2 text-center">Không có cờ</div>
            </div>

            <div class="flex-1">
              <label class="text-sm text-slate-300">Tải ảnh lá cờ (jpg/png)</label>
              <input @change="handleFile" type="file" accept="image/*" class="block mt-2 text-slate-300" />
              <div class="text-slate-400 text-xs mt-2">Hoặc dán URL vào đây</div>
              <input v-model="form.flag" placeholder="https://..." class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
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

<style scoped>
/* small animation */
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }
</style>