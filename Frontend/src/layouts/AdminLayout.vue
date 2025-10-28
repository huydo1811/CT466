<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AdminSidebar from '@/components/common/admin/AdminSidebar.vue'
import AdminHeader from '@/components/common/admin/AdminHeader.vue'

// Trạng thái sidebar
const open = ref(true)
const mobileOpen = ref(false)

// Toggle sidebar desktop
const toggleSidebar = () => {
  open.value = !open.value
}

// Toggle sidebar mobile
const toggleMobileSidebar = () => {
  mobileOpen.value = !mobileOpen.value
}

// Đóng sidebar mobile
const closeMobileSidebar = () => {
  mobileOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#0f0f10] text-gray-200 flex relative">

    <!-- Sidebar -->
    <AdminSidebar
      :open="open"
      :mobile-open="mobileOpen"
      @update:open="open = $event"
      @update:mobile-open="mobileOpen = $event"
    />

    <!-- Overlay (mobile only) -->
    <transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-30 bg-black/50 md:hidden"
        @click="closeMobileSidebar"
      ></div>
    </transition>

    <!-- Nội dung chính -->
    <section
      :class="[open ? 'md:ml-72' : 'md:ml-20']"
      class="flex-1 min-w-0 transition-all duration-500"
    >
      <AdminHeader
        @toggle-sidebar="toggleSidebar"
        @toggle-mobile="toggleMobileSidebar"
      />

      <main class="p-4 sm:p-6">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
