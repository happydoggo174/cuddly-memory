import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { Admin } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const admin = ref<Admin | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password)
    token.value = res.data.data.token
    admin.value = res.data.data.admin
    localStorage.setItem('auth_token', token.value)
  }

  async function fetchMe() {
    try {
      const res = await authApi.me()
      admin.value = res.data.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    admin.value = null
    localStorage.removeItem('auth_token')
  }

  return { token, admin, isAuthenticated, login, fetchMe, logout }
})
