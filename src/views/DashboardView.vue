<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dashboardApi } from '@/api/dashboard'
import type { DashboardStats } from '@/types'
import StatCard from '@/components/StatCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await dashboardApi.stats()
    stats.value = res.data.data
  } catch {
    error.value = 'Không thể tải dữ liệu dashboard'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Tổng quan hoạt động đào tạo</p>
    </div>

    <LoadingSpinner v-if="loading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />

    <template v-else-if="stats">
      <!-- Stat cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Tổng khóa học" :value="stats.total_courses" icon="📚" color="blue" />
        <StatCard label="Tổng lượt đào tạo" :value="stats.total_records" icon="👥" color="green" />
        <StatCard label="Phòng ban" :value="stats.by_department.length" icon="🏢" color="purple" />
        <StatCard label="Loại đào tạo" :value="stats.by_training_type.length" icon="🎯" color="orange" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- By department -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-semibold text-gray-900 mb-4">Theo phòng ban</h3>
          <div v-if="stats.by_department.length === 0" class="text-sm text-gray-400 text-center py-6">Chưa có dữ liệu</div>
          <div v-else class="space-y-3">
            <div v-for="item in stats.by_department.slice(0, 8)" :key="item.department" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 w-32 truncate flex-shrink-0">{{ item.department }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full transition-all"
                  :style="{ width: `${Math.round((item.count / stats.total_records) * 100)}%` }"
                />
              </div>
              <span class="text-sm font-medium text-gray-700 w-8 text-right">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- By training type -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-semibold text-gray-900 mb-4">Theo loại đào tạo</h3>
          <div v-if="stats.by_training_type.length === 0" class="text-sm text-gray-400 text-center py-6">Chưa có dữ liệu</div>
          <div v-else class="space-y-3">
            <div v-for="item in stats.by_training_type" :key="item.training_type" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 w-40 truncate flex-shrink-0">{{ item.training_type }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  class="bg-purple-500 h-2 rounded-full transition-all"
                  :style="{ width: `${Math.round((item.count / stats.total_records) * 100)}%` }"
                />
              </div>
              <span class="text-sm font-medium text-gray-700 w-8 text-right">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- By format -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-semibold text-gray-900 mb-4">Theo hình thức đào tạo</h3>
          <div v-if="stats.by_training_format.length === 0" class="text-sm text-gray-400 text-center py-6">Chưa có dữ liệu</div>
          <div v-else class="grid grid-cols-2 gap-3">
            <div v-for="item in stats.by_training_format" :key="item.training_format"
              class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-gray-900">{{ item.count }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.training_format }}</p>
            </div>
          </div>
        </div>

        <!-- By month -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-semibold text-gray-900 mb-4">Theo tháng (6 tháng gần nhất)</h3>
          <div v-if="stats.by_month.length === 0" class="text-sm text-gray-400 text-center py-6">Chưa có dữ liệu</div>
          <div v-else class="space-y-2">
            <div v-for="item in stats.by_month.slice(-6)" :key="item.month" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 w-20 flex-shrink-0">{{ item.month }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full transition-all"
                  :style="{ width: `${Math.round((item.count / Math.max(...stats.by_month.map(m => m.count))) * 100)}%` }"
                />
              </div>
              <span class="text-sm font-medium text-gray-700 w-8 text-right">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
