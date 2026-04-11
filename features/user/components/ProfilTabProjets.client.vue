<template>
  <div class="space-y-4">
    <div v-if="projects.length > 0" class="grid gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-card rounded-lg border border-border p-6"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-semibold">{{ project.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ project.ong }}</p>
          </div>
          <UBadge :color="getProjectStatusColor(project.status)" variant="soft">
            {{ project.status }}
          </UBadge>
        </div>
        <p class="text-sm text-muted-foreground mb-3">{{ project.description }}</p>
        <div class="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{{ formatDate(project.startDate) }}</span>
          <span>•</span>
          <span>{{ project.participants }} participants</span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8 text-muted-foreground">
      <Icon name="i-heroicons-folder" class="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>{{ isOwnProfile ? "Vous n'avez pas encore de projets" : 'Aucun projet' }}</p>
    </div>
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
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long' }).format(d)
}

function getProjectStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'en cours': return 'yellow'
    case 'terminé': return 'green'
    case 'planifié': return 'blue'
    default: return 'gray'
  }
}
</script>
