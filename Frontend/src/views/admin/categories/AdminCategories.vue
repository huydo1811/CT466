<template>
  <div class="space-y-6 animate-fade-in p-2">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-white">Thể loại</h2>
        <p class="text-slate-400 text-sm mt-1">Quản lý thể loại — thêm, sửa, xóa.</p>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <input
          v-model="q"
          @keydown.enter="reload"
          placeholder="Tìm tên hoặc slug..."
          class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none w-full sm:w-auto"
        />
        <button @click="openAdd" class="px-3 py-2 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded w-full sm:w-auto">
          Thêm thể loại
        </button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px]">
          <thead class="text-slate-400 text-xs bg-slate-700/50">
            <tr>
              <th class="px-4 py-3 text-left">Ảnh</th>
              <th class="px-4 py-3 text-left">Tên</th>
              <th class="px-4 py-3 text-left">Slug</th>
              <th class="px-4 py-3 text-left">Mô tả</th>
              <th class="px-4 py-3">Ngày tạo</th>
              <th class="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-700/40">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-6 text-slate-400">Đang tải...</td>
            </tr>

            <tr v-else-if="!items.length">
              <td colspan="6" class="px-4 py-6 text-slate-400">Không có kết quả.</td>
            </tr>

            <tr v-for="c in items" :key="c._id || c.id" class="hover:bg-slate-700/20">
              <td class="px-4 py-3">
                <div class="w-16 h-16 rounded overflow-hidden bg-slate-700">
                  <img 
                    v-if="c.image" 
                    :src="c.image" 
                    :alt="c.name" 
                    class="w-full h-full object-cover" 
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    No Image
                  </div>
                </div>
              </td>

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
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
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
              <td colspan="6" class="px-4 py-3 bg-slate-900/40">
                <div class="flex items-center justify-between">
                  <div class="text-slate-400 text-sm">Tổng: {{ pagination.totalItems || 0 }}</div>
                  <div class="flex items-center gap-2">
                    <button :disabled="page<=1" @click="prev" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Prev</button>
                    <div class="px-3 py-1 bg-slate-800 rounded text-slate-200">{{ page }} / {{ pagination.totalPages || 1 }}</div>
                    <button :disabled="page>=(pagination.totalPages||1)" @click="next" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div class="w-full max-w-2xl bg-slate-900 rounded-lg border border-slate-700 overflow-hidden my-4">
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div class="text-white font-medium">{{ editing ? 'Sửa thể loại' : 'Thêm thể loại' }}</div>
          <button @click="closeModal" class="text-slate-300 hover:text-white px-2">Đóng</button>
        </div>

        <div class="p-4 space-y-4">
          <!-- Upload ảnh -->
          <div>
            <label class="text-sm text-slate-300 block mb-2">Ảnh đại diện</label>
            <div class="flex items-start gap-4">
              <!-- Preview -->
              <div class="w-32 h-32 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                <img 
                  v-if="imagePreview" 
                  :src="imagePreview" 
                  alt="Preview" 
                  class="w-full h-full object-cover" 
                />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  No Image
                </div>
              </div>

              <!-- Upload controls -->
              <div class="flex-1">
                <input 
                  type="file" 
                  ref="imageInput" 
                  @change="onImageChange" 
                  accept="image/*" 
                  class="hidden" 
                />
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="$refs.imageInput.click()" 
                    class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm"
                  >
                    Chọn ảnh
                  </button>
                  <button 
                    v-if="imagePreview" 
                    @click="clearImage" 
                    class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Xóa ảnh
                  </button>
                </div>
                <p class="text-slate-400 text-xs mt-2">Định dạng: JPG, PNG, WEBP, AVIF. Tối đa 5MB.</p>
                <p v-if="imageFile" class="text-emerald-400 text-xs mt-1">
                  ✓ Đã chọn: {{ imageFile.name }}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-slate-300">Tên *</label>
              <input 
                v-model="form.name" 
                @input="onNameInput" 
                class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" 
                placeholder="Ví dụ: Hành động"
              />
            </div>

            <div>
              <label class="text-sm text-slate-300">Slug</label>
              <input 
                v-model="form.slug" 
                class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" 
                placeholder="hanh-dong"
              />
            </div>
          </div>

          <div>
            <label class="text-sm text-slate-300">Mô tả</label>
            <textarea 
              v-model="form.description" 
              rows="4" 
              class="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
              placeholder="Mô tả về thể loại này..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="closeModal" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Hủy</button>
            <button @click="save" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
              {{ editing ? 'Lưu' : 'Tạo' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

// state
const loading = ref(false)
const q = ref('')
const page = ref(1)
const perPage = ref(10)

const items = ref([])
const pagination = ref({ totalItems: 0, totalPages: 1 })
const showModal = ref(false)
const editing = ref(false)
const form = ref({ id: null, name: '', slug: '', description: '' })

// image upload state
const imageInput = ref(null)
const imageFile = ref(null)
const imagePreview = ref('')

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await api.get('/categories', {
      params: { page: page.value, limit: perPage.value, search: q.value }
    })
    const data = res?.data || {}
    items.value = data.data || []
    pagination.value = data.pagination || { totalItems: items.value.length, totalPages: 1 }
  } catch (err) {
    console.error('fetchCategories error', err)
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

const reload = () => { page.value = 1; fetchCategories() }
const prev = () => { if (page.value>1) { page.value--; fetchCategories() } }
const next = () => { if (page.value < (pagination.value.totalPages||1)) { page.value++; fetchCategories() } }

const openAdd = () => {
  editing.value = false
  form.value = { id: null, name: '', slug: '', description: '' }
  imageFile.value = null
  imagePreview.value = ''
  showModal.value = true
}

const openEdit = (c) => {
  editing.value = true
  form.value = { 
    id: c._id || c.id, 
    name: c.name, 
    slug: c.slug, 
    description: c.description 
  }
  imageFile.value = null
  imagePreview.value = c.image || ''
  showModal.value = true
}

const closeModal = () => { 
  showModal.value = false 
  // Clear image state
  imageFile.value = null
  imagePreview.value = ''
  if (imageInput.value) imageInput.value.value = ''
}

const slugify = (s = '') => {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const onNameInput = () => { 
  if (!editing.value) {
    form.value.slug = slugify(form.value.name) 
  }
}

// Handle image upload
const onImageChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Chỉ chấp nhận file ảnh')
    return
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File không được vượt quá 5MB')
    return
  }
  
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  if (imageInput.value) imageInput.value.value = ''
}

const save = async () => {
  if (!form.value.name) { 
    alert('Nhập tên thể loại')
    return 
  }
  
  form.value.slug = form.value.slug || slugify(form.value.name)
  
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('slug', form.value.slug)
    fd.append('description', form.value.description || '')
    
    // Append image file if selected
    if (imageFile.value) {
      fd.append('image', imageFile.value)
    }

    if (editing.value && form.value.id) {
      await api.put(`/categories/${form.value.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await api.post('/categories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    
    closeModal()
    fetchCategories()
  } catch (err) {
    console.error('save category error', err)
    alert(err?.response?.data?.message || 'Lưu thất bại')
  }
}

const remove = async (c) => {
  if (!confirm(`Xóa thể loại "${c.name}"? Ảnh cũng sẽ bị xóa.`)) return
  
  try {
    await api.delete(`/categories/${c._id || c.id}`)
    fetchCategories()
  } catch (err) {
    console.error('delete category error', err)
    alert(err?.response?.data?.message || 'Xóa thất bại')
  }
}

const formatDate = (d) => {
  if (!d) return '-'
  try {
    const dt = new Date(d)
    if (isNaN(dt)) return d
    return dt.toLocaleDateString('vi-VN')
  } catch { return d }
}
</script>

<style scoped>
@keyframes fade-in { 
  from { opacity: 0; transform: translateY(6px); } 
  to { opacity: 1; transform: translateY(0); } 
}
.animate-fade-in { 
  animation: fade-in .22s ease-out; 
}
.line-clamp-2 { 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
</style>