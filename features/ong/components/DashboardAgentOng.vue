<template>
  <div class="space-y-6">
    <!-- Header avec titre -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Mon ONG</h2>
        <p class="text-muted-foreground">Gérez votre organisation</p>
      </div>
      <NuxtLink v-if="!loading && !ong" to="/ongs/new">
        <UButton variant="default">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Créer mon ONG
        </UButton>
      </NuxtLink>
    </div>

    <!-- Skeleton loader (UX-DR15) -->
    <div v-if="loading" class="space-y-3 animate-pulse">
      <div class="h-6 bg-muted rounded w-1/3" />
      <div class="h-4 bg-muted rounded w-1/2" />
      <div class="h-32 bg-muted rounded-xl" />
    </div>

    <!-- ONG chargée -->
    <div v-else-if="ong" class="space-y-4">
      <!-- Header contextuel : complétude + score (UX-DR11) -->
      <div class="p-4 bg-card border border-border rounded-xl space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Complétude du dossier</span>
          <span class="text-sm font-bold">{{ completionPct }}%</span>
        </div>
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="completionPct >= 80 ? 'bg-green-500' : completionPct >= 50 ? 'bg-blue-500' : 'bg-amber-500'"
            :style="{ width: `${completionPct}%` }"
          />
        </div>

        <!-- Statut en temps réel -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted-foreground">Statut :</span>
            <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', statusConfig.class]">
              {{ statusConfig.label }}
            </span>
          </div>
          <NuxtLink
            v-if="ong.status === 'submitted' || ong.status === 'under_review' || ong.status === 'verified' || ong.status === 'active'"
            :to="`/ongs/${ong.id}/recap`"
            class="text-xs text-primary underline"
          >
            Récapitulatif
          </NuxtLink>
        </div>

        <!-- Bloc complément requis -->
        <div v-if="ong.status === 'complement_required'" class="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg space-y-2">
          <p class="text-xs font-semibold text-amber-700 dark:text-amber-300">
            ⚠ Complément requis par le back-office
          </p>
          <p class="text-xs text-amber-600 dark:text-amber-400">
            Consultez vos documents et complétez les informations demandées, puis re-soumettez votre dossier.
          </p>
          <UButton size="xs" color="amber" :loading="resubmitting" @click="resubmit">
            Re-soumettre mon dossier
          </UButton>
        </div>

        <!-- Bloc rejeté -->
        <div v-else-if="ong.status === 'rejected'" class="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-xs font-semibold text-red-700 dark:text-red-300">✗ Dossier rejeté</p>
          <p class="text-xs text-red-600 dark:text-red-400 mt-1">
            Votre dossier a été rejeté. Contactez le support pour plus d'informations.
          </p>
        </div>

        <!-- CTA soumettre si pending -->
        <div v-else-if="ong.status === 'pending'" class="pt-1">
          <NuxtLink :to="`/ongs/new?step=identite`">
            <UButton size="sm" variant="outline" class="w-full">
              Compléter et soumettre mon dossier →
            </UButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Carte ONG principale -->
      <OwnOng :ong="ong" />
    </div>

    <!-- État vide -->
    <div v-else class="bg-card border border-border rounded-xl p-12 text-center">
      <div class="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold mb-2">Vous n'avez pas encore d'ONG</h3>
      <p class="text-muted-foreground mb-6">Créez votre organisation pour commencer à faire la différence</p>
      <NuxtLink to="/ongs/new">
        <UButton variant="default">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Créer mon ONG
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '~/features/ong/type'
import { getOwnerOng } from '~/features/ong/services'
import OwnOng from './OwnOng.vue'

const loading     = ref(true)
const resubmitting = ref(false)
const ong = ref<ONG | null>(null)
const toast = useToast()
let realtimeChannel: ReturnType<NonNullable<ReturnType<typeof useSupabase>>['channel']> | null = null

// ── Status config ────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  pending:             { label: 'En cours de création', class: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  submitted:           { label: 'Soumis', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  under_review:        { label: 'En révision', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  complement_required: { label: 'Complément requis', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  verified:            { label: '✓ Vérifié', class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  active:              { label: '✓ Vérifié', class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  rejected:            { label: 'Rejeté', class: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  inactive:            { label: 'Inactif', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
}

const statusConfig = computed(() => {
  const s = ong.value?.status ?? 'pending'
  return STATUS_CONFIG[s] ?? STATUS_CONFIG.pending
})

// ── Complétude % (UX-DR11) ───────────────────────────────────
const completionPct = computed(() => {
  const o = ong.value
  if (!o) return 0
  let pct = 0
  if (o.name?.trim())              pct += 20
  if ((o.description?.length ?? 0) >= 20) pct += 20
  if (o.location?.trim())          pct += 15
  if (o.email?.trim())             pct += 15
  if ((o.projects?.length ?? 0) > 0) pct += 15
  if (o.phone?.trim())             pct += 15
  return Math.min(pct, 100)
})

// ── Realtime subscription ────────────────────────────────────
function subscribeRealtime(ongId: string) {
  const supabase = useSupabase()
  if (!supabase) return

  realtimeChannel = supabase
    .channel(`ong-status-${ongId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'ongs', filter: `id=eq.${ongId}` },
      (payload: any) => {
        if (ong.value && payload.new?.status) {
          ong.value = { ...ong.value, status: payload.new.status }
        }
      }
    )
    .subscribe()
}

onMounted(async () => {
  try {
    ong.value = await getOwnerOng()
    if (ong.value?.id) subscribeRealtime(ong.value.id)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  const supabase = useSupabase()
  if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel)
})

// ── Re-soumission après complément ───────────────────────────
async function resubmit() {
  if (!ong.value?.id) return
  resubmitting.value = true
  try {
    const supabase = useSupabase()
    const { data: { session } } = await supabase!.auth.getSession()
    await $fetch(`/api/ongs/${ong.value.id}/resubmit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })
    if (ong.value) ong.value = { ...ong.value, status: 'submitted' }
    toast.add({ title: 'Dossier re-soumis', description: 'Votre dossier est à nouveau en attente de vérification.', color: 'green', timeout: 5000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally {
    resubmitting.value = false
  }
}

onUnmounted(() => {
  const supabase = useSupabase()
  if (realtimeChannel && supabase) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>
