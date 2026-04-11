<template>
  <div class="space-y-4">
    <div
      v-for="item in activities"
      :key="item.id"
      class="flex gap-3 p-4 bg-card rounded-lg border border-border"
    >
      <UAvatar :src="item.avatar" size="sm" />
      <div class="flex-1">
        <p class="text-sm">
          <span class="font-medium">{{ item.user }}</span>
          {{ item.action }}
          <span class="font-medium">{{ item.target }}</span>
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          {{ formatDate(item.createdAt) }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="activities.length === 0" class="text-center py-8 text-muted-foreground">
      <Icon name="i-heroicons-clock" class="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>Aucune activité récente</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activities: any[]
}>()

function formatDate(value?: string | Date) {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long' }).format(d)
}
</script>
