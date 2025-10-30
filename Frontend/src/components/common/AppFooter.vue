<template>
  <footer class="bg-dark-900 border-t border-gray-800 mt-20">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-red-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">C</span>
            </div>
            <span class="text-xl font-bold text-gradient">ChillFilm</span>
          </div>
          <p class="text-gray-400 mb-4 max-w-md">Nền tảng xem phim trực tuyến hàng đầu Việt Nam.</p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-4">Danh mục</h4>
          <ul class="space-y-2 text-gray-400">
            <li><RouterLink to="/movies" class="hover:text-white transition-colors">Phim điện ảnh</RouterLink></li>
            <li><RouterLink to="/series" class="hover:text-white transition-colors">Phim bộ</RouterLink></li>
            <li><RouterLink to="/animation" class="hover:text-white transition-colors">Hoạt hình</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-4">Hỗ trợ</h4>
          <ul class="space-y-2 text-gray-400">
            <li><RouterLink to="/contact" class="hover:text-white transition-colors">Liên hệ</RouterLink></li>
            <li><RouterLink to="/faq" class="hover:text-white transition-colors">FAQ-Hỏi đáp</RouterLink></li>
            <li><RouterLink to="/policy" class="hover:text-white transition-colors">Chính sách</RouterLink></li>
            <li><RouterLink to="/terms" class="hover:text-white transition-colors">Điều khoản</RouterLink></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 ChillFilm. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>