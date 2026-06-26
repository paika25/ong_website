<template>
  <div class="max-w-5xl space-y-6">
    <PageHeader title="Mon portefeuille" subtitle="Historique de vos dons et demandes de remboursement" />

    <!-- Cartes de synthèse -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Total donné"
        :value="loading ? '—' : formatEur(totalDonne)"
        :sub="`${completedDons.length} don${completedDons.length > 1 ? 's' : ''}`"
        icon="i-heroicons-banknotes"
        :loading="loading"
      />
      <StatCard
        label="ONGs soutenues"
        :value="loading ? '—' : ongsDistinctes"
        sub="Organisations financées"
        icon="i-heroicons-building-office-2"
        :loading="loading"
      />
      <StatCard
        label="Remboursements"
        :value="loading ? '—' : refundCount"
        :sub="`Demande${refundCount > 1 ? 's' : ''} en cours`"
        icon="i-heroicons-arrow-uturn-left"
        icon-bg="bg-orange-100 dark:bg-orange-900"
        icon-color="text-orange-600 dark:text-orange-400"
        :loading="loading"
      />
    </div>

    <!-- Tableau des dons -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <p class="text-sm font-semibold">Historique des dons</p>
      </div>
      <UTable :rows="transactions" :columns="columns" :loading="loading">
        <template #empty-state>
          <EmptyState icon="i-heroicons-heart" title="Vous n'avez effectué aucun don pour l'instant">
            <template #action>
              <NuxtLink to="/">
                <UButton size="sm" variant="outline">Découvrir les ONGs</UButton>
              </NuxtLink>
            </template>
          </EmptyState>
        </template>
        <template #created_at-data="{ row }">
          <span class="whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(row.created_at) }}</span>
        </template>
        <template #ong_name-data="{ row }">
          <NuxtLink v-if="row.ong_id" :to="`/ongs/${row.ong_id}`" class="flex items-center gap-2 group">
            <div class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700">
              {{ (row.ong_name ?? '?')[0]?.toUpperCase() }}
            </div>
            <span class="text-sm font-medium group-hover:text-primary transition-colors">{{ row.ong_name ?? '—' }}</span>
          </NuxtLink>
        </template>
        <template #amount-data="{ row }">
          <span class="font-semibold">{{ formatEur(row.amount) }}</span>
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
        <template #action-data="{ row }">
          <UButton
            v-if="row.status === 'completed' && !row.refund_requested"
            size="xs"
            variant="outline"
            color="orange"
            :loading="refundLoading === row.id"
            @click="requestRefund(row)"
          >
            Remboursement
          </UButton>
          <span v-else-if="row.refund_requested" class="text-xs text-orange-500 font-medium">
            Demande envoyée
          </span>
          <span v-else class="text-xs text-muted-foreground">—</span>
        </template>
      </UTable>
    </div>

    <!-- Modal confirmation remboursement -->
    <UModal v-model="isRefundModalOpen">
      <div v-if="refundModal" class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <Icon name="i-heroicons-arrow-uturn-left" class="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p class="font-semibold">Demande de remboursement</p>
            <p class="text-xs text-muted-foreground">{{ refundModal.ong_name }} · {{ formatEur(refundModal.amount) }}</p>
          </div>
        </div>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Votre demande sera transmise à l'équipe Paika pour traitement manuel. Vous serez contacté sous 48 h ouvrées.
        </p>
        <div class="flex gap-3">
          <UButton variant="outline" block @click="refundModal = null">Annuler</UButton>
          <UButton color="orange" block :loading="refundLoading === refundModal.id" @click="confirmRefund">
            Confirmer
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { getToken } from '~/features/auth/utils/getToken'

definePageMeta({ layout: 'partner', middleware: ['auth'] })

interface Transaction {
  id: string
  ong_id: string | null
  ong_name: string | null
  amount: number
  currency: string
  status: string
  provider: string
  created_at: string
  commission_cents: number | null
  net_amount_cents: number | null
  stripe_payment_intent_id: string | null
  refund_requested?: boolean
}

const loading      = ref(true)
const transactions = ref<Transaction[]>([])
const refundLoading = ref<string | null>(null)
const refundModal   = ref<Transaction | null>(null)
const toast         = useToast()

const completedDons   = computed(() => transactions.value.filter(t => t.status === 'completed'))
const totalDonne      = computed(() => completedDons.value.reduce((s, t) => s + t.amount, 0))
const ongsDistinctes  = computed(() => new Set(completedDons.value.map(t => t.ong_id)).size)
const refundCount     = computed(() => transactions.value.filter(t => t.refund_requested).length)

const columns = [
  { key: 'created_at', label: 'Date' },
  { key: 'ong_name', label: 'ONG' },
  { key: 'amount', label: 'Montant' },
  { key: 'status', label: 'Statut' },
  { key: 'provider', label: 'Moyen' },
  { key: 'action', label: '' },
]

const isRefundModalOpen = computed({
  get: () => !!refundModal.value,
  set: (v: boolean) => { if (!v) refundModal.value = null },
})

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

function requestRefund(tx: Transaction) {
  refundModal.value = tx
}

async function confirmRefund() {
  const tx = refundModal.value
  if (!tx) return
  refundLoading.value = tx.id
  try {
    const token = await getToken()
    await $fetch(`/api/donations/${tx.id}/refund-request`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const idx = transactions.value.findIndex(t => t.id === tx.id)
    if (idx !== -1) transactions.value[idx] = { ...transactions.value[idx], refund_requested: true }
    refundModal.value = null
    toast.add({ title: 'Demande envoyée', description: 'L\'équipe Paika traitera votre demande sous 48 h.', color: 'green' })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    refundLoading.value = null
  }
}

onMounted(async () => {
  const token = await getToken()
  try {
    const raw = await $fetch<any[]>('/api/donations/donor-history', {
      headers: { Authorization: `Bearer ${token}` },
    })
    transactions.value = raw.map(r => ({
      ...r,
      ong_id:   r.ongs?.id ?? null,
      ong_name: r.ongs?.name ?? null,
    }))
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
})
</script>
