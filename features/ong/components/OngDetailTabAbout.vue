<template>
  <div class="space-y-6">
    <!-- Description -->
    <div class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-2xl font-semibold mb-4">À propos</h2>
      <p class="text-muted-foreground leading-relaxed">
        {{ ong.description }}
      </p>
    </div>

    <!-- Informations de contact -->
    <div class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-2xl font-semibold mb-4">Contact</h2>
      <div class="space-y-3">
        <div v-if="ong.email" class="flex items-center gap-5">
          <div class="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="i-heroicons-envelope" class="w-5 h-5 text-primary" />
          </div>
          <div class="text-left">
            <div class="text-xs text-muted-foreground">Email</div>
            <a :href="`mailto:${ong.email}`" class="text-sm text-primary hover:underline">{{ ong.email }}</a>
          </div>
        </div>

        <div v-if="ong.phone" class="flex items-center gap-5">
          <div class="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="i-heroicons-phone" class="w-5 h-5 text-primary" />
          </div>
          <div class="text-left">
            <div class="text-xs text-muted-foreground">Téléphone</div>
            <a :href="`tel:${ong.phone}`" class="text-sm text-primary hover:underline">{{ ong.phone }}</a>
          </div>
        </div>

        <div v-if="ong.website" class="flex items-center gap-5">
          <div class="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="i-heroicons-globe-alt" class="w-5 h-5 text-primary" />
          </div>
          <div class="text-left">
            <div class="text-xs text-muted-foreground">Site web</div>
            <a :href="ong.website" target="_blank" class="text-sm text-primary hover:underline">{{ ong.website }}</a>
          </div>
        </div>

        <div class="flex items-center gap-5">
          <div class="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="i-heroicons-calendar" class="w-5 h-5 text-primary" />
          </div>
          <div class="text-left">
            <div class="text-xs text-muted-foreground">Créée le</div>
            <div class="text-sm font-medium">{{ formatDate(ong.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'

defineProps<{
  ong: ONG
  formatDate: (date: string) => string
}>()
</script>
