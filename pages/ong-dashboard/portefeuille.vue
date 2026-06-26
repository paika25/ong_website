<template>
  <div class="space-y-6">
    <PageHeader title="Portefeuille" subtitle="Dons reçus, commissions Paika et montants nets reversés" />

    <!-- Cartes de synthèse -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total brut reçu"
        :value="loading ? '—' : formatEur(totalBrut)"
        :sub="`${completedDons.length} don${completedDons.length > 1 ? 's' : ''} complété${completedDons.length > 1 ? 's' : ''}`"
        icon="i-heroicons-banknotes"
        :loading="loading"
      />
      <StatCard
        label="Commission Paika (5 %)"
        :value="loading ? '—' : formatEur(totalCommission)"
        sub="Prélevée automatiquement"
        icon="i-heroicons-receipt-percent"
        icon-bg="bg-orange-100 dark:bg-orange-900"
        icon-color="text-orange-600 dark:text-orange-400"
        :loading="loading"
      />
      <StatCard
        label="Montant net reversé"
        :value="loading ? '—' : formatEur(totalNet)"
        sub="Après déduction commission"
        icon="i-heroicons-check-circle"
        icon-bg="bg-green-100 dark:bg-green-900"
        icon-color="text-green-600 dark:text-green-400"
        :loading="loading"
      />
    </div>

    <!-- Tableau des transactions -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <p class="text-sm font-semibold">Historique des dons</p>
      </div>
      <UTable :rows="transactions" :columns="columns" :loading="loading">
        <template #empty-state>
          <EmptyState icon="i-heroicons-inbox" title="Aucun don reçu pour l'instant" />
        </template>
        <template #created_at-data="{ row }">
          <span class="whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(row.created_at) }}</span>
        </template>
        <template #donor_email-data="{ row }">
          <span class="text-xs text-muted-foreground">{{ row.donor_email ?? '—' }}</span>
        </template>
        <template #amount-data="{ row }">
          <span class="font-semibold">{{ formatEur(row.amount) }}</span>
        </template>
        <template #commission_cents-data="{ row }">
          <span class="text-orange-500 text-xs">{{ row.commission_cents != null ? '- ' + formatEur(row.commission_cents) : '—' }}</span>
        </template>
        <template #net_amount_cents-data="{ row }">
          <span class="font-semibold text-green-600">{{ row.net_amount_cents != null ? formatEur(row.net_amount_cents) : '—' }}</span>
        </template>
        <template #status-data="{ row }">
          <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(row.status)]">
            {{ statusLabel(row.status) }}
          </span>
        </template>
        <template #provider-data="{ row }">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 capitalize">
            <Icon name="i-heroicons-credit-card" class="w-3 h-3" />
            {{ row.provider }}
          </span>
        </template>
      </UTable>
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

const columns = [
  { key: 'created_at', label: 'Date' },
  { key: 'donor_email', label: 'Donateur' },
  { key: 'amount', label: 'Montant brut', class: 'text-right' },
  { key: 'commission_cents', label: 'Commission (5 %)', class: 'text-right' },
  { key: 'net_amount_cents', label: 'Montant net', class: 'text-right' },
  { key: 'status', label: 'Statut' },
  { key: 'provider', label: 'Mode' },
]

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
