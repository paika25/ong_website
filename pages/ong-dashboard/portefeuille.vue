<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Portefeuille</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Dons reçus, commissions Paika et montants nets reversés</p>
    </div>

    <!-- Cartes de synthèse -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-card border border-border rounded-xl p-5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Total brut reçu</p>
        <p class="text-2xl font-bold text-primary">{{ loading ? '—' : formatEur(totalBrut) }}</p>
        <p class="text-xs text-muted-foreground mt-1">{{ completedDons.length }} don{{ completedDons.length > 1 ? 's' : '' }} complété{{ completedDons.length > 1 ? 's' : '' }}</p>
      </div>
      <div class="bg-card border border-border rounded-xl p-5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Commission Paika (5 %)</p>
        <p class="text-2xl font-bold text-orange-500">{{ loading ? '—' : formatEur(totalCommission) }}</p>
        <p class="text-xs text-muted-foreground mt-1">Prélevée automatiquement</p>
      </div>
      <div class="bg-card border border-border rounded-xl p-5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Montant net reversé</p>
        <p class="text-2xl font-bold text-green-600">{{ loading ? '—' : formatEur(totalNet) }}</p>
        <p class="text-xs text-muted-foreground mt-1">Après déduction commission</p>
      </div>
    </div>

    <!-- Tableau des transactions -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <p class="text-sm font-semibold">Historique des dons</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-left">Donateur</th>
              <th class="px-4 py-3 text-right">Montant brut</th>
              <th class="px-4 py-3 text-right">Commission (5 %)</th>
              <th class="px-4 py-3 text-right">Montant net</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th class="px-4 py-3 text-left">Mode</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="i in 6" :key="i" class="border-t border-border animate-pulse">
                <td v-for="j in 7" :key="j" class="px-4 py-3">
                  <div class="h-4 bg-muted rounded w-3/4" />
                </td>
              </tr>
            </template>
            <tr v-else-if="!transactions.length">
              <td colspan="7" class="px-4 py-16 text-center text-muted-foreground">
                <Icon name="i-heroicons-inbox" class="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Aucun don reçu pour l'instant</p>
              </td>
            </tr>
            <tr
              v-for="tx in transactions"
              :key="tx.id"
              class="border-t border-border hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(tx.created_at) }}</td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{{ tx.donor_email ?? '—' }}</td>
              <td class="px-4 py-3 text-right font-semibold">{{ formatEur(tx.amount) }}</td>
              <td class="px-4 py-3 text-right text-orange-500 text-xs">
                {{ tx.commission_cents != null ? '- ' + formatEur(tx.commission_cents) : '—' }}
              </td>
              <td class="px-4 py-3 text-right font-semibold text-green-600">
                {{ tx.net_amount_cents != null ? formatEur(tx.net_amount_cents) : '—' }}
              </td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(tx.status)]">
                  {{ statusLabel(tx.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 capitalize">
                  <Icon name="i-heroicons-credit-card" class="w-3 h-3" />
                  {{ tx.provider }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getToken } from '~/features/auth/utils/getToken'

definePageMeta({ layout: 'ong', middleware: ['auth', 'agent-only'] })

interface Transaction {
  id: string
  amount: number
  currency: string
  status: string
  provider: string
  created_at: string
  commission_cents: number | null
  net_amount_cents: number | null
  commission_rate: number | null
  donor_email: string | null
  stripe_payment_intent_id: string | null
}

const loading      = ref(true)
const transactions = ref<Transaction[]>([])

const completedDons = computed(() => transactions.value.filter(t => t.status === 'completed'))
const totalBrut     = computed(() => completedDons.value.reduce((s, t) => s + t.amount, 0))
const totalCommission = computed(() => completedDons.value.reduce((s, t) => s + (t.commission_cents ?? 0), 0))
const totalNet      = computed(() => completedDons.value.reduce((s, t) => s + (t.net_amount_cents ?? t.amount), 0))

function formatEur(cents: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusLabel(s: string) {
  return { completed: 'Complété', pending: 'En attente', failed: 'Échoué', cancelled: 'Annulé' }[s] ?? s
}

function statusClass(s: string) {
  return {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }[s] ?? 'bg-gray-100 text-gray-600'
}

onMounted(async () => {
  const token = await getToken()
  try {
    transactions.value = await $fetch<Transaction[]>('/api/ong-dashboard/portefeuille', {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (e: any) {
    useToast().add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
})
</script>
