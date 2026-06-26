<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
    <div class="px-5 py-4 border-b border-border flex items-center justify-between">
      <div>
        <h2 class="font-semibold">Toutes les versions</h2>
        <p class="text-xs text-muted-foreground mt-0.5">{{ versions.length }} version{{ versions.length > 1 ? 's' : '' }} au total</p>
      </div>
    </div>

    <div class="divide-y divide-border">
      <div
        v-for="v in versions"
        :key="v.id"
        class="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
      >
        <!-- Statut + version -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', statusMeta(v.status).iconBg]">
            <Icon :name="statusMeta(v.status).icon" class="w-4 h-4" :class="statusMeta(v.status).iconColor" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-sm">v{{ v.version }}</span>
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', STATUS_META[v.status].class]">
                {{ STATUS_META[v.status].label }}
              </span>
            </div>
            <div class="text-xs text-muted-foreground mt-0.5">
              Créé le {{ formatDate(v.created_at) }}
              <template v-if="v.approved_at"> · Approuvé le {{ formatDate(v.approved_at) }}</template>
            </div>
          </div>
        </div>

        <!-- Total poids -->
        <div class="text-right shrink-0 hidden sm:block">
          <div class="text-xs text-muted-foreground">Total poids</div>
          <div :class="['text-sm font-semibold', calcTotal(v.params_json.weights) !== 100 ? 'text-amber-600' : 'text-foreground']">
            {{ calcTotal(v.params_json.weights) }}/100
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <UButton
            v-if="v.status === 'draft'"
            size="xs"
            variant="outline"
            @click="emit('edit', v)"
          >
            <Icon name="i-heroicons-pencil-square" class="w-3.5 h-3.5 mr-1" />
            Éditer
          </UButton>
          <UButton
            v-else
            size="xs"
            variant="ghost"
            @click="emit('view', v)"
          >
            <Icon name="i-heroicons-eye" class="w-3.5 h-3.5 mr-1" />
            Voir
          </UButton>

          <template v-for="t in VALID_TRANSITIONS[v.status]" :key="t.status">
            <UButton
              size="xs"
              :color="t.color as any"
              variant="soft"
              :loading="transitionLoading === v.id + '-' + t.status"
              @click="emit('transition', v, t.status)"
            >
              {{ t.label }}
            </UButton>
          </template>
        </div>
      </div>

      <EmptyState v-if="!versions.length" icon="i-heroicons-cpu-chip" title="Aucune version enregistrée" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlgorithmVersion, AlgorithmStatus } from '../services/admin.algorithm.service'
import { STATUS_META, VALID_TRANSITIONS, weightsTotal as calcTotal } from '../services/admin.algorithm.service'

const STATUS_ICON_BG: Record<AlgorithmStatus, { iconBg: string; iconColor: string; icon: string }> = {
  draft:      { iconBg: 'bg-gray-100 dark:bg-gray-800',     iconColor: 'text-gray-500',                          icon: 'i-heroicons-pencil-square' },
  approved:   { iconBg: 'bg-blue-100 dark:bg-blue-900',     iconColor: 'text-blue-600 dark:text-blue-400',       icon: 'i-heroicons-check-circle' },
  active:     { iconBg: 'bg-emerald-100 dark:bg-emerald-900', iconColor: 'text-emerald-600 dark:text-emerald-400', icon: 'i-heroicons-bolt' },
  deprecated: { iconBg: 'bg-red-100 dark:bg-red-900',       iconColor: 'text-red-500 dark:text-red-400',         icon: 'i-heroicons-archive-box-x-mark' },
}

defineProps<{
  versions:          AlgorithmVersion[]
  transitionLoading: string | null
}>()

const emit = defineEmits<{
  edit:       [v: AlgorithmVersion]
  view:       [v: AlgorithmVersion]
  transition: [v: AlgorithmVersion, status: 'approved' | 'active' | 'deprecated']
}>()

function statusMeta(s: AlgorithmStatus) { return STATUS_ICON_BG[s] }

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
