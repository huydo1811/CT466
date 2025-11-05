<template>
  <div class="bg-dark-900 min-h-screen pt-20 pb-16">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-b from-dark-800 to-dark-900 py-12 mb-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold text-white mb-2">Thể loại phim</h1>
          <p class="text-gray-300 text-lg">Khám phá bộ sưu tập phim phong phú của chúng tôi theo từng thể loại, từ hành động kịch tính đến tâm lý sâu sắc.</p>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-4">
      <!-- Popular Categories Section -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-6">Thể loại phổ biến</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="category in popularCategories" 
            :key="category.id" 
            class="bg-dark-800 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-primary-500 transition-all"
            @click="viewCategoryDetail(category.slug)"
          >
            <div class="h-32 overflow-hidden relative">
              <img :src="category.image" :alt="category.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div class="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-70"></div>
              <div class="absolute bottom-0 left-0 right-0 p-3 text-white font-medium">
                {{ category.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- All Categories Section -->
      <div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dữ liệu mẫu - danh mục phổ biến
const popularCategories = ref([
  { id: 1, name: 'Hành động', slug: 'hanh-dong', count: 245, image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
  { id: 2, name: 'Tình cảm', slug: 'tinh-cam', count: 189, image: 'https://image.tmdb.org/t/p/w500/4rsomWxlqnHt3muGYK06auhOib6.jpg' },
  { id: 3, name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong', count: 167, image: 'https://image.tmdb.org/t/p/w500/zFR8amwiEKuLTHSI2JYpyeSuzQL.jpg' },
  { id: 4, name: 'Kinh dị', slug: 'kinh-di', count: 156, image: 'https://image.tmdb.org/t/p/w500/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg' },
  { id: 5, name: 'Hài', slug: 'hai', count: 205, image: 'https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg' },
  { id: 6, name: 'Phiêu lưu', slug: 'phieu-luu', count: 178, image: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg' }
])

// Dữ liệu mẫu - tất cả các danh mục
const allCategories = ref([
  { id: 1, name: 'Âm nhạc', slug: 'am-nhac', count: 45 },
  { id: 2, name: 'Bí ẩn', slug: 'bi-an', count: 86 },
  { id: 3, name: 'Chiến tranh', slug: 'chien-tranh', count: 53 },
  { id: 4, name: 'Cổ trang', slug: 'co-trang', count: 72 },
  { id: 5, name: 'Gia đình', slug: 'gia-dinh', count: 98 },
  { id: 6, name: 'Giả tưởng', slug: 'gia-tuong', count: 67 },
  { id: 7, name: 'Hài', slug: 'hai', count: 205 },
  { id: 8, name: 'Hành động', slug: 'hanh-dong', count: 245 },
  { id: 9, name: 'Hình sự', slug: 'hinh-su', count: 112 },
  { id: 10, name: 'Hoạt hình', slug: 'hoat-hinh', count: 156 },
  { id: 11, name: 'Học đường', slug: 'hoc-duong', count: 43 },
  { id: 12, name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong', count: 167 },
  { id: 13, name: 'Kinh dị', slug: 'kinh-di', count: 156 },
  { id: 14, name: 'Lãng mạn', slug: 'lang-man', count: 114 },
  { id: 15, name: 'Lịch sử', slug: 'lich-su', count: 76 },
  { id: 16, name: 'Phiêu lưu', slug: 'phieu-luu', count: 178 },
  { id: 17, name: 'Tài liệu', slug: 'tai-lieu', count: 32 },
  { id: 18, name: 'Tâm lý', slug: 'tam-ly', count: 192 },
  { id: 19, name: 'Thảm họa', slug: 'tham-hoa', count: 28 },
  { id: 20, name: 'Thần thoại', slug: 'than-thoai', count: 41 },
  { id: 21, name: 'Thể thao', slug: 'the-thao', count: 37 },
  { id: 22, name: 'Tình cảm', slug: 'tinh-cam', count: 189 },
  { id: 23, name: 'Tội phạm', slug: 'toi-pham', count: 124 },
  { id: 24, name: 'Võ thuật', slug: 'vo-thuat', count: 83 },
])

// Nhóm các danh mục theo chữ cái đầu tiên
const categoryGroups = computed(() => {
  const groups = [];
  const sortedCategories = [...allCategories.value].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  
  let currentLetter = '';
  let currentGroup = null;
  
  sortedCategories.forEach(category => {
    const firstLetter = category.name.charAt(0).toUpperCase();
    
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      currentGroup = {
        letter: currentLetter,
        categories: []
      };
      groups.push(currentGroup);
    }
    
    currentGroup.categories.push(category);
  });
  
  return groups;
})

// Xem chi tiết danh mục
function viewCategoryDetail(slug) {
  router.push({ name: 'category-detail', params: { slug: slug } });
}
</script>

<style scoped>
/* Nếu cần thêm style riêng */
</style>