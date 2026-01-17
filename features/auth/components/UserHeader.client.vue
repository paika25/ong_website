<template>
    <div v-if="user" class="flex justify-between ml-2">
      <div class="flex items-center gap-3">
        <NuxtLink to="/profil" class="flex items-center space-x-1 text-gray-600 hover:text-red-600" aria-label="Profil" title="Profil">
          <div class="text-right hidden sm:block">
            <p class="font-medium">{{ user.fullName }}</p>
            <p class="text-xs text-muted-foreground">
              {{ user.accountType === 'user_agent' ? 'Agent ONG' : 'Partenaire' }}
            </p>
          </div>
        
          <!-- Avatar -->

          <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {{ userInitials }}
          </div>
        </NuxtLink>
      </div>

      <!-- Bouton déconnexion -->
      <UButton 
        variant="ghost" 
        color="red" 
        @click="handleLogout"
        :loading="loggingOut"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span class="hidden sm:inline ml-0">Déconnexion</span>
      </UButton>
    </div>
    
</template>


<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'

const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
const userInitials = computed(() => authStore.userInitials)
const loggingOut = ref(false)

const supabase = useSupabase()
const handleLogout = async () => {
  loggingOut.value = true
  try {
    if (supabase) {
      await supabase.auth.signOut()
    }
    authStore.setDisconnected()
    await navigateTo('/auth/login')
  } catch (e) {
    console.error('Erreur logout:', e)
  } finally {
    loggingOut.value = false
  }
}

</script>