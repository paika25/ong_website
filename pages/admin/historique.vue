<template>
  <div class="max-w-5xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Historique des actions</h1>
        <p class="text-sm text-muted-foreground">Journal complet des décisions back-office</p>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3 mb-6">
        <USelect
          v-model="filterAction"
          :options="ACTION_OPTIONS"
          placeholder="Toutes les actions"
          class="w-52"
          @change="reload"
        />
        <UInput
          v-model="filterOngId"
          placeholder="ID ONG (optionnel)"
          class="w-64"
          @keydown.enter="reload"
        />
        <UButton variant="outline" size="sm" @click="reload">Filtrer</UButton>
        <UButton v-if="filterAction || filterOngId" variant="ghost" size="sm" @click="clearFilters">
          Réinitialiser
        </UButton>
      </div>

      <!-- Tableau -->
      <div class="bg-card border border-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th class="px-4 py-3 text-left">Date / Heure</th>
                <th class="px-4 py-3 text-left">Action</th>
                <th class="px-4 py-3 text-left">ONG</th>
                <th class="px-4 py-3 text-left">Opérateur</th>
                <th class="px-4 py-3 text-left">Détail</th>
              </tr>
            </thead>
            <tbody>
              <!-- Skeleton -->
              <template v-if="loading">
                <tr v-for="i in 8" :key="i" class="border-t border-border animate-pulse">
                  <td v-for="j in 5" :key="j" class="px-4 py-3">
                    <div class="h-4 bg-muted rounded w-3/4" />
                  </td>
                </tr>
              </template>

              <!-- Empty state -->
              <tr v-else-if="!entries.length">
                <td colspan="5" class="px-4 py-12 text-center text-muted-foreground">
                  Aucune action enregistrée
                </td>
              </tr>

              <!-- Lignes -->
              <tr
                v-for="entry in entries"
                :key="entry.id"
                class="border-t border-border hover:bg-muted/30 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                  {{ formatDate(entry.created_at) }}
                </td>
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', actionBadge(entry.action).class]">
                    {{ actionBadge(entry.action).label }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="font-medium">{{ entry.ongs?.name ?? '—' }}</span>
                  <span class="text-xs text-muted-foreground block">{{ entry.ong_id?.slice(0,8) }}…</span>
                </td>
                <td class="px-4 py-3 text-xs text-muted-foreground">
                  {{ entry.performed_by ? entry.performed_by.slice(0,8) + '…' : 'système' }}
                </td>
                <td class="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                  {{ entry.details_json?.comment ?? entry.details_json?.message ?? '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Charger plus -->
        <div v-if="cursor" class="px-4 py-3 border-t border-border">
          <UButton variant="ghost" size="sm" :loading="loadingMore" @click="loadMore">
            Charger les entrées suivantes
          </UButton>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

const filterAction = ref('')
const filterOngId  = ref('')
const loading      = ref(true)
const loadingMore  = ref(false)
const entries      = ref<any[]>([])
const cursor       = ref<string | null>(null)

const ACTION_OPTIONS = [
  { label: 'Toutes les actions', value: '' },
  { label: 'Dossier soumis',     value: 'DOSSIER_SUBMITTED' },
  { label: 'Revue démarrée',     value: 'REVIEW_STARTED' },
  { label: 'Validé',             value: 'BACKOFFICE_VALIDATED' },
  { label: 'Rejeté',             value: 'BACKOFFICE_REJECTED' },
  { label: 'Complément demandé', value: 'COMPLEMENT_REQUESTED' },
  { label: 'Re-soumis',          value: 'DOSSIER_RESUBMITTED' },
  { label: 'Badge suspendu',     value: 'BADGE_SUSPENDED' },
  { label: 'Badge réactivé',     value: 'BADGE_REACTIVATED' },
  { label: 'Désactivé',          value: 'DOSSIER_DEACTIVATED' },
]

const ACTION_BADGE: Record<string, { label: string; class: string }> = {
  DOSSIER_SUBMITTED:    { label: 'Soumis',             class: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  REVIEW_STARTED:       { label: 'En revue',           class: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  BACKOFFICE_VALIDATED: { label: 'Validé ✓',           class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  BACKOFFICE_REJECTED:  { label: 'Rejeté',             class: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  COMPLEMENT_REQUESTED: { label: 'Complément',         class: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  DOSSIER_RESUBMITTED:  { label: 'Re-soumis',          class: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  BADGE_SUSPENDED:      { label: 'Badge suspendu',     class: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  BADGE_REACTIVATED:    { label: 'Badge réactivé',     class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  DOSSIER_DEACTIVATED:  { label: 'Désactivé',          class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
}

function actionBadge(action: string) {
  return ACTION_BADGE[action] ?? { label: action, class: 'bg-gray-100 text-gray-600' }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function clearFilters() {
  filterAction.value = ''
  filterOngId.value  = ''
  reload()
}

async function fetchPage(cursorParam?: string) {
  const { getHistorique } = await import('~/features/admin/services/admin.service')
  return getHistorique({
    action: filterAction.value || undefined,
    ongId:  filterOngId.value  || undefined,
    cursor: cursorParam,
  })
}

async function reload() {
  loading.value = true
  entries.value = []
  cursor.value  = null
  try {
    const res = await fetchPage()
    entries.value = res.data
    cursor.value  = res.cursor
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!cursor.value) return
  loadingMore.value = true
  try {
    const res = await fetchPage(cursor.value)
    entries.value.push(...res.data)
    cursor.value = res.cursor
  } finally {
    loadingMore.value = false
  }
}

onMounted(reload)
</script>
