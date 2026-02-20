<template>
  <div class="select-wrapper">
    <label v-if="label" :for="selectId" class="select-label">
      {{ label }}
      <span v-if="required" class="select-required">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="['select', { 'select-error': error, 'select-disabled': disabled }]"
      @change="handleChange"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <option v-if="placeholder" :value="undefined" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="String(option.value ?? '')" :value="option.value ?? ''">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="select-error-message">{{ error }}</span>
    <span v-if="hint && !error" class="select-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SelectOption {
  value: string | number | undefined
  label: string
}

interface Props {
  modelValue: string | number | undefined
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value === '' ? undefined : target.value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.select-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.select-required {
  color: #ef4444;
}

.select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
  transition: all 0.2s;
  font-family: inherit;
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-error {
  border-color: #ef4444;
}

.select-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.select-disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.select-error-message {
  font-size: 0.875rem;
  color: #ef4444;
}

.select-hint {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>

