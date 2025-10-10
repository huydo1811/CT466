<script setup>
import { ref } from 'vue'
const open = ref(true)
</script>

<template>
  <div class="min-h-screen bg-dark-900 text-gray-200 flex">
    <aside :class="['bg-dark-900 border-r border-gray-800 transition-all', open ? 'w-64' : 'w-16']">
      <div class="p-4 font-bold text-white">Admin</div>
      <nav class="px-2 space-y-1">
        <RouterLink to="/admin" class="block px-3 py-2 rounded hover:bg-gray-800">Dashboard</RouterLink>
        <RouterLink to="/admin/movies" class="block px-3 py-2 rounded hover:bg-gray-800">Movies</RouterLink>
        <RouterLink to="/admin/users" class="block px-3 py-2 rounded hover:bg-gray-800">Users</RouterLink>
        <RouterLink to="/admin/settings" class="block px-3 py-2 rounded hover:bg-gray-800">Settings</RouterLink>
      </nav>
    </aside>
    <section class="flex-1 min-w-0">
      <header class="h-14 border-b border-gray-800 flex items-center justify-between px-4">
        <button class="px-3 py-1 rounded bg-gray-800" @click="open = !open">☰</button>
        <div class="text-sm text-gray-400">Admin Panel</div>
      </header>
      <main class="p-6">
        <RouterView />
      </main>
    </section>
  </div>
</template>