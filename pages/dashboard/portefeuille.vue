<template>
  <main class="container mx-auto px-4 py-8 max-w-5xl">
    <div class="mb-6">
      <NuxtLink to="/dashboard">
        <UButton variant="ghost" size="sm" class="text-muted-foreground gap-1.5 -ml-2">
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Tableau de bord
        </UButton>
      </NuxtLink>
    </div>

    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Mon portefeuille</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Historique de vos dons et demandes de remboursement</p>
    </div>

    <!-- Cartes de synthèse -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-card border border-border rounded-xl p-5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Total donné</p>
        <p class="text-2xl font-bold text-primary">{{ loading ? '—' : formatEur(totalDonne) }}</p>
        <p class="text-xs text-muted-foreground mt-1">{{ completedDons.length }} don{{ completedDons.length > 1 ? 's' : '' }}</p>
      </div>
      <div class="bg-card border border-border rounded-xl p-5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">ONGs soutenues</p>
        <p class="text-2xl font-bold">{{ loading ? '—' : ongsDistinctes }}</p>
        <p class="text-xs text-muted-foreground mt-1">organisations financées</p>
      </div>
      <div class="bg-card border border-border rounded-xl p-5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Remboursements</p>
        <p class="text-2xl font-bold text-orange-500">{{ loading ? '—' : refundCount }}</p>
        <p class="text-xs text-muted-foreground mt-1">demande{{ refundCount > 1 ? 's' : '' }} en cours</p>
      </div>
    </div>

    <!-- Tableau des dons -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-border flex items-center justify-between">
        <p class="text-sm font-semibold">Historique des dons</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-left">ONG</th>
              <th class="px-4 py-3 text-right">Montant</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th class="px-4 py-3 text-left">Mode</th>
              <th class="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="i in 5" :key="i" class="border-t border-border animate-pulse">
                <td v-for="j in 6" :key="j" class="px-4 py-3">
                  <div class="h-4 bg-muted rounded w-3/4" />
                </td>
              </tr>
            </template>
            <tr v-else-if="!transactions.length">
              <td colspan="6" class="px-4 py-16 text-center text-muted-foreground">
                <Icon name="i-heroicons-heart" class="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Vous n'avez effectué aucun don pour l'instant</p>
                <NuxtLink to="/" class="mt-4 inline-block">
                  <UButton size="sm" variant="outline">Découvrir les ONGs</UButton>
                </NuxtLink>
              </td>
            </tr>
            <tr
              v-for="tx in transactions"
              :key="tx.id"
              class="border-t border-border hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(tx.created_at) }}</td>
              <td class="px-4 py-3">
                <NuxtLink v-if="tx.ong_id" :to="`/ongs/${tx.ong_id}`" class="flex items-center gap-2 group">
                  <div class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700">
                    {{ (tx.ong_name ?? '?')[0]?.toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium group-hover:text-primary transition-colors">{{ tx.ong_name ?? '—' }}</span>
                </NuxtLink>
              </td>
              <td class="px-4 py-3 text-right font-semibold">{{ formatEur(tx.amount) }}</td>
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
              <td class="px-4 py-3 text-center">
                <UButton
                  v-if="tx.status === 'completed' && !tx.refund_requested"
                  size="xs"
                  variant="outline"
                  color="orange"
                  :loading="refundLoading === tx.id"
                  @click="requestRefund(tx)"
                >
                  Remboursement
                </UButton>
                <span
                  v-else-if="tx.refund_requested"
                  class="text-xs text-orange-500 font-medium"
                >
                  Demande envoyée
                </span>
                <span v-else class="text-xs text-muted-foreground">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal confirmation remboursement -->
    <Teleport to="body">
      <div
        v-if="refundModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="refundModal = null"
      >
        <div class="bg-card border border-border rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
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
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { getToken } from '~/features/auth/utils/getToken'

definePageMeta({ middleware: ['auth'] })

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
