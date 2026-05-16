<template>
  <div class="space-y-6">
    <!-- KPI cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="card in kpiCards"
        :key="card.label"
        class="bg-card border border-border rounded-xl p-5 flex flex-col gap-1.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{{ card.label }}</span>
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg]">
            <Icon :name="card.icon" class="w-4 h-4" :class="card.iconColor" />
          </div>
        </div>
        <div class="text-2xl font-bold">{{ card.value }}</div>
        <div class="text-xs text-muted-foreground">{{ card.sub }}</div>
      </div>
    </div>

    <!-- Répartition ONGs par statut -->
    <div class="bg-card border border-border rounded-xl p-5">
      <h3 class="text-sm font-semibold mb-4">Répartition des ONGs par statut</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          v-for="(count, status) in overview.byStatus"
          :key="status"
          class="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/40 border border-border/50 gap-1"
        >
          <span class="text-xl font-bold">{{ count }}</span>
          <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(String(status))]">
            {{ statusLabel(String(status)) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminOverview } from '../services/admin.overview.service'
import { formatEur, ONG_STATUS_LABELS } from '../services/admin.overview.service'

const props = defineProps<{ overview: AdminOverview }>()

const STATUS_CLASSES: Record<string, string> = {
  verified:            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  active:              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  pending:             'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  submitted:           'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  under_review:        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  complement_required: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  rejected:            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  suspended:           'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  inactive:            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

function statusLabel(s: string): string { return ONG_STATUS_LABELS[s] ?? s }
function statusClass(s: string): string { return STATUS_CLASSES[s] ?? 'bg-gray-100 text-gray-600' }

const kpiCards = computed(() => [
  {
    label:     'ONGs total',
    value:     props.overview.totalOngs,
    sub:       `${props.overview.byStatus['verified'] ?? 0} certifiées`,
    icon:      'i-heroicons-building-office-2',
    iconBg:    'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label:     'Dons complétés',
    value:     props.overview.totalDonations,
    sub:       formatEur(props.overview.totalAmountCents) + ' collectés',
    icon:      'i-heroicons-heart',
    iconBg:    'bg-rose-100 dark:bg-rose-900',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    label:     'Utilisateurs',
    value:     props.overview.totalUsers,
    sub:       `${props.overview.totalAgents} agents · ${props.overview.totalPartners} partenaires`,
    icon:      'i-heroicons-users',
    iconBg:    'bg-violet-100 dark:bg-violet-900',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    label:     'Volume total',
    value:     formatEur(props.overview.totalAmountCents),
    sub:       'Dons EUR complétés',
    icon:      'i-heroicons-banknotes',
    iconBg:    'bg-emerald-100 dark:bg-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
])
</script>
