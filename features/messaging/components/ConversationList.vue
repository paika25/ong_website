<template>
  <div class="flex-1 overflow-y-auto">
    <div v-if="loading" class="p-4 space-y-3 animate-pulse">
      <div v-for="i in 4" :key="i" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-muted shrink-0" />
        <div class="flex-1 space-y-1.5">
          <div class="h-3 bg-muted rounded w-2/3" />
          <div class="h-2.5 bg-muted rounded w-full" />
        </div>
      </div>
    </div>

    <div v-else-if="!items.length" class="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
      <Icon name="i-heroicons-chat-bubble-left-right" class="w-10 h-10 opacity-30 mb-2" />
      <p class="text-sm">{{ emptyTitle ?? 'Aucune conversation' }}</p>
      <p v-if="emptyHint" class="text-xs mt-1">{{ emptyHint }}</p>
    </div>

    <div v-else class="divide-y divide-border">
      <button
        v-for="item in items"
        :key="item.id"
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
        :class="selectedId === item.id ? 'bg-muted/60' : ''"
        @click="emit('select', item.id)"
      >
        <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold overflow-hidden" :class="avatarClass(item.avatarColor)">
          <img v-if="item.avatarUrl" :src="item.avatarUrl" :alt="item.name" class="w-full h-full object-cover">
          <template v-else>{{ initials(item.name) }}</template>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="text-sm font-medium truncate">{{ item.name }}</p>
            <span v-if="item.badge" class="shrink-0 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
              {{ item.badge }}
            </span>
            <span v-if="item.unreadCount" class="ml-auto shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {{ item.unreadCount }}
            </span>
          </div>
          <p v-if="item.preview" class="text-xs text-muted-foreground truncate">{{ item.preview }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ConversationListItem {
  id: string
  name: string
  preview?: string
  avatarUrl?: string | null
  unreadCount?: number
  /** Étiquette courte affichée à côté du nom (ex. 'ONG', 'Bailleur') pour distinguer les types dans une liste mixte */
  badge?: string
  /** Teinte de l'avatar par défaut (initiales) quand aucune image n'est fournie */
  avatarColor?: 'blue' | 'emerald' | 'primary'
}

defineProps<{
  items: ConversationListItem[]
  selectedId?: string | null
  loading?: boolean
  emptyTitle?: string
  emptyHint?: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

function initials(name: string): string {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '?'
}

function avatarClass(color?: ConversationListItem['avatarColor']): string {
  switch (color) {
    case 'emerald': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
    case 'primary':  return 'bg-primary/15 text-primary'
    default:         return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  }
}
</script>
