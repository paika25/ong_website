<template>
  <main class="container mx-auto px-4 py-8 max-w-2xl">
      <NuxtLink to="/ong-dashboard" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group">
        <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour au dashboard
      </NuxtLink>

      <div class="mb-6">
        <h1 class="text-2xl font-bold tracking-tight">Mon Score de Transparence</h1>
        <p class="text-sm text-muted-foreground mt-1">Suivez votre progression vers la certification.</p>
      </div>

      <div v-if="loading" class="space-y-3 animate-pulse">
        <div class="h-8 bg-muted rounded" />
        <div class="h-32 bg-muted rounded-xl" />
      </div>

      <div v-else class="bg-card border border-border rounded-xl p-6">
        <ScoreTransparenceWidget
          :score="currentScore"
          :criteria="enrichedCriteria"
          @action-click="handleAction"
        />
      </div>
  </main>
</template>

<script setup lang="ts">
import ScoreTransparenceWidget from '~/features/verification/components/ScoreTransparenceWidget.vue'
import type { ScoreCriterion, ScoreAction } from '~/features/verification/components/ScoreTransparenceWidget.vue'
import { getOwnerOng } from '~/features/ong/services'

definePageMeta({ middleware: ['auth', 'agent-only'] })

const router  = useRouter()
const loading = ref(true)
const currentScore = ref(0)
const enrichedCriteria = ref<ScoreCriterion[]>([])

onMounted(async () => {
  try {
    const { getScoreCriteria } = await import('~/features/score/services/score.service')
    const [ong, criteriaData] = await Promise.all([
      getOwnerOng(),
      getScoreCriteria(),
    ])

    if (!ong) return

    // Calculer l'état atteint côté client (approximation — score serveur via score_history)
    const achieved: Record<string, boolean> = {
      profile_complete:     !!(ong.name && ong.description && ong.location && ong.email),
      projects_declared:    (ong.projects?.length ?? 0) > 0,
      backoffice_validated: ong.status === 'verified' || ong.status === 'active',
      financial_reports:    Array.isArray(ong.financials?.financialReports) && ong.financials.financialReports.length > 0,
      documents_uploaded:   false, // ne peut pas être déterminé client-side sans Storage call
    }

    enrichedCriteria.value = criteriaData.criteria.map(c => ({
      key:      c.key,
      label:    c.label,
      points:   c.points,
      achieved: achieved[c.key] ?? false,
    }))

    currentScore.value = enrichedCriteria.value
      .filter(c => c.achieved)
      .reduce((acc, c) => acc + c.points, 0)
  } finally {
    loading.value = false
  }
})

function handleAction(action: ScoreAction) {
  const ROUTES: Record<string, string> = {
    documents_uploaded:   '/ongs/new?step=documents',
    profile_complete:     '/ongs/new?step=identite',
    backoffice_validated: '/ongs/new?step=contacts',
    financial_reports:    '/ongs/new?step=documents',
    projects_declared:    '/ongs/new?step=projets',
  }
  const route = ROUTES[action.key]
  if (route) router.push(route)
}
</script>
