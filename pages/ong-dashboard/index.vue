<template>
  <div class="space-y-6">

    <!-- ─── Skeleton ─── -->
    <template v-if="loading">
      <USkeleton class="h-40 w-full rounded-2xl" />
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <USkeleton v-for="i in 4" :key="i" class="h-24 rounded-xl" />
      </div>
    </template>

    <template v-else-if="ong">

      <!-- ─── Carte héro ONG ─── -->
      <div class="rounded-2xl border border-border overflow-hidden relative h-44 bg-gradient-to-br from-primary/80 via-primary to-primary/50">
        <!-- Image de fond -->
        <img v-if="ong.image" :src="ong.image" :alt="ong.name" class="absolute inset-0 w-full h-full object-cover" />
        <!-- Overlay gradient pour lisibilité du texte -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        <!-- Badge statut (haut droite) -->
        <div class="absolute top-4 right-4">
          <span :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm', ongStatusClass(ong.status)]">
            <span class="w-1.5 h-1.5 rounded-full bg-current" />
            {{ ongStatusLabel(ong.status) }}
          </span>
        </div>

        <!-- Boutons (haut gauche) -->
        <div class="absolute top-4 left-4 flex gap-2">
          <NuxtLink :to="`/ongs/${ong.id}`" target="_blank">
            <UButton size="xs" variant="solid" color="white" trailing-icon="i-heroicons-arrow-top-right-on-square" class="backdrop-blur-sm">
              Page publique
            </UButton>
          </NuxtLink>
          <NuxtLink :to="`/ongs/${ong.id}/edit`">
            <UButton size="xs" variant="solid" color="white" icon="i-heroicons-pencil" class="backdrop-blur-sm">
              Modifier
            </UButton>
          </NuxtLink>
        </div>

        <!-- Nom + métadonnées (bas gauche, sur l'image) -->
        <div class="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h1 class="text-xl font-bold text-white">{{ ong.name }}</h1>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70 mt-1">
            <span v-if="ong.category" class="capitalize flex items-center gap-1">
              <Icon name="i-heroicons-tag" class="w-3 h-3" />{{ ong.category }}
            </span>
            <span v-if="ong.location" class="flex items-center gap-1">
              <Icon name="i-heroicons-map-pin" class="w-3 h-3" />{{ ong.location }}
            </span>
            <span v-if="ong.description" class="hidden sm:inline text-white/60 line-clamp-1 max-w-lg">
              {{ ong.description }}
            </span>
          </div>
        </div>
      </div>

      <!-- ─── Alertes ─── -->
      <UAlert
        v-if="ong.status === 'pending'"
        color="amber"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="Dossier en attente de soumission"
        description="Complétez votre profil et soumettez votre dossier pour obtenir la certification."
      >
        <template #actions>
          <NuxtLink to="/ong-dashboard/dossier">
            <UButton size="sm" color="amber">Voir le dossier</UButton>
          </NuxtLink>
        </template>
      </UAlert>

      <UAlert
        v-if="ong.status === 'complement_required'"
        color="orange"
        variant="soft"
        icon="i-heroicons-chat-bubble-left-ellipsis"
        title="Complément requis par le back-office"
        description="Le back-office a demandé des informations supplémentaires. Consultez la messagerie."
      >
        <template #actions>
          <NuxtLink to="/ong-dashboard/dossier">
            <UButton size="sm" color="orange">Voir les messages</UButton>
          </NuxtLink>
        </template>
      </UAlert>

      <!-- ─── Stats ─── -->
      <OngDashboardStats v-if="stats" :stats="stats" />

      <!-- ─── Actions rapides ─── -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <p class="text-sm font-medium group-hover:text-primary transition-colors leading-tight">{{ action.label }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ action.sub }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- ─── Score + Détails ─── -->
      <div class="grid lg:grid-cols-3 gap-4">
        <!-- Score de transparence -->
        <div class="bg-card border border-border rounded-xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-sm">Score de transparence</h2>
            <NuxtLink to="/dashboard/agent/score">
              <UButton variant="ghost" size="xs">Détails</UButton>
            </NuxtLink>
          </div>
          <ScoreTransparenceWidget
            :score="score"
            :criteria="scoreCriteria"
            @action-click="handleScoreAction"
          />
        </div>

        <!-- Infos ONG -->
        <div class="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 class="font-semibold text-sm">Informations de l'ONG</h2>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="info in ongInfos" :key="info.label" class="flex items-start gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Icon :name="info.icon" class="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div class="min-w-0">
                <p class="text-xs text-muted-foreground mb-0.5">{{ info.label }}</p>
                <p class="text-sm font-medium truncate">{{ info.value || '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- ─── Pas d'ONG ─── -->
    <div v-else-if="!loading" class="bg-card border border-border rounded-2xl">
      <EmptyState
        icon="i-heroicons-building-office-2"
        title="Vous n'avez pas encore créé d'ONG"
        description="Créez votre ONG pour commencer le processus de certification Paika."
      >
        <template #action>
          <NuxtLink to="/ongs/new">
            <UButton icon="i-heroicons-plus">Créer mon ONG</UButton>
          </NuxtLink>
        </template>
      </EmptyState>
    </div>

  </div>
</template>

<script setup lang="ts">
import OngDashboardStats from '~/features/ong-dashboard/components/OngDashboardStats.vue'
import ScoreTransparenceWidget from '~/features/verification/components/ScoreTransparenceWidget.vue'
import type { ScoreCriterion, ScoreAction } from '~/features/verification/components/ScoreTransparenceWidget.vue'
import { fetchOwnerOng, fetchOngDonations, computeOngStats, ongStatusLabel, ongStatusClass } from '~/features/ong-dashboard/services/ong-dashboard.service'
import type { ONG } from '~/features/ong/type'
import type { OngDashboardStats as Stats } from '~/features/ong-dashboard/services/ong-dashboard.service'

definePageMeta({ layout: 'ong', middleware: ['auth', 'agent-only'] })

const router = useRouter()
const ong    = ref<ONG | null>(null)
const stats  = ref<Stats | null>(null)
const loading = ref(true)
const score   = ref(0)
const scoreCriteria = ref<ScoreCriterion[]>([])

const QUICK_ACTIONS = [
  { label: 'Portefeuille',  sub: 'Dons et reversements',      to: '/ong-dashboard/portefeuille', icon: 'i-heroicons-banknotes',                  iconBg: 'bg-primary/10',                  iconColor: 'text-primary' },
  { label: 'Dons reçus',   sub: 'Historique transactions',    to: '/ong-dashboard/donations',    icon: 'i-heroicons-heart',                      iconBg: 'bg-rose-100 dark:bg-rose-900',   iconColor: 'text-rose-600 dark:text-rose-400' },
  { label: 'Documents',    sub: 'Légaux et rapports',         to: '/ong-dashboard/documents',    icon: 'i-heroicons-document-text',              iconBg: 'bg-blue-100 dark:bg-blue-900',   iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: 'Mon dossier',  sub: 'Certification Paika',        to: '/ong-dashboard/dossier',      icon: 'i-heroicons-clipboard-document-check',  iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-400' },
]

const ongInfos = computed(() => ong.value ? [
  { label: 'Catégorie',    icon: 'i-heroicons-tag',          value: ong.value.category },
  { label: 'Localisation', icon: 'i-heroicons-map-pin',      value: ong.value.location },
  { label: 'Email',        icon: 'i-heroicons-envelope',     value: ong.value.email },
  { label: 'Site web',     icon: 'i-heroicons-globe-alt',    value: ong.value.website },
] : [])

onMounted(async () => {
  try {
    const [ongData, criteriaData] = await Promise.all([
      fetchOwnerOng(),
      import('~/features/score/services/score.service').then(m => m.getScoreCriteria()),
    ])
    ong.value = ongData
    if (ongData) {
      const donations = await fetchOngDonations(ongData.id)
      stats.value = computeOngStats(ongData, donations)

      const achieved: Record<string, boolean> = {
        profile_complete:     !!(ongData.name && ongData.description && ongData.location && ongData.email),
        projects_declared:    (ongData.projects?.length ?? 0) > 0,
        backoffice_validated: ongData.status === 'verified' || ongData.status === 'active',
        financial_reports:    Array.isArray(ongData.financials?.financialReports) && ongData.financials!.financialReports.length > 0,
        documents_uploaded:   false,
      }
      scoreCriteria.value = criteriaData.criteria.map((c: any) => ({
        key:      c.key,
        label:    c.label,
        points:   c.points,
        achieved: achieved[c.key] ?? false,
      }))
      score.value = scoreCriteria.value.filter(c => c.achieved).reduce((acc, c) => acc + c.points, 0)
    }
  } finally {
    loading.value = false
  }
})

function handleScoreAction(action: ScoreAction) {
  const ROUTES: Record<string, string> = {
    documents_uploaded:   '/ong-dashboard/documents',
    profile_complete:     ong.value ? `/ongs/${ong.value.id}/edit` : '/ongs/new',
    backoffice_validated: '/ong-dashboard/dossier',
    financial_reports:    '/ong-dashboard/documents',
    projects_declared:    ong.value ? `/ongs/${ong.value.id}/edit` : '/ongs/new',
  }
  const route = ROUTES[action.key]
  if (route) router.push(route)
}
</script>
