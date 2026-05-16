<template>
  <div>
    <div v-if="!documents.length" class="py-10 text-center text-muted-foreground">
      <Icon name="i-heroicons-document-text" class="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p>Aucun document uploadé par cette ONG</p>
    </div>

    <div v-else class="space-y-2">
      <a
        v-for="doc in documents"
        :key="doc.name"
        :href="doc.url ?? '#'"
        target="_blank"
        rel="noopener"
        :class="['flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/30 transition-colors group', !doc.url && 'pointer-events-none opacity-50']"
      >
        <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
          <Icon name="i-heroicons-document" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span class="text-sm font-medium flex-1 truncate group-hover:text-primary transition-colors">{{ doc.name }}</span>
        <Icon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-muted-foreground shrink-0" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminOngDocument } from '../services/admin.ong.service'

defineProps<{ documents: AdminOngDocument[] }>()
</script>
