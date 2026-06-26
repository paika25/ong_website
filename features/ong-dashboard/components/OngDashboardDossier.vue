<template>
  <div class="space-y-6">

    <!-- ─── Bannière statut ─── -->
    <div :class="['rounded-2xl border overflow-hidden', cfg.border]">
      <!-- Bande couleur en haut -->
      <div :class="['h-1.5 w-full', cfg.stripe]" />

      <div class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-start gap-5">
          <!-- Icône statut -->
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', cfg.iconBg]">
            <Icon :name="cfg.icon" class="w-7 h-7" :class="cfg.iconColor" />
          </div>

          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <h2 class="text-lg font-bold">Statut du dossier</h2>
              <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.badge]">
                <span :class="['w-1.5 h-1.5 rounded-full', cfg.dot]" />
                {{ statusLabel }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xl">{{ cfg.description }}</p>

            <!-- Boutons d'action -->
            <div class="flex flex-wrap gap-2">
              <UButton
                v-if="canSubmit"
                icon="i-heroicons-paper-airplane"
                :loading="submitting"
                @click="submit"
              >
                Soumettre pour validation
              </UButton>
              <UButton
                v-if="canResubmit"
                icon="i-heroicons-arrow-path"
                :loading="submitting"
                @click="resubmit"
              >
                Resoumettre le dossier
              </UButton>
              <NuxtLink :to="`/ongs/${ongId}/edit`">
                <UButton variant="outline" icon="i-heroicons-pencil-square">
                  Modifier mon profil
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Checklist contextuelle (pending ou complement) -->
        <div v-if="showChecklist" class="mt-6 pt-5 border-t border-border">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Éléments requis pour la soumission</p>
          <div class="grid sm:grid-cols-2 gap-2">
            <div
              v-for="item in checklist"
              :key="item.label"
              class="flex items-center gap-2.5 p-2.5 rounded-lg"
              :class="item.done ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/40'"
            >
              <div :class="['w-5 h-5 rounded-full flex items-center justify-center shrink-0', item.done ? 'bg-green-500' : 'bg-border']">
                <Icon
                  :name="item.done ? 'i-heroicons-check' : 'i-heroicons-minus'"
                  class="w-3 h-3"
                  :class="item.done ? 'text-white' : 'text-muted-foreground'"
                />
              </div>
              <span class="text-sm" :class="item.done ? 'text-green-700 dark:text-green-400 font-medium' : 'text-muted-foreground'">
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Pipeline de certification ─── -->
    <div class="bg-card border border-border rounded-2xl p-6">
      <h3 class="font-semibold text-sm mb-6">Parcours de certification</h3>

      <!-- Desktop : horizontal -->
      <div class="hidden sm:block">
        <div class="flex items-start">
          <div
            v-for="(step, i) in PIPELINE_STEPS"
            :key="step.key"
            class="flex-1 flex flex-col items-center text-center relative"
          >
            <!-- Trait de connexion (entre étapes) -->
            <div
              v-if="i < PIPELINE_STEPS.length - 1"
              class="absolute top-5 left-1/2 w-full h-0.5"
              :class="stepState(step.key) === 'done' ? 'bg-emerald-400' : 'bg-border'"
            />

            <!-- Cercle de l'étape -->
            <div
              class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-3 border-2 transition-all"
              :class="{
                'bg-emerald-500 border-emerald-500 text-white':                    stepState(step.key) === 'done',
                'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20': stepState(step.key) === 'active',
                'bg-card border-border text-muted-foreground':                     stepState(step.key) === 'pending',
              }"
            >
              <Icon v-if="stepState(step.key) === 'done'" name="i-heroicons-check" class="w-4 h-4" />
              <Icon v-else :name="step.icon" class="w-4 h-4" />
            </div>

            <!-- Label + description -->
            <p
              class="text-xs font-semibold mb-0.5"
              :class="{
                'text-emerald-600 dark:text-emerald-400': stepState(step.key) === 'done',
                'text-primary':                            stepState(step.key) === 'active',
                'text-muted-foreground':                   stepState(step.key) === 'pending',
              }"
            >
              {{ step.label }}
            </p>
            <p class="text-xs text-muted-foreground/70 max-w-[90px] leading-tight">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Mobile : vertical -->
      <div class="sm:hidden space-y-0">
        <div
          v-for="(step, i) in PIPELINE_STEPS"
          :key="step.key"
          class="flex items-start gap-3"
        >
          <div class="flex flex-col items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0"
              :class="{
                'bg-emerald-500 border-emerald-500 text-white':                    stepState(step.key) === 'done',
                'bg-primary border-primary text-primary-foreground ring-2 ring-primary/20': stepState(step.key) === 'active',
                'bg-card border-border text-muted-foreground':                     stepState(step.key) === 'pending',
              }"
            >
              <Icon v-if="stepState(step.key) === 'done'" name="i-heroicons-check" class="w-3.5 h-3.5" />
              <Icon v-else :name="step.icon" class="w-3.5 h-3.5" />
            </div>
            <div v-if="i < PIPELINE_STEPS.length - 1" class="w-0.5 h-8 mt-1" :class="stepState(step.key) === 'done' ? 'bg-emerald-400' : 'bg-border'" />
          </div>
          <div class="pb-6">
            <p
              class="text-sm font-semibold"
              :class="{
                'text-emerald-600 dark:text-emerald-400': stepState(step.key) === 'done',
                'text-primary':                            stepState(step.key) === 'active',
                'text-muted-foreground':                   stepState(step.key) === 'pending',
              }"
            >
              {{ step.label }}
            </p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Résumé -->
      <div class="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <p class="text-xs text-muted-foreground">
          {{ doneCount }} / {{ PIPELINE_STEPS.length }} étapes complétées
        </p>
        <div class="flex-1 mx-4 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            class="h-full rounded-full bg-emerald-500 transition-all duration-500"
            :style="{ width: `${(doneCount / PIPELINE_STEPS.length) * 100}%` }"
          />
        </div>
        <p class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {{ Math.round((doneCount / PIPELINE_STEPS.length) * 100) }} %
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ongStatusLabel } from '../services/ong-dashboard.service'
import type { ONG } from '~/features/ong/type'

const props = defineProps<{ ongId: string; status: ONG['status'] }>()
const toast = useToast()
const submitting = ref(false)

const PIPELINE_STEPS = [
  { key: 'pending',             label: 'Création',   desc: 'Profil créé',         icon: 'i-heroicons-building-office-2' },
  { key: 'submitted',           label: 'Soumission', desc: 'Dossier envoyé',       icon: 'i-heroicons-paper-airplane' },
  { key: 'under_review',        label: 'Révision',   desc: 'Examen en cours',      icon: 'i-heroicons-magnifying-glass' },
  { key: 'complement_required', label: 'Complément', desc: 'Infos demandées',      icon: 'i-heroicons-exclamation-triangle' },
  { key: 'verified',            label: 'Certifié',   desc: 'Badge accordé',        icon: 'i-heroicons-shield-check' },
]

const STEP_ORDER = ['pending', 'submitted', 'under_review', 'complement_required', 'verified']

function stepState(key: string): 'done' | 'active' | 'pending' {
  const currentIdx = STEP_ORDER.indexOf(props.status)
  const stepIdx    = STEP_ORDER.indexOf(key)
  if (stepIdx < currentIdx) return 'done'
  if (stepIdx === currentIdx) return 'active'
  return 'pending'
}

const doneCount = computed(() => PIPELINE_STEPS.filter(s => stepState(s.key) === 'done').length)

const statusLabel = computed(() => ongStatusLabel(props.status))

type StatusCfg = {
  icon: string; iconBg: string; iconColor: string
  badge: string; dot: string; stripe: string; border: string
  description: string
}

const STATUS_CONFIG: Record<string, StatusCfg> = {
  pending: {
    icon: 'i-heroicons-clock', iconBg: 'bg-yellow-100 dark:bg-yellow-900', iconColor: 'text-yellow-600 dark:text-yellow-400',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', dot: 'bg-yellow-500',
    stripe: 'bg-yellow-400', border: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/30 dark:bg-yellow-950/10',
    description: 'Votre dossier est en cours de préparation. Complétez votre profil ONG puis soumettez-le pour démarrer la procédure de certification.',
  },
  submitted: {
    icon: 'i-heroicons-paper-airplane', iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', dot: 'bg-blue-500',
    stripe: 'bg-blue-400', border: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10',
    description: 'Votre dossier a été soumis et est en attente de prise en charge par l\'équipe de validation Paika.',
  },
  under_review: {
    icon: 'i-heroicons-magnifying-glass', iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', dot: 'bg-blue-500',
    stripe: 'bg-blue-500', border: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10',
    description: 'Votre dossier est en cours d\'examen par le back-office Paika. Vous serez notifié dès qu\'une décision est prise.',
  },
  complement_required: {
    icon: 'i-heroicons-exclamation-triangle', iconBg: 'bg-orange-100 dark:bg-orange-900', iconColor: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300', dot: 'bg-orange-500',
    stripe: 'bg-orange-400', border: 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10',
    description: 'Des informations supplémentaires sont requises. Mettez à jour votre profil et resoumettez votre dossier.',
  },
  verified: {
    icon: 'i-heroicons-shield-check', iconBg: 'bg-emerald-100 dark:bg-emerald-900', iconColor: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300', dot: 'bg-emerald-500',
    stripe: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10',
    description: 'Félicitations ! Votre ONG est certifiée et visible sur le marketplace public de Paika.',
  },
  active: {
    icon: 'i-heroicons-check-circle', iconBg: 'bg-emerald-100 dark:bg-emerald-900', iconColor: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300', dot: 'bg-emerald-500',
    stripe: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10',
    description: 'Votre ONG est active et pleinement visible sur le marketplace Paika.',
  },
  rejected: {
    icon: 'i-heroicons-x-circle', iconBg: 'bg-red-100 dark:bg-red-900', iconColor: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', dot: 'bg-red-500',
    stripe: 'bg-red-500', border: 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10',
    description: 'Votre dossier a été rejeté. Corrigez les éléments signalés, mettez à jour votre profil et resoumettez.',
  },
  suspended: {
    icon: 'i-heroicons-pause-circle', iconBg: 'bg-red-100 dark:bg-red-900', iconColor: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', dot: 'bg-red-500',
    stripe: 'bg-red-500', border: 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10',
    description: 'Le badge de certification de votre ONG est suspendu. Contactez l\'équipe Paika pour régulariser la situation.',
  },
  inactive: {
    icon: 'i-heroicons-minus-circle', iconBg: 'bg-gray-100 dark:bg-gray-800', iconColor: 'text-gray-500',
    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400',
    stripe: 'bg-gray-300', border: 'border-border bg-muted/20',
    description: 'Votre ONG est inactive.',
  },
}

const cfg = computed((): StatusCfg => STATUS_CONFIG[props.status] ?? STATUS_CONFIG['inactive'])

const canSubmit   = computed(() => props.status === 'pending')
const canResubmit = computed(() => props.status === 'complement_required' || props.status === 'rejected')
const showChecklist = computed(() => canSubmit.value || canResubmit.value)

const checklist = [
  { label: 'Nom et description renseignés', done: true },
  { label: 'Localisation et catégorie',     done: true },
  { label: 'Email de contact',              done: true },
  { label: 'Au moins un projet déclaré',    done: false },
  { label: 'Documents légaux uploadés',     done: false },
  { label: 'Rapport d\'activité fourni',    done: false },
]

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
