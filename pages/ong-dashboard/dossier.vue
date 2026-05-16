<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Mon dossier</h1>
      <p class="text-sm text-muted-foreground mt-0.5">
        Suivez votre dossier de certification et échangez avec le back-office
      </p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="bg-card border border-border rounded-xl p-6 animate-pulse h-36" />
      <div class="bg-card border border-border rounded-xl p-6 animate-pulse h-24" />
    </div>

    <div v-else-if="!ong" class="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
      <Icon name="i-heroicons-building-office-2" class="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p class="mb-4">Aucune ONG associée à votre compte</p>
      <NuxtLink to="/ongs/new">
        <UButton color="primary">Créer mon ONG</UButton>
      </NuxtLink>
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
