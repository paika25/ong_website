<template>
  <div class="min-h-screen bg-background">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <DashboardWelcome :first-name="user?.firstName || user?.fullName || ''" />

      <!-- Cards d'information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardCardProfil />
        <DashboardCardExplorer />
      </div>

      <!-- Section selon le type de compte -->
      <DashboardAgentOng
        v-if="user?.accountType === 'user_agent'"
        :ong="userOng"
      />
      <DashboardPartnerDonations
        v-else
        :donations="donations"
        :total="stats.totalDonated"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { getOwnerOng } from '~/features/ong/services/ongService'
import type { ONG } from '~/features/ong/type'
import { useStats } from '~/features/user/composables/useStats'
import DashboardWelcome from '~/features/user/components/DashboardWelcome.vue'
import DashboardCardProfil from '~/features/user/components/DashboardCardProfil.vue'
import DashboardCardExplorer from '~/features/ong/components/DashboardCardExplorer.vue'
import DashboardAgentOng from '~/features/ong/components/DashboardAgentOng.vue'
import DashboardPartnerDonations from '~/features/user/components/DashboardPartnerDonations.vue'

definePageMeta({
  middleware: ['auth-client']
})

const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)

const userOng = ref<ONG | null>(null)
const { donations, stats, isLoading: loading, load: loadStats } = useStats()

onMounted(async () => {
  try {
    await loadStats()

    if (user.value?.accountType === 'user_agent') {
      userOng.value = await getOwnerOng()
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})
</script>
