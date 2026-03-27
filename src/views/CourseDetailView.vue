<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { coursesApi } from '@/api/courses'
import type { Course, Attendee } from '@/types'
import BaseButton from '@/components/BaseButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import EmptyState from '@/components/EmptyState.vue'
import { formatDate, formatDateTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const course = ref<Course | null>(null)
const attendees = ref<Attendee[]>([])
const loading = ref(true)
const error = ref('')
const copied = ref(false)

// Build frontend checkin URL from slug (not the backend URL from API)
function getFrontendCheckinUrl(c: Course): string {
  const slug = c.checkin_slug ?? c.id
  return `${window.location.origin}/checkin/${slug}`
}

onMounted(async () => {
  try {
    const [courseRes, attendeesRes] = await Promise.all([
      coursesApi.get(route.params.id as string),
      coursesApi.attendees(route.params.id as string, { limit: 100 }),
    ])
    course.value = courseRes.data.data
    attendees.value = attendeesRes.data.data
  } catch {
    error.value = 'Không thể tải thông tin khóa học'
  } finally {
    loading.value = false
  }
})

function copyLink() {
  if (!course.value) return
  navigator.clipboard.writeText(getFrontendCheckinUrl(course.value))
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function downloadQR() {
  const qr = course.value?.qr_code_value
  if (!qr) return
  const link = document.createElement('a')
  link.href = qr
  link.download = `qr-${course.value?.checkin_slug ?? course.value?.id}.png`
  link.click()
}

function printQR() {
  const qr = course.value?.qr_code_value
  if (!qr) return
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
    <html><head><title>QR - ${course.value?.course_name}</title></head>
    <body style="display:flex;flex-direction:column;align-items:center;padding:40px;font-family:sans-serif">
      <h2>${course.value?.course_name}</h2>
      <img src="${qr}" style="width:300px;height:300px" />
      <p style="margin-top:16px;color:#666;font-size:14px">Quét QR để check-in</p>
    </body></html>
  `)
  win.document.close()
  win.print()
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Chi tiết khóa học</h1>
    </div>

    <LoadingSpinner v-if="loading" />
    <AlertMessage v-else-if="error" type="error" :message="error" />

    <template v-else-if="course">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Course info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">{{ course.course_name }}</h2>
              <span :class="['px-2.5 py-1 rounded-full text-xs font-medium',
                course.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500']">
                {{ course.is_active ? 'Đang mở' : 'Đã đóng' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-400 text-xs mb-1">Ngày bắt đầu</p>
                <p class="font-medium text-gray-900">{{ formatDate(course.start_date) }}</p>
              </div>
              <div>
                <p class="text-gray-400 text-xs mb-1">Ngày kết thúc</p>
                <p class="font-medium text-gray-900">{{ formatDate(course.end_date) }}</p>
              </div>
              <div>
                <p class="text-gray-400 text-xs mb-1">Giảng viên</p>
                <p class="font-medium text-gray-900">{{ course.instructor }}</p>
              </div>
              <div>
                <p class="text-gray-400 text-xs mb-1">Thời lượng</p>
                <p class="font-medium text-gray-900">{{ course.duration }}</p>
              </div>
              <div>
                <p class="text-gray-400 text-xs mb-1">Loại đào tạo</p>
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">{{ course.training_type }}</span>
              </div>
              <div>
                <p class="text-gray-400 text-xs mb-1">Hình thức</p>
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700">{{ course.training_format }}</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <BaseButton variant="secondary" size="sm" @click="router.push(`/courses/${course.id}/edit`)">
                ✏️ Chỉnh sửa
              </BaseButton>
            </div>
          </div>

          <!-- Attendees -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">Danh sách học viên</h3>
              <span class="text-sm text-gray-500">{{ attendees.length }} người</span>
            </div>

            <EmptyState v-if="attendees.length === 0" title="Chưa có học viên check-in" icon="👥" />

            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="text-left py-2 px-3 font-medium text-gray-500">Họ tên</th>
                    <th class="text-left py-2 px-3 font-medium text-gray-500">Mã NV</th>
                    <th class="text-left py-2 px-3 font-medium text-gray-500 hidden sm:table-cell">Phòng ban</th>
                    <th class="text-left py-2 px-3 font-medium text-gray-500 hidden md:table-cell">Thời gian</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="a in attendees" :key="a.id" class="hover:bg-gray-50">
                    <td class="py-2.5 px-3 font-medium text-gray-900">{{ a.employee_name }}</td>
                    <td class="py-2.5 px-3 text-gray-600">{{ a.employee_id }}</td>
                    <td class="py-2.5 px-3 text-gray-600 hidden sm:table-cell">{{ a.department }}</td>
                    <td class="py-2.5 px-3 text-gray-400 hidden md:table-cell">{{ formatDateTime(a.checkin_time) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- QR Code panel -->
        <div class="space-y-4">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <h3 class="font-semibold text-gray-900 mb-4">QR Check-in</h3>

            <div v-if="course.qr_code_value" class="mb-4">
              <img :src="course.qr_code_value" alt="QR Code" class="w-48 h-48 mx-auto rounded-lg" />
            </div>
            <div v-else class="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-4">
              Không có QR
            </div>

            <div class="space-y-2">
              <BaseButton variant="primary" size="sm" class="w-full" @click="downloadQR">
                ⬇️ Tải QR
              </BaseButton>
              <BaseButton variant="secondary" size="sm" class="w-full" @click="printQR">
                🖨️ In QR
              </BaseButton>
            </div>
          </div>

          <!-- Check-in link -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 class="font-semibold text-gray-900 mb-3 text-sm">Link check-in</h3>
            <a
              :href="getFrontendCheckinUrl(course)"
              target="_blank"
              class="block bg-gray-50 rounded-lg px-3 py-2 text-xs text-blue-600 break-all mb-3 hover:bg-blue-50 transition-colors"
            >
              {{ getFrontendCheckinUrl(course) }}
            </a>
            <BaseButton variant="secondary" size="sm" class="w-full" @click="copyLink">
              {{ copied ? '✅ Đã copy' : '📋 Copy link' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
