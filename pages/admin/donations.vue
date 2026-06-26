<template>
  <div>
    <PageHeader title="Dons & Commissions" subtitle="Transactions de type don — suivi financier Paika" class="mb-6" />

    <!-- Cartes de synthèse -->
    <div v-if="!loading && donations.length" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard label="Dons complétés" :value="totalCompleted" icon="i-heroicons-heart" />
      <StatCard label="Volume brut" :value="formatEur(totalAmountCents)" icon="i-heroicons-banknotes" />
      <StatCard
        label="Commission Paika"
        :value="formatEur(totalCommissionCents)"
        icon="i-heroicons-receipt-percent"
        icon-bg="bg-orange-100 dark:bg-orange-900"
        icon-color="text-orange-600 dark:text-orange-400"
      />
      <StatCard
        label="Reversé aux ONGs"
        :value="formatEur(totalNetCents)"
        icon="i-heroicons-check-circle"
        icon-bg="bg-green-100 dark:bg-green-900"
        icon-color="text-green-600 dark:text-green-400"
      />
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <UTable :rows="donations" :columns="columns" :loading="loading">
        <template #empty-state>
          <EmptyState icon="i-heroicons-heart" title="Aucun don enregistré pour l'instant" />
        </template>
        <template #created_at-data="{ row }">
          <span class="whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(row.created_at) }}</span>
        </template>
        <template #ong-data="{ row }">
          <span class="text-sm font-medium">{{ (row as any).ongs?.name ?? row.ong_id?.slice(0, 8) + '…' }}</span>
        </template>
        <template #donor_email-data="{ row }">
          <span class="text-xs text-muted-foreground">{{ row.donor_email ?? '—' }}</span>
        </template>
        <template #amount-data="{ row }">
          <span class="font-semibold">{{ row.currency === 'eur' ? formatEur(row.amount) : `${row.amount} Ar` }}</span>
        </template>
        <template #commission_cents-data="{ row }">
          <span class="text-orange-500 text-xs">{{ (row as any).commission_cents != null ? formatEur((row as any).commission_cents) : '—' }}</span>
        </template>
        <template #net_amount_cents-data="{ row }">
          <span class="font-semibold text-green-600">{{ (row as any).net_amount_cents != null ? formatEur((row as any).net_amount_cents) : '—' }}</span>
        </template>
        <template #status-data="{ row }">
          <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(row.status)]">
            {{ statusLabel(row.status) }}
          </span>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

interface Donation {
  id: string
  ong_id: string
  amount: number
  currency: string
  status: string
  provider: string
  donor_email: string | null
  created_at: string
  stripe_payment_intent_id: string | null
  metadata: Record<string, any> | null
}

const loading = ref(true)
const donations = ref<Donation[]>([])

const columns = [
  { key: 'created_at', label: 'Date' },
  { key: 'ong', label: 'ONG' },
  { key: 'donor_email', label: 'Donateur' },
  { key: 'amount', label: 'Montant brut', class: 'text-right' },
  { key: 'commission_cents', label: 'Commission', class: 'text-right' },
  { key: 'net_amount_cents', label: 'Net ONG', class: 'text-right' },
  { key: 'status', label: 'Statut' },
  { key: 'provider', label: 'Mode' },
]

const completedEur = computed(() =>
  donations.value.filter(d => d.status === 'completed' && d.currency === 'eur')
)
const totalCompleted = computed(() =>
  donations.value.filter(d => d.status === 'completed').length
)
const totalAmountCents = computed(() =>
  completedEur.value.reduce((sum, d) => sum + d.amount, 0)
)
const totalCommissionCents = computed(() =>
  completedEur.value.reduce((sum, d) => sum + ((d as any).commission_cents ?? 0), 0)
)
const totalNetCents = computed(() =>
  completedEur.value.reduce((sum, d) => sum + ((d as any).net_amount_cents ?? d.amount), 0)
)

function formatEur(cents: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function statusLabel(status: string) {
  return { completed: 'Complété', pending: 'En attente', failed: 'Échoué', cancelled: 'Annulé' }[status] ?? status
}

function statusClass(status: string) {
  return {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }[status] ?? 'bg-gray-100 text-gray-600'
}

onMounted(async () => {
  const { getDonations } = await import('~/features/admin/services/admin.service')
  try {
    donations.value = await getDonations()
  } catch (e: any) {
    useToast().add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
})
</script>
