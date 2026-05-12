<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <div
      v-for="col in columns"
      :key="col.id"
      class="flex-1 min-w-[260px] bg-muted/40 rounded-xl p-3 space-y-3"
    >
      <!-- En-tête colonne -->
      <div class="flex items-center justify-between px-1">
        <h3 class="text-sm font-semibold text-foreground">{{ col.label }}</h3>
        <span class="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {{ cardsByColumn[col.id]?.length ?? 0 }}
        </span>
      </div>

      <!-- Empty state -->
      <div
        v-if="!cardsByColumn[col.id]?.length"
        class="py-8 text-center text-xs text-muted-foreground border-2 border-dashed border-border rounded-lg"
      >
        Aucun dossier
      </div>

      <!-- Cartes -->
      <div
        v-for="card in cardsByColumn[col.id]"
        :key="card.id"
        :class="[
          'bg-card border rounded-xl p-3 cursor-pointer hover:shadow-sm transition-shadow space-y-2',
          isUrgent(card.submittedAt) ? 'border-l-4 border-l-amber-500 border-t border-r border-b border-border' : 'border-border',
        ]"
        @click="emit('card-click', card)"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="text-sm font-medium leading-tight">{{ card.ongName }}</span>
          <span v-if="isUrgent(card.submittedAt)" class="shrink-0 text-xs text-amber-600 font-semibold">
            ⚠ Urgent
          </span>
        </div>

        <div class="text-xs text-muted-foreground">
          Soumis {{ formatRelative(card.submittedAt) }}
        </div>

        <div v-if="card.score !== undefined" class="flex items-center gap-2">
          <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :class="card.score >= 70 ? 'bg-green-500' : card.score >= 40 ? 'bg-blue-500' : 'bg-amber-500'"
              :style="{ width: `${card.score}%` }"
            />
          </div>
          <span class="text-xs text-muted-foreground shrink-0">{{ card.score }}/100</span>
        </div>

        <!-- Actions (size=sm UX-DR21) -->
        <div class="flex gap-1 pt-1" @click.stop>
          <slot name="actions" :card="card" :column="col.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DossierCard, KanbanColumn, KanbanColumnId } from '../types'
import { isUrgent } from '../types'

const props = defineProps<{
  columns: KanbanColumn[]
  cards: DossierCard[]
}>()

const emit = defineEmits<{
  'card-click': [card: DossierCard]
  drop: [cardId: string, targetColumn: KanbanColumnId]
}>()

const cardsByColumn = computed<Record<KanbanColumnId, DossierCard[]>>(() => {
  const map = {} as Record<KanbanColumnId, DossierCard[]>
  for (const col of props.columns) map[col.id] = []
  for (const card of [...props.cards].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  )) {
    const colId: KanbanColumnId =
      card.status === 'under_review'        ? 'en_cours'
      : card.status === 'complement_required' ? 'complement_requis'
      : (card.status === 'verified' || card.status === 'active') ? 'valide'
      : 'a_verifier' // pending, submitted, rejected, inactive → À vérifier
    if (map[colId]) map[colId].push(card)
  }
  return map
})

function formatRelative(iso: string): string {
  const hours = (Date.now() - new Date(iso).getTime()) / 3_600_000
  if (hours < 1)  return 'il y a moins d\'1h'
  if (hours < 24) return `il y a ${Math.floor(hours)}h`
  return `il y a ${Math.floor(hours / 24)}j`
}
</script>
