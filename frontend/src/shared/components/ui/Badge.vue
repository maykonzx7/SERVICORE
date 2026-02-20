<template>
  <span :class="['badge', `badge-${variant}`, `badge-${size}`]">
    <slot>{{ value }}</slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  value?: string | number
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  line-height: 1;
}

.badge-sm {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
}

.badge-md {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.badge-lg {
  padding: 0.375rem 1rem;
  font-size: 1rem;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.badge-success {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>

