<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
    <div class="px-5 py-4 border-b border-border flex items-center justify-between">
      <div>
        <h2 class="font-semibold">Dons reçus</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Historique des transactions pour votre ONG</p>
      </div>
      <div v-if="!loading && donations.length" class="flex gap-4 text-sm">
        <div class="text-center">
          <div class="font-bold text-primary">{{ completedCount }}</div>
          <div class="text-xs text-muted-foreground">Complétés</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-emerald-600">{{ totalFormatted }}</div>
          <div class="text-xs text-muted-foreground">Total (EUR)</div>
        </div>
      </div>
    </div>

    <UTable :rows="donations" :columns="columns" :loading="loading">
      <template #empty-state>
        <EmptyState
          icon="i-heroicons-heart"
          title="Aucun don reçu pour l'instant"
          description="Les dons apparaîtront ici une fois votre ONG certifiée"
        />
      </template>
      <template #created_at-data="{ row }">
        <span class="whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(row.created_at) }}</span>
      </template>
      <template #amount-data="{ row }">
        <span class="font-semibold">{{ row.currency === 'eur' ? formatEur(row.amount) : `${row.amount} Ar` }}</span>
      </template>
      <template #status-data="{ row }">
        <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', donationStatusClass(row.status)]">
          {{ donationStatusLabel(row.status) }}
        </span>
      </template>
      <template #donor_email-data="{ row }">
        <span class="text-muted-foreground text-xs">{{ row.donor_email ?? '—' }}</span>
      </template>
      <template #provider-data="{ row }">
        <span
          v-if="row.provider"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 capitalize"
        >
          <Icon name="i-heroicons-credit-card" class="w-3 h-3" />
          {{ row.provider }}
        </span>
        <span v-else class="text-xs text-muted-foreground">—</span>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import type { OngDonation } from '../services/ong-dashboard.service'
import { formatEur, formatDate } from '../services/ong-dashboard.service'

const props = defineProps<{
  donations: OngDonation[]
  loading?: boolean
}>()

const columns = [
  { key: 'created_at', label: 'Date' },
  { key: 'amount', label: 'Montant' },
  { key: 'status', label: 'Statut' },
  { key: 'donor_email', label: 'Donateur' },
  { key: 'provider', label: 'Mode' },
]

const completedCount = computed(() =>
  props.donations.filter(d => d.status === 'completed').length
)

const totalFormatted = computed(() => {
  const total = props.donations
    .filter(d => d.status === 'completed' && d.currency === 'eur')
    .reduce((sum, d) => sum + d.amount, 0)
  return formatEur(total)
})

function donationStatusLabel(status: string): string {
  return { completed: 'Complété', pending: 'En attente', failed: 'Échoué', cancelled: 'Annulé' }[status] ?? status
}

function donationStatusClass(status: string): string {
  return ({
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  } as Record<string, string>)[status] ?? 'bg-gray-100 text-gray-600'
}
</script>
