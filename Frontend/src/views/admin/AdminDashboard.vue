<script setup>
import { ref } from 'vue'


// Mock data
const stats = ref({
  totalMovies: 1250,
  totalUsers: 15420,
  totalViews: 892340,
  totalEpisodes: 5678
})

const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  views: [12000, 19000, 15000, 25000, 22000, 30000],
  users: [120, 180, 150, 220, 280, 320]
})

const recentActivities = ref([
  {
    id: 1,
    description: 'Phim "Avengers: Endgame" đã được thêm vào hệ thống',
    time: '2 phút trước',
    icon: '🎬'
  },
  {
    id: 2,
    description: 'Người dùng "john_doe" đã đăng ký tài khoản',
    time: '5 phút trước',
    icon: '👤'
  },
  {
    id: 3,
    description: 'Phim "The Dark Knight" đạt 1000 lượt xem',
    time: '10 phút trước',
    icon: '👁️'
  },
  {
    id: 4,
    description: 'Tập mới của "Breaking Bad" đã được cập nhật',
    time: '15 phút trước',
    icon: '📺'
  }
])

const formatNumber = (num) => {
  return num.toLocaleString('vi-VN')
}

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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Movies -->
      <div class="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Tổng phim</p>
            <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalMovies) }}</p>
            <p class="text-green-400 text-sm flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
              +12% so với tháng trước
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Users -->
      <div class="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-xl border border-green-500/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Tổng người dùng</p>
            <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalUsers) }}</p>
            <p class="text-green-400 text-sm flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
              +8% so với tháng trước
            </p>
          </div>
          <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Views -->
      <div class="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Tổng lượt xem</p>
            <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalViews) }}</p>
            <p class="text-green-400 text-sm flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
              +15% so với tháng trước
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Episodes -->
      <div class="bg-gradient-to-br from-red-600/20 to-red-700/20 backdrop-blur-xl border border-red-500/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">Tổng tập phim</p>
            <p class="text-2xl font-bold text-white">{{ formatNumber(stats.totalEpisodes) }}</p>
            <p class="text-green-400 text-sm flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
              +20% so với tháng trước
            </p>
          </div>
          <div class="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Views Chart -->
      <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Lượt xem theo tháng</h3>
          <select class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white">
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
        <div class="h-64 flex items-end justify-between space-x-2">
          <div v-for="(value, index) in chartData.views" :key="index" class="flex-1 flex flex-col items-center">
            <div 
              class="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-lg transition-all duration-300 hover:opacity-80 min-h-[20px]"
              :style="{ height: `${Math.max((value / Math.max(...chartData.views)) * 100, 10)}%` }"
            ></div>
            <span class="text-xs text-slate-400 mt-2">{{ chartData.labels[index] }}</span>
          </div>
        </div>
      </div>

      <!-- User Growth Chart -->
      <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Người dùng mới</h3>
          <select class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white">
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
        <div class="h-64 flex items-end justify-between space-x-2">
          <div v-for="(value, index) in chartData.users" :key="index" class="flex-1 flex flex-col items-center">
            <div 
              class="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t shadow-lg transition-all duration-300 hover:opacity-80 min-h-[20px]"
              :style="{ height: `${Math.max((value / Math.max(...chartData.users)) * 100, 10)}%` }"
            ></div>
            <span class="text-xs text-slate-400 mt-2">{{ chartData.labels[index] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Hoạt động gần đây</h3>
        <button class="text-blue-400 hover:text-blue-300 text-sm transition-colors">Xem tất cả</button>
      </div>
      
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
          <div class="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-lg">
            {{ activity.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm">{{ activity.description }}</p>
            <p class="text-slate-400 text-xs">{{ activity.time }}</p>
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
</style>