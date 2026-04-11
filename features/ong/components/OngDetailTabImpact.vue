<template>
  <div v-if="impact" class="space-y-6">
    <!-- Statistiques d'impact -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-card rounded-xl border border-border p-6 text-center">
        <div class="text-4xl font-bold text-primary mb-2">{{ formatNumber(impact.totalBeneficiaries) }}</div>
        <div class="text-sm text-muted-foreground">Bénéficiaires</div>
      </div>
      <div v-if="impact.schoolsBuilt" class="bg-card rounded-xl border border-border p-6 text-center">
        <div class="text-4xl font-bold text-green-600 mb-2">{{ impact.schoolsBuilt }}</div>
        <div class="text-sm text-muted-foreground">Écoles construites</div>
      </div>
      <div v-if="impact.teachersTrained" class="bg-card rounded-xl border border-border p-6 text-center">
        <div class="text-4xl font-bold text-blue-600 mb-2">{{ impact.teachersTrained }}</div>
        <div class="text-sm text-muted-foreground">Enseignants formés</div>
      </div>
      <div v-if="impact.healthcareProvided" class="bg-card rounded-xl border border-border p-6 text-center">
        <div class="text-4xl font-bold text-red-600 mb-2">{{ formatNumber(impact.healthcareProvided) }}</div>
        <div class="text-sm text-muted-foreground">Soins fournis</div>
      </div>
      <div v-if="impact.treesPlanted" class="bg-card rounded-xl border border-border p-6 text-center">
        <div class="text-4xl font-bold text-green-600 mb-2">{{ formatNumber(impact.treesPlanted) }}</div>
        <div class="text-sm text-muted-foreground">Arbres plantés</div>
      </div>
      <div v-if="impact.wasteCollected" class="bg-card rounded-xl border border-border p-6 text-center">
        <div class="text-4xl font-bold text-yellow-600 mb-2">{{ impact.wasteCollected }} T</div>
        <div class="text-sm text-muted-foreground">Déchets collectés</div>
      </div>
    </div>

    <!-- KPIs -->
    <div v-if="impact.kpis && impact.kpis.length > 0" class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-2xl font-semibold mb-4">Indicateurs de performance</h2>
      <div class="space-y-4">
        <div v-for="kpi in impact.kpis" :key="kpi.metric" class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Icon name="i-heroicons-chart-bar" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div class="flex-1">
            <div class="font-semibold mb-1">{{ kpi.metric }}</div>
            <div class="text-muted-foreground">{{ kpi.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'

defineProps<{
  impact: ONG['impact']
  formatNumber: (num: number) => string
}>()
</script>
