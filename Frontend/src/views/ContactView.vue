<template>
  <div class="pt-20 p-4 animate-fade-in">
    <div class="flex items-center justify-center mb-6">
      <div class="mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">Liên hệ ChillFilm</h1>
        <p class="text-slate-400 text-sm mt-1 max-w-prose mx-auto">
          Nếu bạn cần trợ giúp, phản ánh lỗi hoặc góp ý, vui lòng liên hệ với chúng tôi. ChillFilm luôn sẵn sàng hỗ trợ.
        </p>
      </div>
    </div>

    <div class="bg-slate-800 p-6 rounded border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 space-y-4">
        <div class="bg-slate-900 p-4 rounded border border-slate-700">
          <h3 class="text-sm text-slate-200 font-medium">Thông tin liên hệ chính</h3>
          <div class="text-slate-400 text-sm mt-3 space-y-2">
            <div><span class="font-medium text-slate-200">Email hỗ trợ:</span> support@chillfilm.example</div>
            <div><span class="font-medium text-slate-200">Vấn đề tài khoản:</span> account@chillfilm.example</div>
            <div><span class="font-medium text-slate-200">Chính sách & bảo mật:</span> privacy@chillfilm.example</div>
            <div><span class="font-medium text-slate-200">Hotline:</span> +84 912 345 678</div>
            <div><span class="font-medium text-slate-200">Giờ làm việc:</span> 09:00 – 18:00 (T2 – T7)</div>
          </div>
        </div>

        <div class="bg-slate-900 p-4 rounded border border-slate-700">
          <h3 class="text-sm text-slate-200 font-medium">Kênh mạng xã hội</h3>
          <div class="flex items-center gap-4 mt-3">
            <a target="_blank" rel="noopener" href="#" class="flex items-center gap-2 text-slate-300 hover:text-white" aria-label="Facebook">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.2-3.4.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 2.9h-1.9v7A10 10 0 0022 12z"/></svg>
              Facebook
            </a>
            <a target="_blank" rel="noopener" href="#" class="flex items-center gap-2 text-slate-300 hover:text-white" aria-label="Instagram">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.3A4.7 4.7 0 1016.7 13 4.7 4.7 0 0012 8.3zm6.5-3.2a1.1 1.1 0 11-1.1 1.1 1.1 1.1 0 011.1-1.1z"/></svg>
              Instagram
            </a>
          </div>
        </div>

        <div class="bg-slate-900 p-4 rounded border border-slate-700 text-sm">
          <div class="text-slate-300 font-medium">Trước khi liên hệ</div>
          <ul class="text-slate-400 mt-2 list-disc ml-5">
            <li>Kiểm tra mục FAQ-Hỏi đáp trước — nhiều câu hỏi đã có sẵn câu trả lời.</li>
            <li>Nêu rõ: loại vấn đề, mô tả ngắn và (nếu cần) ảnh chụp màn hình.</li>
            <li>Ghi email hoặc số điện thoại để chúng tôi phản hồi.</li>
          </ul>

          <div class="mt-3">
            <RouterLink to="/faq" class="inline-block px-3 py-2 bg-slate-700 rounded text-slate-200 hover:bg-slate-600">Xem FAQ-Hỏi đáp</RouterLink>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 space-y-4">
        <div class="bg-slate-900 p-6 rounded border border-slate-700">
          <h3 class="text-lg text-slate-200 font-medium mb-2">Cách gửi yêu cầu</h3>
          <p class="text-slate-400 text-sm">
            Vui lòng gửi yêu cầu tới email phù hợp (xem mục “Thông tin liên hệ chính”). Ghi rõ tiêu đề, mô tả và đính kèm ảnh chụp màn hình nếu cần.
          </p>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-800 p-4 rounded border border-slate-700">
              <div class="text-slate-300 font-medium">Hỗ trợ tài khoản</div>
              <div class="text-slate-400 text-sm mt-2">Vấn đề đăng nhập, quên mật khẩu, khóa tài khoản.</div>
            </div>

            <div class="bg-slate-800 p-4 rounded border border-slate-700">
              <div class="text-slate-300 font-medium">Hỗ trợ kỹ thuật</div>
              <div class="text-slate-400 text-sm mt-2">Sự cố khi phát video, lỗi giao diện, báo lỗi nội dung.</div>
            </div>

            <div class="bg-slate-800 p-4 rounded border border-slate-700">
              <div class="text-slate-300 font-medium">Góp ý & hợp tác</div>
              <div class="text-slate-400 text-sm mt-2">Đề xuất tính năng, hợp tác nội dung, quảng cáo.</div>
            </div>

            <div class="bg-slate-800 p-4 rounded border border-slate-700">
              <div class="text-slate-300 font-medium">Chính sách & bảo mật</div>
              <div class="text-slate-400 text-sm mt-2">Các câu hỏi về quyền riêng tư và xử lý dữ liệu.</div>
            </div>
          </div>
        </div>

        <div class="text-slate-400 text-sm">
          <em>Chúng tôi cố gắng phản hồi trong vòng 24–48 giờ làm việc. Trường hợp khẩn cấp, liên hệ hotline.</em>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.animate-fade-in { animation: fade-in .18s ease-out; }
@keyframes fade-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
.max-w-prose { max-width: 60ch; }
</style>