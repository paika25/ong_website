<template>
<div v-if="props.ong" class=" ong bg-card border border-border rounded-xl overflow-hidden">
          <!-- Header avec image -->
          <div class="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
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
                    <Icon name="i-heroicons-users" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                    <Icon name="i-heroicons-folder-open" class="w-5 h-5 text-green-600 dark:text-green-400" />
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
                    <Icon name="i-heroicons-banknotes" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
                  <Icon name="i-heroicons-eye" class="w-4 h-4 mr-2" />
                  Voir la page publique
                </UButton>
              </NuxtLink>
              <NuxtLink :to="`/ongs/${props.ong.id}/edit`" class="flex-1">
                <UButton variant="default" class="w-full">
                  <Icon name="i-heroicons-pencil-square" class="w-4 h-4 mr-2" />
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