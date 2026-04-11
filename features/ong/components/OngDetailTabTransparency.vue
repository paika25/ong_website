<template>
  <div class="space-y-6">
    <!-- Informations légales -->
    <div v-if="legal" class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-2xl font-semibold mb-4">Informations légales</h2>
      <div class="space-y-3">
        <div v-if="legal.siret" class="flex items-center gap-3">
          <Icon name="i-heroicons-identification" class="w-5 h-5 text-primary" />
          <div>
            <div class="text-sm text-muted-foreground">SIRET</div>
            <div class="font-medium">{{ legal.siret }}</div>
          </div>
        </div>
        <div v-if="legal.registrationDate" class="flex items-center gap-3">
          <Icon name="i-heroicons-calendar" class="w-5 h-5 text-primary" />
          <div>
            <div class="text-sm text-muted-foreground">Date d'enregistrement</div>
            <div class="font-medium">{{ formatDate(legal.registrationDate) }}</div>
          </div>
        </div>
        <div v-if="legal.compliance">
          <div class="text-sm text-muted-foreground mb-2">Conformité</div>
          <div v-if="legal.compliance.dataProtection" class="flex items-start gap-2 mb-2">
            <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 flex-shrink-0" />
            <span class="text-sm">{{ legal.compliance.dataProtection }}</span>
          </div>
          <div v-if="legal.compliance.financialTransparency" class="flex items-start gap-2">
            <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 flex-shrink-0" />
            <span class="text-sm">{{ legal.compliance.financialTransparency }}</span>
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

defineProps<{
  legal: ONG['legal']
  monitoring: ONG['monitoring']
  formatDate: (date: string) => string
}>()
</script>
