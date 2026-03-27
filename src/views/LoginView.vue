<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import AlertMessage from '@/components/AlertMessage.vue'

const auth = useAuthStore()
const router = useRouter()

const email = ref('admin@company.com')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">L</div>
        <h1 class="text-2xl font-bold text-gray-900">L&D Portal</h1>
        <p class="text-sm text-gray-500 mt-1">Hệ thống quản lý đào tạo nội bộ</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Đăng nhập</h2>

        <AlertMessage v-if="error" type="error" :message="error" class="mb-4" />

        <form @submit.prevent="handleLogin" class="space-y-4">
          <BaseInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="admin@company.com"
            required
          />
          <BaseInput
            v-model="password"
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            required
          />
          <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="w-full mt-2">
            Đăng nhập
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>
