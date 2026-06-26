<template>
  <div class="pt-2 space-y-3">
    <template v-if="projects.length > 0">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-card rounded-xl border border-border p-5 hover:border-border/80 transition-colors"
      >
        <div class="flex items-start justify-between gap-4 mb-3">
          <div class="flex items-start gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="i-heroicons-briefcase" class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-sm leading-tight">{{ project.name }}</h3>
              <p class="text-xs text-muted-foreground mt-0.5">{{ project.ong }}</p>
            </div>
          </div>
          <UBadge :color="statusColor(project.status)" variant="soft" size="xs" class="shrink-0">
            {{ project.status }}
          </UBadge>
        </div>

        <p v-if="project.description" class="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {{ project.description }}
        </p>

        <div class="flex items-center gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <Icon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
            {{ formatDate(project.startDate) }}
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="i-heroicons-users" class="w-3.5 h-3.5" />
            {{ project.participants }} participants
          </span>
        </div>
      </div>
    </template>

    <EmptyState
      v-else
      icon="i-heroicons-briefcase"
      :title="isOwnProfile ? 'Vous n\'avez pas encore de projets' : 'Aucun projet'"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  projects: any[]
  isOwnProfile: boolean
}>()

function formatDate(value?: string | Date) {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'short' }).format(d)
}

function statusColor(status: string) {
  const s = status.toLowerCase()
  if (s.includes('cours'))   return 'yellow'
  if (s.includes('terminé')) return 'green'
  if (s.includes('planif'))  return 'blue'
  return 'gray'
}
</script>
