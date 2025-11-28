<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Image de l'ONG -->
    <div class="relative h-48 bg-muted">
      <img
        v-if="ong.image"
        :src="ong.image"
        :alt="ong.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="i-heroicons-building-office-2" class="w-16 h-16 text-muted-foreground" />
      </div>
      
      <!-- Badge de statut -->
      <div class="absolute top-3 right-3">
        <UBadge
          :color="ong.status === 'active' ? 'green' : ong.status === 'pending' ? 'yellow' : 'red'"
          variant="solid"
        >
          {{ getStatusLabel(ong.status) }}
        </UBadge>
      </div>

      <!-- Badge de catégorie -->
      <div class="absolute top-3 left-3">
        <UBadge color="blue" variant="soft">
          {{ ong.category }}
        </UBadge>
      </div>
    </div>

    <!-- Contenu de la card -->
    <div class="p-6">
      <!-- Header avec nom et localisation -->
      <div class="mb-3">
        <h3 class="font-semibold text-lg mb-1 line-clamp-1">{{ ong.name }}</h3>
        <div class="flex items-center text-sm text-muted-foreground">
          <Icon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
          <span>{{ ong.location }}</span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm text-muted-foreground mb-4 line-clamp-3">
        {{ ong.description }}
      </p>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center">
          <div class="font-semibold text-primary">{{ formatNumber(ong.volunteers) }}</div>
          <div class="text-xs text-muted-foreground">Bénévoles</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-primary">{{ formatNumber(getProjectCount(ong)) }}</div>
          <div class="text-xs text-muted-foreground">Projets</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <UButton
          variant="outline"
          size="sm"
          block
          @click="onViewDetails"
        >
          Voir plus
        </UButton>
        <!-- <UButton
          color="primary"
          size="sm"
          block
          @click="$emit('join', ong)"
          :disabled="ong.status !== 'active'"
        >
          Rejoindre
        </UButton> -->
      </div>

      <!-- Contact rapide -->
      <div class="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-border">
        <UButton
          v-if="ong.email"
          variant="ghost"
          size="xs"
          color="gray"
          :to="`mailto:${ong.email}`"
          external
        >
          <Icon name="i-heroicons-envelope" class="w-4 h-4" />
        </UButton>
        <UButton
          v-if="ong.phone"
          variant="ghost"
          size="xs"
          color="gray"
          :to="`tel:${ong.phone}`"
          external
        >
          <Icon name="i-heroicons-phone" class="w-4 h-4" />
        </UButton>
        <UButton
          v-if="ong.website"
          variant="ghost"
          size="xs"
          color="gray"
          :to="ong.website"
          external
          target="_blank"
        >
          <Icon name="i-heroicons-globe-alt" class="w-4 h-4" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'

interface Props {
  ong: ONG
}

defineProps<Props>()

defineEmits<{
  'view-details': [ong: ONG]
  'join': [ong: ONG]
}>()

const onViewDetails = () => {
  if (process.client || import.meta.client) {
    emit('view-details', ong)
  }
}

const getStatusLabel = (status: string) => {
  const labels = {
    active: 'Actif',
    pending: 'En attente',
    inactive: 'Inactif'
  }
  return labels[status as keyof typeof labels] || status
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getProjectCount = (ong: ONG) => {
  const p: any = (ong as any).projects
  return Array.isArray(p) ? p.length : Number(p) || 0
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>