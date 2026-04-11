<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Mon ONG</h2>
        <p class="text-muted-foreground">Gérez votre organisation</p>
      </div>
      <NuxtLink v-if="!ong" to="/ongs/new">
        <UButton variant="default">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Créer mon ONG
        </UButton>
      </NuxtLink>
    </div>

    <!-- Informations de l'ONG -->
    <div v-if="ong">
      <OwnOng :ong="ong" />
    </div>

    <!-- État vide : Aucune ONG -->
    <div v-else class="bg-card border border-border rounded-xl p-12 text-center">
      <div class="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold mb-2">Vous n'avez pas encore d'ONG</h3>
      <p class="text-muted-foreground mb-6">Créez votre organisation pour commencer à faire la différence</p>
      <NuxtLink to="/ongs/new">
        <UButton variant="default">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Créer mon ONG
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '~/features/ong/type'
import OwnOng from '~/features/ong/components/OwnOng.vue'

defineProps<{
  ong: ONG | null
}>()
</script>
