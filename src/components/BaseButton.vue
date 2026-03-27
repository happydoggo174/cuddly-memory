<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary' || !variant,
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        'text-gray-600 hover:bg-gray-100 focus:ring-gray-400': variant === 'ghost',
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-sm': size === 'md' || !size,
        'px-6 py-3 text-base': size === 'lg',
      },
    ]"
  >
    <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    <slot />
  </button>
</template>
