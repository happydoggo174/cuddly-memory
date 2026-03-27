<script setup lang="ts">
defineProps<{
  label?: string
  error?: string
  modelValue?: string
  options: { label: string; value: string }[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :class="[
        'w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50',
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
      ]"
    >
      <option value="" disabled>{{ placeholder || 'Chọn...' }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
