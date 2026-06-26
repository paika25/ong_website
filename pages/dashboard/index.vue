<template>
  <div class="max-w-4xl space-y-6">

    <!-- En-tête -->
    <PageHeader
      class="mb-8"
      :title="`Bonjour${firstName ? ', ' + firstName : ''}`"
      subtitle="Suivez vos dons et découvrez des ONGs à soutenir."
    />

    <!-- Bannière : partenaire non encore validé -->
    <UAlert
      v-if="user && user.accountType === 'user_partner' && !user.verified"
      class="mb-6"
      color="amber"
      variant="soft"
      icon="i-heroicons-clock"
      title="Compte en attente de validation"
      description="Votre profil partenaire est en cours de vérification par notre équipe (sous 48 h ouvrées). En attendant, vous naviguez comme visiteur public : les données financières des ONGs ne sont pas encore accessibles."
    />

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <StatCard
        v-for="card in statCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :sub="card.sub"
        :icon="card.icon"
        :icon-bg="card.iconBg"
        :icon-color="card.iconColor"
        :loading="isLoading"
      />
    </div>

    <!-- Actions rapides -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <NuxtLink
        v-for="action in QUICK_ACTIONS"
        :key="action.to"
        :to="action.to"
        class="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/30 transition-all group"
      >
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', action.iconBg]">
          <Icon :name="action.icon" class="w-4 h-4" :class="action.iconColor" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium group-hover:text-primary transition-colors">{{ action.label }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ action.sub }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Historique dons -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <h2 class="font-semibold">Mes dons</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Historique de vos contributions</p>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="divide-y divide-border">
        <div v-for="i in 4" :key="i" class="flex items-center gap-4 px-5 py-4 animate-pulse">
          <div class="h-4 bg-muted rounded flex-1" />
          <div class="h-4 bg-muted rounded w-24" />
          <div class="h-4 bg-muted rounded w-16" />
        </div>
      </div>

      <!-- Vide -->
      <EmptyState
        v-else-if="!donations.length"
        icon="i-heroicons-heart"
        title="Aucun don pour le moment"
        description="Soutenez une ONG en faisant votre premier don"
      >
        <template #action>
          <NuxtLink to="/">
            <UButton size="sm" color="primary">Découvrir les ONGs</UButton>
          </NuxtLink>
        </template>
      </EmptyState>

      <!-- Table -->
      <UTable
        v-else
        :rows="donations"
        :columns="donationColumns"
      >
        <template #createdAt-data="{ row }">
          <span class="whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(row.createdAt) }}</span>
        </template>
        <template #ongName-data="{ row }">
          <span class="font-medium">{{ row.ongName }}</span>
        </template>
        <template #amount-data="{ row }">
          <span class="font-semibold block text-right">{{ row.amount }} €</span>
        </template>
        <template #status-data="{ row }">
          <div class="flex justify-center">
            <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(row.status)]">
              {{ statusLabel(row.status) }}
            </span>
          </div>
        </template>
      </UTable>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { useStats } from '~/features/user/composables/useStats'

definePageMeta({ layout: 'partner', middleware: ['auth'] })

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.currentUser)
const firstName = computed(() => user.value?.firstName?.split(' ')[0] || user.value?.fullName?.split(' ')[0] || '')

const { donations, stats, isLoading, load } = useStats()

const donationColumns = [
  { key: 'createdAt', label: 'Date' },
  { key: 'ongName', label: 'ONG' },
  { key: 'amount', label: 'Montant', class: 'text-right' },
  { key: 'status', label: 'Statut', class: 'text-center' },
]

const QUICK_ACTIONS = [
  {
    label:    'Explorer les ONGs',
    sub:      'Découvrir et soutenir',
    to:       '/',
    icon:     'i-heroicons-magnifying-glass',
    iconBg:   'bg-blue-100 dark:bg-blue-900',
    iconColor:'text-blue-600 dark:text-blue-400',
  },
  {
    label:    'Portefeuille',
    sub:      'Dons effectués et remboursements',
    to:       '/dashboard/portefeuille',
    icon:     'i-heroicons-banknotes',
    iconBg:   'bg-orange-100 dark:bg-orange-900',
    iconColor:'text-orange-600 dark:text-orange-400',
  },
  {
    label:    'Mon profil',
    sub:      'Gérer mes informations',
    to:       '/profil',
    icon:     'i-heroicons-user-circle',
    iconBg:   'bg-violet-100 dark:bg-violet-900',
    iconColor:'text-violet-600 dark:text-violet-400',
  },
  {
    label:    'Paramètres',
    sub:      'Compte et sécurité',
    to:       '/account/settings',
    icon:     'i-heroicons-cog-6-tooth',
    iconBg:   'bg-gray-100 dark:bg-gray-800',
    iconColor:'text-gray-600 dark:text-gray-400',
  },
]

const statCards = computed(() => [
  {
    label:     'Dons effectués',
    value:     stats.value.totalDonations,
    sub:       'Contributions totales',
    icon:      'i-heroicons-heart',
    iconBg:    'bg-rose-100 dark:bg-rose-900',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    label:     'Montant total',
    value:     stats.value.totalDonated + ' €',
    sub:       'Dons complétés',
    icon:      'i-heroicons-banknotes',
    iconBg:    'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    label:     'ONGs soutenues',
    value:     stats.value.uniqueOngsSupported,
    sub:       'Organisations aidées',
    icon:      'i-heroicons-building-office-2',
    iconBg:    'bg-amber-100 dark:bg-amber-900',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
])

function statusLabel(status: string): string {
  return ({
    completed: 'Complété',
    pending:   'En attente',
    failed:    'Échoué',
    refunded:  'Remboursé',
    cancelled: 'Annulé',
  } as Record<string, string>)[status] ?? status
}

function statusClass(status: string): string {
  return ({
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    refunded:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  } as Record<string, string>)[status] ?? 'bg-gray-100 text-gray-600'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  // Agents ONG ont leur propre espace dédié
  if (authStore.isAgent) {
    await navigateTo('/ong-dashboard')
    return
  }
  try {
    await load()
  } catch (e) {
    console.error('[dashboard]', e)
  }
})
</script>
