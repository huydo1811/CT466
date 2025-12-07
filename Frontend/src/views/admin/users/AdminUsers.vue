<template>
  <div class="space-y-6 animate-fade-in p-2">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-white">Người dùng</h2>
        <p class="text-slate-400 text-sm mt-1">
          Quản lý tài khoản — tìm, thêm, sửa, đổi trạng thái / vai trò.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <input
          v-model="q"
          @input="onInput"
          placeholder="Tìm theo tên hoặc username..."
          class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none w-full sm:w-auto"
        />
        <select v-model="roleFilter" @change="applyFilters" class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto">
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button @click="goAdd" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded w-full sm:w-auto">
          Thêm người dùng
        </button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[880px]">
          <thead class="text-slate-400 text-xs bg-slate-700/50">
            <tr>
              <th class="px-4 py-3 text-left">Người dùng</th>
              <th class="px-4 py-3 text-left">Tên đầy đủ</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Vai trò</th>
              <th class="px-4 py-3 text-left">Trạng thái</th>
              <th class="px-4 py-3">Đăng nhập lần cuối</th>
              <th class="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-700/40">
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-6 text-slate-400">Đang tải...</td>
            </tr>

            <tr v-else-if="!users.length">
              <td colspan="7" class="px-4 py-6 text-slate-400">Không có kết quả.</td>
            </tr>

            <tr v-for="u in users" :key="u._id || u.id" class="hover:bg-slate-700/20">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
                    <img :src="getMediaUrl(u.avatar) || '/default-avatar.png'" alt="avatar" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ u.username }}</div>
                    <div class="text-xs text-slate-400">{{ u.role }}</div>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3 text-slate-200">{{ u.fullName }}</td>
              <td class="px-4 py-3 text-slate-200">{{ u.email || '-' }}</td>
              <td class="px-4 py-3">
                <span class="text-sm text-slate-200">{{ u.role }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span :class="u.status === 'active' ? 'text-emerald-400' : 'text-rose-400'">
                    {{ u.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-200">{{ formatDateTime(u.lastLogin) }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="goEdit(u)" class="text-yellow-300 hover:text-yellow-200 p-2 rounded" title="Sửa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>

                  <button @click="toggleStatus(u)" class="text-sky-400 hover:text-sky-300 p-2 rounded" :title="u.status === 'active' ? 'Khóa' : 'Mở khóa'">
                    <template v-if="u.status === 'active'">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                      </svg>
                    </template>
                    <template v-else>
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <path d="M8 11V7a4 4 0 118 0v1"></path>
                        <path d="M15 11h.01"></path>
                      </svg>
                    </template>
                  </button>

                  <button @click="changeRolePrompt(u)" class="text-indigo-300 hover:text-indigo-200 p-2 rounded" title="Đổi vai trò">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5v14" /></svg>
                  </button>

                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td colspan="7" class="px-4 py-3 bg-slate-900/40">
                <div class="flex items-center justify-between">
                  <div class="text-slate-400 text-sm">Tổng: {{ pagination.totalItems || total }}</div>
                  <div class="flex items-center gap-2">
                    <button :disabled="page<=1" @click="changePage(page-1)" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Prev</button>
                    <div class="px-3 py-1 bg-slate-800 rounded text-slate-200">{{ page }} / {{ pagination.totalPages || pages }}</div>
                    <button :disabled="page>= (pagination.totalPages || pages)" @click="changePage(page+1)" class="px-2 py-1 bg-slate-800 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Simple modal / form for create & edit -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-slate-900 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-white mb-4">{{ editing ? 'Sửa người dùng' : 'Thêm người dùng' }}</h3>

        <div class="space-y-3">
          <input v-model="form.username" placeholder="Username" class="w-full px-3 py-2 rounded bg-slate-800 text-slate-200" />
          <input v-model="form.fullName" placeholder="Họ tên" class="w-full px-3 py-2 rounded bg-slate-800 text-slate-200" />
          <input v-model="form.email" placeholder="Email" class="w-full px-3 py-2 rounded bg-slate-800 text-slate-200" />
          <select v-model="form.role" class="w-full px-3 py-2 rounded bg-slate-800 text-slate-200">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input v-if="!editing" v-model="form.password" type="password" placeholder="Mật khẩu (khi tạo)" class="w-full px-3 py-2 rounded bg-slate-800 text-slate-200" />
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button @click="closeModal" class="px-3 py-2 bg-slate-700 rounded text-white">Hủy</button>
          <button @click="submitForm" :disabled="submitting" class="px-3 py-2 bg-emerald-600 rounded text-white">
            {{ submitting ? 'Đang xử lý...' : (editing ? 'Lưu' : 'Tạo') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
import { useRouter } from 'vue-router'
const router = useRouter()

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  return `${baseUrl}${u.startsWith('/') ? u : '/' + u}`
}

const loading = ref(false)
const users = ref([])
const page = ref(1)
const perPage = ref(10)
const q = ref('')
const roleFilter = ref('')
const pagination = ref({ totalItems: 0, totalPages: 1 })
const submitting = ref(false)

const showModal = ref(false)
const editing = ref(false)
const form = ref({ username: '', fullName: '', email: '', role: 'user', password: '' })

const token = localStorage.getItem('token') || ''
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`

// debounce timer ref
let debounceTimer = null

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', page.value)
    params.append('limit', perPage.value)
    if (q.value) params.append('search', q.value)
    if (roleFilter.value) params.append('role', roleFilter.value)

    const res = await api.get(`/users?${params.toString()}`)
    if (res?.data?.data) {
      users.value = res.data.data
      pagination.value = res.data.pagination || {}
    } else {
      users.value = []
      pagination.value = {}
    }
  } catch (err) {
    console.error('fetchUsers error', err)
    alert('Lấy danh sách người dùng thất bại')
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const onInput = () => {
  // debounce search input
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    fetchUsers()
  }, 500)
}

const applyFilters = () => { page.value = 1; fetchUsers() }
const changePage = (p) => { page.value = p; fetchUsers() }

const goAdd = () => {
  // navigate to route declared in router (name: 'admin.users.add')
  router.push({ name: 'admin.users.add' })
}
const goEdit = (u) => {
  const id = u._id || u.id
  if (!id) return alert('User id không hợp lệ')
  // navigate to route declared in router (name: 'admin.users.edit')
  router.push({ name: 'admin.users.edit', params: { id } })
}

const closeModal = () => { showModal.value = false }

const submitForm = async () => {
  submitting.value = true
  try {
    if (editing.value) {
      const id = form.value.id
      const payload = { username: form.value.username, fullName: form.value.fullName, email: form.value.email, role: form.value.role }
      await api.put(`/users/${id}`, payload)
      alert('Cập nhật thành công')
    } else {
      const payload = { username: form.value.username, fullName: form.value.fullName, email: form.value.email, role: form.value.role, passwordHash: form.value.password }
      await api.post('/users', payload)
      alert('Tạo user thành công')
    }
    closeModal()
    fetchUsers()
  } catch (err) {
    console.error('submitForm error', err)
    const msg = err?.response?.data?.message || 'Thao tác thất bại'
    alert(msg)
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (u) => {
  const newStatus = u.status === 'active' ? 'banned' : 'active'
  if (u.status === 'active' && !confirm(`Bạn có muốn khóa user "${u.username}"?`)) return
  try {
    await api.put(`/users/${u._id || u.id}`, { status: newStatus })
    alert('Cập nhật trạng thái thành công')
    fetchUsers()
  } catch (err) {
    console.error('toggleStatus error', err)
    alert('Cập nhật trạng thái thất bại')
  }
}

const changeRolePrompt = async (u) => {
  const wanted = prompt('Nhập vai trò mới (admin | user):', u.role)
  if (!wanted) return
  if (!['admin', 'user'].includes(wanted)) { alert('Role không hợp lệ'); return }
  try {
    await api.put(`/users/${u._id || u.id}`, { role: wanted })
    alert('Đổi vai trò thành công')
    fetchUsers()
  } catch (err) {
    console.error('changeRole error', err)
    alert('Đổi vai trò thất bại')
  }
}

const formatDateTime = (d) => { if (!d) return '-'; try { const dt = new Date(d); if (isNaN(dt)) return d; return dt.toLocaleString('vi-VN') } catch { return d } }
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }
</style>