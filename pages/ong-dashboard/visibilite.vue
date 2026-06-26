<template>
  <div class="space-y-6">
    <PageHeader title="Visibilité" subtitle="Contrôlez les sections affichées sur votre page publique" />

    <div v-if="loading" class="bg-card border border-border rounded-xl p-12 animate-pulse text-center">
      <div class="h-6 bg-muted rounded w-48 mx-auto" />
    </div>

    <div v-else-if="!ong" class="bg-card border border-border rounded-xl">
      <EmptyState icon="i-heroicons-building-office-2" title="Aucune ONG associée à votre compte" />
    </div>

    <template v-else>
      <!-- Lien vers la page publique -->
      <div class="bg-muted/40 border border-border rounded-xl p-4 flex items-center gap-3">
        <Icon name="i-heroicons-globe-alt" class="w-5 h-5 text-muted-foreground shrink-0" />
        <p class="text-sm text-muted-foreground flex-1">
          Prévisualiser votre page publique pour voir l'effet des modifications en temps réel.
        </p>
        <NuxtLink :to="`/ongs/${ong.id}`" target="_blank">
          <UButton variant="outline" size="sm">
            <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5 mr-1.5" />
            Ouvrir
          </UButton>
        </NuxtLink>
      </div>

      <OngDashboardVisibility :ong-id="ong.id" :visibility="ong.sectionVisibility ?? DEFAULT_VISIBILITY" />
    </template>
  </div>
</template>

<script setup lang="ts">
import OngDashboardVisibility from '~/features/ong-dashboard/components/OngDashboardVisibility.vue'
import { fetchOwnerOng } from '~/features/ong-dashboard/services/ong-dashboard.service'
import { DEFAULT_SECTION_VISIBILITY } from '~/features/ong/type'
import type { ONG } from '~/features/ong/type'

definePageMeta({ layout: 'ong', middleware: ['auth', 'agent-only'] })

const ong = ref<ONG | null>(null)
const loading = ref(true)
const DEFAULT_VISIBILITY = DEFAULT_SECTION_VISIBILITY

onMounted(async () => {
  ong.value = await fetchOwnerOng()
  loading.value = false
})
</script>
