<template>
  <div class="bg-dark-900 min-h-screen pt-20 pb-16">
    <!-- Hero/Banner Section -->
    <div class="relative bg-gradient-to-b from-dark-800 to-dark-900 py-12 mb-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold text-white mb-2">Diễn viên</h1>
          <p class="text-gray-300 text-lg">Khám phá các ngôi sao điện ảnh từ khắp nơi trên thế giới, từ những tài năng mới nổi đến các huyền thoại màn bạc với thông tin chi tiết và phim tiêu biểu.</p>
        </div>
      </div>
      <!-- Decorative element -->
      <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none">
        <svg width="400" height="150" viewBox="0 0 400 150" fill="none">
          <circle cx="300" cy="75" r="50" stroke="white" stroke-width="1" fill="none"/>
          <circle cx="300" cy="75" r="35" stroke="white" stroke-width="1" fill="none"/>
          <path d="M250,75 L350,75" stroke="white" stroke-width="1"/>
          <path d="M300,25 L300,125" stroke="white" stroke-width="1"/>
        </svg>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- Search and filters -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div class="relative lg:max-w-md w-full">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm diễn viên..."
            class="w-full bg-dark-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            @input="handleSearch"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Filters -->
          <button 
            @click="showFilters = !showFilters" 
            class="flex items-center bg-dark-800 text-white border border-gray-700 rounded-lg px-3 py-2 hover:bg-dark-700 transition"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
            <span v-if="hasActiveFilters" class="ml-2 w-2 h-2 rounded-full bg-primary-500"></span>
          </button>
          
          <!-- Sort dropdown -->
          <span class="text-gray-400 whitespace-nowrap">Sắp xếp:</span>
          <select 
            v-model="sortBy" 
            @change="applySorting"
            class="bg-dark-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="nameAZ">Tên A-Z</option>
            <option value="nameZA">Tên Z-A</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      <!-- Filter Modal -->
      <div 
        v-if="showFilters" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-start justify-center pt-20 pb-6 px-4"
        @click.self="showFilters = false"
      >
        <div class="bg-dark-800 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fadeIn">
          <div class="p-4 bg-gradient-to-r from-primary-600/50 to-red-600/50 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-white">Lọc diễn viên</h2>
            <button @click="showFilters = false" class="text-white hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Quốc gia -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Quốc tịch</label>
                <select 
                  v-model="filters.nationality" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả quốc tịch</option>
                  <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.id">
                    {{ nationality.name }}
                  </option>
                </select>
              </div>

              <!-- Thể loại -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Thể loại phim</label>
                <select 
                  v-model="filters.genre" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả thể loại</option>
                  <option v-for="genre in genres" :key="genre.id" :value="genre.slug">
                    {{ genre.name }}
                  </option>
                </select>
              </div>

              <!-- Giới tính -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Giới tính</label>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="filters.gender = 'male'"
                    :class="[
                      'py-2 px-4 rounded-lg border', 
                      filters.gender === 'male' 
                        ? 'bg-primary-600 border-primary-500 text-white' 
                        : 'bg-dark-700 border-gray-600 text-gray-300 hover:bg-dark-600'
                    ]"
                  >
                    Nam
                  </button>
                  <button 
                    @click="filters.gender = 'female'"
                    :class="[
                      'py-2 px-4 rounded-lg border', 
                      filters.gender === 'female' 
                        ? 'bg-primary-600 border-primary-500 text-white' 
                        : 'bg-dark-700 border-gray-600 text-gray-300 hover:bg-dark-600'
                    ]"
                  >
                    Nữ
                  </button>
                </div>
              </div>

              <!-- Độ tuổi -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Độ tuổi</label>
                <select 
                  v-model="filters.ageRange" 
                  class="w-full bg-dark-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tất cả độ tuổi</option>
                  <option value="under30">Dưới 30</option>
                  <option value="30to50">Từ 30-50</option>
                  <option value="over50">Trên 50</option>
                </select>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3 mt-6">
              <button @click="applyFiltersAndClose" class="btn-primary py-2 px-4">
                Áp dụng
              </button>
              <button @click="resetFiltersAndClose" class="btn-outline py-2 px-4">
                Đặt lại
              </button>
              <button @click="showFilters = false" class="text-gray-400 hover:text-white ml-auto">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results count -->
      <div class="text-gray-300 mb-6">
        <span>Hiển thị <span class="text-white font-medium">{{ (currentPage - 1) * actorsPerPage + 1 }}-{{ Math.min(currentPage * actorsPerPage, totalActors) }}</span> 
        trên <span class="text-white font-medium">{{ totalActors }}</span> diễn viên</span>
      </div>

      <!-- Actors grid -->
      <div v-if="actors.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-8">
        <div 
          v-for="actor in actors" 
          :key="actor.id" 
          class="group cursor-pointer"
          @click="viewActorDetails(actor.id)"
        >
          <div class="relative overflow-hidden rounded-xl aspect-[3/4] bg-dark-800">
            <img 
              :src="actor.photo" 
              :alt="actor.name" 
              class="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
            />
            
            <!-- Nationality badge -->
            <div class="absolute top-2 right-2">
              <span class="px-2 py-1 text-xs font-medium rounded-lg bg-black/70 backdrop-blur-sm text-white">
                {{ actor.nationality }}
              </span>
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
            <h3 class="text-white font-medium group-hover:text-primary-500 transition">{{ actor.name }}</h3>
            <p class="text-gray-400 text-sm truncate">{{ actor.knownFor }}</p>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="bg-dark-800 border border-gray-700 rounded-xl p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-400 mb-2">Không tìm thấy diễn viên nào</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">Không có diễn viên nào phù hợp với tìm kiếm hoặc bộ lọc của bạn. Vui lòng thử lại với từ khóa khác.</p>
        <button @click="resetSearch" class="btn-primary px-4 py-2">
          Xóa bộ lọc
        </button>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="['px-3 py-2 rounded-lg', 
              currentPage === 1 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-300 hover:bg-dark-700 hover:text-white']"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            v-for="page in pageArray"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-4 py-2 rounded-lg', 
              page === currentPage 
                ? 'bg-primary-600 text-white' 
                : page === '...' 
                  ? 'text-gray-500 cursor-default' 
                  : 'text-gray-300 hover:bg-dark-700 hover:text-white'
            ]"
          >
            {{ page }}
          </button>
          
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="['px-3 py-2 rounded-lg', 
              currentPage === totalPages 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-300 hover:bg-dark-700 hover:text-white']"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Tìm kiếm
const searchQuery = ref('')
const searchTimeout = ref(null)

// Trạng thái lọc
const filters = ref({
  nationality: '',
  gender: '',
  ageRange: '',
  genre: ''
})

// Trạng thái sắp xếp
const sortBy = ref('popular')

// Trạng thái hiển thị modal filter
const showFilters = ref(false)

// Dữ liệu mẫu - quốc tịch
const nationalities = ref([
  { id: 'us', name: 'Mỹ' },
  { id: 'kr', name: 'Hàn Quốc' },
  { id: 'jp', name: 'Nhật Bản' },
  { id: 'vn', name: 'Việt Nam' },
  { id: 'cn', name: 'Trung Quốc' },
  { id: 'uk', name: 'Anh' },
  { id: 'fr', name: 'Pháp' },
  { id: 'ca', name: 'Canada' }
])

// Dữ liệu mẫu - thể loại
const genres = ref([
  { id: 1, name: 'Hành động', slug: 'hanh-dong' },
  { id: 2, name: 'Tâm lý', slug: 'tam-ly' },
  { id: 3, name: 'Kinh dị', slug: 'kinh-di' },
  { id: 4, name: 'Hài', slug: 'hai' },
  { id: 5, name: 'Phiêu lưu', slug: 'phieu-luu' },
  { id: 6, name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong' }
])

// Trạng thái phân trang
const currentPage = ref(1)
const totalPages = ref(10)
const actorsPerPage = 20
const totalActors = ref(182)

// Dữ liệu mẫu - danh sách diễn viên
const actors = ref([
  { id: 1, name: 'Tom Cruise', photo: 'https://m.media-amazon.com/images/M/MV5BYTFlOTdjMjgtNmY0ZC00MDgxLThjNmEtZGIxZTQyZDdkMTRjXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', nationality: 'Mỹ', knownFor: 'Mission Impossible, Top Gun' },
  { id: 2, name: 'Robert Downey Jr.', photo: 'https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_.jpg', nationality: 'Mỹ', knownFor: 'Iron Man, Sherlock Holmes' },
  { id: 3, name: 'Son Ye-Jin', photo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Son_Ye-jin_at_BIFF_in_October_2018.jpg', nationality: 'Hàn Quốc', knownFor: 'Crash Landing on You' },
  { id: 4, name: 'Scarlett Johansson', photo: 'https://m.media-amazon.com/images/M/MV5BMTM3OTUwMDYwNl5BMl5BanBnXkFtZTcwNTUyNzc3Nw@@._V1_.jpg', nationality: 'Mỹ', knownFor: 'Black Widow, Lucy' },
  { id: 5, name: 'Leonardo DiCaprio', photo: 'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_.jpg', nationality: 'Mỹ', knownFor: 'Titanic, Inception, The Revenant' },
  { id: 6, name: 'Ngô Thanh Vân', photo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Ngo_Thanh_Van_1.png', nationality: 'Việt Nam', knownFor: 'Hai Phượng, The Old Guard' },
  { id: 7, name: 'Keanu Reeves', photo: 'https://m.media-amazon.com/images/M/MV5BNGJmMWEzOGQtMWZkNS00MGNiLTk5NGEtYzg1YzAyZTgzZTZmXkEyXkFqcGdeQXVyMTE1MTYxNDAw._V1_.jpg', nationality: 'Canada', knownFor: 'The Matrix, John Wick' },
  { id: 8, name: 'Cate Blanchett', photo: 'https://m.media-amazon.com/images/M/MV5BMTc1MDI0MDg1NV5BMl5BanBnXkFtZTgwMDM3OTAzMTE@._V1_.jpg', nationality: 'Úc', knownFor: 'Elizabeth, Lord of the Rings' },
  { id: 9, name: 'Choi Woo-Shik', photo: 'https://m.media-amazon.com/images/M/MV5BYzhjMjZmYjgtY2M0NS00ZTU3LTk0NzctODA0YzMwY2NlZjkyXkEyXkFqcGdeQXVyNTc0NTgxNjM@._V1_.jpg', nationality: 'Hàn Quốc', knownFor: 'Parasite, Train to Busan' },
  { id: 10, name: 'Jennifer Lawrence', photo: 'https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg', nationality: 'Mỹ', knownFor: 'The Hunger Games, Silver Linings Playbook' },
  { id: 11, name: 'Tom Holland', photo: 'https://m.media-amazon.com/images/M/MV5BNzZiNTEyNTItYjNhMS00YjI2LWIwMWQtZmYwYTRlNjMyZTJjXkEyXkFqcGdeQXVyMTExNzQzMDE0._V1_.jpg', nationality: 'Anh', knownFor: 'Spider-Man, Avengers' },
  { id: 12, name: 'Florence Pugh', photo: 'https://m.media-amazon.com/images/M/MV5BNTk5ZmM5NGMtMTg4ZC00MmVlLWEzMGQtNGNiNzEyNjY0MWE5XkEyXkFqcGdeQXVyMTI4MTcwOTcy._V1_.jpg', nationality: 'Anh', knownFor: 'Black Widow, Little Women' },
  { id: 13, name: 'Ryan Gosling', photo: 'https://m.media-amazon.com/images/M/MV5BMTQzMjkwNTQ2OF5BMl5BanBnXkFtZTgwNTQ4MTQ4MTE@._V1_.jpg', nationality: 'Canada', knownFor: 'La La Land, Blade Runner 2049' },
  { id: 14, name: 'Emma Stone', photo: 'https://m.media-amazon.com/images/M/MV5BMjI4NjM1NDkyN15BMl5BanBnXkFtZTgwODgyNTY1MjE@._V1.jpg', nationality: 'Mỹ', knownFor: 'La La Land, Easy A' },
  { id: 15, name: 'Châu Tinh Trì', photo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Stephen_Chow_in_2004.jpg', nationality: 'Trung Quốc', knownFor: 'Kung Fu Hustle, Shaolin Soccer' },
  { id: 16, name: 'Viola Davis', photo: 'https://m.media-amazon.com/images/M/MV5BNzUxNjM4ODI1OV5BMl5BanBnXkFtZTgwNTEwNDE2OTE@._V1_.jpg', nationality: 'Mỹ', knownFor: 'The Help, Fences' },
  { id: 17, name: 'Anthony Hopkins', photo: 'https://m.media-amazon.com/images/M/MV5BMTg5ODk1NTc5Nl5BMl5BanBnXkFtZTYwMjAwOTI4._V1_FMjpg_UX1000_.jpg', nationality: 'Anh', knownFor: 'The Silence of the Lambs, The Father' },
  { id: 18, name: 'Satoshi Tsumabuki', photo: 'https://m.media-amazon.com/images/M/MV5BMTgzMDczODIwNF5BMl5BanBnXkFtZTgwOTkzMTU5NTE@._V1_.jpg', nationality: 'Nhật Bản', knownFor: 'Waterboys, Villain' },
  { id: 19, name: 'Tang Wei', photo: 'https://m.media-amazon.com/images/M/MV5BYWQ3ZjQ2YzgtNTZmOS00ZTI2LTgwZjAtOTU2NjkzZGMwYWQxXkEyXkFqcGdeQXVyMjg0MTI5NzQ@._V1_.jpg', nationality: 'Trung Quốc', knownFor: 'Lust, Caution, Decision to Leave' },
  { id: 20, name: 'Brad Pitt', photo: 'https://m.media-amazon.com/images/M/MV5BMjA1MjE2MTQ2MV5BMl5BanBnXkFtZTcwMjE5MDY0Nw@@._V1_.jpg', nationality: 'Mỹ', knownFor: 'Fight Club, Once Upon a Time in Hollywood' }
])

// Tính toán số trang
const pageArray = computed(() => {
  const result = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 || 
      i === totalPages.value || 
      (i >= currentPage.value - 1 && i <= currentPage.value + 1)
    ) {
      result.push(i)
    } else if (i === currentPage.value - 2 || i === currentPage.value + 2) {
      result.push('...')
    }
  }
  return result
})

// Kiểm tra xem có filter nào đang active không
const hasActiveFilters = computed(() => {
  return filters.value.nationality !== '' || 
         filters.value.gender !== '' || 
         filters.value.ageRange !== '' ||
         filters.value.genre !== ''
})

// Xử lý khi đổi trang
function goToPage(page) {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
  // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu cho trang mới
}

// Xử lý tìm kiếm
function handleSearch() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1
    // Trong thực tế, bạn sẽ gọi API để tìm kiếm
    console.log('Searching for:', searchQuery.value)
  }, 500)
}

// Reset tìm kiếm
function resetSearch() {
  searchQuery.value = ''
  resetFilters()
}

// Xử lý khi thay đổi filter
function applyFilters() {
  currentPage.value = 1
  // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu theo filter
  console.log('Applying filters:', filters.value)
}

// Reset filters
function resetFilters() {
  filters.value = {
    nationality: '',
    gender: '',
    ageRange: '',
    genre: ''
  }
  applyFilters()
}

// Hàm áp dụng filter và đóng modal
function applyFiltersAndClose() {
  applyFilters()
  showFilters.value = false
}

// Hàm reset filter và đóng modal
function resetFiltersAndClose() {
  resetFilters()
  showFilters.value = false
}

// Xử lý khi đổi sort
function applySorting() {
  currentPage.value = 1
  // Trong thực tế, bạn sẽ gọi API để sắp xếp dữ liệu
  console.log('Sorting by:', sortBy.value)
}

// Xem chi tiết diễn viên
function viewActorDetails(actorId) {
  router.push({ name: 'actor-detail', params: { id: actorId } })
}

onMounted(() => {
  // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu
})
</script>

<style scoped>
/* Tùy chỉnh select */
select {
  background-color: #1f2937 !important; /* bg-dark-700 */
  color: white !important;
  appearance: none; /* Loại bỏ mũi tên mặc định */
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Các tùy chọn trong dropdown */
select option {
  background-color: #1f2937 !important;
  color: white !important;
}

/* Animation cho modal */
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>