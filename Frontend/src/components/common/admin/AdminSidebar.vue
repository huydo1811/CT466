<template>
  <aside
    :class="[
      'bg-gradient-to-b from-[#0f0f10] via-[#151518] to-[#1a1a1f] border-r border-[#2b2b35] transition-all duration-500 ease-in-out shadow-2xl backdrop-blur-sm',
      open ? 'w-72' : 'w-20',
      // fixed so sidebar stays in place while main content scrolls
      'fixed top-0 left-0 h-screen z-40'
    ]"
  >
    <!-- Logo -->
    <div
      class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-[#E50914] via-[#d90f3f] to-[#b00020] shadow-lg rounded-br-2xl"
    >
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm"
        >
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <span v-if="open" class="text-2xl font-bold text-white tracking-wide">ChillFilm</span>
      </div>
    </div>

    <!-- Navigation: scrollable independent of page -->
    <nav class="mt-0 px-4 space-y-1 h-[calc(100vh-4rem)] overflow-y-auto pr-2 pt-4">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        :class="[
          'group flex items-center px-4 py-3 text-xl font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-[#2b2b35] hover:text-white hover:shadow-lg hover:scale-105',
          $route.path === item.href
            ? 'bg-[#E50914]/20 text-[#E50914] border-l-4 border-[#E50914] shadow-md shadow-[#E50914]/20'
            : 'text-gray-400'
        ]"
      >
        <div class="w-5 h-5 mr-3 flex-shrink-0" v-html="item.icon"></div>
        <span v-if="open" class="transition-opacity duration-300">{{ item.name }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router";
import { defineProps } from "vue";

defineProps({
  open: Boolean,
});

const $route = useRoute();

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
    </svg>`,
  },
  {
    name: "Phim điện ảnh",
    href: "/admin/movies",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>`,
  },
    {
    name: "Phim bộ",
    href: "/admin/series",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`,
  },
  {
    name: "Người dùng",
    href: "/admin/users",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>`,
  },
  {
    name: "Diễn viên",
    href: "/admin/actors",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>`,
  },
  {
    name: "Quốc gia",
    href: "/admin/countries",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
  },
  {
    name: "Thể loại",
    href: "/admin/categories",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>`,
  },
  {
    name: "Banner",
    href: "/admin/banners",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>`,
  },
  {
    name: "Bình luận",
    href: "/admin/reviews",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>`,
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>`,
  },

];
</script>
