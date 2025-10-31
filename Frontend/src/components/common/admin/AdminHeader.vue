<template>
  <header
    class="bg-gradient-to-r from-[#0f0f10] to-[#1a1a1f] border-b border-[#2b2b35] sticky top-0 z-40 shadow-xl"
  >
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Mobile toggle -->
      <button
        @click="$emit('toggle-mobile')"
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

      <!-- Title -->
      <div class="text-xl font-bold text-[#E50914] tracking-wide drop-shadow-[0_0_6px_#E50914]">
        QUẢN LÝ HỆ THỐNG
      </div>

      <!-- User menu -->
      <div ref="menuRef" class="relative">
        <button
          @click="userMenuOpen = !userMenuOpen"
          class="flex items-center space-x-3 p-2 rounded-lg bg-[#18181c] text-gray-400 hover:text-white hover:bg-[#2b2b35] transition-colors"
        >
          <div
            class="w-10 h-10 bg-gradient-to-br from-[#E50914] to-[#ff304f] rounded-full flex items-center justify-center shadow-md shadow-[#E50914]/30 overflow-hidden"
          >
            <span class="text-white text-sm font-bold">{{ initials }}</span>
          </div>
          <div class="flex flex-col items-start">
            <span class="text-sm text-gray-200 font-semibold leading-4">{{ displayName }}</span>
            <span class="text-xs text-slate-400">{{ auth.user?.role || '' }}</span>
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
            to="/admin/profile"
            @click="userMenuOpen = false"
            class="block px-4 py-2 text-lg text-gray-300 hover:bg-[#2b2b35] hover:text-white"
          >
            Hồ sơ cá nhân
          </RouterLink>
          <hr class="border-[#2b2b35] my-1" />
          <button
            @click="onLogout"
            class="block w-full text-left px-4 py-2 text-lg text-gray-300 hover:bg-[#2b2b35] hover:text-white"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const userMenuOpen = ref(false);
const menuRef = ref(null);
const route = useRoute();
const router = useRouter();

const displayName = computed(() => {
  if (!auth.user) return "Khách";
  return auth.user.fullName || auth.user.username || "Admin";
});

const initials = computed(() => {
  const name = auth.user?.fullName || auth.user?.username || "A";
  return name
    .split(" ")
    .map(s => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

const onLogout = async () => {
  userMenuOpen.value = false;
  try {
    // optional: call backend logout if exists
    // await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${auth.token}` } })
  } catch (e) {
    console.error("Logout failed:", e);
    // ignore
  }
  auth.logout();
  router.push({ name: "admin.login" });
};

const onDocumentClick = (e) => {
  if (!menuRef.value) return;
  if (!menuRef.value.contains(e.target)) userMenuOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});

watch(
  () => route.fullPath,
  () => {
    userMenuOpen.value = false;
  }
);
</script>

<style scoped>
</style>
