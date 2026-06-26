<template>
  <div>
    <EmptyState v-if="!projects.length" icon="i-heroicons-folder-open" title="Aucun projet déclaré par cette ONG" />

    <div v-else class="space-y-3">
      <div
        v-for="p in projects"
        :key="p.id"
        class="border border-border rounded-xl p-4 bg-card"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-sm font-semibold">{{ p.name }}</h4>
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', projectStatusClass(p.status)]">
                {{ projectStatusLabel(p.status) }}
              </span>
            </div>
            <p v-if="p.description" class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ p.description }}</p>
          </div>
          <div v-if="p.budget" class="text-sm font-semibold shrink-0 text-emerald-600">
            {{ formatEur(p.budget) }}
          </div>
        </div>

        <div class="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-muted-foreground">
          <span v-if="p.startDate">
            <span class="font-medium">Début :</span> {{ formatDate(p.startDate) }}
          </span>
          <span v-if="p.endDate">
            <span class="font-medium">Fin :</span> {{ formatDate(p.endDate) }}
          </span>
          <span v-if="p.impact">
            <span class="font-medium">Impact :</span> {{ p.impact }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/features/ong/type'

defineProps<{ projects: Project[] }>()

const PROJECT_STATUS_LABELS: Record<string, string> = {
  planned:   'Planifié',
  ongoing:   'En cours',
  completed: 'Terminé',
  canceled:  'Annulé',
}

const PROJECT_STATUS_CLASSES: Record<string, string> = {
  planned:   'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  ongoing:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  canceled:  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

function projectStatusLabel(s: string): string { return PROJECT_STATUS_LABELS[s] ?? s }
function projectStatusClass(s: string): string { return PROJECT_STATUS_CLASSES[s] ?? 'bg-gray-100 text-gray-600' }

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
