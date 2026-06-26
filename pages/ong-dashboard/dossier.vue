<template>
  <div class="space-y-6">
    <PageHeader title="Mon dossier" subtitle="Suivez l'avancement de votre certification Paika" />

    <div v-if="loading" class="space-y-4">
      <div class="bg-card border border-border rounded-xl p-6 animate-pulse h-36" />
      <div class="bg-card border border-border rounded-xl p-6 animate-pulse h-24" />
    </div>

    <div v-else-if="!ong" class="bg-card border border-border rounded-xl">
      <EmptyState icon="i-heroicons-building-office-2" title="Aucune ONG associée à votre compte">
        <template #action>
          <NuxtLink to="/ongs/new">
            <UButton color="primary">Créer mon ONG</UButton>
          </NuxtLink>
        </template>
      </EmptyState>
    </div>

    <OngDashboardDossier v-else :ong-id="ong.id" :status="ong.status" />
  </div>
</template>

<script setup lang="ts">
import OngDashboardDossier from '~/features/ong-dashboard/components/OngDashboardDossier.vue'
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
