<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
    <div :class="[
      'w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
      {
        'bg-blue-50 text-blue-600': color === 'blue' || !color,
        'bg-green-50 text-green-600': color === 'green',
        'bg-purple-50 text-purple-600': color === 'purple',
        'bg-orange-50 text-orange-600': color === 'orange',
      }
    ]">
      {{ icon }}
    </div>
    <div>
      <p class="text-sm text-gray-500">{{ label }}</p>
      <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
    </div>
  </div>
</template>
