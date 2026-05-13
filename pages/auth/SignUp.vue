<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 bg-background relative">
    <!-- Bouton retour à l'accueil -->
    <NuxtLink 
      to="/" 
      class="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="group-hover:-translate-x-1 transition-transform"
      >
        <path d="m12 19-7-7 7-7"/>
        <path d="M19 12H5"/>
      </svg>
      <span>Retour à l'accueil</span>
    </NuxtLink>

    <AuthSignup 
      @signup-success="onSignupSuccess" 
      @switch-to-login="onSwitchToLogin" 
    />
  </div>
</template>

<script setup lang="ts">
import AuthSignup from '~/features/auth/components/Signup.client.vue'
import { useAuthStore } from '~/features/auth/stores/auth.client'
import type { User } from '~/features/auth/types/auth.types'

// Rediriger vers dashboard si déjà connecté
definePageMeta({
  layout: false,
  middleware: ['guest-client']
})

const authStore = useAuthStore()

const onSignupSuccess = async (user: User) => {
  // Persister l'utilisateur dans le store
  authStore.setUser(user)
  console.log('✅ Utilisateur inscrit:', user.email)
  
  // Rediriger vers le dashboard
  await navigateTo('/dashboard')
}

const onSwitchToLogin = () => {
  navigateTo('/auth/login')
}
</script>