<template>
  <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{{ label }}</span>
      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconBg]">
        <Icon :name="icon" class="w-4 h-4" :class="iconColor" />
      </div>
    </div>
    <div class="text-2xl font-bold">
      <span v-if="loading" class="inline-block h-7 w-16 bg-muted rounded animate-pulse" />
      <span v-else>{{ value }}</span>
    </div>
    <div v-if="sub" class="text-xs text-muted-foreground">{{ sub }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  value: string | number
  sub?: string
  icon: string
  iconBg?: string
  iconColor?: string
  loading?: boolean
}>(), {
  iconBg: 'bg-primary/10',
  iconColor: 'text-primary',
  loading: false,
})
</script>
