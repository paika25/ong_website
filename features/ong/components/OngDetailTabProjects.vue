<template>
  <div class="space-y-4">
    <div v-if="projects.length === 0" class="bg-card rounded-xl border border-border p-12 text-center">
      <Icon name="i-heroicons-folder-open" class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-semibold mb-2">Aucun projet</h3>
      <p class="text-muted-foreground">Cette ONG n'a pas encore de projets enregistrés.</p>
    </div>

    <div
      v-for="project in projects"
      :key="project.id"
      class="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
    >
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-xl font-semibold mb-2">{{ project.name }}</h3>
          <p class="text-muted-foreground mb-3">{{ project.description }}</p>
        </div>
        <UBadge
          :color="getProjectStatusColor(project.status)"
          variant="soft"
          size="lg"
        >
          {{ getProjectStatusLabel(project.status) }}
        </UBadge>
      </div>

      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-1">
          <Icon name="i-heroicons-calendar" class="w-4 h-4" />
          <span>Début: {{ formatDate(project.startDate) }}</span>
        </div>
        <div v-if="project.endDate" class="flex items-center gap-1">
          <Icon name="i-heroicons-calendar" class="w-4 h-4" />
          <span>Fin: {{ formatDate(project.endDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '../type'

defineProps<{
  projects: Project[]
  getProjectStatusColor: (status: string) => string
  getProjectStatusLabel: (status: string) => string
  formatDate: (date: string) => string
}>()
</script>
