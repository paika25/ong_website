<template>
  <div class="flex flex-col min-h-0">
    <!-- ── Navigation étapes (role="tablist" ARIA) ────────────── -->
    <div
      role="tablist"
      aria-label="Étapes du formulaire"
      class="flex border-b border-border overflow-x-auto shrink-0"
    >
      <button
        v-for="step in steps"
        :key="step.id"
        role="tab"
        :id="`tab-${step.id}`"
        :aria-controls="`panel-${step.id}`"
        :aria-selected="currentStep === step.id"
        :aria-current="currentStep === step.id ? 'step' : undefined"
        :disabled="!isStepAccessible(step.id)"
        :class="[
          'relative flex items-center gap-2 px-4 border-b-2 -mb-px transition-colors whitespace-nowrap',
          'min-h-[44px] min-w-[44px]', // cibles tactiles ≥ 44×44px (UX-DR10)
          currentStep === step.id
            ? 'border-primary text-primary font-medium'
            : completedSteps.includes(step.id)
              ? 'border-green-500 text-green-600 dark:text-green-400 cursor-pointer hover:border-green-400'
              : 'border-transparent text-muted-foreground cursor-not-allowed opacity-60',
        ]"
        @click="isStepAccessible(step.id) && emit('step-click', step.id)"
      >
        <!-- Indicateur numéro / check -->
        <span
          :class="[
            'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0',
            currentStep === step.id
              ? 'bg-primary text-white'
              : completedSteps.includes(step.id)
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground',
          ]"
        >
          <svg v-if="completedSteps.includes(step.id) && currentStep !== step.id" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ step.number }}</span>
        </span>
        <span class="text-sm hidden sm:block">{{ step.label }}</span>
      </button>
    </div>

    <!-- ── Contenu de l'étape ─────────────────────────────────── -->
    <div
      v-for="step in steps"
      :key="`panel-${step.id}`"
      role="tabpanel"
      :id="`panel-${step.id}`"
      :aria-labelledby="`tab-${step.id}`"
      :hidden="currentStep !== step.id"
      class="flex-1 overflow-auto py-6"
    >
      <slot :name="step.id" />
    </div>

    <!-- ── Footer : Score sidebar + indicateur sauvegarde ─────── -->
    <div class="shrink-0 border-t border-border pt-4 mt-4 flex items-center justify-between gap-4">
      <!-- Score de transparence (placeholder jusqu'à Story 4.1) -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="text-xs text-muted-foreground shrink-0">Score actuel</div>
        <div class="flex items-center gap-2 min-w-0">
          <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden w-24 sm:w-32">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="scoreColorClass"
              :style="{ width: `${score}%` }"
            />
          </div>
          <span class="text-sm font-semibold text-gray-500 shrink-0">{{ score }}/100</span>
        </div>
      </div>

      <!-- Indicateur sauvegarde silencieuse (visible uniquement si > 3s) -->
      <div class="flex items-center gap-2 shrink-0">
        <span v-if="showSaveIndicator" class="text-xs text-muted-foreground animate-pulse flex items-center gap-1">
          <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sauvegarde...
        </span>
        <span v-else-if="lastSaved" class="text-xs text-muted-foreground">
          ✓ Sauvegardé
        </span>
      </div>
    </div>

    <!-- ── Boutons navigation ─────────────────────────────────── -->
    <div class="flex justify-between pt-4 shrink-0">
      <UButton
        v-if="!isFirstStep"
        variant="outline"
        @click="emit('prev')"
      >
        ← Précédent
      </UButton>
      <div v-else />

      <UButton
        :loading="saving"
        :disabled="saving"
        @click="emit('next')"
      >
        {{ isLastStep ? 'Terminer' : 'Suivant →' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface StepDefinition {
  id: string
  label: string
  number: number
}

const props = defineProps<{
  steps: StepDefinition[]
  currentStep: string
  completedSteps: string[]
  saving?: boolean
  showSaveIndicator?: boolean
  lastSaved?: boolean
  score?: number
}>()

const emit = defineEmits<{
  'step-click': [stepId: string]
  next: []
  prev: []
}>()

const currentStepIndex = computed(() =>
  props.steps.findIndex(s => s.id === props.currentStep)
)
const isFirstStep = computed(() => currentStepIndex.value === 0)
const isLastStep  = computed(() => currentStepIndex.value === props.steps.length - 1)

function isStepAccessible(stepId: string) {
  return props.currentStep === stepId || props.completedSteps.includes(stepId)
}

const scoreColorClass = computed(() => {
  const s = props.score ?? 0
  if (s < 40) return 'bg-amber-500'
  if (s < 70) return 'bg-blue-500'
  if (s < 90) return 'bg-teal-500'
  return 'bg-green-500'
})
</script>
