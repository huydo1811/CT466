<template>
  <div class="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
    <AppHeader />
    
    <!-- Banner đầu trang (hero) - thêm mới -->
    <BannerDisplay :banners="heroBanners" />
    
    <main class="pt-20">
      <RouterView :key="$route.fullPath" />
      
      <!-- Banner giữa trang (secondary) - thêm mới -->
      <BannerDisplay :banners="secondaryBanners" />
    </main>
    
    <!-- Banner cuối trang (footer) - thêm mới -->
    <BannerDisplay :banners="footerBanners" />
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import api from '@/services/api'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import BannerDisplay from '@/components/common/BannerDisplay.vue' 
const heroBanners = ref([])
const secondaryBanners = ref([])
const footerBanners = ref([])

const fetchBanners = async () => {
  try {
    const res = await api.get('/banners/public') 
    console.log('API Response:', res?.data) 
    
    const allBanners = res?.data?.data || []
    
    const now = new Date()
    const activeBanners = allBanners.filter(b => {
      if (!b.isActive) return false
      if (b.startDate && new Date(b.startDate) > now) return false
      if (b.endDate && new Date(b.endDate) < now) return false
      return true
    })
    
    heroBanners.value = activeBanners
      .filter(b => b.position === 'hero')
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    
    secondaryBanners.value = activeBanners
      .filter(b => b.position === 'secondary')
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    
    footerBanners.value = activeBanners
      .filter(b => b.position === 'footer')
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      
  } catch (err) {
    console.error('Lỗi tải banner:', err)
  }
}

onMounted(fetchBanners)
</script>