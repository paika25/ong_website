<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden">
    <!-- Image de couverture -->
    <div class="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
      <img
        v-if="ong.image"
        :src="ong.image"
        :alt="ong.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="i-heroicons-building-office-2" class="w-24 h-24 text-muted-foreground" />
      </div>

      <div class="absolute top-4 right-4 flex gap-2 items-center">
        <!-- Badge vérifié (certifié) -->
        <BadgeVerifie
          v-if="ong.status === 'verified' || ong.status === 'active'"
          status="verified"
          :certification-date="ong.updatedAt"
          size="md"
        />
        <UBadge
          v-else
          :color="ong.status === 'pending' ? 'yellow' : ong.status === 'submitted' || ong.status === 'under_review' ? 'blue' : 'red'"
          variant="solid"
          size="lg"
        >
          {{ statusLabel }}
        </UBadge>
      </div>

      <div class="absolute top-4 left-4">
        <UBadge color="blue" variant="solid" size="lg" class="shadow-md">
          {{ categoryLabel }}
        </UBadge>
      </div>

      <!-- Boutons en bas à droite de l'image -->
      <div class="absolute bottom-4 right-4 flex gap-3">
        <UButton
          color="primary"
          size="lg"
          :disabled="ong.status !== 'active'"
          @click="$emit('join')"
        >
          <Icon name="i-heroicons-currency-euro" class="w-5 h-5 mr-2" />
          Faites un don
        </UButton>
        <UButton
          variant="outline"
          size="lg"
          class="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          @click="$emit('shareDonation')"
        >
          <Icon name="i-heroicons-share" class="w-5 h-5" />
        </UButton>
      </div>
    </div>

    <!-- Informations principales -->
    <div class="p-6 md:p-8">
      <div class="flex flex-col items-center gap-4 mb-6">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-3">{{ ong.name }}</h1>
          <div class="flex items-center justify-center text-muted-foreground mb-4">
            <Icon name="i-heroicons-map-pin" class="w-5 h-5 mr-2" />
            <span class="text-lg">{{ ong.location }}</span>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-muted/50 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-primary mb-1">{{ ong.volunteers }}</div>
          <div class="text-sm text-muted-foreground">Bénévoles</div>
        </div>
        <div class="bg-muted/50 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-purple-600 mb-1">{{ projectCount }}</div>
          <div class="text-sm text-muted-foreground">Projets</div>
        </div>
        <div class="bg-muted/50 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-green-600 mb-1">{{ activeProjectsCount }}</div>
          <div class="text-sm text-muted-foreground">Projets actifs</div>
        </div>
        <div class="bg-muted/50 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-1">{{ yearsSinceCreation }}</div>
          <div class="text-sm text-muted-foreground">Années d'activité</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'
import BadgeVerifie from '~/features/verification/components/BadgeVerifie.vue'

const props = defineProps<{
  ong: ONG
  statusLabel: string
  categoryLabel: string
  projectCount: number
  activeProjectsCount: number
  yearsSinceCreation: number
}>()

defineEmits<{
  join: []
  shareDonation: []
}>()
</script>
