<template>
  <div class="space-y-4">
    <!-- Barre de score (ARIA role=meter) -->
    <div>
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm font-medium">Score de Transparence</span>
        <span class="text-sm font-bold text-gray-500">{{ score }}/100</span>
      </div>
      <div
        role="meter"
        :aria-valuenow="score"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Score de transparence : ${score} sur 100`"
        class="h-3 bg-muted rounded-full overflow-hidden"
      >
        <div
          class="h-full rounded-full score-bar"
          :class="barColor"
          :style="{ width: `${score}%` }"
        />
      </div>
      <div class="flex justify-between text-xs text-muted-foreground mt-1">
        <span>0 — Insuffisant</span>
        <span class="text-amber-600">40 min. soumission</span>
        <span class="text-green-600">70 badge vérifié</span>
      </div>
    </div>

    <!-- Critères atteints -->
    <div v-if="criteria?.length" class="space-y-2">
      <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Critères</h4>
      <div
        v-for="c in criteria"
        :key="c.key"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center gap-2">
          <span :class="c.achieved ? 'text-green-500' : 'text-muted-foreground'">
            {{ c.achieved ? '✓' : '○' }}
          </span>
          <span :class="c.achieved ? '' : 'text-muted-foreground'">{{ c.label }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="!c.achieved"
            class="text-xs text-primary font-medium"
          >
            +{{ c.points }} pts
          </span>
          <span class="text-xs text-muted-foreground">{{ c.points }} pts</span>
        </div>
      </div>
    </div>

    <!-- CTA action contextuel -->
    <UButton
      v-if="nextAction"
      variant="outline"
      size="sm"
      class="w-full"
      @click="emit('action-click', nextAction)"
    >
      {{ nextAction.label }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
export interface ScoreCriterion {
  key:      string
  label:    string
  points:   number
  achieved: boolean
}

export interface ScoreAction {
  key:   string
  label: string
  href?: string
}

const props = defineProps<{
  score:    number
  criteria?: ScoreCriterion[]
  onActionClick?: (action: ScoreAction) => void
}>()

const emit = defineEmits<{ 'action-click': [action: ScoreAction] }>()

const barColor = computed(() => {
  if (props.score < 40) return 'bg-amber-500'
  if (props.score < 70) return 'bg-blue-500'
  if (props.score < 90) return 'bg-teal-500'
  return 'bg-green-500'
})

const nextAction = computed<ScoreAction | null>(() => {
  if (!props.criteria) return null
  const first = props.criteria.find(c => !c.achieved)
  if (!first) return null
  const ACTION_MAP: Record<string, string> = {
    documents_uploaded:   'Uploader les documents obligatoires',
    profile_complete:     'Compléter votre profil',
    backoffice_validated: 'Soumettre votre dossier à validation',
    financial_reports:    'Ajouter votre rapport financier audité',
    projects_declared:    'Déclarer au moins un projet',
  }
  return { key: first.key, label: ACTION_MAP[first.key] ?? `Compléter : ${first.label}` }
})
</script>

<style>
@media (prefers-reduced-motion: reduce) {
  .score-bar { transition: none !important; }
}
.score-bar { transition: width 0.6s ease; }
</style>
