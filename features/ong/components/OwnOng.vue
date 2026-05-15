<template>
<div v-if="props.ong" class=" ong bg-card border border-border rounded-xl overflow-hidden">
          <!-- Header avec image -->
          <div class="relative h-48 bg-gradient-to-r from-purple-500 to-blue-500">
            <img 
              v-if="props.ong.image" 
              :src="props.ong.image" 
              :alt="props.ong.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-4 right-4">
              <OngStatus :status="props.ong.status" />
            </div>
          </div>

          <!-- Contenu principal -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <h3 class="text-lg font-semibold mb-2">{{ props.ong.name }}</h3>
                <p class="text-muted-foreground mb-4">{{ props.ong.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {{ props.ong.category }}
                  </span>
                  <span class="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                    {{ props.ong.location }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Statistiques -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-muted rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold">{{ props.ong.volunteers }}</p>
                    <p class="text-sm text-muted-foreground">Bénévoles</p>
                  </div>
                </div>
              </div>

              <div class="bg-muted rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold">{{ props.ong.projects?.length || 0 }}</p>
                    <p class="text-sm text-muted-foreground">Projets actifs</p>
                  </div>
                </div>
              </div>

              <div class="bg-muted rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold">{{ props.ong.financials?.transparency || 0 }}%</p>
                    <p class="text-sm text-muted-foreground">Transparence</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <NuxtLink :to="`/ongs/${props.ong.id}`" class="flex-1">
                <UButton variant="outline" class="w-full">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Voir la page publique
                </UButton>
              </NuxtLink>
              <NuxtLink :to="`/ongs/${props.ong.id}/edit`" class="flex-1">
                <UButton variant="default" class="w-full">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Gérer mon ONG
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ONG } from '~/features/ong/type'

const props = defineProps({
    ong:{
        type: Object as () => ONG,
        required: true
    }
})  
</script>