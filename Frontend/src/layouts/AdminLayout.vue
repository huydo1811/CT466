<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/common/admin/AdminSidebar.vue'
import AdminHeader from '@/components/common/admin/AdminHeader.vue'

const open = ref(true)
const activeTab = ref('dashboard')

const toggleSidebar = () => {
  open.value = !open.value
}
</script>

<template>
  <div class="min-h-screen bg-dark-900 text-gray-200 flex">
    <AdminSidebar :open="open" :active-tab="activeTab" @toggle-sidebar="toggleSidebar" />
    
    <section
      :class="[open ? 'ml-72' : 'ml-20']"
      class="flex-1 min-w-0 transition-all duration-500"
    >
      <AdminHeader @toggle-sidebar="toggleSidebar" />
      <main class="p-6">
        <RouterView />
      </main>
    </section>
  </div>
</template>