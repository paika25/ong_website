<template>
  <div class="space-y-4">
    <div class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-lg font-semibold mb-4">Documents officiels</h2>
      <div class="space-y-3">
        <a
          v-for="doc in documents"
          :key="doc.id"
          :href="doc.fileUrl"
          target="_blank"
          class="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="i-heroicons-document-text" class="w-5 h-5 text-primary" />
            </div>
            <div class="min-w-0">
              <div class="font-medium truncate">{{ doc.name }}</div>
              <div class="text-xs text-muted-foreground">
                {{ getCategoryDocLabel(doc.category) }} — {{ (doc.fileSize / 1024).toFixed(0) }} Ko
              </div>
            </div>
          </div>
          <Icon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OngDocument } from '../type'

defineProps<{
  documents: OngDocument[]
  getCategoryDocLabel: (category: string) => string
}>()
</script>
