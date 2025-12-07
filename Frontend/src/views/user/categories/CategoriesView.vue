<template>
  <div class="bg-dark-900 min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-b from-dark-800 to-dark-900 py-12 mb-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold text-white mb-2">Thể loại phim</h1>
          <p class="text-gray-300 text-lg">Khám phá bộ sưu tập phim phong phú của chúng tôi theo từng thể loại, từ hành động kịch tính đến tâm lý sâu sắc.</p>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-4 pb-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <p class="text-slate-400 mt-4">Đang tải...</p>
      </div>

      <template v-else>
        <!-- Popular Categories Section -->
        <div class="mb-12" v-if="popularCategories.length">
          <h2 class="text-2xl font-bold text-white mb-6">Thể loại phổ biến</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="category in popularCategories" 
              :key="category.id" 
              class="bg-dark-800 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-primary-500 transition-all"
              @click="viewCategoryDetail(category.slug)"
            >
              <div class="h-32 overflow-hidden relative">
                <img 
                  v-if="category.image"
                  :src="category.image" 
                  :alt="category.name" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div v-else class="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500 text-xs">
                  No Image
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-70"></div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <div class="text-white font-medium text-sm">{{ category.name }}</div>
                  <div class="text-gray-400 text-xs">{{ category.count }} phim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- All Categories Section -->
        <div v-if="categoryGroups.length">
          <h2 class="text-2xl font-bold text-white mb-6">Tất cả thể loại</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div 
              v-for="group in categoryGroups" 
              :key="group.letter" 
              class="bg-dark-800 rounded-xl p-5"
            >
              <h3 class="text-xl font-bold text-primary-500 mb-4">{{ group.letter }}</h3>
              <ul class="space-y-3">
                <li v-for="category in group.categories" :key="category.id">
                  <a 
                    @click="viewCategoryDetail(category.slug)" 
                    class="flex items-center justify-between text-gray-300 hover:text-white cursor-pointer group"
                  >
                    <span class="group-hover:text-primary-500 transition">{{ category.name }}</span>
                    <span class="text-gray-500 text-sm">{{ category.count }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!popularCategories.length && !categoryGroups.length" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <p class="text-slate-400 text-lg">Chưa có thể loại nào</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const loading = ref(false)
const popularCategories = ref([])
const allCategories = ref([])

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https? :\/\//.test(u)) return u
  const apiBase = import.meta.env. VITE_API_BASE || 'http://localhost:3000/api'
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  return `${baseUrl}${u.startsWith('/') ?  u : '/' + u}`
}

const fetchCategories = async () => {
  loading.value = true
  try {
    // Fetch popular categories (top 6 with count)
    const resPopular = await api.get('/categories?withCount=true&limit=6')
    popularCategories.value = (resPopular?.data?.data || []).map(c => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      count: c.movieCount || 0,
      image: getMediaUrl(c.image || '')
    }))

    // Fetch all categories
    const resAll = await api.get('/categories?withCount=true&limit=100')
    allCategories.value = (resAll?.data?.data || []).map(c => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      count: c.movieCount || 0
    }))
  } catch (err) {
    console.error('fetchCategories error', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

// Nhóm các danh mục theo chữ cái đầu tiên
const categoryGroups = computed(() => {
  const groups = []
  const sortedCategories = [...allCategories.value].sort((a, b) => 
    a.name.localeCompare(b.name, 'vi')
  )
  
  let currentLetter = ''
  let currentGroup = null
  
  sortedCategories.forEach(category => {
    const firstLetter = category.name.charAt(0).toUpperCase()
    
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter
      currentGroup = {
        letter: currentLetter,
        categories: []
      }
      groups.push(currentGroup)
    }
    
    currentGroup.categories.push(category)
  })
  
  return groups
})

// Xem chi tiết danh mục
function viewCategoryDetail(slug) {
  router.push({ name: 'category-detail', params: { slug: slug } })
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>