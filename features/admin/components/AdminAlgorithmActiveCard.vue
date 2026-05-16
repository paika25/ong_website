<template>
  <div class="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
    <div class="flex items-start justify-between gap-4 flex-wrap mb-5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
          <Icon name="i-heroicons-bolt" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold">v{{ version.version }}</h2>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              Actif
            </span>
          </div>
          <p class="text-xs text-muted-foreground mt-0.5">
            Depuis le {{ formatDate(version.created_at) }}
            <template v-if="version.approved_at"> · Approuvé le {{ formatDate(version.approved_at) }}</template>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="text-right">
          <div class="text-xs text-muted-foreground">Total des poids</div>
          <div :class="['text-lg font-bold', weightsTotal !== 100 ? 'text-amber-600' : 'text-emerald-600']">
            {{ weightsTotal }}/100
          </div>
        </div>
      </div>
    </div>

    <!-- Critères avec barres visuelles -->
    <div class="space-y-3 mb-5">
      <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Poids des critères</h3>
      <div v-for="w in weightRows" :key="w.key" class="space-y-1">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium">{{ w.label }}</span>
          <span class="font-bold text-emerald-700 dark:text-emerald-400">{{ w.value }} pts</span>
        </div>
        <div class="h-2 bg-emerald-100 dark:bg-emerald-900 rounded-full overflow-hidden">
          <div
            class="h-full bg-emerald-500 rounded-full transition-all"
            :style="{ width: `${w.value}%` }"
          />
        </div>
        <p class="text-xs text-muted-foreground">{{ w.description }}</p>
      </div>
    </div>

    <!-- Seuils + documents requis -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white/60 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800">
        <h4 class="text-xs font-semibold text-muted-foreground mb-2">Seuils</h4>
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Soumission min.</span>
            <span class="font-semibold">{{ version.params_json.thresholds.submission_minimum }} pts</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Badge vérifié</span>
            <span class="font-semibold">{{ version.params_json.thresholds.verified_badge }} pts</span>
          </div>
        </div>
      </div>
      <div class="bg-white/60 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800">
        <h4 class="text-xs font-semibold text-muted-foreground mb-2">Documents requis ({{ version.params_json.required_documents.length }})</h4>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="doc in version.params_json.required_documents"
            :key="doc"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
          >
            {{ doc }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlgorithmVersion } from '../services/admin.algorithm.service'
import { WEIGHT_KEYS, weightsTotal as calcTotal } from '../services/admin.algorithm.service'

const props = defineProps<{ version: AlgorithmVersion }>()

const weightsTotal = computed(() => calcTotal(props.version.params_json.weights))

const weightRows = computed(() =>
  WEIGHT_KEYS.map(w => ({
    key:         w.key,
    label:       w.label,
    description: w.description,
    value:       props.version.params_json.weights[w.key],
  }))
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
