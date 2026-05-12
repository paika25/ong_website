<template>
  <div class="space-y-2">
    <!-- Skeleton loader -->
    <div v-if="loading" class="space-y-2 animate-pulse">
      <div v-for="i in 3" :key="i" class="h-12 bg-muted rounded-lg" />
    </div>

    <!-- Empty state (UX-DR16) -->
    <div
      v-else-if="!entries.length"
      class="py-6 text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg"
    >
      Aucune action enregistrée pour ce dossier.
    </div>

    <!-- Entrées -->
    <div v-else class="space-y-2">
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="p-3 bg-muted/50 rounded-lg text-sm space-y-1"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ actionLabel(entry.action) }}</span>
          <time class="text-xs text-muted-foreground">{{ formatDate(entry.created_at) }}</time>
        </div>
        <div class="text-xs text-muted-foreground">
          Opérateur : {{ entry.performed_by ? entry.performed_by.slice(0, 8) + '…' : 'système' }}
        </div>
        <div v-if="entry.details_json?.comment || entry.details_json?.message" class="text-xs italic text-muted-foreground border-l-2 border-muted pl-2">
          {{ entry.details_json.comment ?? entry.details_json.message }}
        </div>
      </div>

      <!-- Charger plus -->
      <UButton
        v-if="cursor"
        variant="ghost"
        size="sm"
        :loading="loadingMore"
        class="w-full"
        @click="loadMore"
      >
        Charger plus
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ ongId: string }>()

const loading    = ref(true)
const loadingMore = ref(false)
const entries    = ref<any[]>([])
const cursor     = ref<string | null>(null)

const ACTION_LABELS: Record<string, string> = {
  BACKOFFICE_VALIDATED:    'Dossier validé',
  BACKOFFICE_REJECTED:     'Dossier rejeté',
  COMPLEMENT_REQUESTED:    'Complément demandé',
  BADGE_SUSPENDED:         'Badge suspendu',
  BADGE_REACTIVATED:       'Badge réactivé',
  DOCUMENT_UPLOADED:       'Document uploadé',
  PROFILE_UPDATED:         'Profil mis à jour',
}

function actionLabel(action: string) {
  return ACTION_LABELS[action] ?? action
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

async function fetchAudit(cursorParam?: string) {
  if (!props.ongId) return { data: [], cursor: null }
  const supabase = useSupabase()
  const { data: { session } } = await supabase!.auth.getSession()
  const url = `/api/admin/dossiers/${props.ongId}/audit${cursorParam ? `?cursor=${cursorParam}` : ''}`
  return $fetch<{ data: any[]; cursor: string | null }>(url, {
    headers: { Authorization: `Bearer ${session?.access_token}` }
  })
}

onMounted(async () => {
  if (!props.ongId) { loading.value = false; return }
  try {
    const res = await fetchAudit()
    entries.value = res.data
    cursor.value  = res.cursor
  } catch { /* swallow — dossier peut ne pas avoir d'audit encore */ } finally {
    loading.value = false
  }
})

watch(() => props.ongId, async (id) => {
  if (!id) return
  loading.value = true
  entries.value = []
  cursor.value  = null
  try {
    const res = await fetchAudit()
    entries.value = res.data
    cursor.value  = res.cursor
  } finally { loading.value = false }
})

async function loadMore() {
  if (!cursor.value) return
  loadingMore.value = true
  try {
    const res = await fetchAudit(cursor.value)
    entries.value.push(...res.data)
    cursor.value = res.cursor
  } finally { loadingMore.value = false }
}
</script>
