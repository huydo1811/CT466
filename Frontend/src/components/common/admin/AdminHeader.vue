<template>
  <header
    class="bg-gradient-to-r from-[#0f0f10] to-[#1a1a1f] border-b border-[#2b2b35] sticky top-0 z-40 shadow-xl"
  >
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Nút mở sidebar -->
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2b2b35] transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Tiêu đề -->
      <div
        class="text-xl font-bold text-[#E50914] tracking-wide drop-shadow-[0_0_6px_#E50914]"
      >
        QUẢN LÝ HỆ THỐNG
      </div>

      <!-- Menu người dùng -->
      <div class="relative">
        <button
          @click="userMenuOpen = !userMenuOpen"
          class="flex items-center space-x-3 p-2 rounded-lg bg-[#18181c] text-gray-400 hover:text-white hover:bg-[#2b2b35] transition-colors"
        >
          <div
            class="w-10 h-10 bg-gradient-to-br from-[#E50914] to-[#ff304f] rounded-full flex items-center justify-center shadow-md shadow-[#E50914]/30"
          >
            <span class="text-white text-sm font-bold">A</span>
          </div>
          <svg
            class="w-5 h-5 transition-transform duration-200"
            :class="userMenuOpen ? 'rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown -->
        <div
          v-if="userMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-[#18181c] border border-[#2b2b35] rounded-lg shadow-xl py-2 z-50"
        >
          <RouterLink
            to="/profile"
            class="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2b2b35] hover:text-white"
          >
            Hồ sơ cá nhân
          </RouterLink>
          <RouterLink
            to="/settings"
            class="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2b2b35] hover:text-white"
          >
            Cài đặt
          </RouterLink>
          <hr class="border-[#2b2b35] my-1" />
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2b2b35] hover:text-white"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const userMenuOpen = ref(false);

const logout = () => {
  console.log("Đăng xuất...");
};

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
      userMenuOpen.value = false;
    }
  });
});
</script>
