<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { recordsApi } from '@/api/records'
import type { TrainingRecord, RecordFilters } from '@/types'
import { TRAINING_FORMATS, TRAINING_TYPES } from '@/utils/constants'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseButton from '@/components/BaseButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import { formatDate, formatDateTime } from '@/utils/format'

const records = ref<TrainingRecord[]>([])
const loading = ref(true)
const error = ref('')
const total = ref(0)
const exporting = ref<'excel' | 'csv' | null>(null)

const filters = ref<RecordFilters>({
  search: '',
  department: '',
  training_type: '',
  training_format: '',
  date_from: '',
  date_to: '',
  page: 1,
  limit: 20,
  sort_by: 'checkin_time',
  sort_order: 'desc',
})

const formatOptions = [{ label: 'Tất cả', value: '' }, ...TRAINING_FORMATS.map(f => ({ label: f, value: f }))]
const typeOptions = [{ label: 'Tất cả', value: '' }, ...TRAINING_TYPES.map(t => ({ label: t, value: t }))]

async function load() {
  loading.value = true
  error.value = ''
  try {
    // Remove empty string params
    const params = Object.fromEntries(
      Object.entries(filters.value).filter(([, v]) => v !== '' && v !== undefined)
    ) as RecordFilters
    const res = await recordsApi.list(params)
    records.value = res.data.data
    total.value = res.data.meta?.total || 0
  } catch {
    error.value = 'Không thể tải hồ sơ đào tạo'
  } finally {
    loading.value = false
  }
}

async function exportFile(type: 'excel' | 'csv') {
  exporting.value = type
  try {
    const params = Object.fromEntries(
      Object.entries(filters.value).filter(([, v]) => v !== '' && v !== undefined)
    ) as RecordFilters
    const res = type === 'excel'
      ? await recordsApi.exportExcel(params)
      : await recordsApi.exportCsv(params)

    const url = URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `training-records-${Date.now()}.${type === 'excel' ? 'xlsx' : 'csv'}`
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    error.value = 'Export thất bại'
  } finally {
    exporting.value = null
  }
}

function resetFilters() {
  filters.value = { search: '', department: '', training_type: '', training_format: '', date_from: '', date_to: '', page: 1, limit: 20, sort_by: 'checkin_time', sort_order: 'desc' }
}

let searchTimer: ReturnType<typeof setTimeout>
watch(() => filters.value.search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { filters.value.page = 1; load() }, 400)
})

watch(
  () => [filters.value.department, filters.value.training_type, filters.value.training_format, filters.value.date_from, filters.value.date_to],
  () => { filters.value.page = 1; load() }
)

const totalPages = () => Math.ceil(total.value / (filters.value.limit || 20))

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Hồ sơ đào tạo</h1>
        <p class="text-sm text-gray-500 mt-1">{{ total }} bản ghi</p>
      </div>
      <div class="flex gap-2">
        <BaseButton variant="secondary" size="sm" :loading="exporting === 'csv'" @click="exportFile('csv')">
          CSV
        </BaseButton>
        <BaseButton variant="secondary" size="sm" :loading="exporting === 'excel'" @click="exportFile('excel')">
          Excel
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <BaseInput v-model="filters.search" placeholder="Tìm tên, mã NV, khóa học..." />
        <BaseInput v-model="filters.department" placeholder="Phòng ban..." />
        <BaseSelect v-model="filters.training_type" :options="typeOptions" placeholder="Loại đào tạo" />
        <BaseSelect v-model="filters.training_format" :options="formatOptions" placeholder="Hình thức" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
        <BaseInput v-model="filters.date_from" type="date" label="" placeholder="Từ ngày" />
        <BaseInput v-model="filters.date_to" type="date" label="" placeholder="Đến ngày" />
        <div class="flex items-end">
          <BaseButton variant="ghost" size="sm" @click="resetFilters">Xóa bộ lọc</BaseButton>
        </div>
      </div>
    </div>

    <AlertMessage v-if="error" type="error" :message="error" class="mb-4" />
    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="records.length === 0"
      title="Không có hồ sơ nào"
      description="Thử thay đổi bộ lọc hoặc chờ nhân viên check-in"
      icon="assignment"
    />

    <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-4 py-3 font-medium text-gray-600">Họ tên</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Mã NV</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Phòng ban</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Khóa học</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Loại</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Ngày học</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Check-in lúc</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="r in records" :key="r.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900">{{ r.employee_name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ r.employee_id }}</td>
              <td class="px-4 py-3 text-gray-600 hidden sm:table-cell">{{ r.department }}</td>
              <td class="px-4 py-3 hidden md:table-cell">
                <p class="text-gray-900 font-medium">{{ r.course_name }}</p>
                <p class="text-xs text-gray-400">{{ r.training_format }}</p>
              </td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">{{ r.training_type }}</span>
              </td>
              <td class="px-4 py-3 text-gray-600 hidden lg:table-cell">{{ formatDate(r.start_date) }}</td>
              <td class="px-4 py-3 text-gray-400 hidden xl:table-cell">{{ formatDateTime(r.checkin_time) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages() > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-sm text-gray-500">Trang {{ filters.page }} / {{ totalPages() }}</p>
        <div class="flex gap-2">
          <BaseButton
            variant="secondary" size="sm"
            :disabled="filters.page === 1"
            @click="filters.page!--; load()"
          >Trước</BaseButton>
          <BaseButton
            variant="secondary" size="sm"
            :disabled="filters.page === totalPages()"
            @click="filters.page!++; load()"
          >Sau</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
