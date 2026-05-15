<template>
  <span :class="['inline-flex items-center font-medium whitespace-nowrap', sizeClasses, config.class]">
    {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import { getOngStatusConfig } from '~/features/ong/constants/ong-status'

const props = defineProps<{
  status: string
  size?: 'xs' | 'sm' | 'md'
}>()

const config = computed(() => getOngStatusConfig(props.status))

const sizeClasses = computed(() => {
  switch (props.size ?? 'sm') {
    case 'xs': return 'px-1.5 py-0.5 rounded text-xs'
    case 'md': return 'px-2.5 py-1 rounded-full text-sm'
    default:   return 'px-2 py-0.5 rounded-full text-xs'
  }
})
</script>
