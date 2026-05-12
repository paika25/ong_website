<!--
  Formulaire dossier ONG complet — 5 étapes avec StepperForm.
  Auto-save toutes les 30s + à chaque navigation.
  useOnline() déclenche une sync à la reconnexion.
  URL step persistence : émet 'step-change' à chaque navigation.
-->
<template>
  <div class="w-full max-w-2xl mx-auto">
    <StepperForm
      :steps="STEPS"
      :current-step="currentStep"
      :completed-steps="completedSteps"
      :saving="saving"
      :show-save-indicator="showSaveIndicator"
      :last-saved="lastSaved"
      :score="score"
      @step-click="goToStep"
      @next="nextStep"
      @prev="prevStep"
    >
      <template #identite>
        <OngStepIdentite :identite="identite" :errors="errors" @blur="clearError" />
      </template>

      <template #mission>
        <OngStepMission :mission="mission" :errors="errors" @blur="clearError" />
      </template>

      <template #documents>
        <OngStepDocuments
          :ong-id="currentOngId || 'draft'"
          :documents="documents"
          :errors="errors"
          @add-document="addDocument"
          @remove-document="removeDocument"
        />
      </template>

      <template #projets>
        <OngStepProjets :projets="projets" />
      </template>

      <template #contacts>
        <OngStepContacts :contacts="contacts" :errors="errors" @blur="clearError" />
      </template>
    </StepperForm>

    <!-- ── Section Soumettre (visible après complétion étape 5) ── -->
    <div v-if="formCompleted" class="mt-8 p-6 bg-card border border-border rounded-xl space-y-4">
      <div>
        <h3 class="text-base font-semibold">Soumettre mon dossier</h3>
        <p class="text-sm text-muted-foreground mt-1">
          Votre dossier sera examiné par notre équipe de vérification.
        </p>
      </div>

      <!-- Score + docs gate -->
      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <span :class="score >= 40 ? 'text-green-600' : 'text-amber-600'">
            {{ score >= 40 ? '✓' : '✗' }}
          </span>
          <span>Score de transparence : <strong>{{ score }}/100</strong>
            <span v-if="score < 40" class="text-amber-600"> (minimum 40 requis)</span>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span :class="hasRequiredDocs ? 'text-green-600' : 'text-amber-600'">
            {{ hasRequiredDocs ? '✓' : '✗' }}
          </span>
          <span>Documents obligatoires (statuts + récépissé)
            <span v-if="!hasRequiredDocs" class="text-amber-600"> — manquants</span>
          </span>
        </div>
      </div>

      <UButton
        :disabled="!canSubmit"
        :loading="submitting"
        size="lg"
        class="w-full"
        @click="showSubmitModal = true"
      >
        Soumettre mon dossier
      </UButton>

      <p v-if="!canSubmit" class="text-xs text-muted-foreground text-center">
        Complétez votre profil pour atteindre un score ≥ 40 et ajoutez les documents obligatoires.
      </p>
    </div>

    <!-- ── Modal de confirmation ─────────────────────────────── -->
    <UModal v-model="showSubmitModal">
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">Confirmer la soumission</h3>
        <p class="text-sm text-muted-foreground">
          Vous allez soumettre le dossier de <strong>{{ identite.nomOng }}</strong> à validation.
          Cette action est irréversible — vous ne pourrez plus modifier le dossier pendant la révision.
        </p>

        <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
          <div>ONG : <strong>{{ identite.nomOng }}</strong></div>
          <div>Score actuel : <strong>{{ score }}/100</strong></div>
          <div>Documents : <strong>{{ documents.length }} fichier(s)</strong></div>
        </div>

        <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" class="flex-1" :disabled="submitting" @click="showSubmitModal = false">
            Annuler
          </UButton>
          <UButton class="flex-1" :loading="submitting" @click="confirmSubmit">
            Confirmer la soumission
          </UButton>
        </div>
      </div>
    </UModal>

    <div v-if="globalError" class="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
      {{ globalError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage, useOnline } from '@vueuse/core'
import StepperForm, { type StepDefinition } from './StepperForm.vue'
import OngStepIdentite from './OngStepIdentite.vue'
import OngStepMission from './OngStepMission.vue'
import OngStepDocuments from './OngStepDocuments.vue'
import OngStepProjets, { type Projet } from './OngStepProjets.vue'
import OngStepContacts, { type Contacts } from './OngStepContacts.vue'
import { useOngDossierForm, REQUIRED_DOCS } from '../composables/useOngDossierForm'
import { createOng, updateOng } from '~/features/ong/services'
import { getOngById } from '~/features/ong/services'
import { useAuthStore } from '~/features/auth/stores/auth.client'

type StepId = 'identite' | 'mission' | 'documents' | 'projets' | 'contacts'

const STEPS: StepDefinition[] = [
  { id: 'identite',   label: 'Identité',   number: 1 },
  { id: 'mission',    label: 'Mission',    number: 2 },
  { id: 'documents',  label: 'Documents',  number: 3 },
  { id: 'projets',    label: 'Projets',    number: 4 },
  { id: 'contacts',   label: 'Contacts',   number: 5 },
]

const props = defineProps<{
  ongId?: string
  initialStep?: string
}>()

const emit = defineEmits<{
  completed: [ongId: string]
  'step-change': [step: string]
}>()

const authStore = useAuthStore()
const isOnline  = useOnline()

const { identite, mission, documents, errors,
        addDocument, removeDocument,
        validateIdentite, validateMission, validateDocuments } = useOngDossierForm(props.ongId)

// Étapes 4-5 persistées dans localStorage
const storageKey = `ong-dossier-${props.ongId ?? 'new'}`
const projets  = useStorage<Projet[]>(`${storageKey}-projets`, [])
const contacts = useStorage<Contacts>(`${storageKey}-contacts`, {
  responsableNom: '', responsableFonction: '', responsableEmail: '', responsableTel: '',
  communicationNom: '', communicationEmail: '',
  siteWeb: '', facebook: '', linkedin: '', twitter: '',
})

// Résoudre l'étape initiale depuis la prop
const resolvedInitialStep = (): StepId => {
  if (props.initialStep && STEPS.some(s => s.id === props.initialStep)) {
    return props.initialStep as StepId
  }
  return 'identite'
}

const currentStep    = ref<StepId>(resolvedInitialStep())
const completedSteps = ref<StepId[]>([])
const currentOngId   = ref(props.ongId ?? '')
const saving         = ref(false)
const showSaveIndicator = ref(false)
const lastSaved      = ref(false)
const globalError    = ref('')
const formCompleted   = ref(false)
const showSubmitModal = ref(false)
const submitting      = ref(false)
const submitError     = ref('')
// ── Score calculé côté client (approximation algo v1) ────────
const score = computed(() => {
  let s = 0
  if (identite.value.nomOng?.trim())       s += 5
  if (identite.value.email?.trim())        s += 5
  if (identite.value.adresseSiege?.trim()) s += 5
  if (identite.value.telephone?.trim())    s += 5
  if (identite.value.numeroRecepisse?.trim()) s += 5
  if (mission.value.missionPrincipale?.trim().length >= 20) s += 10
  if (mission.value.secteurs?.length > 0)  s += 5
  if (mission.value.zonesGeographiques?.length > 0) s += 5
  if (documents.value.length >= 2)         s += 20
  else if (documents.value.length === 1)   s += 10
  if (projets.value.length > 0)           s += 10
  if (contacts.value.responsableNom?.trim())   s += 5
  if (contacts.value.responsableEmail?.trim()) s += 5
  if (contacts.value.responsableTel?.trim())   s += 5
  return Math.min(s, 100)
})

// ── Émettre step-change à chaque navigation ──────────────────
watch(currentStep, (step) => {
  emit('step-change', step)
})

// ── Computed : docs + soumission ─────────────────────────────
const hasRequiredDocs = computed(() =>
  REQUIRED_DOCS.filter(d => d.required).every(req =>
    documents.value.some(d => d.name.toLowerCase().includes(req.key.replace('_', '')))
  )
)

const canSubmit = computed(() => score.value >= 40)

// ── Auto-save toutes les 30s ─────────────────────────────────
let autoSaveTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  // Restauration depuis Supabase si localStorage vide
  if (props.ongId && identite.value.nomOng === '') {
    const ong = await getOngById(props.ongId)
    if (ong) {
      identite.value.nomOng      = ong.name        || ''
      identite.value.email       = ong.email       || ''
      identite.value.telephone   = ong.phone       || ''
      identite.value.siteWeb     = ong.website     || ''
      identite.value.adresseSiege = ong.location   || ''
      mission.value.missionPrincipale = ong.description || ''
    }
    currentOngId.value = props.ongId
  }

  autoSaveTimer = setInterval(() => {
    if (currentOngId.value && isOnline.value) silentSave()
  }, 30_000)
})

onUnmounted(() => {
  if (autoSaveTimer) clearInterval(autoSaveTimer)
})

// ── Sync à la reconnexion ─────────────────────────────────────
watch(isOnline, (online) => {
  if (online && currentOngId.value) silentSave()
})

async function silentSave() {
  if (!currentOngId.value || saving.value) return
  const indicatorTimer = setTimeout(() => { showSaveIndicator.value = true }, 3000)
  try {
    await updateOng(currentOngId.value, {
      name: identite.value.nomOng,
      description: mission.value.missionPrincipale || identite.value.nomOng,
      category: 'social',
      location: identite.value.adresseSiege,
      email: identite.value.email,
    })
    lastSaved.value = true
    setTimeout(() => { lastSaved.value = false }, 3000)
  } catch { /* silencieux */ } finally {
    clearTimeout(indicatorTimer)
    showSaveIndicator.value = false
  }
}

function clearError(field: string) { delete errors[field] }

function goToStep(stepId: string) {
  if (completedSteps.value.includes(stepId as StepId) || currentStep.value === stepId) {
    currentStep.value = stepId as StepId
  }
}

function prevStep() {
  const order = STEPS.map(s => s.id as StepId)
  const idx = order.indexOf(currentStep.value)
  if (idx > 0) currentStep.value = order[idx - 1]
}

const STEP_VALIDATORS: Partial<Record<StepId, () => boolean>> = {
  identite:  validateIdentite,
  mission:   validateMission,
  documents: validateDocuments,
}

async function nextStep() {
  const validator = STEP_VALIDATORS[currentStep.value]
  if (validator && !validator()) return

  saving.value = true
  globalError.value = ''
  const indicatorTimer = setTimeout(() => { showSaveIndicator.value = true }, 3000)

  try {
    if (currentStep.value === 'identite') {
      if (!currentOngId.value) {
        const res = await createOng(authStore.currentUser!.id, {
          name: identite.value.nomOng,
          description: identite.value.nomOng,
          category: 'social',
          location: identite.value.adresseSiege,
          email: identite.value.email,
          phone: identite.value.telephone,
          website: identite.value.siteWeb,
        })
        if (!res.success || !res.data) throw new Error(res.error || 'Erreur création ONG')
        currentOngId.value = res.data.id
      }
    }

    if (currentStep.value === 'contacts') {
      // Dernière étape — marquer complet, afficher section submit
      completedSteps.value = [...new Set([...completedSteps.value, 'contacts'])]
      formCompleted.value = true
    } else {
      completedSteps.value = [...new Set([...completedSteps.value, currentStep.value])]
      const order = STEPS.map(s => s.id as StepId)
      const idx = order.indexOf(currentStep.value)
      currentStep.value = order[idx + 1]
    }

    lastSaved.value = true
    setTimeout(() => { lastSaved.value = false }, 3000)
  } catch (err: any) {
    globalError.value = err.message || 'Une erreur est survenue'
  } finally {
    clearTimeout(indicatorTimer)
    saving.value = false
    showSaveIndicator.value = false
  }
}

const toast = useToast()

async function confirmSubmit() {
  if (!canSubmit.value || !currentOngId.value) return
  submitting.value = true
  submitError.value = ''

  try {
    const supabase = useSupabase()
    const { data: { session } } = await supabase!.auth.getSession()
    const token = session?.access_token

    if (!token) throw new Error('Session expirée — reconnectez-vous')

    await $fetch(`/api/ongs/${currentOngId.value}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    showSubmitModal.value = false
    toast.add({ title: 'Dossier soumis avec succès', description: 'Notre équipe va examiner votre dossier.', color: 'green', timeout: 5000 })
    emit('completed', currentOngId.value)
  } catch (err: any) {
    submitError.value = err.data?.statusMessage || err.message || 'Erreur lors de la soumission'
  } finally {
    submitting.value = false
  }
}
</script>
