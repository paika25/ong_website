<template>
  <div class="space-y-6">
    <!-- Score de Transparence (Story 4.2) -->
    <div v-if="score !== undefined" class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-lg font-semibold mb-4">Score de Transparence</h2>
      <ScoreTransparenceWidget :score="score" :criteria="criteria" />
    </div>

    <!-- Informations légales -->
    <div v-if="legal" class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-2xl font-semibold mb-6">Informations légales</h2>
      <div class="flex flex-col md:flex-row gap-8">

        <!-- Conformité (gauche) -->
        <div v-if="legal.compliance" class="flex-1">
          <div class="text-sm text-muted-foreground mb-3">Conformité</div>
          <div class="space-y-2">
            <div v-if="legal.compliance.dataProtection" class="flex items-start gap-2">
              <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-left">{{ legal.compliance.dataProtection }}</span>
            </div>
            <div v-if="legal.compliance.financialTransparency" class="flex items-start gap-2">
              <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-left">{{ legal.compliance.financialTransparency }}</span>
            </div>
          </div>
        </div>

        <!-- SIRET + Date (droite) -->
        <div class="flex-1 space-y-3">
          <div v-if="legal.siret" class="flex items-center gap-5">
            <div class="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="i-heroicons-identification" class="w-5 h-5 text-primary" />
            </div>
            <div class="text-left">
              <div class="text-xs text-muted-foreground">SIRET</div>
              <div class="text-sm font-medium">{{ legal.siret }}</div>
            </div>
          </div>
          <div v-if="legal.registrationDate" class="flex items-center gap-5">
            <div class="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="i-heroicons-calendar" class="w-5 h-5 text-primary" />
            </div>
            <div class="text-left">
              <div class="text-xs text-muted-foreground">Date d'enregistrement</div>
              <div class="text-sm font-medium">{{ formatDate(legal.registrationDate) }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Monitoring et évaluation -->
    <div v-if="monitoring" class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-2xl font-semibold mb-4">Suivi et évaluation</h2>
      <div class="space-y-4">
        <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Icon name="i-heroicons-document-chart-bar" class="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <div class="font-semibold mb-1 flex flex-column items-start">Rapports</div>
            <div class="text-sm text-muted-foreground">{{ monitoring.reportsFrequency }}</div>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Icon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <div class="font-semibold mb-1 flex flex-column items-start">Évaluation</div>
            <div class="text-sm text-muted-foreground">{{ monitoring.evaluation }}</div>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Icon name="i-heroicons-shield-check" class="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <div class="font-semibold mb-1 flex flex-column items-start">Audits</div>
            <div class="text-sm text-muted-foreground">{{ monitoring.audits }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'

import ScoreTransparenceWidget from '~/features/verification/components/ScoreTransparenceWidget.vue'
import type { ScoreCriterion } from '~/features/verification/components/ScoreTransparenceWidget.vue'

defineProps<{
  legal:       ONG['legal']
  monitoring:  ONG['monitoring']
  formatDate:  (date: string) => string
  score?:      number
  criteria?:   ScoreCriterion[]
}>()
</script>
