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

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
          <tr>
            <th class="px-4 py-3 text-left">Date</th>
            <th class="px-4 py-3 text-left">Montant</th>
            <th class="px-4 py-3 text-left">Statut</th>
            <th class="px-4 py-3 text-left">Donateur</th>
            <th class="px-4 py-3 text-left">Mode</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-t border-border animate-pulse">
              <td v-for="j in 5" :key="j" class="px-4 py-3">
                <div class="h-4 bg-muted rounded w-3/4" />
              </td>
            </tr>
          </template>

          <tr v-else-if="!donations.length">
            <td colspan="5" class="px-4 py-16 text-center text-muted-foreground">
              <Icon name="i-heroicons-heart" class="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Aucun don reçu pour l'instant</p>
              <p class="text-xs mt-1">Les dons apparaîtront ici une fois votre ONG certifiée</p>
            </td>
          </tr>

          <tr
            v-for="d in donations"
            :key="d.id"
            class="border-t border-border hover:bg-muted/30 transition-colors"
          >
            <td class="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
              {{ formatDate(d.created_at) }}
            </td>
            <td class="px-4 py-3 font-semibold">
              {{ d.currency === 'eur' ? formatEur(d.amount) : `${d.amount} Ar` }}
            </td>
            <td class="px-4 py-3">
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', donationStatusClass(d.status)]">
                {{ donationStatusLabel(d.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-muted-foreground text-xs">
              {{ d.donor_email ?? '—' }}
            </td>
            <td class="px-4 py-3">
              <span
                v-if="d.provider"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 capitalize"
              >
                <Icon name="i-heroicons-credit-card" class="w-3 h-3" />
                {{ d.provider }}
              </span>
              <span v-else class="text-xs text-muted-foreground">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OngDonation } from '../services/ong-dashboard.service'
import { formatEur, formatDate } from '../services/ong-dashboard.service'

const props = defineProps<{
  donations: OngDonation[]
  loading?: boolean
}>()

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
