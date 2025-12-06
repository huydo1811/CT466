<template>
  <!-- Modal Overlay -->
  <div 
    v-if="showBanner && currentBanner" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    @click="closeBanner"
  >
    <!-- Modal Content -->
    <div 
      class="relative max-w-4xl w-11/12 md:w-4/5 lg:w-3/4"
      @click.stop
    >
      <!-- Nút đóng (X) -->
      <button 
        @click="closeBanner"
        class="absolute -top-4 -right-4 z-10 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-all hover:scale-110"
      >
        ×
      </button>

      <!-- Banner Image (clickable) -->
      <a 
        @click.prevent="handleClick(currentBanner)"
        :href="getHref(currentBanner)"
        class="block cursor-pointer"
      >
        <img 
          :src="getImageUrl(currentBanner)" 
          :alt="currentBanner.title || 'Banner'" 
          class="w-full h-auto rounded-lg shadow-2xl"
        />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  banners: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const showBanner = ref(false)
const currentBanner = ref(null)

// Hiển thị banner khi có data
watch(() => props.banners, (newBanners) => {
  if (newBanners && newBanners.length > 0) {
    // Kiểm tra xem user đã đóng banner chưa (dùng sessionStorage)
    const dismissed = sessionStorage.getItem('banner-dismissed')
    if (!dismissed) {
      currentBanner.value = newBanners[0] // Lấy banner đầu tiên (hoặc random)
      showBanner.value = true
    }
  }
}, { immediate: true })

// Đóng banner
const closeBanner = () => {
  showBanner.value = false
}

// Lấy URL ảnh
const getImageUrl = (banner) => {
  if (!banner) return ''
  
  const isMobile = window.innerWidth < 768
  const url = isMobile ? (banner.mobileImage || banner.image) : banner.image
  
  if (!url) return ''
  if (url.startsWith('http')) return url
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${baseUrl}${url}`
}

// Tạo href
const getHref = (banner) => {
  if (!banner.linkType || banner.linkType === 'none') return '#'
  if (banner.linkType === 'external' && banner.linkUrl) return banner.linkUrl
  return '#'
}

// Xử lý click vào banner
const handleClick = (banner) => {
  if (!banner) return
  
  closeBanner() // Đóng modal trước
  
  // Link ngoài
  if (banner.linkType === 'external' && banner.linkUrl) {
    window.open(banner.linkUrl, '_blank')
    return
  }
  
  // Link đến phim
  if (banner.linkType === 'movie' && banner.targetId) {
    router.push({ name: 'movie-detail', params: { id: banner.targetId } })
    return
  }
  
  // Link đến thể loại
  if (banner.linkType === 'category' && banner.targetId) {
    router.push({ name: 'category-detail', params: { id: banner.targetId } })
    return
  }
}

// Đóng khi nhấn ESC
onMounted(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape' && showBanner.value) {
      closeBanner()
    }
  }
  window.addEventListener('keydown', handleEsc)
  
  // Cleanup
  return () => window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
/* Animation */
.fixed {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>