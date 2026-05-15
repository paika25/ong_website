<template>
  <main class="container mx-auto px-4 py-8">
      <DashboardWelcome
        :first-name="user?.firstName || user?.fullName || ''"
        :account-type="user?.accountType"
      />

      <!-- Agent ONG : dossier directement -->
      <DashboardAgentOng v-if="user?.accountType === 'user_agent'" />

      <!-- Partenaire : raccourcis + historique dons -->
      <template v-else>
        <div class="grid grid-cols-2 gap-3 mb-6">
          <NuxtLink to="/profil">
            <div class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors cursor-pointer">
              <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium">Mon Profil</p>
                <p class="text-xs text-muted-foreground">Gérer mes informations</p>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink to="/">
            <div class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors cursor-pointer">
              <div class="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium">Explorer</p>
                <p class="text-xs text-muted-foreground">Découvrir des ONGs</p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <DashboardPartnerDonations
          :donations="donations"
          :total="stats.totalDonated"
        />
      </template>
    </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { useStats } from '~/features/user/composables/useStats'
import DashboardWelcome from '~/features/user/components/DashboardWelcome.vue'
import DashboardAgentOng from '~/features/ong/components/DashboardAgentOng.vue'
import DashboardPartnerDonations from '~/features/user/components/DashboardPartnerDonations.vue'

definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)

const { donations, stats, load: loadStats } = useStats()

onMounted(async () => {
  try {
    await loadStats()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})
</script>
