<template>
  <div
    class="bg-card border border-border rounded-xl p-3 cursor-pointer hover:shadow-sm transition-shadow space-y-2"
    :class="dimmed ? 'opacity-60' : ''"
    @click="emit('click')"
  >
    <!-- Ligne titre + badge statut -->
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-medium leading-tight">{{ card.ongName }}</span>
      <OngStatus :status="card.status" size="xs" class="shrink-0" />
    </div>

    <!-- Date -->
    <div class="text-xs text-muted-foreground">
      {{ formatDate(card.submittedAt) }}
    </div>

    <!-- Email agent -->
    <div v-if="card.agentEmail" class="text-xs text-muted-foreground truncate">
      {{ card.agentEmail }}
    </div>

    <!-- Barre de score -->
    <div v-if="card.score !== undefined" class="flex items-center gap-2">
      <div class="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="card.score >= 70 ? 'bg-green-500' : card.score >= 40 ? 'bg-blue-500' : 'bg-amber-500'"
          :style="{ width: `${card.score}%` }"
        />
      </div>
      <span class="text-xs text-muted-foreground shrink-0">{{ card.score }}/100</span>
    </div>

    <!-- Actions (slot) — stopPropagation pour ne pas ouvrir le modal -->
    <div class="flex flex-wrap gap-1 pt-1" @click.stop>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DossierCard } from '../types'

const props = defineProps<{
  card: DossierCard
  dimmed?: boolean
}>()

const emit = defineEmits<{ click: [] }>()


function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
