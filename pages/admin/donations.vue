<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Dons reçus</h1>
        <p class="text-sm text-muted-foreground">Transactions de type don via Stripe</p>
      </div>
      <!-- Totaux -->
      <div class="flex gap-6 text-sm" v-if="!loading && donations.length">
        <div class="text-center">
          <div class="font-bold text-xl text-primary">{{ donations.length }}</div>
          <div class="text-muted-foreground text-xs">Total dons</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-xl text-green-600">{{ totalCompleted }}</div>
          <div class="text-muted-foreground text-xs">Complétés</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-xl">{{ formatEur(totalAmountCents) }}</div>
          <div class="text-muted-foreground text-xs">Volume total</div>
        </div>
      </div>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-left">Montant</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th class="px-4 py-3 text-left">Donateur</th>
              <th class="px-4 py-3 text-left">ONG</th>
              <th class="px-4 py-3 text-left">Réf. Stripe</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="i in 8" :key="i" class="border-t border-border animate-pulse">
                <td v-for="j in 6" :key="j" class="px-4 py-3">
                  <div class="h-4 bg-muted rounded w-3/4" />
                </td>
              </tr>
            </template>

            <tr v-else-if="!donations.length">
              <td colspan="6" class="px-4 py-16 text-center text-muted-foreground">
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
              <td class="px-4 py-3 font-semibold">
                {{ d.currency === 'eur' ? formatEur(d.amount) : `${d.amount} Ar` }}
              </td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(d.status)]">
                  {{ statusLabel(d.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-muted-foreground">
                {{ d.donor_email ?? '—' }}
              </td>
              <td class="px-4 py-3 text-xs text-muted-foreground font-mono">
                {{ d.ong_id?.slice(0, 8) }}…
              </td>
              <td class="px-4 py-3 text-xs font-mono text-muted-foreground">
                {{ d.stripe_payment_intent_id?.slice(0, 18) ?? '—' }}
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

const totalCompleted = computed(() =>
  donations.value.filter(d => d.status === 'completed').length
)
const totalAmountCents = computed(() =>
  donations.value.filter(d => d.status === 'completed' && d.currency === 'eur')
    .reduce((sum, d) => sum + d.amount, 0)
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
