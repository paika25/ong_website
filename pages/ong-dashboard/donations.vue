<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Dons reçus</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Toutes les transactions enregistrées pour votre ONG</p>
    </div>

    <div v-if="loadingOng" class="bg-card border border-border rounded-xl p-12 animate-pulse text-center">
      <div class="h-6 bg-muted rounded w-48 mx-auto" />
    </div>

    <div v-else-if="!ong" class="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
      <Icon name="i-heroicons-building-office-2" class="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p>Aucune ONG associée à votre compte</p>
    </div>

    <OngDashboardDonations
      v-else
      :donations="donations"
      :loading="loadingDonations"
    />
  </div>
</template>

<script setup lang="ts">
import OngDashboardDonations from '~/features/ong-dashboard/components/OngDashboardDonations.vue'
import { fetchOwnerOng, fetchOngDonations } from '~/features/ong-dashboard/services/ong-dashboard.service'
import type { ONG } from '~/features/ong/type'
import type { OngDonation } from '~/features/ong-dashboard/services/ong-dashboard.service'

definePageMeta({ layout: 'ong', middleware: ['auth', 'agent-only'] })

const ong = ref<ONG | null>(null)
const donations = ref<OngDonation[]>([])
const loadingOng = ref(true)
const loadingDonations = ref(false)

onMounted(async () => {
  ong.value = await fetchOwnerOng()
  loadingOng.value = false

  if (ong.value) {
    loadingDonations.value = true
    donations.value = await fetchOngDonations(ong.value.id)
    loadingDonations.value = false
  }
})
</script>
