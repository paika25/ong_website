<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12">
    <AuthSignup 
      @signup-success="onSignupSuccess" 
      @switch-to-login="onSwitchToLogin" 
    />
  </div>
</template>

<script setup lang="ts">
import AuthSignup from '../../features/auth/components/Signup.client.vue'
import useAuthStore from '../../features/auth/stores/auth'
import type { User } from '../../features/auth/types/auth.types'

const authStore = useAuthStore()

const onSignupSuccess = async (user: User) => {
  // Persister l'utilisateur dans le store
  authStore.setUser(user)
  console.log('✅ Utilisateur inscrit et persisté:', user.email)
  
  // Rediriger vers le dashboard ou la page d'accueil
  await navigateTo('/')
}

const onSwitchToLogin = () => {
  navigateTo('/auth/login')
}
</script>