<template>
  <div class="space-y-5">
    <!-- Barre de score -->
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-sm font-medium">Score de transparence</span>
        <span class="text-sm font-bold">{{ score }}/100</span>
      </div>
      <div class="h-3 bg-muted rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-700"
          :class="barColor"
          :style="{ width: `${score}%` }"
        />
      </div>
      <div class="flex justify-between text-xs text-muted-foreground mt-1.5">
        <span>0 — Insuffisant</span>
        <span class="text-amber-600 font-medium">40 min. soumission</span>
        <span class="text-green-600 font-medium">70 badge vérifié</span>
      </div>
    </div>

    <!-- Critères -->
    <div class="space-y-2">
      <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Critères de scoring</h4>
      <div
        v-for="c in criteria"
        :key="c.key"
        class="flex items-center justify-between py-2 px-3 rounded-lg"
        :class="c.achieved ? 'bg-green-50 dark:bg-green-950/40' : 'bg-muted/40'"
      >
        <div class="flex items-center gap-2.5">
          <div :class="['w-5 h-5 rounded-full flex items-center justify-center shrink-0', c.achieved ? 'bg-green-500' : 'bg-border']">
            <Icon
              :name="c.achieved ? 'i-heroicons-check' : 'i-heroicons-minus'"
              class="w-3 h-3"
              :class="c.achieved ? 'text-white' : 'text-muted-foreground'"
            />
          </div>
          <span class="text-sm" :class="c.achieved ? 'font-medium' : 'text-muted-foreground'">{{ c.label }}</span>
        </div>
        <span
          :class="['text-xs font-semibold px-2 py-0.5 rounded-full', c.achieved
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-muted text-muted-foreground']"
        >
          {{ c.points }} pts
        </span>
      </div>
    </div>

    <!-- Seuils -->
    <div class="grid grid-cols-2 gap-3 pt-1">
      <div :class="['p-3 rounded-lg border text-center', score >= 40 ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800' : 'bg-muted/40 border-border']">
        <div :class="['text-xs font-semibold', score >= 40 ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground']">
          Seuil soumission
        </div>
        <div class="text-lg font-bold mt-0.5">40 pts</div>
        <div :class="['text-xs mt-0.5', score >= 40 ? 'text-green-600' : 'text-muted-foreground']">
          {{ score >= 40 ? 'Atteint' : `Manque ${40 - score} pts` }}
        </div>
      </div>
      <div :class="['p-3 rounded-lg border text-center', score >= 70 ? 'bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800' : 'bg-muted/40 border-border']">
        <div :class="['text-xs font-semibold', score >= 70 ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground']">
          Seuil badge
        </div>
        <div class="text-lg font-bold mt-0.5">70 pts</div>
        <div :class="['text-xs mt-0.5', score >= 70 ? 'text-green-600' : 'text-muted-foreground']">
          {{ score >= 70 ? 'Atteint' : `Manque ${70 - score} pts` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScoreCriterion } from '../services/admin.ong.service'

const props = defineProps<{
  score:    number
  criteria: ScoreCriterion[]
}>()

const barColor = computed(() => {
  if (props.score < 40) return 'bg-amber-500'
  if (props.score < 70) return 'bg-blue-500'
  return 'bg-green-500'
})
</script>
