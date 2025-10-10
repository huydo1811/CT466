<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Thêm router
const router = useRouter()

// Trailer modal state
const showTrailer = ref(false)

// Tabs state
const activeTab = ref('overview')

// Get movie id from route params (sẽ dùng sau khi có API)
// const movieId = route.params.id

// Dummy data - sẽ thay bằng API call sau
const movie = ref({
  id: 1,
  title: "Spider-Man: No Way Home",
  tagline: "The Multiverse unleashed.",
  description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man. The spell goes horribly wrong and shatters the multiverse, bringing in monstrous villains that could destroy the world.",
  backdrop: "https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
  poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  rating: 8.4,
  voteCount: 14872,
  year: 2021,
  releaseDate: "17/12/2021",
  duration: "148 phút",
  trailerKey: "JfVOs4VSpmA", // YouTube video ID
  genres: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
  countries: ["Mỹ"],
  languages: ["Tiếng Anh"],
  director: "Jon Watts",
  budget: "$200,000,000",
  boxOffice: "$1,921,847,111",
  status: "Đã phát hành",
  ageRating: "PG-13",
  productionCompanies: ["Marvel Studios", "Columbia Pictures", "Pascal Pictures"],
  
  // Cast
  cast: [
    { id: 1, name: "Tom Holland", character: "Peter Parker / Spider-Man", image: "https://image.tmdb.org/t/p/w185/bBRlrpJm9XkNSg0YT5LCaxqoFMX.jpg" },
    { id: 2, name: "Zendaya", character: "Michelle 'MJ' Jones", image: "https://image.tmdb.org/t/p/w185/so3Gqz7QZla6lGz8mB8ZpV6EoV5.jpg" },
    { id: 3, name: "Benedict Cumberbatch", character: "Dr. Stephen Strange", image: "https://image.tmdb.org/t/p/w185/fBEucxECxGLKVHBznO0qHtCGiMO.jpg" },
    { id: 4, name: "Jacob Batalon", character: "Ned Leeds", image: "https://image.tmdb.org/t/p/w185/53YhaL4xw4Sb1ssoHkeSSBaO29c.jpg" },
    { id: 5, name: "Jamie Foxx", character: "Max Dillon / Electro", image: "https://image.tmdb.org/t/p/w185/hPwCMEq6jLAidsXGX54CMIoFZdF.jpg" },
    { id: 6, name: "Willem Dafoe", character: "Norman Osborn / Green Goblin", image: "https://image.tmdb.org/t/p/w185/ui8e4sgZAwMPi3hzEO53jyBJF9B.jpg" },
  ],
  
  // Reviews
  reviews: [
    { 
      id: 101, 
      author: "MovieFan2023", 
      rating: 9, 
      date: "20/12/2021", 
      content: "Tuyệt vời! Phim đã tạo nên cột mốc quan trọng cho vũ trụ Marvel. Đặc biệt là màn tái xuất của các nhân vật từ loạt phim Spider-Man trước đây." 
    },
    { 
      id: 102, 
      author: "SpideyLover", 
      rating: 10, 
      date: "25/12/2021", 
      content: "Không thể tin được! Đây là bộ phim Spider-Man hay nhất từ trước đến nay. Kịch bản xuất sắc, diễn xuất tuyệt vời và các cảnh hành động mãn nhãn." 
    },
    { 
      id: 103, 
      author: "MarvelCritic", 
      rating: 7, 
      date: "03/01/2022", 
      content: "Mặc dù có nhiều điểm sáng, phim vẫn tồn tại một số lỗ hổng về mặt kịch bản. Tuy nhiên, các màn tái xuất vẫn đủ làm người hâm mộ hài lòng." 
    }
  ],
  
  // Similar movies
  similar: [
    { id: 201, title: "Doctor Strange in the Multiverse of Madness", poster: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg", year: 2022, rating: 6.9 },
    { id: 202, title: "Spider-Man: Homecoming", poster: "https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg", year: 2017, rating: 7.4 },
    { id: 203, title: "Spider-Man: Far From Home", poster: "https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg", year: 2019, rating: 7.5 },
    { id: 204, title: "The Amazing Spider-Man", poster: "https://image.tmdb.org/t/p/w500/fSbqPbqXa7ePo8bcnZYN9AHv6zA.jpg", year: 2012, rating: 6.7 },
    { id: 205, title: "Spider-Man", poster: "https://image.tmdb.org/t/p/w500/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg", year: 2002, rating: 7.3 },
    { id: 206, title: "Venom: Let There Be Carnage", poster: "https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg", year: 2021, rating: 6.8 },
  ]
})

// Get movie function - sẽ sử dụng khi có API
// async function getMovie(id) {
//   try {
//     // const response = await fetch(`/api/movies/${id}`)
//     // movie.value = await response.json()
//   } catch (error) {
//     console.error('Error fetching movie:', error)
//   }
// }

// Handle watching movie
function watchMovie() {
  router.push({ name: 'watch-movie', params: { id: movie.value.id } })
}

// Toggle trailer modal
function toggleTrailer() {
  showTrailer.value = !showTrailer.value
}

// onMounted(() => {
//   getMovie(movieId)
// })
</script>

<template>
  <div class="bg-dark-900 min-h-screen pb-20">
    <!-- Hero Section with Backdrop -->
    <div class="relative h-[75vh] overflow-hidden">
      <!-- Backdrop Image -->
      <div class="absolute inset-0">
        <img 
          :src="movie.backdrop" 
          :alt="movie.title"
          class="w-full h-full object-cover object-center"
        />
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
      </div>

      <!-- Movie Info -->
      <div class="container relative h-full flex items-end py-16">
        <div class="flex flex-col md:flex-row gap-8 w-full">
          <!-- Poster -->
          <div class="w-64 flex-shrink-0">
            <div class="rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl aspect-[2/3] bg-gray-800">
              <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1">
            <div class="flex flex-wrap gap-3 mb-2">
              <span v-for="genre in movie.genres" :key="genre" 
                class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                {{ genre }}
              </span>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">{{ movie.title }}</h1>
            <p class="text-lg text-gray-300 italic mb-4">{{ movie.tagline }}</p>
            
            <div class="flex items-center gap-4 mb-6 text-sm text-gray-300 flex-wrap">
              <div class="flex items-center">
                <div class="flex items-center text-yellow-400 mr-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="font-bold">{{ movie.rating }}</span>
                </div>
                <span class="text-gray-500">/10 ({{ movie.voteCount.toLocaleString() }} đánh giá)</span>
              </div>
              <div class="flex items-center">
                <span>{{ movie.releaseDate }}</span>
              </div>
              <div class="flex items-center">
                <span>{{ movie.duration }}</span>
              </div>
              <div class="flex items-center">
                <span>{{ movie.ageRating }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 mb-6">
              <button @click="watchMovie" class="btn-primary py-3 px-6 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                </svg>
                Xem phim
              </button>
              <button @click="toggleTrailer" class="btn-secondary py-3 px-6 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Xem Trailer
              </button>
              <button class="btn-outline py-3 px-6 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                Yêu thích
              </button>
              <button class="btn-outline py-3 px-6 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trailer Modal -->
    <div v-if="showTrailer" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" @click="showTrailer = false">
      <div class="relative max-w-5xl w-full aspect-video rounded-xl overflow-hidden shadow-2xl" @click.stop>
        <button @click="showTrailer = false" class="absolute top-3 right-3 z-50 bg-black/60 text-white p-2 rounded-full hover:bg-black/80">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <iframe 
          :src="`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&rel=0`" 
          frameborder="0" 
          class="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="container pt-6">
      <div class="flex border-b border-gray-800 mb-6 overflow-x-auto scrollbar-hide">
        <button 
          @click="activeTab = 'overview'" 
          :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'overview' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">
          Tổng quan
        </button>
        <button 
          @click="activeTab = 'cast'" 
          :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'cast' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">
          Diễn viên
        </button>
        <button 
          @click="activeTab = 'reviews'" 
          :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'reviews' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">
          Đánh giá <span class="text-gray-500">({{ movie.reviews.length }})</span>
        </button>
        <button 
          @click="activeTab = 'similar'" 
          :class="['px-6 py-3 font-medium whitespace-nowrap', activeTab === 'similar' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white']">
          Phim tương tự
        </button>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Synopsis -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold text-white mb-4">Nội dung phim</h2>
            <p class="text-gray-300 leading-relaxed mb-8 text-lg">{{ movie.description }}</p>

            <h2 class="text-2xl font-bold text-white mb-4">Trailer chính thức</h2>
            <div class="aspect-video rounded-xl overflow-hidden mb-8 bg-gray-800">
              <iframe 
                :src="`https://www.youtube.com/embed/${movie.trailerKey}?rel=0`" 
                frameborder="0" 
                class="w-full h-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            </div>

            <!-- Production Companies -->
            <h2 class="text-2xl font-bold text-white mb-4">Nhà sản xuất</h2>
            <div class="flex flex-wrap gap-6 mb-8">
              <div v-for="company in movie.productionCompanies" :key="company" class="py-3 px-5 bg-dark-800 border border-gray-700 rounded-xl text-white">
                {{ company }}
              </div>
            </div>
          </div>

          <!-- Right Column - Details -->
          <div>
            <div class="bg-dark-800 border border-gray-800 rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Thông tin phim</h2>
              
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-400">Đạo diễn</span>
                  <span class="text-white text-right">{{ movie.director }}</span>
                </div>
                <div class="border-b border-gray-700"></div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Ngày phát hành</span>
                  <span class="text-white text-right">{{ movie.releaseDate }}</span>
                </div>
                <div class="border-b border-gray-700"></div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Thời lượng</span>
                  <span class="text-white text-right">{{ movie.duration }}</span>
                </div>
                <div class="border-b border-gray-700"></div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Ngôn ngữ</span>
                  <span class="text-white text-right">{{ movie.languages.join(', ') }}</span>
                </div>
                <div class="border-b border-gray-700"></div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Quốc gia</span>
                  <span class="text-white text-right">{{ movie.countries.join(', ') }}</span>
                </div>
                <div class="border-b border-gray-700"></div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Đánh giá</span>
                  <span class="text-white text-right">{{ movie.ageRating }}</span>
                </div>
                <div class="border-b border-gray-700"></div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Ngân sách</span>
                  <span class="text-white text-right">{{ movie.budget }}</span>
                </div>
                <div class="border-b border-gray-700"></div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Doanh thu</span>
                  <span class="text-white text-right">{{ movie.boxOffice }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cast Tab -->
        <div v-else-if="activeTab === 'cast'">
          <h2 class="text-2xl font-bold text-white mb-6">Diễn viên</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div v-for="actor in movie.cast" :key="actor.id" class="bg-dark-800 border border-gray-800 rounded-xl overflow-hidden group">
              <div class="aspect-[2/3] overflow-hidden bg-gray-700">
                <img :src="actor.image" :alt="actor.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div class="p-4">
                <h3 class="text-white font-medium truncate">{{ actor.name }}</h3>
                <p class="text-gray-400 text-sm truncate">{{ actor.character }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-else-if="activeTab === 'reviews'">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-white">Đánh giá từ người dùng</h2>
            <button class="btn-outline py-2 px-4">Viết đánh giá</button>
          </div>
          
          <div class="space-y-6">
            <div v-for="review in movie.reviews" :key="review.id" class="bg-dark-800 border border-gray-800 rounded-xl p-6">
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                    {{ review.author.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-3">
                    <h4 class="text-white font-medium">{{ review.author }}</h4>
                    <p class="text-gray-400 text-sm">{{ review.date }}</p>
                  </div>
                </div>
                <div class="flex items-center px-3 py-1 bg-yellow-400/10 rounded-lg">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-white font-medium">{{ review.rating }}/10</span>
                </div>
              </div>
              <p class="text-gray-300">{{ review.content }}</p>
            </div>
          </div>
        </div>

        <!-- Similar Movies Tab -->
        <div v-else-if="activeTab === 'similar'">
          <h2 class="text-2xl font-bold text-white mb-6">Phim tương tự</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div v-for="movie in movie.similar" :key="movie.id" class="movie-card group">
              <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
                <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span class="text-yellow-400 text-xs font-semibold">{{ movie.rating }}</span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                  <div class="p-4 w-full">
                    <button class="w-full py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm transition">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <h3 class="text-white font-medium truncate">{{ movie.title }}</h3>
                <p class="text-gray-400 text-sm">{{ movie.year }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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