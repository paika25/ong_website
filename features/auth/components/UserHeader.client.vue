<template>
    <template v-if="user">
      <!-- Navigation -->
      <nav class="flex items-center gap-2 lg:ml-4 ml-0">
        <NuxtLink to="/" class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Accueil
        </NuxtLink>
        <NuxtLink
          to="/dashboard"
          class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Dashboard
        </NuxtLink>
        <!-- Lien Messages — agents ONG uniquement -->
        <NuxtLink
          v-if="user?.accountType === 'user_agent'"
          to="/dashboard"
          class="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          @click.prevent="scrollToMessages"
        >
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4" />
          <span class="hidden sm:inline">Messages</span>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
          >
            {{ unreadCount }}
          </span>
        </NuxtLink>
      </nav>
      
      <!-- Bouton admin -->
      <NuxtLink v-if="isAdmin" to="/admin/verification">
        <UButton size="sm" color="orange" variant="soft" class="gap-1.5">
          <Icon name="i-heroicons-shield-check" class="w-3.5 h-3.5" />
          Admin
        </UButton>
      </NuxtLink>

      <div class="flex justify-between ml-2">
        <div class="flex items-center gap-3">
          <NuxtLink to="/profil" class="flex items-center space-x-1 text-gray-600 hover:text-red-600" aria-label="Profil" title="Profil">
            <div class="text-right hidden sm:block max-w-[120px]">
              <p class="font-medium truncate">{{ user.fullName?.split(' ')[0] }}</p>
              <p class="text-xs text-muted-foreground truncate">
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

    <div v-else>
      <NuxtLink to="/auth/login">
        <UButton color="primary">
          Se connecter
        </UButton>
      </NuxtLink>
    </div>
  </template>


<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'

const { $pinia } = useNuxtApp()
const authStore = useAuthStore($pinia as any)
const user = computed(() => authStore.currentUser)
const userInitials = computed(() => authStore.userInitials)
const loggingOut = ref(false)
const isAdmin = ref(false)
const unreadCount = ref(0)

onMounted(async () => {
  const supabase = useSupabase()
  if (!supabase) return
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return
  try {
    const payload = JSON.parse(atob(session.access_token.split('.')[1]))
    const role = payload?.app_metadata?.role ?? payload?.role
    isAdmin.value = role === 'admin' || role === 'back_office'
  } catch {}

  // Compte des messages non lus pour les agents ONG
  if (user.value?.accountType === 'user_agent') {
    watchUnreadMessages(supabase, session.access_token)
  }
})

async function watchUnreadMessages(supabase: any, token: string) {
  try {
    // Récupère l'ONG de l'agent pour s'abonner aux messages non lus
    const { data: ong } = await supabase
      .from('ongs')
      .select('id')
      .eq('account_id', (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle()

    if (!ong) return

    const refresh = async () => {
      const { count } = await supabase
        .from('dossier_messages')
        .select('id', { count: 'exact', head: true })
        .eq('ong_id', ong.id)
        .eq('sender_role', 'back_office')
        .is('read_at', null)
      unreadCount.value = count ?? 0
    }

    await refresh()

    supabase
      .channel('header-unread-messages')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'dossier_messages',
        filter: `ong_id=eq.${ong.id}`,
      }, refresh)
      .subscribe()
  } catch {}
}

function scrollToMessages() {
  if (window.location.pathname !== '/dashboard') {
    navigateTo('/dashboard')
    return
  }
  const el = document.querySelector('[data-messages-section]')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

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