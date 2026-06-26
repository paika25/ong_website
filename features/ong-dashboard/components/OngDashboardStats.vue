<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      v-for="card in cards"
      :key="card.label"
      :label="card.label"
      :value="card.value"
      :sub="card.sub"
      :icon="card.icon"
      :icon-bg="card.iconBg"
      :icon-color="card.iconColor"
      :loading="loading"
    />
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
    iconBg:    'bg-primary/10',
    iconColor: 'text-primary',
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
