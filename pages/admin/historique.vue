<template>
  <div class="max-w-5xl">
      <PageHeader title="Historique des actions" subtitle="Journal complet des décisions back-office" class="mb-6" />

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
        <UTable :rows="entries" :columns="columns" :loading="loading">
          <template #empty-state>
            <EmptyState icon="i-heroicons-clock" title="Aucune action enregistrée" />
          </template>
          <template #created_at-data="{ row }">
            <span class="whitespace-nowrap text-xs text-muted-foreground">{{ formatDate(row.created_at) }}</span>
          </template>
          <template #action-data="{ row }">
            <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', actionBadge(row.action).class]">
              {{ actionBadge(row.action).label }}
            </span>
          </template>
          <template #ong-data="{ row }">
            <span class="font-medium">{{ row.ongs?.name ?? '—' }}</span>
            <span class="text-xs text-muted-foreground block">{{ row.ong_id?.slice(0,8) }}…</span>
          </template>
          <template #operator-data="{ row }">
            <template v-if="row.operator">
              <span class="text-sm font-medium block">
                {{ [row.operator.first_name, row.operator.last_name].filter(Boolean).join(' ') || '—' }}
              </span>
              <span class="text-xs text-muted-foreground block">{{ row.operator.email }}</span>
              <span class="text-[10px] text-muted-foreground/60 font-mono">{{ row.performed_by?.slice(0,8) }}…</span>
            </template>
            <span v-else class="text-xs text-muted-foreground italic">système</span>
          </template>
          <template #detail-data="{ row }">
            <span class="text-xs text-muted-foreground max-w-xs truncate block">
              {{ row.details_json?.comment ?? row.details_json?.message ?? '—' }}
            </span>
          </template>
        </UTable>

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
