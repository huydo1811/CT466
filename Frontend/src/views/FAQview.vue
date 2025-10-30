<template>
  <div class="pt-20 p-4 animate-fade-in">
    <div class="flex items-center justify-center mb-6">
      <div class="mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">FAQ — ChillFilm</h1>
        <p class="text-slate-400 text-sm mt-1 max-w-prose mx-auto">
          Câu hỏi thường gặp về ChillFilm — tổng hợp ngắn gọn để bạn nhanh tìm được thông tin cần thiết.
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <div v-for="(item, idx) in faqs" :key="idx" class="bg-slate-800 p-4 rounded border border-slate-700">
        <button @click="toggle(idx)" class="w-full text-left flex items-start justify-between gap-4">
          <div>
            <div class="text-white font-medium">{{ idx + 1 }}. {{ item.q }}</div>
            <div v-if="item.meta" class="text-xs text-slate-400 mt-1">{{ item.meta }}</div>
          </div>
          <div class="text-slate-300 ml-2">{{ open === idx ? '−' : '+' }}</div>
        </button>

        <div v-if="open === idx" class="mt-3 text-slate-200 whitespace-pre-wrap">
          {{ item.a }}
        </div>
      </div>
    </div>

    <div class="mt-6 text-slate-400 text-sm">
      Nếu bạn chưa tìm thấy giải đáp, xem trang
      <RouterLink to="/contact" class="text-slate-200 underline ml-1">Liên hệ</RouterLink>
      để gửi thắc mắc cho ChillFilm.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const open = ref(-1)

const toggle = (i) => { open.value = open.value === i ? -1 : i }

const faqs = [
  { q: 'ChillFilm là gì và có điểm gì nổi bật?', a: 'ChillFilm là nền tảng xem phim trực tuyến tập trung vào trải nghiệm người dùng: giao diện đơn giản, kho phim đa dạng và chất lượng cao.' },
  { q: 'ChillFilm có hoàn toàn miễn phí không?', a: 'ChillFilm cung cấp nội dung không tính phí cho người dùng. Một số tính năng nâng cao có thể yêu cầu tài khoản hoặc gói trả phí tùy chính sách.' },
  { q: 'Có phim chiếu rạp trên ChillFilm không?', a: 'Nền tảng cập nhật cả phim điện ảnh mới và các bộ phim phổ biến. Tùy theo nguồn, một số phim chiếu rạp sẽ có mặt sớm.' },
  { q: 'Tốc độ tải và phát phim như thế nào?', a: 'ChillFilm tối ưu băng thông và server để đảm bảo tốc độ phát mượt trên kết nối ổn định; chất lượng có thể thay đổi theo đường truyền của bạn.' },
  { q: 'Chất lượng video có tốt không?', a: 'Chất lượng dao động từ SD/HD đến 4K, tùy phim và nguồn cung cấp. Bạn có thể chọn độ phân giải phù hợp khi xem.' },
  { q: 'Xem ChillFilm trên thiết bị nào được?', a: 'ChillFilm tương thích với máy tính, điện thoại và máy tính bảng. Ứng dụng riêng (nếu có) sẽ hỗ trợ thêm TV/box.' },
  { q: 'Có thuyết minh, phụ đề không?', a: 'Nhiều phim có phụ đề và thuyết minh; thông tin về ngôn ngữ được hiển thị trên trang phim nếu có.' },
  { q: 'Có quảng cáo khi xem phim không?', a: 'ChillFilm cố gắng giảm gián đoạn; chính sách quảng cáo sẽ được hiển thị rõ trên trang nếu có áp dụng.' },
  { q: 'Phim từ những quốc gia nào?', a: 'Kho phim gồm Việt Nam, Hàn Quốc, Nhật Bản, Trung Quốc, Thái Lan, Âu-Mỹ và nhiều quốc gia khác.' },
  { q: 'Thể loại phim phổ biến?', a: 'Hành động, tình cảm, viễn tưởng, cổ trang, hoạt hình và kinh dị là những thể loại được người xem ưa chuộng.' },
  { q: 'ChillFilm cập nhật phim mới thường xuyên không?', a: 'Có — nền tảng liên tục cập nhật các tiêu đề hot và phim mới theo nguồn cung cấp.' },
  { q: 'Có phim lẻ và phim bộ không?', a: 'ChillFilm cung cấp cả phim lẻ và phim bộ/series.' },
  { q: 'Hỗ trợ phim hoạt hình/Anime không?', a: 'Có, ChillFilm có mục hoạt hình và anime cho mọi lứa tuổi.' },
  { q: 'Tìm kiếm phim có dễ không?', a: 'Giao diện tìm kiếm được thiết kế để lọc theo tên, thể loại, quốc gia và danh mục phổ biến.' },
  { q: 'ChillFilm có phim 4K không?', a: 'Một số đầu phim hỗ trợ 4K tùy vào nguồn và bản quyền.' },
  { q: 'Hỗ trợ lồng tiếng địa phương không?', a: 'Một số nội dung có lựa chọn lồng tiếng địa phương; thông tin này được hiển thị trên trang phim.' },
  { q: 'Có danh sách phim được xem nhiều nhất không?', a: 'Có — ChillFilm có bảng xếp hạng/đề xuất những phim thịnh hành để bạn tham khảo.' },
  { q: 'Tại sao chọn ChillFilm?', a: 'Giao diện thân thiện, kho phim đa dạng và trải nghiệm xem mượt là những lý do người dùng chọn ChillFilm.' },
  { q: 'Cần đăng ký tài khoản để xem phim không?', a: 'Nhiều nội dung có thể xem ngay mà không cần tài khoản; đăng nhập giúp lưu danh sách yêu thích và cài đặt cá nhân.' },
  { q: 'ChillFilm bảo vệ quyền riêng tư người dùng như thế nào?', a: 'ChillFilm tôn trọng quyền riêng tư và chỉ thu thập thông tin cần thiết. Chi tiết chính sách được mô tả trong trang Chính sách riêng tư.' }
]
</script>

<style scoped>
.animate-fade-in { animation: fade-in .18s ease-out; }
@keyframes fade-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
.max-w-prose { max-width: 60ch; }
</style>