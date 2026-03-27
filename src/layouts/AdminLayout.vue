<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter, useLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Khóa học', path: '/courses', icon: '📚' },
  { name: 'Hồ sơ đào tạo', path: '/records', icon: '📋' },
]

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-200',
      'lg:translate-x-0 lg:static lg:z-auto',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]">
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">L</div>
          <div>
            <p class="font-semibold text-gray-900 text-sm">L&D Portal</p>
            <p class="text-xs text-gray-400">Training Management</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="sidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith(item.path)
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <span>{{ item.icon }}</span>
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- User -->
      <div class="px-4 py-4 border-t border-gray-100">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            {{ auth.admin?.email?.[0]?.toUpperCase() || 'A' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-gray-900 truncate">{{ auth.admin?.email }}</p>
            <p class="text-xs text-gray-400">Admin</p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span>🚪</span> Đăng xuất
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar (mobile) -->
      <header class="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button @click="sidebarOpen = true" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="font-semibold text-gray-900 text-sm">L&D Portal</span>
      </header>

      <main class="flex-1 p-4 lg:p-8 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
