<template>
  <div class="space-y-6">
    <PageHeader title="Mes documents" subtitle="Gérez les documents légaux et d'activité de votre ONG" />

    <div v-if="loading" class="bg-card border border-border rounded-xl p-12 animate-pulse text-center">
      <div class="h-6 bg-muted rounded w-48 mx-auto" />
    </div>

    <div v-else-if="!ong" class="bg-card border border-border rounded-xl">
      <EmptyState icon="i-heroicons-building-office-2" title="Aucune ONG associée à votre compte" />
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
