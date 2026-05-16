<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">Vue d'ensemble</h1>
        <p class="text-sm text-muted-foreground mt-0.5">
          Bienvenue sur votre espace ONG
          <span v-if="ong" class="font-medium text-foreground">— {{ ong.name }}</span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="ong" :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', ongStatusClass(ong.status)]">
          {{ ongStatusLabel(ong.status) }}
        </span>
        <NuxtLink v-if="ong" :to="`/ongs/${ong.id}`" target="_blank">
          <UButton variant="outline" size="sm">
            <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5 mr-1.5" />
            Voir ma page publique
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Skeleton ou stats -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-card border border-border rounded-xl p-5 animate-pulse h-28" />
    </div>
    <OngDashboardStats v-else-if="stats" :stats="stats" />

    <!-- Alerte dossier incomplet -->
    <div
      v-if="!loading && ong && ong.status === 'pending'"
      class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3"
    >
      <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div class="flex-1">
        <p class="font-medium text-amber-700 dark:text-amber-400">Dossier en attente de soumission</p>
        <p class="text-sm text-muted-foreground mt-0.5">
          Complétez votre profil et soumettez votre dossier pour obtenir la certification et apparaître sur le marketplace.
        </p>
      </div>
      <NuxtLink to="/ong-dashboard/dossier">
        <UButton size="sm" color="amber">Voir le dossier</UButton>
      </NuxtLink>
    </div>

    <!-- Alerte complément requis -->
    <div
      v-if="!loading && ong && ong.status === 'complement_required'"
      class="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3"
    >
      <Icon name="i-heroicons-chat-bubble-left-ellipsis" class="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
      <div class="flex-1">
        <p class="font-medium text-orange-700 dark:text-orange-400">Complément requis par le back-office</p>
        <p class="text-sm text-muted-foreground mt-0.5">
          Le back-office a demandé des informations supplémentaires. Consultez la messagerie et resoumettez votre dossier.
        </p>
      </div>
      <NuxtLink to="/ong-dashboard/dossier">
        <UButton size="sm" color="orange">Voir les messages</UButton>
      </NuxtLink>
    </div>

    <!-- Grille infos -->
    <div v-if="ong" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Infos ONG -->
      <div class="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">Informations de mon ONG</h2>
          <NuxtLink :to="`/ongs/${ong.id}/edit`">
            <UButton variant="ghost" size="xs">
              <Icon name="i-heroicons-pencil-square" class="w-3.5 h-3.5 mr-1" />
              Modifier
            </UButton>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-xs text-muted-foreground mb-1">Catégorie</div>
            <div class="font-medium capitalize">{{ ong.category }}</div>
          </div>
          <div>
            <div class="text-xs text-muted-foreground mb-1">Localisation</div>
            <div class="font-medium">{{ ong.location }}</div>
          </div>
          <div v-if="ong.email">
            <div class="text-xs text-muted-foreground mb-1">Email</div>
            <div class="font-medium">{{ ong.email }}</div>
          </div>
          <div v-if="ong.website">
            <div class="text-xs text-muted-foreground mb-1">Site web</div>
            <a :href="ong.website" target="_blank" class="font-medium text-primary hover:underline truncate block">
              {{ ong.website }}
            </a>
          </div>
          <div class="col-span-2">
            <div class="text-xs text-muted-foreground mb-1">Description</div>
            <p class="text-sm line-clamp-3">{{ ong.description }}</p>
          </div>
        </div>
      </div>

      <!-- Score de transparence -->
      <div class="bg-card border border-border rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">Score de transparence</h2>
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
    </div>

    <!-- Pas d'ONG créée -->
    <div
      v-if="!loading && !ong"
      class="bg-card border border-border rounded-xl p-12 text-center"
    >
      <Icon name="i-heroicons-building-office-2" class="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
      <h2 class="text-lg font-semibold mb-2">Vous n'avez pas encore créé d'ONG</h2>
      <p class="text-sm text-muted-foreground mb-6">Créez votre ONG pour commencer le processus de certification.</p>
      <NuxtLink to="/ongs/new">
        <UButton color="primary">
          <Icon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
          Créer mon ONG
        </UButton>
      </NuxtLink>
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
const ong = ref<ONG | null>(null)
const stats = ref<Stats | null>(null)
const loading = ref(true)
const score = ref(0)
const scoreCriteria = ref<ScoreCriterion[]>([])

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
