<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { coursesApi } from '@/api/courses'
import type { Course } from '@/types'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import BaseModal from '@/components/BaseModal.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import { formatDate } from '@/utils/format'

const router = useRouter()
const courses = ref<Course[]>([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const deleteTarget = ref<Course | null>(null)
const deleting = ref(false)
const total = ref(0)
const page = ref(1)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await coursesApi.list({ search: search.value || undefined, page: page.value, limit: 20 })
    courses.value = res.data.data
    total.value = res.data.meta?.total || 0
  } catch {
    error.value = 'Không thể tải danh sách khóa học'
  } finally {
    loading.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await coursesApi.delete(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } catch {
    error.value = 'Xóa khóa học thất bại'
  } finally {
    deleting.value = false
  }
}

let searchTimer: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; load() }, 400)
})

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Khóa học</h1>
        <p class="text-sm text-gray-500 mt-1">{{ total }} khóa học</p>
      </div>
      <BaseButton variant="primary" @click="router.push('/courses/create')">
        + Tạo khóa học
      </BaseButton>
    </div>

    <!-- Search -->
    <div class="mb-4 max-w-sm">
      <BaseInput v-model="search" placeholder="Tìm kiếm khóa học..." />
    </div>

    <AlertMessage v-if="error" type="error" :message="error" class="mb-4" />

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="courses.length === 0"
      title="Chưa có khóa học nào"
      description="Tạo khóa học đầu tiên để bắt đầu"
      icon="school"
    >
      <BaseButton variant="primary" class="mt-4" @click="router.push('/courses/create')">
        Tạo khóa học
      </BaseButton>
    </EmptyState>

    <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-4 py-3 font-medium text-gray-600">Tên khóa học</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Loại</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Ngày học</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Giảng viên</th>
              <th class="text-center px-4 py-3 font-medium text-gray-600">Học viên</th>
              <th class="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50 transition-colors" @click="router.push(`/courses/${course.id}`)">
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900">{{ course.course_name }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ course.training_format }}</p>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                  {{ course.training_type }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600 hidden lg:table-cell">
                {{ formatDate(course.start_date) }}
              </td>
              <td class="px-4 py-3 text-gray-600 hidden lg:table-cell">{{ course.instructor }}</td>
              <td class="px-4 py-3 text-center">
                <span class="font-medium text-gray-900">{{ course._count?.training_records ?? 0 }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span :class="['inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                  course.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500']">
                  {{ course.is_active ? 'Đang mở' : 'Đã đóng' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1 justify-end">
                  <BaseButton variant="ghost" size="sm" @click.stop="router.push(`/courses/${course.id}/edit`)">Sửa</BaseButton>
                  <BaseButton variant="ghost" size="sm" class="text-red-500 hover:bg-red-50" @click.stop="deleteTarget = course">Xóa</BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirm delete modal -->
    <BaseModal :show="!!deleteTarget" title="Xác nhận xóa" @close="deleteTarget = null">
      <p class="text-sm text-gray-600 mb-6">
        Bạn có chắc muốn xóa khóa học <strong>{{ deleteTarget?.course_name }}</strong>?
        Tất cả hồ sơ đào tạo liên quan cũng sẽ bị xóa.
      </p>
      <div class="flex gap-3 justify-end">
        <BaseButton variant="secondary" @click="deleteTarget = null">Hủy</BaseButton>
        <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">Xóa</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
