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
const gone = ref(false) // 410 - course inactive

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
    // Both 200 (duplicate) and 201 (new) go to success page
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
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <LoadingSpinner v-if="loading" />

      <!-- Course inactive -->
      <div v-else-if="gone" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div class="text-5xl mb-4">🔒</div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Khóa học đã đóng</h2>
        <p class="text-sm text-gray-500">Khóa học này không còn mở check-in.</p>
      </div>

      <!-- Not found -->
      <div v-else-if="pageError" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div class="text-5xl mb-4">❓</div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Không tìm thấy</h2>
        <p class="text-sm text-gray-500">{{ pageError }}</p>
      </div>

      <!-- Check-in form -->
      <div v-else-if="course" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Header -->
        <div class="bg-blue-600 px-6 py-5 text-white">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">Check-in</span>
          </div>
          <h1 class="text-xl font-bold">{{ course.course_name }}</h1>
        </div>

        <!-- Course info -->
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-400 text-xs">Ngày học</p>
              <p class="font-medium text-gray-800">{{ formatDate(course.start_date) }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">Giảng viên</p>
              <p class="font-medium text-gray-800">{{ course.instructor }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">Thời lượng</p>
              <p class="font-medium text-gray-800">{{ course.duration }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">Hình thức</p>
              <p class="font-medium text-gray-800">{{ course.training_format }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="px-6 py-5">
          <h2 class="font-semibold text-gray-900 mb-4">Thông tin của bạn</h2>

          <AlertMessage v-if="formError" type="error" :message="formError" class="mb-4" />

          <form @submit.prevent="submit" class="space-y-4">
            <BaseInput
              v-model="form.employee_name"
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              :error="errors.employee_name"
              required
            />
            <BaseInput
              v-model="form.employee_id"
              label="Mã số nhân viên"
              placeholder="NV001"
              :error="errors.employee_id"
              required
            />
            <BaseInput
              v-model="form.department"
              label="Phòng ban"
              placeholder="Kinh doanh"
              :error="errors.department"
              required
            />
            <BaseButton type="submit" variant="primary" size="lg" :loading="submitting" class="w-full mt-2">
              Xác nhận check-in
            </BaseButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
