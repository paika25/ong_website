<template>
  <div class="px-5 py-16 text-center text-muted-foreground">
    <Icon :name="icon" class="w-10 h-10 mx-auto mb-3 opacity-30" />
    <p class="font-medium mb-1 text-foreground">{{ title }}</p>
    <p v-if="description" class="text-xs mb-5">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
}>()
</script>
