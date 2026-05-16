<template>
  <div class="space-y-6">
    <!-- Statut certification -->
    <div class="bg-card border border-border rounded-xl p-5">
      <div class="flex items-start gap-4">
        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0', statusBg]">
          <Icon :name="statusIcon" class="w-6 h-6" :class="statusColor" />
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-3 flex-wrap">
            <h2 class="font-semibold text-lg">Statut du dossier</h2>
            <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', statusBadgeClass]">
              {{ statusLabel }}
            </span>
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ statusDescription }}</p>

          <!-- Actions selon statut -->
          <div class="flex flex-wrap gap-2 mt-4">
            <UButton
              v-if="canSubmit"
              color="primary"
              size="sm"
              :loading="submitting"
              @click="submit"
            >
              <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 mr-1.5" />
              Soumettre pour validation
            </UButton>
            <UButton
              v-if="canResubmit"
              color="primary"
              size="sm"
              :loading="submitting"
              @click="resubmit"
            >
              <Icon name="i-heroicons-arrow-path" class="w-4 h-4 mr-1.5" />
              Resoumettre le dossier
            </UButton>
            <NuxtLink :to="`/ongs/${ongId}/edit`">
              <UButton variant="outline" size="sm">
                <Icon name="i-heroicons-pencil-square" class="w-4 h-4 mr-1.5" />
                Modifier mon profil
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Pipeline visuel -->
    <div class="bg-card border border-border rounded-xl p-5">
      <h3 class="font-semibold text-sm mb-4">Étapes de certification</h3>
      <div class="flex items-center gap-0">
        <div
          v-for="(step, i) in PIPELINE_STEPS"
          :key="step.key"
          class="flex items-center flex-1 min-w-0"
        >
          <div class="flex flex-col items-center text-center flex-1">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5',
              stepState(step.key) === 'done'    ? 'bg-emerald-600 text-white' :
              stepState(step.key) === 'active'  ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' :
                                                  'bg-muted text-muted-foreground'
            ]">
              <Icon v-if="stepState(step.key) === 'done'" name="i-heroicons-check" class="w-4 h-4" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="text-xs font-medium leading-tight hidden sm:block" :class="stepState(step.key) === 'active' ? 'text-primary' : 'text-muted-foreground'">
              {{ step.label }}
            </span>
          </div>
          <div
            v-if="i < PIPELINE_STEPS.length - 1"
            :class="['h-0.5 flex-shrink-0 w-4 sm:w-8', stepState(step.key) === 'done' ? 'bg-emerald-600' : 'bg-border']"
          />
        </div>
      </div>
    </div>

    <!-- Messagerie avec le back-office -->
    <div class="bg-card border border-border rounded-xl overflow-hidden" style="height: 420px;">
      <div class="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Icon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 text-primary" />
        <span class="text-sm font-semibold">Messagerie avec le back-office</span>
        <span
          v-if="unreadCount > 0"
          class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold"
        >
          {{ unreadCount }}
        </span>
      </div>
      <DossierMessagerie
        :ong-id="ongId"
        viewer-role="agent"
        api-base="/api/ongs"
        hide-header
        @unread-count="unreadCount = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DossierMessagerie from '~/features/verification/components/DossierMessagerie.vue'
import { ongStatusLabel, ongStatusClass } from '../services/ong-dashboard.service'
import type { ONG } from '~/features/ong/type'

const props = defineProps<{ ongId: string; status: ONG['status'] }>()
const toast = useToast()
const submitting = ref(false)
const unreadCount = ref(0)

const PIPELINE_STEPS = [
  { key: 'pending',             label: 'Création' },
  { key: 'submitted',           label: 'Soumis' },
  { key: 'under_review',        label: 'En révision' },
  { key: 'complement_required', label: 'Complément' },
  { key: 'verified',            label: 'Vérifié' },
]

const STEP_ORDER = ['pending', 'submitted', 'under_review', 'complement_required', 'verified']

function stepState(key: string): 'done' | 'active' | 'pending' {
  const currentIdx = STEP_ORDER.indexOf(props.status)
  const stepIdx    = STEP_ORDER.indexOf(key)
  if (stepIdx < currentIdx) return 'done'
  if (stepIdx === currentIdx) return 'active'
  return 'pending'
}

const statusLabel = computed(() => ongStatusLabel(props.status))
const statusBadgeClass = computed(() => ongStatusClass(props.status))

const STATUS_CONFIG: Record<string, { icon: string; bg: string; color: string; description: string }> = {
  pending:             { icon: 'i-heroicons-clock', bg: 'bg-yellow-100 dark:bg-yellow-900', color: 'text-yellow-600 dark:text-yellow-400', description: 'Votre dossier est en cours de préparation. Complétez votre profil puis soumettez-le.' },
  submitted:           { icon: 'i-heroicons-paper-airplane', bg: 'bg-blue-100 dark:bg-blue-900', color: 'text-blue-600 dark:text-blue-400', description: 'Votre dossier a été soumis et attend d\'être pris en charge par l\'équipe de validation.' },
  under_review:        { icon: 'i-heroicons-magnifying-glass', bg: 'bg-blue-100 dark:bg-blue-900', color: 'text-blue-600 dark:text-blue-400', description: 'Votre dossier est en cours d\'examen par le back-office. Restez disponible pour répondre aux questions.' },
  complement_required: { icon: 'i-heroicons-exclamation-triangle', bg: 'bg-orange-100 dark:bg-orange-900', color: 'text-orange-600 dark:text-orange-400', description: 'Des informations supplémentaires sont requises. Consultez les messages ci-dessous et resoumettez.' },
  verified:            { icon: 'i-heroicons-shield-check', bg: 'bg-emerald-100 dark:bg-emerald-900', color: 'text-emerald-600 dark:text-emerald-400', description: 'Félicitations ! Votre ONG est certifiée et visible sur le marketplace public.' },
  active:              { icon: 'i-heroicons-check-circle', bg: 'bg-emerald-100 dark:bg-emerald-900', color: 'text-emerald-600 dark:text-emerald-400', description: 'Votre ONG est active et visible sur le marketplace.' },
  rejected:            { icon: 'i-heroicons-x-circle', bg: 'bg-red-100 dark:bg-red-900', color: 'text-red-600 dark:text-red-400', description: 'Votre dossier a été rejeté. Consultez les messages pour connaître les raisons et prendre contact avec le back-office.' },
  suspended:           { icon: 'i-heroicons-pause-circle', bg: 'bg-red-100 dark:bg-red-900', color: 'text-red-600 dark:text-red-400', description: 'Votre ONG est suspendue. Contactez le back-office via la messagerie.' },
  inactive:            { icon: 'i-heroicons-minus-circle', bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-500', description: 'Votre ONG est inactive.' },
}

const cfg = computed(() => STATUS_CONFIG[props.status] ?? STATUS_CONFIG['inactive'])
const statusIcon = computed(() => cfg.value.icon)
const statusBg = computed(() => cfg.value.bg)
const statusColor = computed(() => cfg.value.color)
const statusDescription = computed(() => cfg.value.description)

const canSubmit = computed(() => props.status === 'pending')
const canResubmit = computed(() => props.status === 'complement_required' || props.status === 'rejected')

async function submit() {
  submitting.value = true
  try {
    await $fetch(`/api/ongs/${props.ongId}/submit`, { method: 'POST' })
    toast.add({ title: 'Dossier soumis', description: 'L\'équipe va examiner votre dossier.', color: 'green' })
    navigateTo('/ong-dashboard/dossier')
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    submitting.value = false
  }
}

async function resubmit() {
  submitting.value = true
  try {
    await $fetch(`/api/ongs/${props.ongId}/resubmit`, { method: 'POST' })
    toast.add({ title: 'Dossier resoumis', description: 'Votre dossier est de nouveau en cours d\'examen.', color: 'green' })
    navigateTo('/ong-dashboard/dossier')
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    submitting.value = false
  }
}
</script>
