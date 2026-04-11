<template>
  <div v-if="financials" class="space-y-6">
    <!-- Budget -->
    <div class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-2xl font-semibold mb-4">Budget 2023</h2>
      <div class="text-4xl font-bold text-primary mb-6">
        {{ formatCurrency(financials.totalBudget2023) }}
      </div>

      <!-- Sources de financement -->
      <h3 class="text-lg font-semibold mb-3">Sources de financement</h3>
      <div class="space-y-3">
        <div v-for="source in financials.fundingSources" :key="source.source" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>{{ source.source }}</span>
            <span class="font-semibold">{{ source.percentage }}% ({{ formatCurrency(source.amount) }})</span>
          </div>
          <div class="w-full bg-muted rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all"
              :style="{ width: `${source.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Allocation des ressources -->
    <div class="bg-card rounded-xl border border-border p-6">
      <h3 class="text-lg font-semibold mb-4">Allocation des ressources</h3>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-4 bg-muted/50 rounded-lg">
          <div class="text-3xl font-bold text-green-600">{{ financials.allocation.programs }}%</div>
          <div class="text-sm text-muted-foreground mt-1">Programmes</div>
        </div>
        <div class="text-center p-4 bg-muted/50 rounded-lg">
          <div class="text-3xl font-bold text-blue-600">{{ financials.allocation.administration }}%</div>
          <div class="text-sm text-muted-foreground mt-1">Administration</div>
        </div>
        <div class="text-center p-4 bg-muted/50 rounded-lg">
          <div class="text-3xl font-bold text-purple-600">{{ financials.allocation.fundraising }}%</div>
          <div class="text-sm text-muted-foreground mt-1">Collecte</div>
        </div>
      </div>
    </div>

    <!-- Rapports financiers -->
    <div v-if="financials.financialReports && financials.financialReports.length > 0" class="bg-card rounded-xl border border-border p-6">
      <h3 class="text-lg font-semibold mb-4">Rapports financiers</h3>
      <div class="space-y-2">
        <a
          v-for="report in financials.financialReports"
          :key="report.year"
          :href="report.url"
          target="_blank"
          class="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-3">
            <Icon name="i-heroicons-document-text" class="w-5 h-5 text-primary" />
            <span class="font-medium">Rapport {{ report.year }}</span>
            <UBadge v-if="report.audited" color="green" variant="soft">Audité</UBadge>
          </div>
          <Icon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-muted-foreground" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'

defineProps<{
  financials: ONG['financials']
  formatCurrency: (amount: number) => string
}>()
</script>
