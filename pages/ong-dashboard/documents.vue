<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Mes documents</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Gérez les documents légaux et d'activité de votre ONG</p>
    </div>

    <div v-if="loading" class="bg-card border border-border rounded-xl p-12 animate-pulse text-center">
      <div class="h-6 bg-muted rounded w-48 mx-auto" />
    </div>

    <div v-else-if="!ong" class="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
      <Icon name="i-heroicons-building-office-2" class="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p>Aucune ONG associée à votre compte</p>
    </div>

    <OngDashboardDocuments v-else :ong-id="ong.id" />
  </div>
</template>

<script setup lang="ts">
import OngDashboardDocuments from '~/features/ong-dashboard/components/OngDashboardDocuments.vue'
import { fetchOwnerOng } from '~/features/ong-dashboard/services/ong-dashboard.service'
import type { ONG } from '~/features/ong/type'

definePageMeta({ layout: 'ong', middleware: ['auth', 'agent-only'] })

const ong = ref<ONG | null>(null)
const loading = ref(true)

onMounted(async () => {
  ong.value = await fetchOwnerOng()
  loading.value = false
})
</script>
