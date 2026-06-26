<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden">
    <!-- Image de couverture -->
    <div
      class="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 to-accent/20"
    >
      <img
        v-if="ong.image"
        :src="ong.image"
        :alt="ong.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon
          name="i-heroicons-building-office-2"
          class="w-24 h-24 text-muted-foreground"
        />
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
          :disabled="!canDonate"
          :title="!canDonate ? 'Cette ONG n\'est pas encore habilitée à recevoir des dons' : undefined"
          @click="$emit('donate')"
        >
          <Icon name="i-heroicons-heart" class="w-5 h-5 mr-2" />
          Faire un don
        </UButton>
        <UButton
          v-if="isPartner && (ong.status === 'verified' || ong.status === 'active')"
          variant="outline"
          size="lg"
          class="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm border-gray-800/40"
          @click="$emit('contact')"
        >
          <Icon name="i-heroicons-envelope" class="w-5 h-5 mr-2" />
          Contacter
        </UButton>
        <UButton
          variant="primary"
          size="lg"
          :class="[
            'backdrop-blur-sm border-gray-800/40',
            shareCopied
              ? 'bg-black text-green-700'
              : 'bg-white/90 text-gray-900 hover:bg-white',
          ]"
          @click="$emit('shareDonation')"
        >
          <Icon
            :name="shareCopied ? 'i-heroicons-check' : 'i-heroicons-share'"
            class="w-5 h-5"
          />
          <span v-if="shareCopied" class="ml-2 text-sm font-medium"
            >Copié !</span
          >
        </UButton>
      </div>
    </div>

    <!-- Informations principales -->
    <div class="p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:items-start gap-4 mb-6">
        <div class="flex-1">
          <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ ong.name }}</h1>
          <div class="flex items-center gap-1.5 text-muted-foreground">
            <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
            <span>{{ ong.location }}</span>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Bénévoles"
          :value="ong.volunteers"
          icon="i-heroicons-users"
        />
        <StatCard
          label="Projets"
          :value="projectCount"
          icon="i-heroicons-briefcase"
          icon-bg="bg-violet-100 dark:bg-violet-900"
          icon-color="text-violet-600 dark:text-violet-400"
        />
        <StatCard
          label="Projets actifs"
          :value="activeProjectsCount"
          icon="i-heroicons-bolt"
          icon-bg="bg-green-100 dark:bg-green-900"
          icon-color="text-green-600 dark:text-green-400"
        />
        <StatCard
          label="Années d'activité"
          :value="yearsSinceCreation"
          icon="i-heroicons-calendar"
          icon-bg="bg-blue-100 dark:bg-blue-900"
          icon-color="text-blue-600 dark:text-blue-400"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'
import BadgeVerifie from '~/features/verification/components/BadgeVerifie.vue'
import { useAuthStore } from '~/features/auth/stores/auth.client'

const props = defineProps<{
  ong: ONG;
  statusLabel: string;
  categoryLabel: string;
  projectCount: number;
  activeProjectsCount: number;
  yearsSinceCreation: number;
  shareCopied?: boolean;
}>();

defineEmits<{
  donate: []
  shareDonation: []
  contact: []
}>()

const authStore = useAuthStore()

const canDonate = computed(() =>
  props.ong.status === 'verified' || props.ong.status === 'active'
)

const isPartner = computed(() => authStore.isPartner)
</script>
