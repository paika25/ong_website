<template>
  <div class="bg-card rounded-2xl border border-border overflow-hidden">

    <!-- Cover -->
    <div class="relative h-44 md:h-52 overflow-hidden bg-gradient-to-br from-primary/80 via-primary to-primary/60">
      <img
        v-if="user.cover"
        :src="user.cover"
        :alt="`Couverture de ${user.fullName}`"
        class="w-full h-full object-cover"
      />
      <!-- Overlay subtil -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <!-- Bouton modifier la couverture -->
      <button
        v-if="isOwnProfile"
        class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white text-xs font-medium backdrop-blur-sm transition-colors"
        @click="emit('upload-cover')"
      >
        <Icon name="i-heroicons-camera" class="w-3.5 h-3.5" />
        Modifier
      </button>
    </div>

    <!-- Corps -->
    <div class="px-6 pb-6">
      <!-- Ligne avatar + actions -->
      <div class="flex items-end justify-between -mt-10 mb-5">
        <!-- Avatar -->
        <div class="relative shrink-0">
          <div class="w-20 h-20 rounded-2xl ring-4 ring-card overflow-hidden bg-muted flex items-center justify-center">
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.fullName"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-2xl font-bold text-muted-foreground">
              {{ initials }}
            </span>
          </div>
          <button
            v-if="isOwnProfile"
            class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center ring-2 ring-card hover:bg-primary/80 transition-colors"
            @click="emit('upload-avatar')"
          >
            <Icon name="i-heroicons-camera" class="w-3 h-3 text-white" />
          </button>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 pt-12">
          <template v-if="isOwnProfile">
            <UButton variant="outline" size="sm" :icon="editMode ? 'i-heroicons-x-mark' : 'i-heroicons-pencil'" @click="emit('toggle-edit')">
              {{ editMode ? 'Annuler' : 'Modifier le profil' }}
            </UButton>
          </template>
          <template v-else>
            <UButton variant="outline" size="sm" icon="i-heroicons-envelope">Message</UButton>
            <UButton size="sm" icon="i-heroicons-user-plus">Suivre</UButton>
          </template>
        </div>
      </div>

      <!-- Identité -->
      <div class="mb-5">
        <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
          <h1 class="text-xl font-bold">{{ user.fullName }}</h1>
          <UBadge v-if="user.verified" color="blue" variant="soft" size="xs">
            <Icon name="i-heroicons-check-badge" class="w-3 h-3 mr-1" />
            Vérifié
          </UBadge>
          <UBadge v-if="user.accountType" color="gray" variant="subtle" size="xs">
            {{ accountTypeLabel }}
          </UBadge>
        </div>

        <p v-if="user.bio" class="text-sm text-muted-foreground leading-relaxed mb-3 max-w-xl">
          {{ user.bio }}
        </p>

        <!-- Métadonnées -->
        <div class="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <span v-if="user.location" class="flex items-center gap-1.5">
            <Icon name="i-heroicons-map-pin" class="w-3.5 h-3.5 shrink-0" />
            {{ user.location }}
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="i-heroicons-envelope" class="w-3.5 h-3.5 shrink-0" />
            {{ user.email }}
          </span>
          <a
            v-if="user.website"
            :href="user.website"
            target="_blank"
            class="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Icon name="i-heroicons-globe-alt" class="w-3.5 h-3.5 shrink-0" />
            {{ cleanUrl(user.website) }}
          </a>
          <span class="flex items-center gap-1.5">
            <Icon name="i-heroicons-calendar" class="w-3.5 h-3.5 shrink-0" />
            Membre depuis {{ formatDate(user.createdAt) }}
          </span>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
        <div class="text-center px-3 py-2.5 rounded-xl bg-muted/40">
          <p class="text-lg font-bold leading-none mb-1">{{ user.stats?.ongs ?? 0 }}</p>
          <p class="text-xs text-muted-foreground">ONGs</p>
        </div>
        <div class="text-center px-3 py-2.5 rounded-xl bg-muted/40">
          <p class="text-lg font-bold leading-none mb-1">{{ user.stats?.projects ?? 0 }}</p>
          <p class="text-xs text-muted-foreground">Projets</p>
        </div>
        <div v-if="user.accountType === 'user_partner'" class="text-center px-3 py-2.5 rounded-xl bg-muted/40">
          <p class="text-lg font-bold leading-none mb-1">{{ user.stats?.donations ?? 0 }}</p>
          <p class="text-xs text-muted-foreground">Dons</p>
        </div>
        <div v-if="user.accountType === 'user_partner'" class="text-center px-3 py-2.5 rounded-xl bg-muted/40">
          <p class="text-lg font-bold leading-none mb-1">
            {{ (user.stats?.totalDonated ?? 0).toLocaleString('fr-FR') }}
          </p>
          <p class="text-xs text-muted-foreground">Ar donnés</p>
        </div>
        <div v-if="user.accountType !== 'user_partner'" class="text-center px-3 py-2.5 rounded-xl bg-muted/40">
          <p class="text-lg font-bold leading-none mb-1">—</p>
          <p class="text-xs text-muted-foreground">Bénévoles</p>
        </div>
        <div v-if="user.accountType !== 'user_partner'" class="text-center px-3 py-2.5 rounded-xl bg-muted/40">
          <p class="text-lg font-bold leading-none mb-1">—</p>
          <p class="text-xs text-muted-foreground">Impact</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileUser } from '../types/profile.types'
import { computed } from 'vue'

const props = defineProps<{
  user: ProfileUser
  isOwnProfile: boolean
  editMode: boolean
}>()

const emit = defineEmits<{
  'upload-avatar': []
  'upload-cover': []
  'toggle-edit': []
}>()

const initials = computed(() => {
  const parts = props.user.fullName?.split(' ') ?? []
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
})

const accountTypeLabel = computed(() => {
  switch (props.user.accountType) {
    case 'user_agent':   return 'Agent ONG'
    case 'user_partner': return 'Bailleur'
    case 'admin':        return 'Administrateur'
    default:             return props.user.accountType ?? ''
  }
})

function formatDate(value?: string | Date) {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long' }).format(d)
}

function cleanUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
</script>
