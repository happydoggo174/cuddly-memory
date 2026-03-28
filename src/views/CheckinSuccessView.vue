<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const name = route.query.name as string
const course = route.query.course as string
const isDuplicate = route.query.duplicate === '1'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
      <div class="text-7xl mb-5">{{ isDuplicate ? '⚠️' : '✅' }}</div>

      <h1 class="text-2xl font-bold text-gray-900 mb-3">
        {{ isDuplicate ? 'Đã check-in trước đó' : 'Check-in thành công!' }}
      </h1>

      <p class="text-gray-500 text-base leading-relaxed">
        {{ isDuplicate
          ? 'Bạn đã check-in cho khóa học này rồi.'
          : `Xin chào ${name}, bạn đã điểm danh thành công.`
        }}
      </p>

      <p v-if="course" class="text-blue-600 font-semibold text-base mt-4 bg-blue-50 px-4 py-3 rounded-xl">
        {{ course }}
      </p>

      <p class="text-sm text-gray-400 mt-8">Bạn có thể đóng trang này.</p>
    </div>
  </div>
</template>
