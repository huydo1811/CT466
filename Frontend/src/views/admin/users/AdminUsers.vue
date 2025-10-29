<template>
  <div class="space-y-6 animate-fade-in p-2">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
            <h2 class="text-3xl font-bold text-white">Người dùng</h2>
            <p class="text-slate-400 text-sm mt-1">
            Quản lý tài khoản — tìm, thêm, sửa, xóa và đổi trạng thái / vai trò.
            </p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <input
            v-model="q"
            placeholder="Tìm theo tên hoặc username..."
            class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none w-full sm:w-auto"
            />
            <select
            v-model="roleFilter"
            class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto"
            >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            </select>
            <button
            @click="goAdd"
            class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded w-full sm:w-auto"
            >
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

            <tr v-else-if="!filtered.length">
              <td colspan="7" class="px-4 py-6 text-slate-400">Không có kết quả.</td>
            </tr>

            <tr v-for="u in paged" :key="u.id" class="hover:bg-slate-700/20">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img :src="u.avatar || '/placeholder-avatar.png'" alt="avatar" class="w-10 h-10 rounded object-cover" />
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
                  <button @click="goEdit(u.id)" class="text-yellow-300 hover:text-yellow-200 p-2 rounded" title="Sửa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="toggleStatus(u)" class="text-sky-400 hover:text-sky-300 p-2 rounded" :title="u.status === 'active' ? 'Khóa' : 'Mở khóa'">
                    <template v-if="u.status === 'active'">
                      <!-- closed lock (heroicons-style) - full viewBox so it won't be clipped -->
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                      </svg>
                    </template>
                    <template v-else>
                      <!-- open lock -->
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <path d="M8 11V7a4 4 0 118 0v1"></path>
                        <path d="M15 11h.01"></path>
                      </svg>
                    </template>
                  </button>
                  <button @click="remove(u)" class="text-red-400 hover:text-red-300 p-2 rounded" title="Xóa">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const USE_MOCK = true
const loading = ref(true)
const q = ref('')
const roleFilter = ref('')
const page = ref(1)
const perPage = ref(10)

const users = ref([])

// mock & fetch (same as before)
const mockUsers = () => ([
  { id: 'u1', username: 'alice01', fullName: 'Alice Nguyen', email: 'alice@example.com', role: 'user', status: 'active', avatar: 'https://i.pravatar.cc/150?img=5', lastLogin: '2025-10-20T12:00:00Z', createdAt: '2023-01-01' },
  { id: 'u2', username: 'bobadmin', fullName: 'Bob Admin', email: 'bob@example.com', role: 'admin', status: 'active', avatar: 'https://i.pravatar.cc/150?img=6', lastLogin: '2025-10-22T09:30:00Z', createdAt: '2022-12-15' },
  { id: 'u3', username: 'charlie', fullName: 'Charlie Tran', email: '', role: 'user', status: 'banned', avatar: '', lastLogin: null, createdAt: '2024-03-08' }
])

const fetchUsers = async () => {
  loading.value = true
  try {
    users.value = USE_MOCK ? mockUsers() : (await (await fetch('/api/admin/users')).json())
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}
onMounted(fetchUsers)

const filtered = computed(() => {
  let list = users.value.slice()
  if (q.value) {
    const t = q.value.toLowerCase().trim()
    list = list.filter(u => (u.username||'').toLowerCase().includes(t) || (u.fullName||'').toLowerCase().includes(t) || (u.email||'').toLowerCase().includes(t))
  }
  if (roleFilter.value) list = list.filter(u => u.role === roleFilter.value)
  return list
})

const total = computed(() => filtered.value.length)
const pages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
const paged = computed(() => filtered.value.slice((page.value-1)*perPage.value, (page.value-1)*perPage.value + perPage.value))

watch([q, roleFilter], () => { page.value = 1 })

const goAdd = () => router.push('/admin/users/add')
const goEdit = (id) => router.push(`/admin/users/edit/${id}`)

const remove = (u) => { if (!confirm(`Xóa user "${u.username}"?`)) return; users.value = users.value.filter(x => x.id !== u.id) }
const toggleStatus = (u) => {
  const idx = users.value.findIndex(x => x.id === u.id)
  if (idx < 0) return
  // nếu đang active -> confirm trước khi khóa
  if (users.value[idx].status === 'active') {
    if (!confirm(`Bạn có chắc muốn khóa user "${users.value[idx].username}"?`)) return
    users.value[idx].status = 'banned'
    return
  }
  // nếu đang đã bị khóa -> mở lại không confirm
  users.value[idx].status = 'active'
}

const formatDateTime = (d) => { if (!d) return '-'; try { const dt = new Date(d); if (isNaN(dt)) return d; return dt.toLocaleString('vi-VN') } catch { return d } }
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }
</style>