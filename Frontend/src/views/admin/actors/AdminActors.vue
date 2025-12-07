<template>
  <div class="space-y-6 animate-fade-in p-2">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-white">Diễn viên</h2>
        <p class="text-slate-400 text-sm mt-1">Quản lý diễn viên — thêm, sửa, xóa.</p>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <input
          v-model="q"
          @keydown.enter="onSearch"
          placeholder="Tìm tên hoặc quốc tịch..."
          class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none w-full sm:w-auto"
        />
        <select v-model="filterStatus" class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto">
          <option :value="''">Tất cả</option>
          <option :value="true">Hoạt động</option>
          <option :value="false">Ẩn</option>
        </select>
        <button @click="openAdd" class="px-3 py-2 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded w-full sm:w-auto">
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
              <th class="px-4 py-3 text-left">Ngày sinh</th>
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

            <tr v-else-if="!actors.length">
              <td colspan="6" class="px-4 py-6 text-slate-400">Không có kết quả.</td>
            </tr>

            <tr v-for="a in actors" :key="a._id || a.id" class="hover:bg-slate-700/30">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
                    <img :src="getMediaUrl(a.photoUrl) || '/default-avatar.png'" alt="photo" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ a.name }}</div>
                    <div class="text-xs text-slate-400">{{ a.bio ? (a.bio.slice(0,60) + (a.bio.length>60? '…':'')) : '' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-200">{{ formatBirth(a.birthDate) }}</td>
              <td class="px-4 py-3 text-slate-200">{{ a.nationality || '-' }}</td>
              <td class="px-4 py-3"><span :class="a.isActive ? 'text-emerald-400' : 'text-rose-400'">{{ a.isActive ? 'Hoạt động' : 'Ẩn' }}</span></td>
              <td class="px-4 py-3 text-slate-200">{{ formatDate(a.createdAt) }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEdit(a)" class="text-yellow-300 hover:text-yellow-200 p-2 rounded" title="Sửa">                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg></button>
                  <button @click="remove(a)" class="text-red-400 hover:text-red-300 p-2 rounded" title="Xóa"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg></button>
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td colspan="6" class="px-4 py-3 bg-slate-900/40">
                <div class="flex items-center justify-between">
                  <div class="text-slate-400 text-sm">Tổng: {{ pagination.totalItems || 0 }}</div>
                  <div class="flex items-center gap-2">
                    <button :disabled="pagination.page<=1" @click="prev" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Prev</button>
                    <div class="px-3 py-1 bg-slate-800 rounded text-slate-200">{{ page }} / {{ pagination.totalPages || 1 }}</div>
                    <button :disabled="pagination.page>=pagination.totalPages" @click="next" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Next</button>
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
              <label class="text-sm text-slate-300">Slug</label>
              <input v-model="form.slug" placeholder="ví dụ: phuong-anh-dao" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
            </div>
            <div>
              <label class="text-sm text-slate-300">Quốc tịch</label>
              <input v-model="form.nationality" placeholder="Quốc tịch" class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
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

          <div>
            <label class="text-sm text-slate-300">Ảnh (URL)</label>
            <div class="flex gap-3 items-start">
              <div class="w-24 h-24 bg-slate-800 rounded overflow-hidden border border-slate-700 flex items-center justify-center">
                <img v-if="form.photoUrl" :src="getMediaUrl(form.photoUrl)" class="w-full h-full object-cover" />
                <div v-else class="text-slate-400 text-xs px-2 text-center">Không có ảnh</div>
              </div>

              <div class="flex-1">
                <input @change="handleFile" type="file" accept="image/*" class="block mt-1 text-slate-300" />
                <div class="text-slate-400 text-xs mt-2">Hoặc dán URL vào đây</div>
                <input v-model="form.photoUrl" placeholder="https://..." class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
              </div>
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
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  return `${baseUrl}${u.startsWith('/') ? u : '/' + u}`
}

const loading = ref(false)
const q = ref('')
const filterStatus = ref('')
const page = ref(1)
const perPage = ref(10)

const actors = ref([])
const pagination = ref({ page: 1, totalPages: 1, totalItems: 0, limit: perPage.value })

const showModal = ref(false)
const editing = ref(false)
const form = ref({
  id: null,
  name: '',
  slug: '',         
  bio: '',
  birthDate: '',
  photoUrl: '',
  photoFile: null,
  nationality: '',
  isActive: true
})

let _searchTimeout = null

const fetchActors = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: perPage.value,
      search: q.value?.trim() ? q.value.trim() : undefined,
      // send isActive only when it's a boolean
      isActive: typeof filterStatus.value === 'boolean' ? filterStatus.value : undefined
    }
    const res = await api.get('/actors', { params })
    const body = res?.data || {}
    const arr = body.data || []
    // normalize id for all items
    actors.value = (arr || []).map(it => ({ ...it, id: it._id || it.id }))
    pagination.value = body.pagination || { page: page.value, totalPages: 1, totalItems: actors.value.length, limit: perPage.value }
    // sync local page with server response
    page.value = pagination.value.page ?? page.value
  } catch (err) {
    console.error('fetchActors error', err)
    actors.value = []
    pagination.value = { page: 1, totalPages: 1, totalItems: 0, limit: perPage.value }
  } finally {
    loading.value = false
  }
}

onMounted(fetchActors)

// real-time search (debounced)
watch(q, () => {
  clearTimeout(_searchTimeout)
  _searchTimeout = setTimeout(() => {
    page.value = 1
    fetchActors()
  }, 350)
})

// react to status filter changes immediately
watch(filterStatus, () => { page.value = 1; fetchActors() })

const handleFile = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  form.value.photoFile = f
  const reader = new FileReader()
  reader.onload = () => { form.value.photoUrl = reader.result }
  reader.readAsDataURL(f)
}

const onSearch = () => { page.value = 1; fetchActors() }

const save = async () => {
  if (!form.value.name) { alert('Nhập tên'); return }
  try {
    if (editing.value && form.value.id) {
      // update
      if (form.value.photoFile) {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('slug', form.value.slug || '')
        fd.append('bio', form.value.bio)
        fd.append('birthDate', form.value.birthDate)
        fd.append('nationality', form.value.nationality)
        fd.append('isActive', String(!!form.value.isActive))
        fd.append('photo', form.value.photoFile)
        await api.put(`/actors/${form.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.put(`/actors/${form.value.id}`, { name: form.value.name, slug: form.value.slug, bio: form.value.bio, birthDate: form.value.birthDate, photoUrl: form.value.photoUrl, nationality: form.value.nationality, isActive: form.value.isActive })
      }
    } else {
      // create
      if (form.value.photoFile) {
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('slug', form.value.slug || '')
        fd.append('bio', form.value.bio)
        fd.append('birthDate', form.value.birthDate)
        fd.append('nationality', form.value.nationality)
        fd.append('isActive', String(!!form.value.isActive))
        fd.append('photo', form.value.photoFile)
        await api.post('/actors', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/actors', { name: form.value.name, slug: form.value.slug, bio: form.value.bio, birthDate: form.value.birthDate, photoUrl: form.value.photoUrl, nationality: form.value.nationality, isActive: form.value.isActive })
      }
    }
    closeModal()
    fetchActors()
  } catch (err) {
    console.error('save actor error', err)
    alert(err?.response?.data?.message || 'Lưu thất bại')
  }
}

const openEdit = (a) => {
  editing.value = true
  // ensure we set id property used by save()
  form.value = { id: a.id || a._id, name: a.name || '', slug: a.slug || '', bio: a.bio || '', birthDate: a.birthDate || '', photoUrl: a.photoUrl || '', photoFile: null, nationality: a.nationality || '', isActive: !!a.isActive }
  showModal.value = true
}
const closeModal = () => { showModal.value = false }

const openAdd = () => {
  editing.value = false
  form.value = { id: null, name: '', slug: '', bio: '', birthDate: '', photoUrl: '', photoFile: null, nationality: '', isActive: true }
  showModal.value = true
}

const remove = async (a) => {
  if (!confirm(`Xóa diễn viên "${a.name}"?`)) return
  try {
    await api.delete(`/actors/${a.id || a._id}`)
    fetchActors()
  } catch (err) {
    console.error('delete actor error', err)
    alert(err?.response?.data?.message || 'Xóa thất bại')
  }
}

const prev = async () => { if (pagination.value.page > 1) { page.value = pagination.value.page - 1; await fetchActors() } }
const next = async () => { if (pagination.value.page < pagination.value.totalPages) { page.value = pagination.value.page + 1; await fetchActors() } }

const formatDate = (d) => { if (!d) return '-'; const dt = new Date(d); return isNaN(dt) ? d : dt.toLocaleDateString('vi-VN') }
const formatBirth = (d) => { if (!d) return '-'; try { return new Date(d).toLocaleDateString('vi-VN') } catch { return d } }
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }
</style>