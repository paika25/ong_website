<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Dons & Commissions</h1>
      <p class="text-sm text-muted-foreground">Transactions de type don — suivi financier Paika</p>
    </div>

    <!-- Cartes de synthèse -->
    <div v-if="!loading && donations.length" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-card border border-border rounded-xl p-4">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Dons complétés</p>
        <p class="text-2xl font-bold text-primary">{{ totalCompleted }}</p>
      </div>
      <div class="bg-card border border-border rounded-xl p-4">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Volume brut</p>
        <p class="text-2xl font-bold">{{ formatEur(totalAmountCents) }}</p>
      </div>
      <div class="bg-card border border-border rounded-xl p-4">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Commission Paika</p>
        <p class="text-2xl font-bold text-orange-500">{{ formatEur(totalCommissionCents) }}</p>
      </div>
      <div class="bg-card border border-border rounded-xl p-4">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Reversé aux ONGs</p>
        <p class="text-2xl font-bold text-green-600">{{ formatEur(totalNetCents) }}</p>
      </div>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-left">ONG</th>
              <th class="px-4 py-3 text-left">Donateur</th>
              <th class="px-4 py-3 text-right">Montant brut</th>
              <th class="px-4 py-3 text-right">Commission</th>
              <th class="px-4 py-3 text-right">Net ONG</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th class="px-4 py-3 text-left">Mode</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="i in 8" :key="i" class="border-t border-border animate-pulse">
                <td v-for="j in 8" :key="j" class="px-4 py-3">
                  <div class="h-4 bg-muted rounded w-3/4" />
                </td>
              </tr>
            </template>

            <tr v-else-if="!donations.length">
              <td colspan="8" class="px-4 py-16 text-center text-muted-foreground">
                <Icon name="i-heroicons-heart" class="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Aucun don enregistré pour l'instant</p>
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
              <td class="px-4 py-3 text-sm font-medium">
                {{ (d as any).ongs?.name ?? d.ong_id?.slice(0, 8) + '…' }}
              </td>
              <td class="px-4 py-3 text-xs text-muted-foreground">
                {{ d.donor_email ?? '—' }}
              </td>
              <td class="px-4 py-3 text-right font-semibold">
                {{ d.currency === 'eur' ? formatEur(d.amount) : `${d.amount} Ar` }}
              </td>
              <td class="px-4 py-3 text-right text-orange-500 text-xs">
                {{ (d as any).commission_cents != null ? formatEur((d as any).commission_cents) : '—' }}
              </td>
              <td class="px-4 py-3 text-right font-semibold text-green-600">
                {{ (d as any).net_amount_cents != null ? formatEur((d as any).net_amount_cents) : '—' }}
              </td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(d.status)]">
                  {{ statusLabel(d.status) }}
                </span>
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
