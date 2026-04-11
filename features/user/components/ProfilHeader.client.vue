<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden">
    <!-- Cover image -->
    <div class="h-32 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
      <img
        v-if="user.cover"
        :src="user.cover"
        :alt="`Couverture de ${user.fullName}`"
        class="w-full h-full object-cover"
      />
      <UButton
        v-if="isOwnProfile"
        variant="solid"
        color="white"
        size="xs"
        class="absolute top-4 right-4"
        @click="emit('upload-cover')"
      >
        <Icon name="i-heroicons-camera" class="w-4 h-4 mr-1" />
        Modifier la couverture
      </UButton>
    </div>

    <!-- Informations principales -->
    <div class="p-6 relative">
      <!-- Avatar -->
      <div class="absolute -top-16 left-6">
        <div class="relative">
          <UAvatar
            :src="user.avatar || ''"
            :alt="user.fullName"
            size="xl"
            class="ring-4 ring-background"
          />
          <UButton
            v-if="isOwnProfile"
            variant="solid"
            color="primary"
            size="2xs"
            class="absolute bottom-0 right-0 rounded-full"
            @click="emit('upload-avatar')"
          >
            <Icon name="i-heroicons-camera" class="w-3 h-3" />
          </UButton>
        </div>
      </div>

      <!-- Actions profil (vue externe) -->
      <div v-if="!isOwnProfile" class="flex justify-end mb-4">
        <div class="flex gap-2">
          <UButton variant="outline" size="sm">
            <Icon name="i-heroicons-envelope" class="w-4 h-4 mr-1" />
            Message
          </UButton>
          <UButton color="primary" size="sm">
            <Icon name="i-heroicons-user-plus" class="w-4 h-4 mr-1" />
            Suivre
          </UButton>
        </div>
      </div>

      <!-- Actions profil (propre profil) -->
      <div v-else class="flex justify-end mb-4">
        <UButton variant="outline" size="sm" @click="emit('toggle-edit')">
          <Icon name="i-heroicons-pencil" class="w-4 h-4 mr-1" />
          {{ editMode ? 'Annuler' : 'Modifier' }}
        </UButton>
      </div>

      <!-- Informations utilisateur -->
      <div class="mt-8">
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-2xl font-bold">{{ user.fullName }}</h1>
          <UBadge v-if="user.verified" color="blue" variant="solid" size="xs">
            <Icon name="i-heroicons-check-badge" class="w-3 h-3 mr-1" />
            Vérifié
          </UBadge>
        </div>

        <p class="text-muted-foreground mb-3 whitespace-pre-line">{{ user.bio }}</p>

        <!-- Métadonnées -->
        <div class="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div v-if="user.location" class="flex items-center gap-1">
            <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
            <span>{{ user.location }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="i-heroicons-calendar" class="w-4 h-4" />
            <span>Rejoint en {{ formatDate(user.createdAt) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="i-heroicons-envelope" class="w-4 h-4" />
            <span>{{ user.email }}</span>
          </div>
          <div v-if="user.website" class="flex items-center gap-1">
            <Icon name="i-heroicons-globe-alt" class="w-4 h-4" />
            <a :href="user.website" target="_blank" class="hover:underline">{{ user.website }}</a>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="flex gap-6">
          <div class="text-center">
            <div class="font-semibold text-lg">{{ user.stats?.ongs || 0 }}</div>
            <div class="text-sm text-muted-foreground">ONGs</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-lg">{{ user.stats?.projects || 0 }}</div>
            <div class="text-sm text-muted-foreground">Projets</div>
          </div>
          <div v-if="user.accountType === 'user_partner'" class="text-center">
            <div class="font-semibold text-lg">{{ user.stats?.donations || 0 }}</div>
            <div class="text-sm text-muted-foreground">Dons</div>
          </div>
          <div v-if="user.accountType === 'user_partner'" class="text-center">
            <div class="font-semibold text-lg">{{ (user.stats?.totalDonated || 0).toLocaleString('fr-FR') }} Ar</div>
            <div class="text-sm text-muted-foreground">Total donné</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileUser } from '../types/profile.types'

defineProps<{
  user: ProfileUser
  isOwnProfile: boolean
  editMode: boolean
}>()

const emit = defineEmits<{
  'upload-avatar': []
  'upload-cover': []
  'toggle-edit': []
}>()

function formatDate(value?: string | Date) {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long' }).format(d)
}
</script>
