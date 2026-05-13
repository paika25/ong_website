<!--
  Orchestrateur provisoire des étapes 1-3 du dossier ONG.
  En attente du StepperForm (Story 2.2) qui remplacera la navigation par onglets.
  Utilisé depuis pages/dashboard/agent/ong/create.vue
-->
<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Constituer mon dossier ONG</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Étapes 1 à 3 sur 5 — Identité, Mission, Documents
      </p>
    </div>

    <!-- Navigation étapes (remplacée par StepperForm en 2.2) -->
    <div class="flex gap-1 border-b border-border pb-0">
      <button
        v-for="step in steps"
        :key="step.id"
        type="button"
        :class="[
          'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
          currentStep === step.id
            ? 'border-primary text-primary'
            : completedSteps.includes(step.id)
              ? 'border-green-500 text-green-600 dark:text-green-400 cursor-pointer'
              : 'border-transparent text-muted-foreground cursor-not-allowed',
        ]"
        :disabled="!completedSteps.includes(step.id) && currentStep !== step.id"
        @click="goToStep(step.id)"
      >
        <span class="flex items-center gap-1.5">
          <span v-if="completedSteps.includes(step.id) && currentStep !== step.id" class="text-green-500">✓</span>
          {{ step.label }}
        </span>
      </button>
    </div>

    <!-- Skeleton loader pendant la sauvegarde -->
    <div v-if="saving" class="space-y-3 animate-pulse">
      <div class="h-4 bg-muted rounded w-3/4" />
      <div class="h-4 bg-muted rounded w-1/2" />
      <div class="h-10 bg-muted rounded" />
    </div>

    <!-- Étape 1 : Identité -->
    <OngStepIdentite
      v-else-if="currentStep === 'identite'"
      :identite="identite"
      :errors="errors"
      @blur="clearError"
    />

    <!-- Étape 2 : Mission -->
    <OngStepMission
      v-else-if="currentStep === 'mission'"
      :mission="mission"
      :errors="errors"
      @blur="clearError"
    />

    <!-- Étape 3 : Documents -->
    <OngStepDocuments
      v-else-if="currentStep === 'documents'"
      :ong-id="ongId || 'draft'"
      :documents="documents"
      :errors="errors"
      @add-document="addDocument"
      @remove-document="removeDocument"
    />

    <!-- Message erreur global -->
    <div v-if="globalError" class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
      {{ globalError }}
    </div>

    <!-- Indicateur sauvegarde silencieuse (visible uniquement si > 3s) -->
    <p v-if="showSaveIndicator" class="text-xs text-muted-foreground text-right animate-pulse">
      Sauvegarde en cours...
    </p>

    <!-- Actions navigation -->
    <div class="flex justify-between pt-4 border-t border-border">
      <UButton
        v-if="currentStep !== 'identite'"
        variant="outline"
        @click="prevStep"
      >
        ← Précédent
      </UButton>
      <div v-else />

      <UButton
        :loading="saving"
        @click="nextStep"
      >
        {{ currentStep === 'documents' ? 'Enregistrer les documents' : 'Suivant →' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import OngStepIdentite from '../components/OngStepIdentite.vue'
import OngStepMission from '../components/OngStepMission.vue'
import OngStepDocuments from '../components/OngStepDocuments.vue'
import { useOngDossierForm } from '../composables/useOngDossierForm'
import { createOng, updateOng } from '~/features/ong/services'
import { useAuthStore } from '~/features/auth/stores/auth.client'

const props = defineProps<{ ongId?: string }>()
const emit = defineEmits<{ saved: [ongId: string] }>()

const authStore = useAuthStore()
const { identite, mission, documents, errors, addDocument, removeDocument,
        validateIdentite, validateMission, validateDocuments, clearStorage } = useOngDossierForm(props.ongId)

type StepId = 'identite' | 'mission' | 'documents'
const currentStep = ref<StepId>('identite')
const completedSteps = ref<StepId[]>([])
const saving = ref(false)
const globalError = ref('')
const showSaveIndicator = ref(false)
const ongId = ref(props.ongId ?? '')

const steps = [
  { id: 'identite' as StepId,   label: '1. Identité'   },
  { id: 'mission'  as StepId,   label: '2. Mission'    },
  { id: 'documents' as StepId,  label: '3. Documents'  },
]

function clearError(field: string) {
  delete errors[field]
}

function goToStep(step: StepId) {
  if (completedSteps.value.includes(step) || currentStep.value === step) {
    currentStep.value = step
  }
}

function prevStep() {
  const order: StepId[] = ['identite', 'mission', 'documents']
  const idx = order.indexOf(currentStep.value)
  if (idx > 0) currentStep.value = order[idx - 1]
}

// Sauvegarde silencieuse + navigation
async function nextStep() {
  globalError.value = ''
  saving.value = true

  // Timeout > 3s → afficher indicateur
  const indicatorTimer = setTimeout(() => { showSaveIndicator.value = true }, 3000)

  try {
    if (currentStep.value === 'identite') {
      if (!validateIdentite()) { saving.value = false; clearTimeout(indicatorTimer); return }

      if (!ongId.value) {
        // Première sauvegarde — créer l'ONG
        const res = await createOng(authStore.currentUser!.id, {
          name: identite.value.nomOng,
          description: mission.value.missionPrincipale || identite.value.nomOng,
          category: 'social',
          location: identite.value.adresseSiege,
          email: identite.value.email,
          phone: identite.value.telephone,
          website: identite.value.siteWeb,
        })
        if (!res.success || !res.data) throw new Error(res.error || 'Erreur création ONG')
        ongId.value = res.data.id
      }

      completedSteps.value = [...new Set([...completedSteps.value, 'identite'])]
      currentStep.value = 'mission'

    } else if (currentStep.value === 'mission') {
      if (!validateMission()) { saving.value = false; clearTimeout(indicatorTimer); return }

      await updateOng(ongId.value, {
        name: identite.value.nomOng,
        description: mission.value.missionPrincipale,
        category: 'social',
        location: identite.value.adresseSiege,
        email: identite.value.email,
      })

      completedSteps.value = [...new Set([...completedSteps.value, 'mission'])]
      currentStep.value = 'documents'

    } else if (currentStep.value === 'documents') {
      validateDocuments() // non-bloquant pour les docs optionnels
      completedSteps.value = [...new Set([...completedSteps.value, 'documents'])]
      emit('saved', ongId.value)
    }
  } catch (err: any) {
    globalError.value = err.message || 'Une erreur est survenue'
  } finally {
    clearTimeout(indicatorTimer)
    saving.value = false
    showSaveIndicator.value = false
  }
}
</script>
