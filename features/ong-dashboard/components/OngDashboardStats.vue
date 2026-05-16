<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="bg-card border border-border rounded-xl p-5 flex flex-col gap-2"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{{ card.label }}</span>
        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg]">
          <Icon :name="card.icon" class="w-4 h-4" :class="card.iconColor" />
        </div>
      </div>
      <div class="text-2xl font-bold">{{ card.value }}</div>
      <div v-if="card.sub" class="text-xs text-muted-foreground">{{ card.sub }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OngDashboardStats } from '../services/ong-dashboard.service'
import { formatEur } from '../services/ong-dashboard.service'

const props = defineProps<{ stats: OngDashboardStats; loading?: boolean }>()

const cards = computed(() => [
  {
    label:     'Dons reçus',
    value:     props.stats.totalDonations,
    sub:       formatEur(props.stats.totalAmountCents) + ' collectés',
    icon:      'i-heroicons-heart',
    iconBg:    'bg-rose-100 dark:bg-rose-900',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    label:     'Volume total',
    value:     formatEur(props.stats.totalAmountCents),
    sub:       'Dons complétés (EUR)',
    icon:      'i-heroicons-banknotes',
    iconBg:    'bg-emerald-100 dark:bg-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label:     'Projets',
    value:     props.stats.totalProjects,
    sub:       'Projets déclarés',
    icon:      'i-heroicons-folder-open',
    iconBg:    'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label:     'Bénévoles',
    value:     props.stats.totalVolunteers,
    sub:       'Bénévoles actifs',
    icon:      'i-heroicons-users',
    iconBg:    'bg-violet-100 dark:bg-violet-900',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
])
</script>
