<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

// Featured movie data (sẽ fetch từ API sau)
const featuredMovie = ref({
  title: "Spider-Man: No Way Home",
  description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man.",
  backdrop: "https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
  poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  rating: 8.4,
  year: 2021,
  duration: "148 min",
  genres: ["Action", "Adventure", "Fantasy"]
})

const popularCategories = ref([
  { id: 1, name: 'Hành động', slug: 'hanh-dong', count: 245, image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
  { id: 2, name: 'Tình cảm', slug: 'tinh-cam', count: 189, image: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg' },
  { id: 3, name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong', count: 167, image: 'https://image.tmdb.org/t/p/w500/zFR8amwiEKuLTHSI2JYpyeSuzQL.jpg' },
  { id: 4, name: 'Kinh dị', slug: 'kinh-di', count: 156, image: 'https://image.tmdb.org/t/p/w500/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg' },
  { id: 5, name: 'Hài', slug: 'hai', count: 205, image: 'https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg' },
  { id: 6, name: 'Phiêu lưu', slug: 'phieu-luu', count: 178, image: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg' }
])

// Mock movies data
const latestMovies = ref([
  {
    id: 1,
    title: "The Batman",
    poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    rating: 7.8,
    year: 2022
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    rating: 8.3,
    year: 2022
  },
  {
    id: 3,
    title: "Doctor Strange 2",
    poster: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    rating: 6.9,
    year: 2022
  },
  {
    id: 4,
    title: "Minions: The Rise of Gru",
    poster: "https://image.tmdb.org/t/p/w500/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg",
    rating: 6.5,
    year: 2022
  },
  {
    id: 5,
    title: "Thor: Love and Thunder",
    poster: "https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
    rating: 6.2,
    year: 2022
  },
  {
    id: 6,
    title: "Black Panther 2",
    poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    rating: 6.7,
    year: 2022
  }
])

const trendingMovies = ref([
  {
    id: 7,
    title: "Avatar 2",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    rating: 7.6,
    year: 2022
  },
  {
    id: 8,
    title: "Stranger Things 4",
    poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    rating: 8.7,
    year: 2022
  },
  {
    id: 9,
    title: "The Umbrella Academy",
    poster: "https://image.tmdb.org/t/p/w500/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg",
    rating: 7.9,
    year: 2022
  },
  {
    id: 10,
    title: "Wednesday",
    poster: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    rating: 8.1,
    year: 2022
  },
  {
    id: 11,
    title: "House of Dragon",
    poster: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    rating: 8.4,
    year: 2022
  },
  {
    id: 12,
    title: "The Rings of Power",
    poster: "https://image.tmdb.org/t/p/w500/mYLOqiStMxDK3fYZFirgrMt8z5d.jpg",
    rating: 6.9,
    year: 2022
  }
])

// ========== Ranking (Tuần/Tháng) ==========
const activePeriod = ref('week')
const weekTop = ref([
  { id: 101, title: 'John Wick 4', poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', rating: 7.8, year: 2023 },
  { id: 102, title: 'Oppenheimer', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', rating: 8.6, year: 2023 },
  { id: 103, title: 'Dune: Part Two', poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', rating: 8.3, year: 2024 },
  { id: 104, title: 'Deadpool & Wolverine', poster: 'https://image.tmdb.org/t/p/w500/qbWtbxwZqFqT4rVY6zK9XH8VE9Q.jpg', rating: 8.0, year: 2024 },
  { id: 105, title: 'Inside Out 2', poster: 'https://image.tmdb.org/t/p/w500/igmE8YQW2tYwA1G8Jrj7r3P1w7G.jpg', rating: 7.9, year: 2024 }
])
const monthTop = ref([
  { id: 201, title: 'Avatar: The Way of Water', poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', rating: 7.6, year: 2022 },
  { id: 202, title: 'The Batman', poster: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', rating: 7.8, year: 2022 },
  { id: 203, title: 'Top Gun: Maverick', poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', rating: 8.3, year: 2022 },
  { id: 204, title: 'Mission: Impossible 7', poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg', rating: 7.6, year: 2023 },
  { id: 205, title: 'Godzilla Minus One', poster: 'https://image.tmdb.org/t/p/w500/hYbT7Z2YQZ2Vq6KYFAsktwVDqve.jpg', rating: 8.0, year: 2023 }
])
const rankedMovies = computed(() =>
  activePeriod.value === 'week' ? weekTop.value : monthTop.value
)

// ========== Explore by Category ==========
const categoriesTab = ref([
  { name: 'Hành động', slug: 'hanh-dong' },
  { name: 'Tâm lý', slug: 'tam-ly' },
  { name: 'Kinh dị', slug: 'kinh-di' },
  { name: 'Hoạt hình', slug: 'hoat-hinh' }
])
const selectedCategory = ref('hanh-dong')
const categoryData = ref({
  'hanh-dong': [
    { id: 301, title: 'Extraction 2', poster: 'https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg', rating: 7.0, year: 2023 },
    { id: 302, title: 'The Beekeeper', poster: 'https://image.tmdb.org/t/p/w500/A7EByudX0eOzlkQ2FIbogzyazm2.jpg', rating: 7.1, year: 2024 },
    { id: 303, title: 'Nobody', poster: 'https://image.tmdb.org/t/p/w500/oBgWY00bEFeZ9N25wWVyuQddbAo.jpg', rating: 7.4, year: 2021 },
    { id: 304, title: 'Kingsman', poster: 'https://image.tmdb.org/t/p/w500/ay7xwXn1G9fzX9TUBlkGA584rGi.jpg', rating: 7.7, year: 2014 }
  ],
  'tam-ly': [
    { id: 311, title: 'La La Land', poster: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', rating: 8.0, year: 2016 },
    { id: 312, title: 'A Star Is Born', poster: 'https://image.tmdb.org/t/p/w500/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg', rating: 7.5, year: 2018 },
    { id: 313, title: 'Marriage Story', poster: 'https://image.tmdb.org/t/p/w500/pZekG6xabTmZxjmYw10wN84Hp8d.jpg', rating: 7.8, year: 2019 },
    { id: 314, title: 'CODA', poster: 'https://image.tmdb.org/t/p/w500/nygOUcBKPHFTbxsD5AA0jLWgMBM.jpg', rating: 8.0, year: 2021 }
  ],
  'kinh-di': [
    { id: 321, title: 'A Quiet Place', poster: 'https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg', rating: 7.4, year: 2018 },
    { id: 322, title: 'Hereditary', poster: 'https://image.tmdb.org/t/p/w500/p9fmuz2Oj3HtEJEqbIwkFGUhVXD.jpg', rating: 7.3, year: 2018 },
    { id: 323, title: 'It', poster: 'https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg', rating: 7.2, year: 2017 },
    { id: 324, title: 'Talk to Me', poster: 'https://image.tmdb.org/t/p/w500/kz7xJLowhuB2bXl70cSekK1dg4G.jpg', rating: 7.1, year: 2023 }
  ],
  'hoat-hinh': [
    { id: 331, title: 'Inside Out 2', poster: 'https://image.tmdb.org/t/p/w500/igmE8YQW2tYwA1G8Jrj7r3P1w7G.jpg', rating: 7.9, year: 2024 },
    { id: 332, title: 'Spider-Verse', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: 8.6, year: 2023 },
    { id: 333, title: 'Soul', poster: 'https://image.tmdb.org/t/p/w500/kf456ZqeC45XTvo6W9pW5clYKfQ.jpg', rating: 8.1, year: 2020 },
    { id: 334, title: 'Coco', poster: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg', rating: 8.2, year: 2017 }
  ]
})
const categoryMovies = computed(() => categoryData.value[selectedCategory.value] || [])

// ========== Stats (count-up) ==========
const stats = ref({ movies: 12500, series: 2300, views: 12000000, users: 450000 })
const statDisplay = ref({ movies: 0, series: 0, views: 0, users: 0 })
function animateStat(key, to) {
  const duration = 800
  const step = Math.max(1, Math.floor(to / 60))
  const timer = setInterval(() => {
    statDisplay.value[key] += step
    if (statDisplay.value[key] >= to) {
      statDisplay.value[key] = to
      clearInterval(timer)
    }
  }, duration / Math.ceil(to / step))
}
onMounted(() => {
  Object.entries(stats.value).forEach(([k, v]) => animateStat(k, v))
})



// ADD: Popular Actors
const popularActors = ref([
  { id: 1, name: 'Tom Holland', avatar: 'https://image.tmdb.org/t/p/w185/bBRlrpJm9XkNSg0YT5LCaxqoFMX.jpg' },
  { id: 2, name: 'Zendaya', avatar: 'https://image.tmdb.org/t/p/w185/so3Gqz7QZla6lGz8mB8ZpV6EoV5.jpg' },
  { id: 3, name: 'Benedict Cumberbatch', avatar: 'https://image.tmdb.org/t/p/w185/4P0hQjgqK2p6q2UoSxHZbRjlW6r.jpg' },
  { id: 4, name: 'Robert Downey Jr.', avatar: 'https://image.tmdb.org/t/p/w185/1YjdSym1jTG7xjHSI0yGGWEsw5i.jpg' },
  { id: 5, name: 'Chris Evans', avatar: 'https://image.tmdb.org/t/p/w185/3bOGNsHlrswhyW79uvIHH1V43JI.jpg' },
  { id: 6, name: 'Scarlett Johansson', avatar: 'https://image.tmdb.org/t/p/w185/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg' }
])

// ADD: Editor Collections (curated blocks)
const editorCollections = ref([
  { id: 'marvel', title: 'Vũ trụ Marvel', cover: 'https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg', count: 28 },
  { id: 'dc', title: 'Vũ trụ DC', cover: 'https://image.tmdb.org/t/p/w780/rlNnwObbMu5G2FaOUlacnUIdIIA.jpg', count: 18 },
  { id: 'oscar', title: 'Phim đoạt giải Oscar', cover: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', count: 35 },
  { id: 'family', title: 'Phim hoạt hình', cover: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', count: 22 }
])

</script>

<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Hero Section - Netflix Style -->
    <section class="relative min-h-[80vh] flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          :src="featuredMovie.backdrop"
          alt="Featured Movie"
          class="w-full h-full object-cover object-[72%_center]"  
        />
        <!-- Overlay trái mỏng để không tạo “cột đen” -->
        <div class="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>
        <!-- Nhẹ bên phải (tùy chọn) -->
        <div class="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-black/30 to-transparent pointer-events-none"></div>
        <!-- Fade đáy -->
        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-900/90 to-transparent pointer-events-none"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container">
        <div class="max-w-3xl">
          <!-- Movie Badge -->
          <div class="inline-flex items-center space-x-3 mb-6">
            <span class="px-3 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full animate-pulse">
              FEATURED
            </span>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{{ featuredMovie.rating }}</span>
              </span>
              <span>•</span>
              <span>{{ featuredMovie.year }}</span>
              <span>•</span>
              <span>{{ featuredMovie.duration }}</span>
            </div>
          </div>

          <!-- Movie Title -->
          <h1 class="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            {{ featuredMovie.title }}
          </h1>

          <!-- Movie Description -->
          <p class="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
            {{ featuredMovie.description }}
          </p>

          <!-- Genres -->
          <div class="flex flex-wrap gap-2 mb-8">
            <span 
              v-for="genre in featuredMovie.genres" 
              :key="genre"
              class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
            >
              {{ genre }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink 
              :to="{ name: 'movie-detail', params: { id: '1' } }" 
              class="btn-primary text-lg px-8 py-4 shadow-glow"
            >
              <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Xem ngay
            </RouterLink>
            
            <RouterLink 
              :to="{ name: 'movie-detail', params: { id: '1' } }" 
              class="btn-secondary text-lg px-8 py-4 glass"
            >
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Thông tin thêm
            </RouterLink>
            
            <button class="btn-outline text-lg px-8 py-4">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Yêu thích
            </button>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div class="animate-bounce">
          <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Latest Movies Section -->
    <section class="py-16 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Phim mới nhất</h1>
            <p class="text-sm text-gray-400">Những bộ phim hot nhất hiện tại</p>
          </div>
          <button class="btn-outline py-2 px-4 text-sm sm:text-base">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Carousel cho mobile -->
        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:hidden">
          <div class="flex gap-4">
            <RouterLink
              v-for="movie in latestMovies" 
              :key="movie.id"
              :to="{ name: 'movie-detail', params: { id: movie.id } }"
              class="movie-card group flex-shrink-0 w-40"
            >
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-gray-800">
                <img 
                  :src="movie.poster"
                  :alt="movie.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span class="text-yellow-400 text-xs font-semibold">{{ movie.rating }}</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="text-white font-semibold text-xs mb-1 truncate">{{ movie.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ movie.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {{ movie.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Grid cho PC -->
        <div class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink
            v-for="movie in latestMovies" 
            :key="movie.id"
            :to="{ name: 'movie-detail', params: { id: movie.id } }"
            class="movie-card group"
          >
            <!-- Movie Poster -->
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-48 bg-gray-800">
              <img 
                :src="movie.poster"
                :alt="movie.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <!-- Play button -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <button class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-primary-600">
                    <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>

                <!-- Movie info -->
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-semibold text-sm mb-1 truncate">{{ movie.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ movie.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {{ movie.rating }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Rating badge -->
              <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                <span class="text-yellow-400 text-xs font-semibold">{{ movie.rating }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Trending Movies Section -->
    <section class="py-12 bg-gradient-to-b from-dark-800 to-dark-900">
      <div class="container">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Xu hướng</h1>
            <p class="text-sm text-gray-400">Phim đang được xem nhiều nhất</p>
          </div>
          <button class="btn-outline py-2 px-4 text-sm sm:text-base">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Horizontal Scroll -->
        <div class="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          <RouterLink 
            v-for="(movie, index) in trendingMovies" 
            :key="movie.id"
            :to="{ name: 'movie-detail', params: { id: movie.id } }"
            class="movie-card group flex-shrink-0 relative"
          >
            <!-- Trending Number -->
            <div class="absolute -left-4 -top-2 z-10">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {{ index + 1 }}
              </div>
            </div>

            <!-- Movie Poster -->
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-40 bg-gray-800">
              <img 
                :src="movie.poster"
                :alt="movie.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="text-white font-semibold text-xs mb-1 truncate">{{ movie.title }}</h3>
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ movie.year }}</span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {{ movie.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Ranking: Tuần / Tháng -->
    <section class="py-12 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Bảng xếp hạng</h1>
            <p class="text-sm text-gray-400">Top phim theo tuần hoặc tháng</p>
          </div>
          <div class="inline-flex rounded-xl bg-gray-800/60 p-1 border border-gray-700">
            <button
              :class="['px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm', activePeriod==='week' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white']"
              @click="activePeriod='week'">Tuần</button>
            <button
              :class="['px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm', activePeriod==='month' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:text-white']"
              @click="activePeriod='month'">Tháng</button>
          </div>
        </div>
        
        <!-- Carousel cho mobile, grid cho PC -->
        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:hidden">
          <div class="flex gap-4">
            <RouterLink 
              v-for="(m,i) in rankedMovies" 
              :key="m.id"
              :to="{ name: 'movie-detail', params: { id: m.id } }"
              class="movie-card group flex-shrink-0 relative w-48"
            >
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-gray-800">
                <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div class="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/70 text-white text-sm font-bold grid place-items-center">{{ i+1 }}</div>
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div class="text-white text-xs font-semibold truncate">{{ m.title }}</div>
                  <div class="text-gray-300 text-xs flex justify-between">
                    <span>{{ m.year }}</span>
                    <span class="text-yellow-400">★ {{ m.rating }}</span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
        
        <!-- Grid cho PC -->
        <div class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink 
            v-for="(m,i) in rankedMovies" 
            :key="m.id"
            :to="{ name: 'movie-detail', params: { id: m.id } }"
            class="movie-card group relative"
          >
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-48 bg-gray-800">
              <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/70 text-white text-sm font-bold grid place-items-center">{{ i+1 }}</div>
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div class="text-white text-sm font-semibold truncate">{{ m.title }}</div>
                <div class="text-gray-300 text-xs flex justify-between">
                  <span>{{ m.year }}</span>
                  <span class="text-yellow-400">★ {{ m.rating }}</span>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- Explore by Category (Tabs) -->
    <section class="py-12 bg-gradient-to-b from-dark-800 to-dark-900">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Khám phá theo thể loại</h1>
        </div>

        <!-- Tabs chuyển xuống dưới h1 -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="c in categoriesTab" :key="c.slug"
            :class="['px-4 py-2 rounded-lg text-sm border', selectedCategory===c.slug ? 'bg-primary-600 border-primary-500 text-white' : 'border-gray-700 text-gray-300 hover:bg-gray-800']"
            @click="selectedCategory=c.slug">
            {{ c.name }}
          </button>
        </div>

        <!-- Carousel cho mobile -->
        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:hidden">
          <div class="flex gap-4">
            <RouterLink 
              v-for="m in categoryMovies" 
              :key="m.id"
              :to="{ name: 'movie-detail', params: { id: m.id } }"
              class="movie-card group flex-shrink-0 w-40"
            >
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-full bg-gray-800">
                <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div class="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                  <span class="text-yellow-400 text-xs font-semibold">{{ m.rating }}</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div class="text-white text-sm font-semibold truncate">{{ m.title }}</div>
                  <div class="text-gray-300 text-xs">{{ m.year }}</div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Grid cho PC -->
        <div class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <RouterLink 
            v-for="m in categoryMovies" 
            :key="m.id"
            :to="{ name: 'movie-detail', params: { id: m.id } }"
            class="movie-card group"
          >
            <div class="relative overflow-hidden rounded-xl aspect-[2/3] w-48 bg-gray-800">
              <img :src="m.poster" :alt="m.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                <span class="text-yellow-400 text-xs font-semibold">{{ m.rating }}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div class="text-white text-sm font-semibold truncate">{{ m.title }}</div>
                <div class="text-gray-300 text-xs">{{ m.year }}</div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
    
    <section class="py-12 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Khám phá thể loại</h1>
            <p class="text-sm text-gray-400">Tìm phim yêu thích theo thể loại</p>
          </div>
          <RouterLink :to="{ name: 'categories' }" class="btn-outline py-2 px-4 text-sm sm:text-base">
            Xem tất cả
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <RouterLink 
              v-for="category in popularCategories" 
              :key="category.id"
              :to="{ name: 'movies', query: { category: category.slug } }"
              class="relative rounded-xl overflow-hidden aspect-[2/3] w-40 group"
            >
            <img 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-white text-lg font-bold">{{ category.name }}</h3>
              <p class="text-gray-300 text-sm">{{ category.count }} phim</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>


    <!-- NEW: Popular Actors (horizontal) -->
    <section class="py-12 bg-gradient-to-b from-dark-800 to-dark-900">
      <div class="container">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Diễn viên nổi bật</h1>
            <p class="text-sm text-gray-400">Theo dõi các gương mặt được yêu thích</p>
          </div>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          <div v-for="a in popularActors" :key="a.id" class="flex-shrink-0 w-40">
            <div class="relative w-40 h-40 rounded-full overflow-hidden ring-2 ring-gray-800 hover:ring-primary-600 transition">
              <img :src="a.avatar" :alt="a.name" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="mt-3 text-center text-white font-medium truncate">{{ a.name }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW: Editor Collections -->
    <section class="py-12 bg-gradient-to-b from-dark-900 to-dark-800">
      <div class="container">
        <div class="mb-8">
          <h1 class="text-2xl sm:text-3xl font-semibold text-red-500">Bộ sưu tập đề xuất</h1>
          <p class="text-sm text-gray-400">Chủ đề do biên tập viên tuyển chọn</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="c in editorCollections" :key="c.id" class="relative group rounded-2xl overflow-hidden border border-gray-800">
            <img :src="c.cover" :alt="c.title" class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <div class="text-white font-semibold text-lg">{{ c.title }}</div>
              <div class="text-gray-300 text-sm">{{ c.count }} phim</div>
            </div>
          </div>
        </div>
      </div>
    </section>
        <!-- Stats -->
    <section class="py-16 bg-gradient-to-r from-primary-500/10 via-red-500/10 to-primary-500/10">
      <div class="container grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.movies.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Phim lẻ</div>
        </div>
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.series.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Phim bộ</div>
        </div>
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.views.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Lượt xem</div>
        </div>
        <div class="glass-dark rounded-2xl p-6 text-center border border-gray-700">
          <div class="text-3xl md:text-4xl font-extrabold text-gradient">{{ statDisplay.users.toLocaleString() }}</div>
          <div class="text-gray-300 mt-1">Người dùng</div>
        </div>
      </div>
    </section>
</div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
