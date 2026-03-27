<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div class="flex items-center justify-center py-12">
    <svg
      :class="['animate-spin text-blue-600', { 'w-6 h-6': size === 'sm', 'w-10 h-10': !size || size === 'md', 'w-14 h-14': size === 'lg' }]"
      fill="none" viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  </div>
</template>
