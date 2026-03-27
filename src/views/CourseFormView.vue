<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { coursesApi } from '@/api/courses'
import type { CourseForm } from '@/types'
import { TRAINING_FORMATS, TRAINING_TYPES } from '@/utils/constants'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseButton from '@/components/BaseButton.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const isEdit = computed(() => !!route.params.id)

const form = ref<CourseForm>({
  course_name: '',
  start_date: '',
  end_date: '',
  instructor: '',
  duration: '',
  training_format: '',
  training_type: '',
  is_active: true,
})

const errors = ref<Partial<Record<keyof CourseForm, string>>>({})
const loading = ref(false)
const fetchLoading = ref(false)
const apiError = ref('')

const formatOptions = TRAINING_FORMATS.map(f => ({ label: f, value: f }))
const typeOptions = TRAINING_TYPES.map(t => ({ label: t, value: t }))

function validate(): boolean {
  errors.value = {}
  if (!form.value.course_name) errors.value.course_name = 'Bắt buộc'
  if (!form.value.start_date) errors.value.start_date = 'Bắt buộc'
  if (!form.value.end_date) errors.value.end_date = 'Bắt buộc'
  if (form.value.start_date && form.value.end_date && form.value.end_date < form.value.start_date)
    errors.value.end_date = 'Ngày kết thúc phải sau ngày bắt đầu'
  if (!form.value.instructor) errors.value.instructor = 'Bắt buộc'
  if (!form.value.duration) errors.value.duration = 'Bắt buộc'
  if (!form.value.training_format) errors.value.training_format = 'Bắt buộc'
  if (!form.value.training_type) errors.value.training_type = 'Bắt buộc'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  loading.value = true
  apiError.value = ''
  try {
    if (isEdit.value) {
      await coursesApi.update(route.params.id as string, form.value)
    } else {
      await coursesApi.create(form.value)
    }
    router.push('/courses')
  } catch (e: any) {
    apiError.value = e.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    fetchLoading.value = true
    try {
      const res = await coursesApi.get(route.params.id as string)
      const c = res.data.data
      form.value = {
        course_name: c.course_name,
        start_date: c.start_date,
        end_date: c.end_date,
        instructor: c.instructor,
        duration: c.duration,
        training_format: c.training_format,
        training_type: c.training_type,
        is_active: c.is_active,
      }
    } catch {
      apiError.value = 'Không thể tải thông tin khóa học'
    } finally {
      fetchLoading.value = false
    }
  }
})
</script>

<template>
  <div class="max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới' }}</h1>
      </div>
    </div>

    <LoadingSpinner v-if="fetchLoading" />

    <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <AlertMessage v-if="apiError" type="error" :message="apiError" class="mb-5" />

      <form @submit.prevent="submit" class="space-y-5">
        <BaseInput
          v-model="form.course_name"
          label="Tên khóa học"
          placeholder="VD: Kỹ năng giao tiếp nội bộ"
          :error="errors.course_name"
          required
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.start_date"
            label="Ngày bắt đầu"
            type="date"
            :error="errors.start_date"
            required
          />
          <BaseInput
            v-model="form.end_date"
            label="Ngày kết thúc"
            type="date"
            :error="errors.end_date"
            required
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.instructor"
            label="Giảng viên"
            placeholder="VD: Nguyễn Văn A"
            :error="errors.instructor"
            required
          />
          <BaseInput
            v-model="form.duration"
            label="Thời lượng"
            placeholder="VD: 8 giờ"
            :error="errors.duration"
            required
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseSelect
            v-model="form.training_format"
            label="Hình thức đào tạo"
            :options="formatOptions"
            placeholder="Chọn hình thức"
            :error="errors.training_format"
            required
          />
          <BaseSelect
            v-model="form.training_type"
            label="Loại đào tạo"
            :options="typeOptions"
            placeholder="Chọn loại"
            :error="errors.training_type"
            required
          />
        </div>

        <!-- Custom training type input if "Khác" selected -->
        <BaseInput
          v-if="form.training_type === 'Khác'"
          v-model="form.training_type"
          label="Nhập loại đào tạo"
          placeholder="Nhập loại đào tạo..."
        />

        <div v-if="isEdit" class="flex items-center gap-3">
          <input
            id="is_active"
            type="checkbox"
            v-model="form.is_active"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label for="is_active" class="text-sm font-medium text-gray-700">Mở check-in</label>
        </div>

        <div class="flex gap-3 pt-2">
          <BaseButton variant="secondary" type="button" @click="router.back()">Hủy</BaseButton>
          <BaseButton variant="primary" type="submit" :loading="loading">
            {{ isEdit ? 'Lưu thay đổi' : 'Tạo khóa học' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
