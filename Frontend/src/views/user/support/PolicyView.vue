<template>
  <div class="pt-20 p-4 animate-fade-in">
    <div class="flex items-center justify-center mb-6">
      <div class="mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Chính sách bảo mật — ChillFilm</h1>
        <p class="text-slate-400 text-sm mt-1 max-w-prose mx-auto">
          ChillFilm cam kết bảo vệ thông tin cá nhân của bạn. Dưới đây là tóm tắt cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.
        </p>
      </div>
    </div>

    <div class="bg-slate-800 p-6 rounded border border-slate-700 space-y-5">
      <section>
        <h3 class="text-white font-medium">Thông tin chúng tôi thu thập</h3>
        <p class="text-slate-400 mt-2">
          Chúng tôi có thể thu thập thông tin bạn cung cấp trực tiếp (ví dụ: tên, email, số điện thoại khi đăng ký hoặc liên hệ) và dữ liệu phi cá nhân (ví dụ: hành vi truy cập, thiết bị, log).
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">Mục đích sử dụng</h3>
        <ul class="text-slate-400 list-disc ml-5 mt-2 space-y-1">
          <li>Cung cấp và duy trì dịch vụ, xử lý yêu cầu hỗ trợ.</li>
          <li>Giao tiếp với người dùng về tài khoản, cập nhật và thông báo.</li>
          <li>Phân tích nhằm cải thiện nội dung, hiệu năng và trải nghiệm người dùng.</li>
          <li>Bảo vệ hệ thống trước hành vi lạm dụng, gian lận và tuân thủ pháp luật.</li>
        </ul>
      </section>

      <section>
        <h3 class="text-white font-medium">Chia sẻ thông tin</h3>
        <p class="text-slate-400 mt-2">
          ChillFilm không bán dữ liệu cá nhân. Chúng tôi chỉ chia sẻ khi có:
        </p>
        <ul class="text-slate-400 list-disc ml-5 mt-2">
          <li>Sự đồng ý của bạn;</li>
          <li>Đối tác cung cấp dịch vụ hỗ trợ hoạt động (ví dụ: hosting, phân tích) với cam kết bảo mật;</li>
          <li>Yêu cầu pháp lý hợp lệ nhằm bảo vệ quyền lợi và an toàn cộng đồng.</li>
        </ul>
      </section>

      <section>
        <h3 class="text-white font-medium">Bảo mật thông tin</h3>
        <p class="text-slate-400 mt-2">
          Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý để giảm thiểu rủi ro mất mát hoặc truy cập trái phép. Tuy nhiên không có hệ thống nào tuyệt đối an toàn; ChillFilm liên tục cập nhật biện pháp bảo vệ.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">Quyền của bạn</h3>
        <p class="text-slate-400 mt-2">
          Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân do ChillFilm lưu trữ. Để thực hiện, vui lòng liên hệ theo thông tin bên dưới.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">Cookies và công nghệ tương tự</h3>
        <p class="text-slate-400 mt-2">
          ChillFilm sử dụng cookies để ghi nhớ lựa chọn, phân tích lưu lượng và nâng cao trải nghiệm. Bạn có thể quản lý hoặc tắt cookies qua trình duyệt; tuy nhiên điều này có thể ảnh hưởng đến một số chức năng.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">Thay đổi chính sách</h3>
        <p class="text-slate-400 mt-2">
          Chính sách này có thể được cập nhật. Mọi thay đổi sẽ được đăng trên trang và có hiệu lực khi xuất bản. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa bạn chấp nhận các điều khoản mới.
        </p>
      </section>

      <section>
        <h3 class="text-white font-medium">Liên hệ</h3>
        <p class="text-slate-400 mt-2">
          Nếu bạn có câu hỏi hoặc muốn thực hiện quyền liên quan tới dữ liệu, vui lòng gửi email tới <a class="text-slate-200 underline" href="mailto:privacy@chillfilm.example">privacy@chillfilm.example</a> hoặc <a class="text-slate-200 underline" href="/contact">truy cập trang Liên hệ</a>.
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
.max-w-prose { max-width: 60ch; }
</style>
