<template>
  <div class="flex gap-3 overflow-x-auto pb-4">
    <div
      v-for="col in columns"
      :key="col.id"
      class="flex-1 min-w-[240px] bg-muted/40 rounded-xl p-3 space-y-2"
    >
      <!-- En-tête colonne -->
      <div class="flex items-center justify-between px-1 mb-2">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full shrink-0" :class="colorClass(col.color)" />
          <h3 class="text-sm font-semibold text-foreground">{{ col.label }}</h3>
        </div>
        <span class="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">
          {{ cardsByColumn[col.id]?.length ?? 0 }}
        </span>
      </div>

      <!-- Empty state -->
      <div
        v-if="!cardsByColumn[col.id]?.length"
        class="py-6 text-center text-xs text-muted-foreground border-2 border-dashed border-border rounded-lg"
      >
        Aucun dossier
      </div>

      <!-- Cartes -->
      <KanbanCard
        v-for="card in cardsByColumn[col.id]"
        :key="card.id"
        :card="card"
        :dimmed="col.id === 'cloture'"
        @click="emit('card-click', card)"
      >
        <template #actions>
          <slot name="actions" :card="card" :column="col.id" />
        </template>
      </KanbanCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KanbanColumn, KanbanColumnId, DossierCard } from '../types'
import { KANBAN_STATUSES, ongStatusToColumn } from '../types'
import KanbanCard from './KanbanCard.vue'

const props = defineProps<{
  columns: KanbanColumn[]
  cards: DossierCard[]
}>()

const emit = defineEmits<{
  'card-click': [card: DossierCard]
}>()

const cardsByColumn = computed<Record<KanbanColumnId, DossierCard[]>>(() => {
  const map = {} as Record<KanbanColumnId, DossierCard[]>
  for (const col of props.columns) map[col.id] = []

  const sorted = [...props.cards]
    .filter(c => KANBAN_STATUSES.has(c.status))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  for (const card of sorted) {
    const colId = ongStatusToColumn(card.status)
    if (map[colId]) map[colId].push(card)
  }
  return map
})

const COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-500',
  purple: 'bg-purple-500',
  amber:  'bg-amber-500',
  red:    'bg-red-500',
  green:  'bg-green-500',
  gray:   'bg-gray-400',
}

function colorClass(color?: string): string {
  return COLOR_MAP[color ?? ''] ?? 'bg-gray-400'
}
</script>
