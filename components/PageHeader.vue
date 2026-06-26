<template>
  <div class="flex items-center justify-between gap-4">
    <div class="min-w-0">
      <h1 class="text-2xl font-bold tracking-tight">{{ title }}</h1>
      <p v-if="subtitle || $slots.subtitle" class="text-sm text-muted-foreground mt-1">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-3 shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
