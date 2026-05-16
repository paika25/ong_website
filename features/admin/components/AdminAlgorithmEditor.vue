<template>
  <div class="space-y-7">
    <!-- Nom de version -->
    <div v-if="mode === 'create'">
      <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
        Numéro de version <span class="text-destructive">*</span>
      </label>
      <input
        v-model="form.version"
        type="text"
        placeholder="ex : 1.2.0"
        class="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <p class="text-xs text-muted-foreground mt-1">Format semver obligatoire (MAJEUR.MINEUR.PATCH)</p>
    </div>

    <!-- Avertissement total ≠ 100 -->
    <div
      v-if="weightsTotal !== 100"
      class="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-400"
    >
      <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0 mt-0.5" />
      <span>La somme des poids est <strong>{{ weightsTotal }}</strong>/100. Ajustez les valeurs pour obtenir exactement 100 points.</span>
    </div>

    <!-- Poids des critères -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Poids des critères</h3>
        <span :class="['text-sm font-bold', weightsTotal === 100 ? 'text-emerald-600' : 'text-amber-600']">
          {{ weightsTotal }}/100
        </span>
      </div>

      <div v-for="w in WEIGHT_KEYS" :key="w.key" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium">{{ w.label }}</span>
            <span class="text-xs text-muted-foreground ml-2">{{ w.description }}</span>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model.number="form.weights[w.key]"
              type="number"
              min="0"
              max="100"
              class="w-16 px-2 py-1 text-sm text-right rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
            />
            <span class="text-xs text-muted-foreground w-6">pts</span>
          </div>
        </div>
        <div class="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="form.weights[w.key] > 0 ? 'bg-primary' : 'bg-transparent'"
            :style="{ width: `${form.weights[w.key]}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Seuils -->
    <div class="space-y-3">
      <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Seuils de certification</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-medium text-muted-foreground block mb-1.5">
            Score minimum de soumission
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="form.thresholds.submission_minimum"
              type="number" min="0" max="100"
              class="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
            />
            <span class="text-xs text-muted-foreground">pts</span>
          </div>
          <p class="text-xs text-muted-foreground mt-1">Score requis pour pouvoir soumettre un dossier</p>
        </div>
        <div>
          <label class="text-xs font-medium text-muted-foreground block mb-1.5">
            Score pour le badge "Vérifié"
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="form.thresholds.verified_badge"
              type="number" min="0" max="100"
              class="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
            />
            <span class="text-xs text-muted-foreground">pts</span>
          </div>
          <p class="text-xs text-muted-foreground mt-1">Score minimum pour obtenir le badge de certification</p>
        </div>
      </div>

      <!-- Visualisation seuils -->
      <div class="h-4 bg-muted rounded-full overflow-hidden relative mt-2">
        <div class="absolute inset-y-0 left-0 bg-amber-400/60 rounded-full transition-all"
             :style="{ width: `${form.thresholds.submission_minimum}%` }" />
        <div class="absolute inset-y-0 left-0 bg-emerald-500/60 rounded-full transition-all"
             :style="{ width: `${form.thresholds.verified_badge}%` }" />
        <div class="absolute inset-y-0 text-[10px] flex items-center pl-1 font-medium text-white/80"
             :style="{ left: `${form.thresholds.submission_minimum}%` }">
          {{ form.thresholds.submission_minimum }}
        </div>
      </div>
      <div class="flex gap-4 text-xs">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" /> Soumission</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" /> Badge vérifié</span>
      </div>
    </div>

    <!-- Documents requis -->
    <div class="space-y-3">
      <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents obligatoires</h3>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(doc, idx) in form.required_documents"
          :key="idx"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/40 text-sm"
        >
          <span>{{ doc }}</span>
          <button
            type="button"
            class="text-muted-foreground hover:text-destructive transition-colors"
            @click="removeDoc(idx)"
          >
            <Icon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Ajout inline -->
        <div v-if="addingDoc" class="flex items-center gap-1.5">
          <input
            ref="docInput"
            v-model="newDocName"
            type="text"
            placeholder="nom_document"
            class="px-2.5 py-1 text-sm rounded-full border border-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 w-40"
            @keydown.enter="confirmAddDoc"
            @keydown.escape="addingDoc = false"
          />
          <button type="button" class="text-primary hover:text-primary/70" @click="confirmAddDoc">
            <Icon name="i-heroicons-check" class="w-4 h-4" />
          </button>
          <button type="button" class="text-muted-foreground" @click="addingDoc = false">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>
        <button
          v-else
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          @click="startAddDoc"
        >
          <Icon name="i-heroicons-plus" class="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>
      <p class="text-xs text-muted-foreground">Ces documents sont requis pour valider le critère "Documents obligatoires"</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between pt-2 border-t border-border">
      <UButton variant="ghost" size="sm" @click="emit('cancel')">Annuler</UButton>
      <div class="flex gap-2">
        <UButton
          v-if="mode === 'edit'"
          variant="outline"
          size="sm"
          :loading="saving"
          :disabled="weightsTotal !== 100"
          @click="save"
        >
          Enregistrer le brouillon
        </UButton>
        <UButton
          v-else
          color="primary"
          size="sm"
          :loading="saving"
          :disabled="!canCreate"
          @click="save"
        >
          Créer le brouillon
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlgorithmVersion, AlgorithmWeights, AlgorithmThresholds } from '../services/admin.algorithm.service'
import { WEIGHT_KEYS, weightsTotal as calcTotal, defaultWeights, defaultThresholds } from '../services/admin.algorithm.service'

const props = defineProps<{
  mode:    'create' | 'edit'
  version?: AlgorithmVersion
  saving:  boolean
}>()

const emit = defineEmits<{
  cancel: []
  save:   [payload: { version?: string; weights: AlgorithmWeights; thresholds: AlgorithmThresholds; required_documents: string[] }]
}>()

const form = reactive({
  version:            '',
  weights:            { ...defaultWeights(), ...(props.version?.params_json.weights ?? {}) } as AlgorithmWeights,
  thresholds:         { ...defaultThresholds(), ...(props.version?.params_json.thresholds ?? {}) } as AlgorithmThresholds,
  required_documents: [...(props.version?.params_json.required_documents ?? ['statuts', 'recepisse', 'rapport_financier'])],
})

const weightsTotal = computed(() => calcTotal(form.weights))

const canCreate = computed(() =>
  /^\d+\.\d+\.\d+$/.test(form.version) &&
  weightsTotal.value === 100 &&
  form.required_documents.length > 0
)

const addingDoc  = ref(false)
const newDocName = ref('')
const docInput   = ref<HTMLInputElement | null>(null)

function startAddDoc() {
  addingDoc.value  = true
  newDocName.value = ''
  nextTick(() => docInput.value?.focus())
}

function confirmAddDoc() {
  const name = newDocName.value.trim().toLowerCase().replace(/\s+/g, '_')
  if (name && !form.required_documents.includes(name)) {
    form.required_documents.push(name)
  }
  addingDoc.value  = false
  newDocName.value = ''
}

function removeDoc(idx: number) {
  form.required_documents.splice(idx, 1)
}

function save() {
  emit('save', {
    ...(props.mode === 'create' && { version: form.version }),
    weights:            { ...form.weights },
    thresholds:         { ...form.thresholds },
    required_documents: [...form.required_documents],
  })
}
</script>
