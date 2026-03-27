<script setup lang="ts">
defineProps<{ title: string; description?: string; icon?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="text-5xl mb-4">{{ icon || '📭' }}</div>
    <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
    <p v-if="description" class="text-sm text-gray-400 mt-1 max-w-xs">{{ description }}</p>
    <slot />
  </div>
</template>
