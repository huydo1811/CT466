<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import api from '@/services/api'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const currentYear = new Date().getFullYear()
const stats = ref({ totalMovies:0, totalUsers:0, totalViews:0, totalEpisodes:0 })
const loading = ref(false)
const error = ref(null)

const chartData = ref({
  labels: Array.from({length:12},(_,i)=>`Thg ${i+1}`),
  views: Array(12).fill(0),
  users: Array(12).fill(0)
})
const recentActivities = ref([])

const showActivitiesModal = ref(false)
const openAllActivities = () => { showActivitiesModal.value = true }
const closeAllActivities = () => { showActivitiesModal.value = false }

const formatNumber = (num) => {
  try { return Number(num || 0).toLocaleString('vi-VN') } catch { return String(num) }
}

const fetchDashboard = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/admin/stats')
    const d = res?.data?.data || res?.data || {}

    stats.value.totalMovies = d.totalMovies || 0
    stats.value.totalUsers = d.totalUsers || 0
    stats.value.totalEpisodes = d.totalEpisodes || 0
    stats.value.totalViews = d.totalViews || 0

    chartData.value.labels = d.monthlyLabels || chartData.value.labels
    chartData.value.views = Array.isArray(d.monthlyViews) ? d.monthlyViews : Array(12).fill(0)
    chartData.value.users = Array.isArray(d.monthlyUsers) ? d.monthlyUsers : Array(12).fill(0)

    stats.value._compare = d.compare || {}
    recentActivities.value = (d.recentActivities || []).map(a => ({
      ...a,
      timeFormatted: new Date(a.time).toLocaleString('vi-VN')
    }))
  } catch (e) {
    console.warn('fetchDashboard failed', e)
    error.value = (e?.response?.data?.message) || e?.message || 'Không thể lấy dữ liệu dashboard'
  } finally {
    loading.value = false
  }
}

// Chart.js instances
let viewsChart = null
let usersChart = null

const viewsChartCanvas = ref(null)
const usersChartCanvas = ref(null)

// Helper: create or update chart
const renderViewsChart = () => {
  if (!viewsChartCanvas.value) return
  const ctx = viewsChartCanvas.value.getContext('2d')
  if (viewsChart) {
    viewsChart.data.labels = chartData.value.labels
    viewsChart.data.datasets[0].data = chartData.value.views
    viewsChart.update()
  } else {
    viewsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.value.labels,
        datasets: [{
          label: 'Lượt xem',
          data: chartData.value.views,
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Lượt xem: ${formatNumber(ctx.parsed.y)}`
            }
          }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#94a3b8' } },
          x: { ticks: { color: '#94a3b8' } }
        }
      }
    })
  }
}

const renderUsersChart = () => {
  if (!usersChartCanvas.value) return
  const ctx = usersChartCanvas.value.getContext('2d')
  if (usersChart) {
    usersChart.data.labels = chartData.value.labels
    usersChart.data.datasets[0].data = chartData.value.users
    usersChart.update()
  } else {
    usersChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.value.labels,
        datasets: [{
          label: 'Người dùng mới',
          data: chartData.value.users,
          backgroundColor: 'rgba(34, 197, 94, 0.8)', // green-500
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Người dùng: ${formatNumber(ctx.parsed.y)}`
            }
          }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#94a3b8' } },
          x: { ticks: { color: '#94a3b8' } }
        }
      }
    })
  }
}

onMounted(async () => {
  await fetchDashboard()
  await nextTick()
  renderViewsChart()
  renderUsersChart()
})

// Watch chartData to re-render when data changes
watch(() => chartData.value, () => {
  nextTick(() => {
    renderViewsChart()
    renderUsersChart()
  })
}, { deep: true })

const viewsChange = computed(() => stats.value._compare?.views || { pct:0, diff:0, cur:0, prev:0 })
const moviesChange = computed(() => stats.value._compare?.movies || { pct:0, diff:0, cur:0, prev:0 })
const usersChange = computed(() => stats.value._compare?.users || { pct:0, diff:0, cur:0, prev:0 })
const episodesChange = computed(() => stats.value._compare?.episodes || { pct:0, diff:0, cur:0, prev:0 })
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p class="text-slate-400">Tổng quan hệ thống</p>
      </div>
    </div>

    <div v-if="loading" class="text-gray-400">Đang tải số liệu...</div>
    <div v-else>
      <div v-if="error" class="p-4 bg-red-900/30 border border-red-800 text-red-200 rounded mb-4">
        {{ error }}
      </div>

      <!-- Stats Cards (unchanged) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Movies -->
        <div class="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Tổng phim</p>
              <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalMovies) }}</p>
              <p class="text-sm mt-1">
                <span :class="['px-2 py-1 rounded text-xs', moviesChange.pct > 0 ?  'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/10 text-rose-400']">
                  {{ moviesChange.pct > 0 ? '▲' : '▼' }} {{ moviesChange.pct || 0 }}% (so với tháng trước)
                </span>
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z"/></svg>
            </div>
          </div>
        </div>

        <!-- Total Users -->
        <div class="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-xl border border-green-500/20 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Tổng người dùng</p>
              <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalUsers) }}</p>
              <p class="text-sm mt-1">
                <span :class="['px-2 py-1 rounded text-xs', usersChange.pct > 0 ? 'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/10 text-rose-400']">
                  {{ usersChange.pct > 0 ? '▲' : '▼' }} {{ usersChange.pct || 0 }}% (so với tháng trước)
                </span>
              </p>
            </div>
            <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
            </div>
          </div>
        </div>

        <!-- Total Views -->
        <div class="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Tổng lượt xem</p>
              <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalViews) }}</p>
              <p class="text-sm mt-1">
                <span :class="['px-2 py-1 rounded text-xs', viewsChange.pct > 0 ? 'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/10 text-rose-400']">
                  {{ viewsChange.pct > 0 ? '▲' : '▼' }} {{ viewsChange.pct || 0 }}% (so với tháng trước)
                </span>
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </div>
          </div>
        </div>

        <!-- Total Episodes -->
        <div class="bg-gradient-to-br from-red-600/20 to-red-700/20 backdrop-blur-xl border border-red-500/20 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Tổng tập phim</p>
              <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalEpisodes) }}</p>
              <p class="text-sm mt-1">
                <span :class="['px-2 py-1 rounded text-xs', episodesChange.pct > 0 ? 'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/10 text-rose-400']">
                  {{ episodesChange.pct > 0 ? '▲' : '▼' }} {{ episodesChange.pct || 0 }}% (so với tháng trước)
                </span>
              </p>
            </div>
            <div class="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row (using Chart.js) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <!-- Views Chart -->
        <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Lượt xem theo tháng ({{ currentYear }})</h3>
          </div>
          <div style="position: relative; height: 300px;">
            <canvas ref="viewsChartCanvas"></canvas>
          </div>
        </div>

        <!-- User Growth Chart -->
        <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Người dùng mới ({{ currentYear }})</h3>
          </div>
          <div style="position: relative; height: 300px;">
            <canvas ref="usersChartCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Activities (unchanged) -->
      <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg mt-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Hoạt động gần đây (24 giờ)</h3>
          <button @click="openAllActivities" class="text-blue-400 hover:text-blue-300 text-sm transition-colors">Xem tất cả</button>
        </div>
        
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
            <div class="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-lg">
              {{ activity.type?.charAt(0)?.toUpperCase() || '•' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm">{{ activity.text }}</p>
              <p class="text-slate-400 text-xs">{{ activity.timeFormatted || new Date(activity.time).toLocaleString('vi-VN') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: All activities -->
    <div v-if="showActivitiesModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60" @click="closeAllActivities"></div>
      <div class="relative bg-slate-900 rounded-xl w-11/12 md:w-2/3 lg:w-1/2 p-6 z-60">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Tất cả hoạt động trong 24 giờ</h3>
          <button @click="closeAllActivities" class="text-slate-400 hover:text-white">Đóng</button>
        </div>
        <div class="max-h-[60vh] overflow-y-auto space-y-3">
          <div v-if="recentActivities.length === 0" class="text-gray-400">Không có hoạt động trong 24 giờ</div>
          <div v-for="act in recentActivities" :key="act.id" class="p-3 bg-slate-800/40 rounded">
            <div class="text-sm text-white">{{ act.text }}</div>
            <div class="text-xs text-slate-400 mt-1">{{ act.timeFormatted || new Date(act.time).toLocaleString('vi-VN') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>