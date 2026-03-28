<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { checkinApi } from '@/api/checkin'
import type { Course, CheckinForm } from '@/types'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

const course = ref<Course | null>(null)
const loading = ref(true)
const submitting = ref(false)
const pageError = ref('')
const formError = ref('')
const gone = ref(false)

const form = ref<CheckinForm>({
  employee_name: '',
  employee_id: '',
  department: '',
})
const errors = ref<Partial<CheckinForm>>({})

onMounted(async () => {
  try {
    const res = await checkinApi.getCourse(slug)
    course.value = res.data.data
  } catch (e: any) {
    if (e.response?.status === 410) {
      gone.value = true
    } else {
      pageError.value = 'Không tìm thấy khóa học này'
    }
  } finally {
    loading.value = false
  }
})

function validate(): boolean {
  errors.value = {}
  if (!form.value.employee_name.trim()) errors.value.employee_name = 'Bắt buộc'
  if (!form.value.employee_id.trim()) errors.value.employee_id = 'Bắt buộc'
  if (!form.value.department.trim()) errors.value.department = 'Bắt buộc'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  formError.value = ''
  try {
    const res = await checkinApi.submit(slug, form.value)
    router.push({
      name: 'checkin-success',
      params: { slug },
      query: {
        name: form.value.employee_name,
        course: course.value?.course_name,
        duplicate: res.status === 200 ? '1' : '0',
      },
    })
  } catch (e: any) {
    formError.value = e.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-4 pt-6">
    <div class="w-full max-w-lg">
      <LoadingSpinner v-if="loading" />

      <!-- Course inactive -->
      <div v-else-if="gone" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <div class="text-6xl mb-5">🔒</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Khóa học đã đóng</h2>
        <p class="text-base text-gray-500">Khóa học này không còn mở check-in.</p>
      </div>

      <!-- Not found -->
      <div v-else-if="pageError" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <div class="text-6xl mb-5">❓</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy</h2>
        <p class="text-base text-gray-500">{{ pageError }}</p>
      </div>

      <!-- Check-in form -->
      <div v-else-if="course" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <!-- Header -->
        <div class="bg-blue-600 px-6 py-6 text-white">
          <span class="text-sm bg-white/20 px-3 py-1 rounded-full inline-block mb-3">📋 Check-in</span>
          <h1 class="text-2xl font-bold leading-snug">{{ course.course_name }}</h1>
        </div>

        <!-- Course info -->
        <div class="px-6 py-5 bg-gray-50 border-b border-gray-100">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-xs mb-1">Ngày học</p>
              <p class="font-semibold text-gray-800 text-base">{{ formatDate(course.start_date) }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs mb-1">Giảng viên</p>
              <p class="font-semibold text-gray-800 text-base">{{ course.instructor }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs mb-1">Thời lượng</p>
              <p class="font-semibold text-gray-800 text-base">{{ course.duration }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs mb-1">Hình thức</p>
              <p class="font-semibold text-gray-800 text-base">{{ course.training_format }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="px-6 py-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5">Thông tin của bạn</h2>

          <AlertMessage v-if="formError" type="error" :message="formError" class="mb-5" />

          <form @submit.prevent="submit" class="space-y-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-base font-medium text-gray-700">
                Họ và tên <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.employee_name"
                type="text"
                placeholder="Nguyễn Văn A"
                class="w-full px-4 py-3.5 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="errors.employee_name ? 'border-red-400 bg-red-50' : 'border-gray-300'"
              />
              <p v-if="errors.employee_name" class="text-sm text-red-500">{{ errors.employee_name }}</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-base font-medium text-gray-700">
                Mã số nhân viên <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.employee_id"
                type="text"
                placeholder="NV001"
                class="w-full px-4 py-3.5 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="errors.employee_id ? 'border-red-400 bg-red-50' : 'border-gray-300'"
              />
              <p v-if="errors.employee_id" class="text-sm text-red-500">{{ errors.employee_id }}</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-base font-medium text-gray-700">
                Phòng ban <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.department"
                type="text"
                placeholder="Kinh doanh"
                class="w-full px-4 py-3.5 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="errors.department ? 'border-red-400 bg-red-50' : 'border-gray-300'"
              />
              <p v-if="errors.department" class="text-sm text-red-500">{{ errors.department }}</p>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <svg v-if="submitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {{ submitting ? 'Đang xử lý...' : 'Xác nhận check-in' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
