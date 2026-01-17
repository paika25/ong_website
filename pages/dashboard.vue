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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        <!-- Card selon le type de compte -->
        <div v-if="user?.accountType === 'user_agent'" class="bg-card border border-border rounded-xl p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Mes ONGs</h3>
              <p class="text-sm text-muted-foreground">Gérer mes organisations</p>
            </div>
          </div>
          <UButton variant="outline" class="w-full">
            Gérer mes ONGs
          </UButton>
        </div>

        <div v-else class="bg-card border border-border rounded-xl p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Mes Dons</h3>
              <p class="text-sm text-muted-foreground">Historique des donations</p>
            </div>
          </div>
          <UButton variant="outline" class="w-full">
            Voir mes dons
          </UButton>
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
          <NuxtLink to="/ongs">
            <UButton variant="outline" class="w-full">
              Voir les ONGs
            </UButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Informations du compte -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-4">Informations du compte</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Email</p>
            <p class="font-medium">{{ user?.email }}</p>
          </div>
          
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Type de compte</p>
            <p class="font-medium">
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  user?.accountType === 'user_agent' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                ]"
              >
                {{ user?.accountType === 'user_agent' ? 'Agent ONG' : 'Partenaire' }}
              </span>
            </p>
          </div>
          
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Statut</p>
            <p class="font-medium">
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  user?.verified 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                ]"
              >
                {{ user?.verified ? 'Vérifié ✓' : 'Non vérifié' }}
              </span>
            </p>
          </div>
          
          <div v-if="user?.location" class="space-y-1">
            <p class="text-sm text-muted-foreground">Localisation</p>
            <p class="font-medium">{{ user.location }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'

definePageMeta({
  middleware: ['auth-client']
})

const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
</script>
