<script setup lang="ts">
defineProps<{
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}>()
</script>

<template>
  <div :class="[
    'flex items-start gap-3 px-4 py-3 rounded-lg text-sm',
    {
      'bg-green-50 text-green-800 border border-green-200': type === 'success',
      'bg-red-50 text-red-800 border border-red-200': type === 'error',
      'bg-yellow-50 text-yellow-800 border border-yellow-200': type === 'warning',
      'bg-blue-50 text-blue-800 border border-blue-200': type === 'info',
    }
  ]">
    <span class="text-base leading-none mt-0.5">
      {{ type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️' }}
    </span>
    <span>{{ message }}</span>
  </div>
</template>
