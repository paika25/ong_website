<template>
  <div class="min-h-screen bg-background">
    <Header />
    <!-- Contenu principal -->
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">
          Bienvenue, {{ user?.firstName || user?.fullName }} ! 👋
        </h1>
        <p class="text-muted-foreground">
          Voici votre tableau de bord personnel.
        </p>
      </div>

      <!-- Cards d'information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Card Profil -->
        <div class="bg-card border border-border rounded-xl p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Mon Profil</h3>
              <p class="text-sm text-muted-foreground">Gérer mes informations</p>
            </div>
          </div>
          <NuxtLink to="/profil">
            <UButton variant="outline" class="w-full">
              Voir mon profil
            </UButton>
          </NuxtLink>
        </div>

        <!-- Card Explorer -->
        <div class="bg-card border border-border rounded-xl p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Explorer</h3>
              <p class="text-sm text-muted-foreground">Découvrir des ONGs</p>
            </div>
          </div>
          <NuxtLink to="/">
            <UButton variant="outline" class="w-full">
              Voir les ONGs
            </UButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Section selon le type de compte -->
      <!-- Dashboard Agent : Mon ONG -->
      <div v-if="user?.accountType === 'user_agent'" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Mon ONG</h2>
            <p class="text-muted-foreground">Gérez votre organisation</p>
          </div>
          <UButton v-if="!userOng" variant="default">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Créer mon ONG
          </UButton>
        </div>

        <!-- Informations de l'ONG -->
        <div v-if="userOng" >
          <OwnOng :ong="userOng"/>
        </div>

        <!-- État vide : Aucune ONG -->
        <div v-else class="bg-card border border-border rounded-xl p-12 text-center">
          <div class="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Vous n'avez pas encore d'ONG</h3>
          <p class="text-muted-foreground mb-6">Créez votre organisation pour commencer à faire la différence</p>
          <UButton variant="default">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Créer mon ONG
          </UButton>
        </div>
      </div>

      <!-- Dashboard Partenaire : Mes Dons -->
      <div v-else class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Mes Dons</h2>
            <p class="text-muted-foreground">Historique de vos contributions</p>
          </div>
          <div class="flex gap-8">
            <!-- Nombre de donations -->
            <div class="text-right">
              <p class="text-sm text-muted-foreground">Nombre de dons</p>
              <p class="text-2xl font-bold">{{ userDonations.length }}</p>
            </div>
            <!-- Total des dons -->
            <div class="text-right">
              <p class="text-sm text-muted-foreground">Total des dons</p>
              <p class="text-2xl font-bold text-primary">{{ totalDonations }} €</p>
            </div>
          </div>
        </div>

        <!-- Liste des dons -->
        <div v-if="userDonations && userDonations.length > 0" class="bg-card border border-border rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-muted">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ONG
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Projet
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Montant
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr 
                  v-for="donation in userDonations" 
                  :key="donation.id"
                  class="hover:bg-muted/50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ formatDate(donation.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm font-medium">{{ donation.ongName }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-muted-foreground">
                    {{ donation.projectName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                    {{ donation.amount }} €
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span 
                      :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        donation.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      ]"
                    >
                      {{ donation.status === 'completed' ? 'Complété' : 'En cours' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="bg-card border border-border rounded-xl p-12 text-center">
          <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Aucun don pour le moment</h3>
          <p class="text-muted-foreground mb-6">Soutenez une ONG en faisant votre premier don</p>
          <NuxtLink to="/">
            <UButton variant="default">
              Découvrir les ONGs
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { getOngs,getOwnerOng } from '~/features/ong/services/ongService'
import type { ONG } from '~/features/ong/type'
import OwnOng from '~/features/ong/components/OwnOng.vue'

definePageMeta({
  middleware: ['auth-client']
})

const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)

// États pour les données
const userOng = ref<ONG | null>(null)
const userDonations = ref<any[]>([])
const totalDonations = ref(0)
const loading = ref(true)

// Fonction de formatage de date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Charger les données selon le type de compte
onMounted(async () => {
  loading.value = true
  
  try {
    if (user.value?.accountType === 'user_agent') {
      // Charger l'ONG unique de l'agent
      // const allOngs = await getOngs()
      // TODO: Filtrer par user.value.id quand le champ owner_id sera disponible
      // Pour l'instant, on prend la première ONG comme exemple
      // userOng.value = allOngs.length > 0 ? allOngs[0] : null
      userOng.value = await getOwnerOng()
    } else {
      // Charger les dons du partenaire
      // TODO: Implémenter le service de dons
      // Pour l'instant, utiliser des données mock
      userDonations.value = [
        {
          id: '1',
          date: '2026-01-15T10:00:00Z',
          ongName: 'Enfants du Monde',
          projectName: 'Éducation en Afrique',
          amount: 50,
          status: 'completed'
        },
        {
          id: '2',
          date: '2026-01-10T14:30:00Z',
          ongName: 'Croix-Rouge',
          projectName: 'Aide d\'urgence',
          amount: 100,
          status: 'completed'
        },
        {
          id: '3',
          date: '2026-01-05T09:15:00Z',
          ongName: 'Greenpeace',
          projectName: 'Sauvegarde des océans',
          amount: 75,
          status: 'completed'
        }
      ]
      
      // Calculer le total
      totalDonations.value = userDonations.value.reduce((sum, donation) => sum + donation.amount, 0)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
})
</script>
