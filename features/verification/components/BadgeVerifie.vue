<template>
  <span
    role="status"
    :aria-label="ariaLabel"
    :class="['inline-flex items-center gap-1 font-semibold rounded-full', sizeClass, colorClass]"
  >
    <span :class="['rounded-full', dotSize, dotColor]" aria-hidden="true" />
    {{ label }}
    <span v-if="status === 'verified' && certificationDate" class="font-normal opacity-70">
      · {{ formattedDate }}
    </span>
  </span>
</template>

<script setup lang="ts">
import type { BadgeStatus, BadgeSize } from '../types'

const props = withDefaults(defineProps<{
  status: BadgeStatus
  certificationDate?: string
  size?: BadgeSize
}>(), { size: 'md' })

const SIZE_MAP: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}
const DOT_SIZE: Record<BadgeSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

const CONFIG: Record<BadgeStatus, { label: string; color: string; dot: string; ariaLabel: string }> = {
  verified:   { label: '✓ Vérifié',      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', dot: 'bg-green-500',  ariaLabel: 'ONG vérifiée et certifiée' },
  pending:    { label: 'En attente',      color: 'bg-blue-100  text-blue-700  dark:bg-blue-900  dark:text-blue-300',  dot: 'bg-blue-500',   ariaLabel: 'Vérification en cours'      },
  suspended:  { label: 'Suspendu',        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300', dot: 'bg-amber-500',  ariaLabel: 'Badge suspendu'             },
  unverified: { label: 'Non vérifié',     color: 'bg-gray-100  text-gray-600  dark:bg-gray-800  dark:text-gray-400',  dot: 'bg-gray-400',   ariaLabel: 'ONG non vérifiée'           },
}

const cfg       = computed(() => CONFIG[props.status])
const label     = computed(() => cfg.value.label)
const colorClass = computed(() => cfg.value.color)
const dotColor  = computed(() => cfg.value.dot)
const ariaLabel = computed(() => cfg.value.ariaLabel)
const sizeClass  = computed(() => SIZE_MAP[props.size])
const dotSize   = computed(() => DOT_SIZE[props.size])

const formattedDate = computed(() =>
  props.certificationDate
    ? new Date(props.certificationDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''
)
</script>

<style>
@media (prefers-reduced-motion: reduce) {
  .badge-transition { transition: none !important; }
}
</style>
