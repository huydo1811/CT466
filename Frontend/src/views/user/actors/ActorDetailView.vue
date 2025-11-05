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