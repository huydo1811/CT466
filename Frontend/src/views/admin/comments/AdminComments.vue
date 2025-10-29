<template>
  <div class="p-2 space-y-6 animate-fade-in">
<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <!-- Tiêu đề -->
  <div>
    <h2 class="text-2xl md:text-3xl font-bold text-white">Bình luận / Đánh giá</h2>
    <p class="text-slate-400 text-sm mt-1">
      Quản lý đánh giá và bình luận của người dùng.
    </p>
  </div>

  <!-- Bộ lọc -->
  <div class="flex flex-col sm:flex-row sm:flex-wrap items-stretch gap-2">
    <input
      v-model="q"
      placeholder="Tìm user, movie hoặc nội dung..."
      class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-64"
    />
    <select
      v-model="ratingFilter"
      class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto"
    >
      <option value="">Tất cả điểm</option>
      <option v-for="r in [5,4,3,2,1]" :key="r" :value="r">{{ r }} sao</option>
    </select>
    <select
      v-model="statusFilter"
      class="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200 w-full sm:w-auto"
    >
      <option value="">Tất cả trạng thái</option>
      <option value="published">Đã đăng</option>
      <option value="hidden">Ẩn</option>
    </select>
    <button
      @click="reportedOnly = !reportedOnly"
      :class="reportedOnly ? 'bg-yellow-600 text-black' : 'bg-slate-700 text-slate-200'"
      class="px-3 py-2 rounded w-full sm:w-auto"
    >
      {{ reportedOnly ? 'Chỉ báo cáo (ON)' : 'Chỉ báo cáo' }}
    </button>
  </div>
</div>


    <div class="bg-slate-800/50 border border-slate-700/40 rounded-xl overflow-hidden">
      <!-- bulk actions -->
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="w-4 h-4" />
          <div class="text-slate-300 text-sm">Chọn tất cả</div>
          <button @click="bulkHide" class="px-2 py-1 bg-slate-700 rounded text-slate-200" :disabled="!anySelected">Ẩn</button>
          <button @click="bulkDelete" class="px-2 py-1 bg-rose-600 rounded text-white" :disabled="!anySelected">Xóa</button>
        </div>

        <div class="text-slate-400 text-sm">Tổng: {{ total }}</div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px]">
          <thead class="text-slate-400 text-xs bg-slate-700/50">
            <tr>
              <th class="px-4 py-3"><!-- checkbox col --></th>
              <th class="px-4 py-3 text-left">User</th>
              <th class="px-4 py-3 text-left">Movie</th>
              <th class="px-4 py-3 text-left">Nội dung</th>
              <th class="px-4 py-3 text-left">Điểm</th>
              <th class="px-4 py-3 text-left">Báo cáo</th>
              <th class="px-4 py-3 text-left">Trạng thái</th>
              <th class="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-700/40">
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-6 text-slate-400">Đang tải...</td>
            </tr>

            <tr v-else-if="!paged.length">
              <td colspan="8" class="px-4 py-6 text-slate-400">Không có bình luận phù hợp.</td>
            </tr>

            <tr v-for="r in paged" :key="r.id" class="hover:bg-slate-700/20 align-top">
              <td class="px-4 py-3">
                <input type="checkbox" v-model="selected" :value="r.id" class="w-4 h-4" />
              </td>

              <td class="px-4 py-3">
                <div class="text-sm font-medium text-white">{{ r.user.name }}</div>
                <div class="text-xs text-slate-400">{{ r.user.username }}</div>
              </td>

              <td class="px-4 py-3">
                <div class="text-sm text-slate-200">{{ r.movie.title }}</div>
                <div class="text-xs text-slate-400">{{ formatDate(r.createdAt) }}</div>
                <div class="text-xs text-slate-400 mt-1">Phản hồi: <span class="font-medium text-slate-200">{{ r.replies?.length || 0 }}</span></div>
              </td>

              <td class="px-4 py-3">
                <div class="text-sm text-slate-200 line-clamp-2">{{ r.comment || '-' }}</div>
              </td>

              <td class="px-4 py-3">
                <div class="text-yellow-300">{{ '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) }}</div>
              </td>

              <td class="px-4 py-3">
                <div v-if="r.reviewed" class="text-xs bg-emerald-600/20 text-emerald-300 px-2 py-0.5 rounded">Đã xử lý</div>
                <div v-else-if="r.reported" class="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-0.5 rounded">Đã báo cáo</div>
                <div v-else class="text-xs text-slate-400">-</div>
              </td>

              <td class="px-4 py-3">
                <div :class="r.isPublished ? 'text-emerald-400' : 'text-rose-400'">{{ r.isPublished ? 'Đã đăng' : 'Ẩn' }}</div>
              </td>

              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="viewDetail(r)" class="text-blue-400 hover:text-blue-300 p-2 rounded" title="Xem chi tiết">
                    <!-- eye icon -->
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>

                  <button @click="togglePublish(r)" :class="r.isPublished ? 'text-rose-400' : 'text-emerald-400' " class="p-2 rounded" :title="r.isPublished ? 'Ẩn' : 'Hiện'">
                    <!-- eye-off / eye icon switch -->
                    <svg v-if="r.isPublished" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.79 21.79 0 015.23-6.02"/><path d="M1 1l22 22"/></svg>
                    <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>

                  <button @click="confirmDelete(r)" class="text-red-400 hover:text-red-300 p-2 rounded" title="Xóa">
                    <!-- trash icon -->
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
              <td colspan="8" class="px-4 py-3 bg-slate-900/40">
                <div class="flex items-center justify-between">
                  <div class="text-slate-400 text-sm">Trang {{ page }} / {{ pages }} — Tổng {{ total }}</div>
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

    <!-- detail modal -->
    <div v-if="showDetail" class="fixed inset-0 z-50 overflow-auto bg-black/50 p-4">
      <div class="mx-auto w-full max-w-2xl bg-slate-900 rounded-lg border border-slate-700 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div class="sticky top-0 bg-slate-900/90 backdrop-blur px-4 py-3 border-b border-slate-700 z-10">
          <div class="flex items-center justify-between">
            <div class="text-white font-medium">Chi tiết bình luận</div>
            <div class="flex items-center gap-2">
              <button @click="markReviewed(current)" class="px-2 py-1 bg-slate-700 rounded text-slate-200" v-if="current?.reported">Đánh dấu đã xử lý</button>
              <button @click="closeDetail" class="text-slate-300 hover:text-white px-2">Đóng</button>
            </div>
          </div>
        </div>

        <div class="p-4 space-y-4 pb-6">
          <div class="flex items-start gap-4">
            <img :src="current?.user.avatar || '/placeholder-avatar.png'" class="w-16 h-16 rounded object-cover" />
            <div>
              <div class="text-white font-medium">{{ current?.user.name }} • <span class="text-slate-400 text-sm">@{{ current?.user.username }}</span></div>
              <div class="text-slate-400 text-sm">Movie: <span class="text-slate-200">{{ current?.movie.title }}</span></div>
              <div class="text-slate-400 text-sm">Ngày: <span class="text-slate-200">{{ formatDate(current?.createdAt) }}</span></div>
              <div class="mt-2 text-yellow-300">{{ current ? ('★'.repeat(current.rating) + '☆'.repeat(5-current.rating)) : '' }}</div>
            </div>
          </div>

          <div class="bg-slate-800 p-3 rounded text-slate-200 whitespace-pre-wrap">{{ current?.comment }}</div>

          <div v-if="current?.reports?.length" class="space-y-2">
            <h4 class="text-sm text-slate-300">Lý do báo cáo</h4>
            <ul class="text-sm text-slate-400 space-y-1">
              <li v-for="(rep, i) in current.reports" :key="i">- {{ rep }}</li>
            </ul>
          </div>

          <div v-if="current?.replies?.length" class="space-y-3">
            <h4 class="text-sm text-slate-300">Phản hồi ({{ current.replies.length }})</h4>
            <ul class="space-y-2">
              <li v-for="rp in current.replies" :key="rp.id" class="bg-slate-800 p-3 rounded">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-sm text-slate-200">{{ rp.user.name }} • <span class="text-slate-400 text-xs">@{{ rp.user.username || '' }}</span></div>
                    <div class="text-xs text-slate-400">{{ formatDate(rp.createdAt) }}</div>
                    <div class="mt-2 text-slate-200 whitespace-pre-wrap">{{ rp.comment }}</div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <button @click="toggleReplyPublish(rp, current)" class="text-sm px-2 py-1 rounded" :class="rp.isPublished ? 'text-rose-400' : 'text-emerald-400'">
                      {{ rp.isPublished ? 'Ẩn' : 'Hiện' }}
                    </button>
                    <button @click="deleteReply(rp, current)" class="text-sm px-2 py-1 bg-rose-600 text-white rounded">Xóa</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="flex gap-2">
            <button @click="togglePublish(current)" class="px-3 py-2 bg-emerald-600 rounded text-white">{{ current?.isPublished ? 'Ẩn' : 'Hiện' }}</button>
            <button @click="confirmDelete(current)" class="px-3 py-2 bg-rose-600 rounded text-white">Xóa</button>
            <button @click="closeDetail" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Đóng</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const loading = ref(true)
const q = ref('')
const ratingFilter = ref('')
const statusFilter = ref('')
const reportedOnly = ref(false)
const page = ref(1)
const perPage = ref(10)

const comments = ref([]) // list of reviews/comments from API
const selected = ref([])
const selectAll = ref(false)

const showDetail = ref(false)
const current = ref(null)

// mock data
const mock = () => ([
  { id: 'r1', user: { id:'u1', name:'Alice', username:'alice01', avatar:'' }, movie: { id:'m1', title:'Movie A' }, rating: 5, comment: 'Tuyệt vời!', reported: false, reports:[], reviewed:false, replies:[], isPublished:true, createdAt:'2025-10-20' },
  { id: 'r2', user: { id:'u2', name:'Bob', username:'bob' }, movie: { id:'m2', title:'Movie B' }, rating: 2, comment: 'Có nhiều lỗi.', reported: true, reports:['Nội dung không phù hợp'], reviewed:false, replies:[{id:'rp1', user:{name:'Mod',username:'mod'}, comment:'Đã kiểm tra, cảm ơn', isPublished:true, createdAt:'2025-10-22'}], isPublished:true, createdAt:'2025-10-21' },
  { id: 'r3', user: { id:'u3', name:'Charlie', username:'char' }, movie: { id:'m1', title:'Movie A' }, rating: 1, comment: 'Spam link http://...', reported: true, reports:['Spam'], reviewed:false, replies:[], isPublished:false, createdAt:'2025-10-15' }
])

const fetchComments = async () => {
  loading.value = true
  try {
    // TODO: fetch from /api/admin/reviews
    comments.value = mock()
  } finally { loading.value = false }
}

onMounted(fetchComments)

const filtered = computed(() => {
  let list = comments.value.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (q.value) {
    const t = q.value.toLowerCase()
    list = list.filter(r => (r.user.name||'').toLowerCase().includes(t) || (r.user.username||'').toLowerCase().includes(t) || (r.movie.title||'').toLowerCase().includes(t) || (r.comment||'').toLowerCase().includes(t))
  }
  if (ratingFilter.value) list = list.filter(r => r.rating === Number(ratingFilter.value))
  if (statusFilter.value) list = list.filter(r => (statusFilter.value === 'published') ? r.isPublished : !r.isPublished)
  if (reportedOnly.value) list = list.filter(r => r.reported)
  return list
})

const total = computed(() => filtered.value.length)
const pages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
const paged = computed(() => filtered.value.slice((page.value-1)*perPage.value, (page.value-1)*perPage.value + perPage.value))

watch([q, ratingFilter, statusFilter, reportedOnly], () => page.value = 1)

const anySelected = computed(() => selected.value.length > 0)

const toggleSelectAll = () => {
  if (selectAll.value) selected.value = paged.value.map(x => x.id)
  else selected.value = []
}

watch(paged, () => {
  // if current page items change, keep selectAll consistent
  const ids = paged.value.map(x => x.id)
  selectAll.value = ids.length && ids.every(id => selected.value.includes(id))
})

const viewDetail = (r) => { current.value = r; showDetail.value = true }
const closeDetail = () => { showDetail.value = false; current.value = null }

const togglePublish = (r) => {
  const id = r?.id
  if (!id) return
  const idx = comments.value.findIndex(x => x.id === id)
  if (idx < 0) return
  // confirm when hiding
  if (comments.value[idx].isPublished) {
    if (!confirm('Bạn có chắc muốn ẩn bình luận này?')) return
    comments.value[idx].isPublished = false
  } else comments.value[idx].isPublished = true
}

const confirmDelete = (r) => {
  if (!confirm('Xóa vĩnh viễn bình luận này?')) return deleteComment(r)
}
const deleteComment = (r) => { comments.value = comments.value.filter(x => x.id !== r.id); closeDetail() }

const markReviewed = (r) => {
  if (!r) return
  const idx = comments.value.findIndex(x => x.id === r.id)
  if (idx >= 0) {
    comments.value[idx].reported = false
    comments.value[idx].reviewed = true
  }
  if (current.value && current.value.id === r.id) current.value = comments.value[idx]
}

const bulkHide = () => {
  if (!anySelected.value) return
  if (!confirm(`Ẩn ${selected.value.length} bình luận đã chọn?`)) return
  comments.value = comments.value.map(c => selected.value.includes(c.id) ? { ...c, isPublished:false } : c)
  selected.value = []
}
const bulkDelete = () => {
  if (!anySelected.value) return
  if (!confirm(`Xóa vĩnh viễn ${selected.value.length} bình luận đã chọn?`)) return
  comments.value = comments.value.filter(c => !selected.value.includes(c.id))
  selected.value = []
}

const formatDate = (d) => {
  if (!d) return '-'
  try { return new Date(d).toLocaleString('vi-VN') } catch { return d }
}

// Add reply moderation helpers in script
const toggleReplyPublish = (reply, parent) => {
  const p = comments.value.find(x => x.id === parent.id)
  if (!p) return
  const idx = (p.replies||[]).findIndex(r => r.id === reply.id)
  if (idx < 0) return
  if (p.replies[idx].isPublished) {
    if (!confirm('Bạn có chắc muốn ẩn phản hồi này?')) return
    p.replies[idx].isPublished = false
  } else p.replies[idx].isPublished = true
  // update current if opened
  if (current.value && current.value.id === p.id) current.value = p
}

const deleteReply = (reply, parent) => {
  if (!confirm('Xóa phản hồi này?')) return
  const p = comments.value.find(x => x.id === parent.id)
  if (!p) return
  p.replies = (p.replies || []).filter(r => r.id !== reply.id)
  if (current.value && current.value.id === p.id) current.value = p
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .22s ease-out; }

/* small helper */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>