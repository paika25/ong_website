<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 bg-background">
    <AuthSignup 
      @signup-success="onSignupSuccess" 
      @switch-to-login="onSwitchToLogin" 
    />
  </div>
</template>

<script setup lang="ts">
import AuthSignup from '~/features/auth/components/Signup.client.vue'
import { useAuthStore } from '~/features/auth/stores/auth'
import type { User } from '~/features/auth/types/auth.types'

// Rediriger vers dashboard si déjà connecté
definePageMeta({
  middleware: ['guest']
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