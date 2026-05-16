<template>
  <div class="space-y-6 max-w-4xl">

    <!-- En-tête -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">Algorithme de score</h1>
        <p class="text-sm text-muted-foreground mt-0.5">
          Gérez les versions du score de transparence — poids, seuils et documents requis
        </p>
      </div>
      <UButton color="primary" size="sm" @click="openCreate">
        <Icon name="i-heroicons-plus" class="w-4 h-4 mr-1.5" />
        Nouvelle version
      </UButton>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div class="h-56 bg-card border border-border rounded-xl" />
      <div class="h-64 bg-card border border-border rounded-xl" />
    </div>

    <template v-else>
      <!-- Version active -->
      <AdminAlgorithmActiveCard v-if="activeVersion" :version="activeVersion" />
      <div v-else class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex items-center gap-3 text-sm text-amber-700 dark:text-amber-400">
        <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0" />
        Aucune version active. Approuvez puis activez un brouillon pour calculer les scores.
      </div>

      <!-- Formulaire création / édition inline -->
      <div v-if="editorMode" class="bg-card border border-border rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">
            {{ editorMode === 'create' ? 'Créer un nouveau brouillon' : `Éditer v${editingVersion?.version}` }}
          </h2>
        </div>
        <AdminAlgorithmEditor
          :mode="editorMode"
          :version="editingVersion ?? undefined"
          :saving="saving"
          @cancel="closeEditor"
          @save="onSave"
        />
      </div>

      <!-- Modale vue seule -->
      <UModal v-model="showViewModal">
        <div v-if="viewingVersion" class="p-6 space-y-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-bold">v{{ viewingVersion.version }}</h3>
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_META[viewingVersion.status].class]">
                {{ STATUS_META[viewingVersion.status].label }}
              </span>
            </div>
            <UButton variant="ghost" icon="i-heroicons-x-mark" size="sm" @click="showViewModal = false" />
          </div>

          <div class="space-y-3">
            <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Poids des critères</h4>
            <div v-for="w in WEIGHT_KEYS" :key="w.key" class="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0">
              <span class="text-muted-foreground">{{ w.label }}</span>
              <span class="font-semibold font-mono">{{ viewingVersion.params_json.weights[w.key] }} pts</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-xs text-muted-foreground mb-1">Seuil soumission</div>
              <div class="font-semibold font-mono">{{ viewingVersion.params_json.thresholds.submission_minimum }} pts</div>
            </div>
            <div>
              <div class="text-xs text-muted-foreground mb-1">Badge vérifié</div>
              <div class="font-semibold font-mono">{{ viewingVersion.params_json.thresholds.verified_badge }} pts</div>
            </div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground mb-2">Documents requis</div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="doc in viewingVersion.params_json.required_documents"
                :key="doc"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted border border-border"
              >
                {{ doc }}
              </span>
            </div>
          </div>
        </div>
      </UModal>

      <!-- Toutes les versions -->
      <AdminAlgorithmVersionsList
        :versions="versions"
        :transition-loading="transitionLoading"
        @edit="openEdit"
        @view="openView"
        @transition="onTransition"
      />
    </template>

    <div v-if="error" class="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminAlgorithmActiveCard    from '~/features/admin/components/AdminAlgorithmActiveCard.vue'
import AdminAlgorithmVersionsList  from '~/features/admin/components/AdminAlgorithmVersionsList.vue'
import AdminAlgorithmEditor        from '~/features/admin/components/AdminAlgorithmEditor.vue'
import {
  getAlgorithmVersions,
  createAlgorithmVersion,
  updateAlgorithmDraft,
  transitionAlgorithmStatus,
  WEIGHT_KEYS,
  STATUS_META,
} from '~/features/admin/services/admin.algorithm.service'
import type { AlgorithmVersion } from '~/features/admin/services/admin.algorithm.service'

definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

const toast = useToast()

const versions          = ref<AlgorithmVersion[]>([])
const loading           = ref(true)
const saving            = ref(false)
const transitionLoading = ref<string | null>(null)
const error             = ref<string | null>(null)

const editorMode      = ref<'create' | 'edit' | null>(null)
const editingVersion  = ref<AlgorithmVersion | null>(null)
const showViewModal   = ref(false)
const viewingVersion  = ref<AlgorithmVersion | null>(null)

const activeVersion = computed(() => versions.value.find(v => v.status === 'active') ?? null)

async function load() {
  loading.value = true
  error.value   = null
  try {
    versions.value = await getAlgorithmVersions()
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? e.message
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingVersion.value = null
  editorMode.value     = 'create'
}

function openEdit(v: AlgorithmVersion) {
  editingVersion.value = v
  editorMode.value     = 'edit'
}

function openView(v: AlgorithmVersion) {
  viewingVersion.value = v
  showViewModal.value  = true
}

function closeEditor() {
  editorMode.value     = null
  editingVersion.value = null
}

async function onSave(payload: any) {
  saving.value = true
  try {
    if (editorMode.value === 'create') {
      const created = await createAlgorithmVersion(payload)
      versions.value.unshift(created)
      toast.add({ title: `Brouillon v${created.version} créé`, color: 'green' })
    } else if (editingVersion.value) {
      const updated = await updateAlgorithmDraft(editingVersion.value.id, payload)
      versions.value = versions.value.map(v => v.id === updated.id ? updated : v)
      toast.add({ title: `v${updated.version} mis à jour`, color: 'green' })
    }
    closeEditor()
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    saving.value = false
  }
}

async function onTransition(v: AlgorithmVersion, status: 'approved' | 'active' | 'deprecated') {
  const key = `${v.id}-${status}`
  transitionLoading.value = key

  const LABELS: Record<string, string> = {
    approved:   'approuvée',
    active:     'activée',
    deprecated: 'dépréciée',
  }

  try {
    const updated = await transitionAlgorithmStatus(v.id, status)
    // Recharger pour refléter la dépréciation de l'ancienne version active
    await load()
    toast.add({ title: `v${updated.version} ${LABELS[status]}`, color: status === 'deprecated' ? 'amber' : 'green' })
  } catch (e: any) {
    toast.add({ title: 'Transition échouée', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    transitionLoading.value = null
  }
}

onMounted(load)
</script>
