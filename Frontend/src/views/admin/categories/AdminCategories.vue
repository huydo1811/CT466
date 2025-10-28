<template>
  <div class="space-y-6 animate-fade-in p-2">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
            <h2 class="text-3xl font-bold text-white">Thể loại</h2>
            <p class="text-slate-400 text-sm mt-1">Quản lý thể loại — thêm, sửa, xóa.</p>
        </div>

        <!-- Tìm kiếm + nút thêm -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <input
            v-model="q"
            placeholder="Tìm tên hoặc slug..."
            class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none w-full sm:w-auto"
            />
            <button
            @click="openAdd"
            class="px-3 py-2 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded w-full sm:w-auto"
            >
            Thêm thể loại
            </button>
        </div>
    </div>


    <div class="bg-slate-800/50 border border-slate-700/40 rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px]">
          <thead class="text-slate-400 text-xs bg-slate-700/50">
            <tr>
              <th class="px-4 py-3 text-left">Tên</th>
              <th class="px-4 py-3 text-left">Slug</th>
              <th class="px-4 py-3 text-left">Mô tả</th>
              <th class="px-4 py-3">Ngày tạo</th>
              <th class="px-4 py-3 text-center">Hành động</th>
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
              </td>

              <td class="px-4 py-3 text-slate-200">{{ c.slug }}</td>

              <td class="px-4 py-3 text-slate-200">
                <div class="text-sm text-slate-400 line-clamp-2">{{ c.description || '-' }}</div>
              </td>

              <td class="px-4 py-3 text-slate-200">{{ formatDate(c.createdAt) }}</td>

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

          <tfoot>
            <tr>
              <td colspan="5" class="px-4 py-3 bg-slate-900/40">
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
          <div class="text-white font-medium">{{ editing ? 'Sửa thể loại' : 'Thêm thể loại' }}</div>
          <button @click="closeModal" class="text-slate-300 hover:text-white px-2">Đóng</button>
        </div>

        <div class="p-4 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-slate-300">Tên</label>
              <input v-model="form.name" @input="onNameInput" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>

            <div>
              <label class="text-sm text-slate-300">Slug</label>
              <input v-model="form.slug" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
          </div>

          <div>
            <label class="text-sm text-slate-300">Mô tả</label>
            <textarea v-model="form.description" rows="4" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200"></textarea>
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
const page = ref(1)
const perPage = ref(10)

const categories = ref([])

const showModal = ref(false)
const editing = ref(false)
const form = ref({
  id: null,
  name: '',
  slug: '',
  description: '',
  createdAt: ''
})

const mockCategories = () => ([
  { id: 'cat1', name: 'Hành động', slug: 'hanh-dong', description: 'Phim hành động', createdAt: '2021-01-01' },
  { id: 'cat2', name: 'Tình cảm', slug: 'tinh-cam', description: 'Phim tình cảm lãng mạn', createdAt: '2021-02-10' },
  { id: 'cat3', name: 'Hài', slug: 'hai', description: 'Phim hài giải trí', createdAt: '2021-03-20' }
])

const fetchCategories = async () => {
  loading.value = true
  try {
    if (USE_MOCK) categories.value = mockCategories()
    else {
      const res = await fetch('/api/admin/categories')
      if (!res.ok) throw new Error('Fetch failed')
      categories.value = await res.json()
    }
  } catch (e) {
    console.warn('load categories failed', e)
    categories.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

const filtered = computed(() => {
  let list = categories.value.slice()
  if (q.value) {
    const t = q.value.toLowerCase().trim()
    list = list.filter(c => (c.name || '').toLowerCase().includes(t) || (c.slug || '').toLowerCase().includes(t))
  }
  return list
})

const total = computed(() => filtered.value.length)
const pages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

watch(q, () => { page.value = 1 })

const openAdd = () => {
  editing.value = false
  form.value = { id: null, name: '', slug: '', description: '', createdAt: '' }
  showModal.value = true
}

const openEdit = (c) => {
  editing.value = true
  form.value = { ...c }
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const slugify = (s = '') => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')

const onNameInput = () => {
  if (!editing.value) form.value.slug = slugify(form.value.name)
}

const save = () => {
  if (!form.value.name) { alert('Nhập tên thể loại'); return }
  form.value.slug = form.value.slug || slugify(form.value.name)
  if (editing.value) {
    const idx = categories.value.findIndex(x => x.id === form.value.id)
    if (idx >= 0) categories.value.splice(idx, 1, { ...form.value })
  } else {
    const id = 'cat' + Date.now()
    categories.value.unshift({ id, createdAt: new Date().toISOString().slice(0,10), ...form.value })
  }
  closeModal()
}

const remove = (c) => {
  if (!confirm(`Xóa thể loại "${c.name}"?`)) return
  categories.value = categories.value.filter(x => x.id !== c.id)
}

const formatDate = (d) => {
  if (!d) return '-'
  try {
    const dt = new Date(d)
    if (isNaN(dt)) return d
    return dt.toLocaleDateString('vi-VN')
  } catch {
    return d
  }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }

/* optional clamp for description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>