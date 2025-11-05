<template>
  <div class="pt-20 p-4 animate-fade-in">
    <div class="flex items-center justify-center mb-6">
      <div class="mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Điều khoản sử dụng — ChillFilm</h1>
        <p class="text-slate-400 text-sm mt-1 max-w-prose mx-auto">
          Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ ChillFilm. Bằng việc truy cập và sử dụng, bạn chấp nhận các điều khoản này.
        </p>
      </div>
    </div>

    <div class="bg-slate-800 p-6 rounded border border-slate-700 space-y-5">
      <section>
        <h3 class="text-white font-medium">1. Chấp nhận điều khoản</h3>
        <p class="text-slate-400 mt-2">
          Khi sử dụng ChillFilm bạn đồng ý tuân thủ các điều khoản này. Nếu không đồng ý, vui lòng ngưng sử dụng dịch vụ.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">2. Đăng ký tài khoản</h3>
        <p class="text-slate-400 mt-2">
          Khi tạo tài khoản, bạn cam kết cung cấp thông tin chính xác và bảo mật thông tin đăng nhập. ChillFilm không chịu trách nhiệm cho các tổn thất phát sinh từ việc lộ thông tin truy cập do bạn quản lý kém.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">3. Hành vi bị cấm</h3>
        <ul class="text-slate-400 list-disc ml-5 mt-2 space-y-1">
          <li>Đăng tải hoặc phát tán nội dung vi phạm bản quyền, pháp luật hoặc quyền riêng tư người khác.</li>
          <li>Gây hại hệ thống, truy cập trái phép hoặc can thiệp vào dữ liệu của người dùng khác.</li>
          <li>Sử dụng dịch vụ cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của ChillFilm.</li>
        </ul>
      </section>

      <section>
        <h3 class="text-white font-medium">4. Bảo mật & quyền riêng tư</h3>
        <p class="text-slate-400 mt-2">
          ChillFilm nỗ lực bảo vệ dữ liệu người dùng. Chi tiết về việc thu thập và xử lý dữ liệu được mô tả trong trang Chính sách riêng tư.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">5. Thay đổi dịch vụ</h3>
        <p class="text-slate-400 mt-2">
          ChillFilm có quyền điều chỉnh, tạm ngưng hoặc chấm dứt cung cấp nội dung, tính năng hay dịch vụ mà không cần thông báo trước. Chúng tôi có thể khóa hoặc xóa tài khoản nếu phát hiện vi phạm.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">6. Miễn trừ trách nhiệm</h3>
        <p class="text-slate-400 mt-2">
          ChillFilm cố gắng cung cấp trải nghiệm ổn định nhưng không thể đảm bảo hoàn toàn không có gián đoạn kỹ thuật. ChillFilm không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ hoặc nội dung bên thứ ba.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">7. Cập nhật điều khoản</h3>
        <p class="text-slate-400 mt-2">
          ChillFilm có thể cập nhật điều khoản theo thời gian. Mọi thay đổi sẽ được đăng trên trang chính thức; việc tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa bạn chấp nhận điều khoản mới.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">8. Liên hệ</h3>
        <p class="text-slate-400 mt-2">
          Nếu bạn có câu hỏi về điều khoản, vui lòng liên hệ qua email: <a class="text-slate-200 underline" href="mailto:lienhe@chillfilm.example">lienhe@chillfilm.example</a>
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.animate-fade-in { animation: fade-in .18s ease-out; }
@keyframes fade-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
.max-w-prose { max-width: 64ch; }
</style>