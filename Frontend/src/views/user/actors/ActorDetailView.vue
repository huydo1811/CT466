<template>
  <div class="bg-dark-900 min-h-screen pb-12">
    <div class="relative">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-900/10 via-dark-900/80 to-dark-900"></div>
      <div class="container mx-auto px-4 relative">
        <div class="flex flex-col md:flex-row items-start gap-8">
          <!-- Actor image -->
          <div class="w-48 md:w-72 h-auto aspect-[2/3] rounded-xl overflow-hidden border-4 border-dark-800 shadow-2xl flex-shrink-0">
            <img 
              :src="actor.profile" 
              :alt="actor.name"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Actor details -->
          <div class="flex-1 pt-4">
            <h1 class="text-4xl font-bold text-white mb-3">{{ actor.name }}</h1>
            
            <div class="flex flex-wrap gap-y-3 gap-x-8 text-gray-300 mb-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <span>{{ formatDate(actor.birthdate) }}</span>
              </div> 
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <span>{{ actor.birthplace }}</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1H5a1 1 0 000 2h1v1a1 1 0 002 0V9h1a1 1 0 000-2H8V6zm7 6a1 1 0 01.707.293l.707.707a1 1 0 01-1.414 1.414l-.707-.707A1 1 0 0115 15zm-7 0a1 1 0 00-.707.293l-.707.707a1 1 0 101.414 1.414l.707-.707A1 1 0 008 15z" clip-rule="evenodd" />
                </svg>
                <span>{{ actor.nationality }}</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>{{ actor.occupation }}</span>
              </div>
            </div>
            
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-white mb-2">Tiểu sử</h2>
              <p class="text-gray-300 leading-relaxed">{{ actor.biography }}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Filmography Section -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-white mb-6">Phim đã tham gia</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="py-3 px-4 text-left text-gray-400 font-medium">Năm</th>
                <th class="py-3 px-4 text-left text-gray-400 font-medium">Phim</th>
                <th class="py-3 px-4 text-left text-gray-400 font-medium hidden md:table-cell">Đánh giá</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="movie in filmography" :key="movie.id" class="hover:bg-dark-800/50">
                <td class="py-3 px-4 text-gray-300">{{ movie.year }}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-10 h-14 rounded overflow-hidden mr-3 flex-shrink-0">
                      <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover">
                    </div>
                    <div>
                      <RouterLink 
                        v-if="movie && (movie.slug || movie._id || movie.id)"
                        :to="getMediaRoute(movie)"
                        class="text-white hover:text-primary-500 font-medium"
                      >
                        {{ movie.title }}
                      </RouterLink>
                      <span v-else class="text-white/60">{{ movie.title }}</span>
                      <div class="text-xs text-gray-400">{{ movie.genre }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 hidden md:table-cell">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span class="text-white">{{ movie.rating }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const actorSlug = ref(route.params.slug || '')

const loading = ref(false)
const error = ref(null)

const getMediaUrl = (u) => {
  if (!u) return ''
  if (/^data:|^https?:\/\//.test(u)) return u
  
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  
  return `${baseUrl}${u. startsWith('/') ? u : '/' + u}`
}

const actor = ref({
  id: null,
  name: '',
  profile: '',
  backdrop: '',
  birthdate: '',
  age: null,
  birthplace: '',
  nationality: '',
  occupation: '',
  biography: ''
})

const formatDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d)) return String(value)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const filmography = ref([])
const getMediaRoute = (m) => {
  const slug = m?. slug || m?._id || m?.id
  const isSeries = (m?.type && String(m.type).toLowerCase() === 'series') || m?.isSeries
  if (isSeries) return { name: 'series-detail', params: { slug } }
  return { name: 'movie-detail', params: { slug } }
}

const fetchActor = async (slug) => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get(`/actors/slug/${encodeURIComponent(slug)}`)
    const data = res?.data?.data ?? res?. data ?? null
    if (data) {
      actor.value = {
        id: data._id || data.id || '',
        slug: data.slug || slug,
        name: data.name || data.fullName || '',
        profile: getMediaUrl(data.photoUrl || data.profile || data.avatar || ''), 
        backdrop: getMediaUrl(data.backdrop || ''),  
        birthdate: data.birthDate || data. birthdate || '',
        age: data.age ?? null,
        birthplace: data.birthplace || data.placeOfBirth || '',
        nationality: data.nationality || '',
        occupation: data. occupation || data.job || '',
        biography: data.bio || data.biography || ''
      }
    } else {
      error. value = 'Không tìm thấy diễn viên'
    }
  } catch (e) {
    console.error('fetchActor error', e)
    error.value = 'Lỗi khi tải thông tin diễn viên'
  } finally {
    loading.value = false
  }
}

const fetchFilmography = async () => {
  try {
    if (!actor.value.id) { filmography.value = []; return }
    const res = await api.get('/movies', { params: { actor: actor.value.id, limit: 100 } })
    const movies = res?.data?.movies ?? res?.data?.data?.movies ?? res?.data?.data ?? res?.data ?? []
    filmography.value = Array.isArray(movies) ? movies.map(m => ({
      id: m._id || m.id,
      slug: m.slug || m._id || m.id,
      title: m.title || m.name || '',
      poster: getMediaUrl(m.poster || m.image || ''), 
      year: m.year || (m.releaseDate ? new Date(m.releaseDate).getFullYear() : ''),
      genre: (m.categories && m.categories[0]?.name) || (m.genre || ''),
      character: (m.role || m.character) || '',
      rating: (m.rating?. average ??  m.rating) || '',
      type: m.type || (m.isSeries ? 'series' : 'movie')
    })) : []
  } catch (e) {
    console.warn('fetchFilmography failed', e)
    filmography.value = []
  }
}

onMounted(async () => {
  const s = actorSlug.value || route.params.slug
  if (! s) {
    router.replace({ name: 'actors' })
    return
  }
  await fetchActor(s)
  await fetchFilmography()
})

watch(() => route.params.slug, async (v) => {
  actorSlug.value = v || ''
  if (actorSlug.value) {
    await fetchActor(actorSlug.value)
    await fetchFilmography()
  }
})
</script>
<style scoped>
/* Nếu cần thêm styles riêng */
</style>