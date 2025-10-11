<template>
  <div class="bg-dark-900 min-h-screen pb-12">
    <!-- Hero section với ảnh và thông tin cơ bản -->
    <div class="relative pt-20">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-900/10 via-dark-900/80 to-dark-900"></div>
      
      <!-- Background image -->
      <div class="w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          :src="actor.backdrop || 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg'" 
          class="w-full h-full object-cover opacity-40" 
          alt="Background"
        />
      </div>
      
      <div class="container mx-auto px-4 relative -mt-32 md:-mt-40">
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
                <span>{{ actor.birthdate }} ({{ actor.age }} tuổi)</span>
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
            
            <!-- Social Media Links -->
            <div class="flex items-center gap-4">
              <a href="#" class="text-gray-400 hover:text-primary-500 transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.982 4.982 0 002.163-2.723 10.04 10.04 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-500 transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-500 transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072c-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-500 transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
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
                <th class="py-3 px-4 text-left text-gray-400 font-medium">Vai diễn</th>
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
                        :to="{ name: 'movie-detail', params: { id: movie.id } }"
                        class="text-white hover:text-primary-500 font-medium"
                      >
                        {{ movie.title }}
                      </RouterLink>
                      <div class="text-xs text-gray-400">{{ movie.genre }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-300">{{ movie.character }}</td>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const actorId = route.params.id

// Actor data (mẫu) - thực tế sẽ lấy từ API
const actor = ref({
  id: 1,
  name: 'Tom Holland',
  profile: 'https://image.tmdb.org/t/p/w500/bBRlrpJm9XkNSg0YT5LCaxqoFMX.jpg',
  backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
  birthdate: '01/06/1996',
  age: 27,
  birthplace: 'Kingston upon Thames, London, England',
  nationality: 'Anh',
  occupation: 'Diễn viên',
  biography: 'Thomas "Tom" Stanley Holland là một diễn viên và vũ công người Anh. Anh được biết đến với vai Spider-Man trong Vũ trụ Điện ảnh Marvel, bắt đầu từ Captain America: Civil War (2016). Holland đã nhận được Giải BAFTA Rising Star năm 2017. Anh bắt đầu sự nghiệp diễn xuất từ vai chính trong vở nhạc kịch Billy Elliot tại Nhà hát Victoria Palace ở West End từ năm 2008 đến năm 2010. Ngoài các phim Marvel, Holland cũng tham gia các phim như The Impossible (2012), In the Heart of the Sea (2015), The Lost City of Z (2016), The Devil All the Time (2020), Cherry (2021), và Uncharted (2022).'
})

// Filmography data
const filmography = ref([
  {
    id: 101,
    title: 'Spider-Man: No Way Home',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    year: 2021,
    genre: 'Hành động, Phiêu lưu',
    character: 'Peter Parker / Spider-Man',
    rating: 8.2
  },
  {
    id: 102,
    title: 'Cherry',
    poster: 'https://image.tmdb.org/t/p/w500/pwDvkDyaHEU9V7cApQhbcSJMG1w.jpg',
    year: 2021,
    genre: 'Tội phạm, Tâm lý',
    character: 'Cherry',
    rating: 7.0
  },
  {
    id: 103,
    title: 'Spider-Man: Far From Home',
    poster: 'https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg',
    year: 2019,
    genre: 'Hành động, Phiêu lưu',
    character: 'Peter Parker / Spider-Man',
    rating: 7.5
  },
  {
    id: 104,
    title: 'Avengers: Endgame',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    year: 2019,
    genre: 'Hành động, Phiêu lưu',
    character: 'Peter Parker / Spider-Man',
    rating: 8.4
  },
  {
    id: 105,
    title: 'Avengers: Infinity War',
    poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    year: 2018,
    genre: 'Hành động, Phiêu lưu',
    character: 'Peter Parker / Spider-Man',
    rating: 8.3
  },
  {
    id: 106,
    title: 'Spider-Man: Homecoming',
    poster: 'https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg',
    year: 2017,
    genre: 'Hành động, Phiêu lưu',
    character: 'Peter Parker / Spider-Man',
    rating: 7.4
  },
  {
    id: 107,
    title: 'Captain America: Civil War',
    poster: 'https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg',
    year: 2016,
    genre: 'Hành động, Phiêu lưu',
    character: 'Peter Parker / Spider-Man',
    rating: 7.8
  },
  {
    id: 108,
    title: 'The Impossible',
    poster: 'https://image.tmdb.org/t/p/w500/jooNRqCzwvlYYgGPMRZOchu0lfc.jpg',
    year: 2012,
    genre: 'Chính kịch, Thảm họa',
    character: 'Lucas Bennett',
    rating: 7.3
  }
])


onMounted(() => {
  // Trong thực tế, bạn sẽ gọi API để lấy thông tin diễn viên theo ID
  console.log('Fetching actor info for ID:', actorId)
})
</script>

<style scoped>
/* Nếu cần thêm styles riêng */
</style>