<template>
  <div
    class="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-border/80 transition-all duration-200 flex flex-col h-full cursor-pointer group"
    @click="onViewDetails"
  >
    <!-- Image / cover -->
    <div class="relative h-44 bg-muted overflow-hidden">
      <img
        v-if="ong.image"
        :src="ong.image"
        :alt="ong.name"
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <Icon name="i-heroicons-building-office-2" class="w-14 h-14 text-primary/30" />
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <div class="absolute top-3 left-3">
        <UBadge color="blue" variant="solid" class="shadow-sm text-xs capitalize">{{ ong.category }}</UBadge>
      </div>
      <div class="absolute top-3 right-3">
        <OngStatus :status="ong.status" />
      </div>
    </div>

    <!-- Corps -->
    <div class="p-5 flex flex-col flex-1">
      <div class="mb-3">
        <h3 class="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">{{ ong.name }}</h3>
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="i-heroicons-map-pin" class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate">{{ ong.location }}</span>
        </div>
      </div>

      <p class="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">
        {{ ong.description }}
      </p>

      <!-- Métriques -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-muted/50 rounded-lg px-3 py-2">
          <div class="text-sm font-bold text-foreground">{{ formatNumber(ong.volunteers) }}</div>
          <div class="text-xs text-muted-foreground">Bénévoles</div>
        </div>
        <div class="bg-muted/50 rounded-lg px-3 py-2">
          <div class="text-sm font-bold text-foreground">{{ formatNumber(getProjectCount(ong)) }}</div>
          <div class="text-xs text-muted-foreground">Projets</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div class="flex items-center gap-1.5" @click.stop>
          <UButton v-if="ong.email" variant="ghost" size="2xs" color="gray" :to="`mailto:${ong.email}`" external>
            <Icon name="i-heroicons-envelope" class="w-3.5 h-3.5" />
          </UButton>
          <UButton v-if="ong.website" variant="ghost" size="2xs" color="gray" :to="ong.website" external target="_blank">
            <Icon name="i-heroicons-globe-alt" class="w-3.5 h-3.5" />
          </UButton>
        </div>
        <UButton size="xs" variant="soft" @click.stop="onViewDetails">
          Voir le profil
          <Icon name="i-heroicons-arrow-right" class="w-3.5 h-3.5 ml-1" />
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

const props = defineProps<Props>()

const emit = defineEmits<{
  'view-details': [ong: ONG]
  'join': [ong: ONG]
}>()

const onViewDetails = () => {
  // Émettre l'événement vers le parent (OngList.vue)
  emit('view-details', props.ong)
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

