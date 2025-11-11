<template>
  <div class="bg-dark-900 min-h-screen pb-12">
    <div class="container mx-auto px-4 pt-6">
      <h2 class="text-white text-2xl mb-4">Kết quả tìm kiếm: "{{ query }}"</h2>
      <div v-if="loading" class="text-gray-400">Đang tải...</div>
      <div v-else>
        <div v-if="movies.length === 0" class="text-gray-400">Không tìm thấy kết quả</div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="m in movies" :key="m._id || m.id" class="bg-dark-800 rounded overflow-hidden">
            <RouterLink :to="movieLink(m)" class="block">
              <img :src="m.poster || m.image" class="w-full h-48 object-cover" />
              <div class="p-2">
                <div class="text-white font-medium truncate">{{ m.title || m.name }}</div>
                <div class="text-xs text-gray-400">{{ m.year || '' }}</div>
              </div>
            </RouterLink>
          </div>
        </div>

        <div class="flex items-center justify-center mt-6 space-x-2">
          <button class="btn-outline px-3 py-1" :disabled="page<=1" @click="changePage(page-1)">Trước</button>
          <span class="text-gray-300">Trang {{ page }} / {{ totalPages }}</span>
          <button class="btn-outline px-3 py-1" :disabled="page>=totalPages" @click="changePage(page+1)">Sau</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const query = ref(route.query.q || '')
const page = ref(Number(route.query.page) || 1)
const movies = ref([])
const loading = ref(false)
const totalPages = ref(1)

const fetch = async () => {
  const q = (query.value || '').trim()
  if (!q) {
    movies.value = []
    totalPages.value = 1
    return
  }
  loading.value = true
  try {
    const res = await api.get('/movies', { params: { search: q, page: page.value, limit: 24 } })
    // support different response shapes
    const data = res?.data?.data || res?.data || res?.data?.movies || []
    const pagination = res?.data?.pagination || res?.data?.pagination || { currentPage: page.value, totalPages: 1 }
    movies.value = Array.isArray(data) ? data : (data.movies || [])
    totalPages.value = pagination.totalPages || 1
  } catch (e) {
    console.warn('search fetch failed', e)
    movies.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const changePage = (p) => {
  if (p < 1) p = 1
  page.value = p
  router.replace({ name: 'search', query: { q: query.value, page: p } })
  fetch()
}

const movieLink = (m) => {
  const slug = m.slug || m._id || m.id
  return { name: (m.type === 'series' || m.isSeries) ? 'series-detail' : 'movie-detail', params: { slug } }
}

watch(() => route.query.q, (v) => {
  query.value = v || ''
  page.value = Number(route.query.page) || 1
  fetch()
})

onMounted(() => fetch())
</script>

<style scoped>
/* simple styles; reuse project classes */
</style>