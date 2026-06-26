<template>
  <div class="space-y-6">
    <PageHeader title="Vue d'ensemble" subtitle="Tableau de bord global de la plateforme Paika" />

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="bg-card border border-border rounded-xl p-5 h-28 animate-pulse" />
      </div>
      <div class="bg-card border border-border rounded-xl p-5 h-32 animate-pulse" />
    </div>

    <AdminOverviewStats v-else-if="overview" :overview="overview" />

    <UAlert v-if="error" color="red" variant="soft" icon="i-heroicons-exclamation-circle" :title="error" />

    <!-- Accès rapides -->
    <div v-if="!loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <NuxtLink
        v-for="action in QUICK_ACTIONS"
        :key="action.to"
        :to="action.to"
        class="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/30 transition-all group"
      >
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', action.iconBg]">
          <Icon :name="action.icon" class="w-4 h-4" :class="action.iconColor" />
        </div>
        <div>
          <p class="text-sm font-medium group-hover:text-primary transition-colors">{{ action.label }}</p>
          <p class="text-xs text-muted-foreground">{{ action.sub }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminOverviewStats from '~/features/admin/components/AdminOverviewStats.vue'
import { getAdminOverview } from '~/features/admin/services/admin.overview.service'
import type { AdminOverview } from '~/features/admin/services/admin.overview.service'

definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

const overview = ref<AdminOverview | null>(null)
const loading  = ref(true)
const error    = ref<string | null>(null)

const QUICK_ACTIONS = [
  { label: 'ONGs',         sub: 'Gérer les organisations', to: '/admin/ongs',         icon: 'i-heroicons-building-office-2', iconBg: 'bg-blue-100 dark:bg-blue-900',    iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: 'Vérification', sub: 'Pipeline de dossiers',    to: '/admin/verification', icon: 'i-heroicons-shield-check',      iconBg: 'bg-violet-100 dark:bg-violet-900', iconColor: 'text-violet-600 dark:text-violet-400' },
  { label: 'Dons',         sub: 'Transactions Stripe',     to: '/admin/donations',    icon: 'i-heroicons-heart',             iconBg: 'bg-rose-100 dark:bg-rose-900',    iconColor: 'text-rose-600 dark:text-rose-400' },
  { label: 'Utilisateurs', sub: 'Comptes et rôles',        to: '/admin/utilisateurs', icon: 'i-heroicons-users',             iconBg: 'bg-emerald-100 dark:bg-emerald-900', iconColor: 'text-emerald-600 dark:text-emerald-400' },
]

onMounted(async () => {
  try {
    overview.value = await getAdminOverview()
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? e.message
  } finally {
    loading.value = false
  }
})
</script>
