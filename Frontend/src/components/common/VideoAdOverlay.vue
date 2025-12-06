<template>
  <!-- Ad overlay bên trong video container -->
  <div 
    v-if="showAd && adData?.videoUrl" 
    class="absolute inset-0 z-40 bg-black"
  >
    <!-- Video quảng cáo -->
    <video
      ref="adVideo"
      :src="getVideoUrl(adData.videoUrl)"
      class="w-full h-full object-contain"
      @loadedmetadata="onVideoLoaded"
      @timeupdate="onTimeUpdate"
      @ended="skipAd"
      @error="onVideoError"
      autoplay
      playsinline
    ></video>
    
    <!-- Controls overlay -->
    <div class="absolute inset-0">
      <!-- Ad info (top-left) -->
      <div class="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded text-sm pointer-events-none">
        <div class="font-medium">{{ adData.title }}</div>
        <div class="text-xs text-gray-300 mt-1">Quảng cáo</div>
      </div>
      
      <!-- Skip button (top-right) -->
      <button
        v-if="canSkip"
        @click="skipAd"
        class="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white text-black px-4 py-2 rounded font-medium text-sm transition flex items-center gap-2 shadow-lg"
      >
        <span>Bỏ qua</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
        </svg>
      </button>
      
      <!-- Countdown -->
      <div
        v-else
        class="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded text-sm font-medium pointer-events-none"
      >
        Bỏ qua trong {{ Math.ceil(skipAfter - currentTime) }}s
      </div>
      
      <!-- Progress bar -->
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 pointer-events-none">
        <div 
          class="h-full bg-primary-600 transition-all"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      
      <!-- Click overlay (nếu có link) -->
      <a
        v-if="adData.linkUrl && adData.linkType === 'external'"
        :href="adData.linkUrl"
        target="_blank"
        rel="noopener"
        @click="trackClick"
        class="absolute inset-0 z-10"
        title="Nhấn để xem chi tiết"
      ></a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['complete'])

const showAd = ref(false)
const adData = ref(null)
const currentTime = ref(0)
const adVideo = ref(null)
const videoLoaded = ref(false)

const skipAfter = computed(() => adData.value?.skipAfter || 5)
const canSkip = computed(() => currentTime.value >= skipAfter.value)
const progress = computed(() => {
  if (!adData.value?.videoDuration) return 0
  return (currentTime.value / adData.value.videoDuration) * 100
})

const getVideoUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${baseUrl}${url}`
}

const onVideoLoaded = () => {
  videoLoaded.value = true
  
  if (adVideo.value) {
    adVideo.value.muted = false
    adVideo.value.play().catch(err => {
      console.warn('Autoplay failed, retrying muted:', err)
      adVideo.value.muted = true
      adVideo.value.play().catch(e => {
        console.error(' Autoplay failed:', e)
      })
    })
  }
}

const onVideoError = (e) => {
  console.error(' Video error:', e)
  skipAd()
}

const onTimeUpdate = () => {
  if (!adVideo.value) return
  currentTime.value = adVideo.value.currentTime
}

const skipAd = async () => {
  console.log('⏭ Skipping ad')
  showAd.value = false
  
  const bannerId = adData.value?._id || adData.value?.id
  
  if (bannerId) {

    // Track view
    try {
      await api.post(`/banners/${bannerId}/view`)
    } catch (e) {
      console.warn('Track view failed', e)
    }
  }
  
  adData.value = null
  currentTime.value = 0
  
  emit('complete')
}

const trackClick = async (e) => {
  if (e.target.closest('button')) {
    e.preventDefault()
    return
  }
  
  const bannerId = adData.value?._id || adData.value?.id
  if (bannerId) {
    try {
      await api.post(`/banners/${bannerId}/click`)
    } catch (e) {
      console.warn('Track click failed', e)
    }
  }
}

const fetchPreRollAd = async () => {
  try {
    console.log(' Fetching pre-roll ad...')
    const res = await api.get('/banners/active', {
      params: { position: 'pre-roll', limit: 1 }
    })
    
    const ads = res?.data?.data || []
    console.log(' Found ads:', ads.length)
    
    if (ads.length > 0 && ads[0].videoUrl) {
      const ad = ads[0]
      
      adData.value = ad
      showAd.value = true
      currentTime.value = 0
      videoLoaded.value = false
      console.log('▶ Playing ad:', ad.title)
    } else {
      console.warn(' No video ad found')
      emit('complete')
    }
  } catch (e) {
    console.error(' Fetch failed:', e)
    emit('complete')
  }
}

watch(() => props.show, (val) => {
  if (val) {
    fetchPreRollAd()
  } else {
    showAd.value = false
    currentTime.value = 0
  }
})

onUnmounted(() => {
  if (adVideo.value) {
    adVideo.value.pause()
    adVideo.value.src = ''
  }
})
</script>