<template>
  <template v-if="user">
    <!-- Navigation -->
    <nav class="hidden md:flex items-center gap-0.5 mr-2">
      <NuxtLink
        to="/"
        class="px-3 py-1.5 rounded-md text-sm font-medium hover:text-green-500 transition-colors"
        inactive-class="text-muted-foreground "
        active-class="text-green-500"
      >
        Accueil
      </NuxtLink>
      <NuxtLink
        to="/dashboard"
        class="px-3 py-1.5 rounded-md text-sm font-medium hover:text-green-500 transition-colors"
        inactive-class="text-muted-foreground "
        active-class="text-green-500"
      >
        Dashboard
      </NuxtLink>
      
    </nav>

    <!-- Séparateur -->
    <div class="hidden md:block h-5 w-px bg-border mr-2" />

    <!-- Admin badge -->
    <NuxtLink v-if="isAdmin" to="/admin/verification" class="mr-2">
      <UButton size="xs" color="orange" variant="soft" class="gap-1">
        <Icon name="i-heroicons-shield-check" class="w-3 h-3" />
        Admin
      </UButton>
    </NuxtLink>

    <!-- Profil + Déconnexion -->
    <div class="flex items-center gap-1">
      <NuxtLink
        to="/profil"
        class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors group"
        aria-label="Mon profil"
      >
        <div class="hidden sm:block text-right leading-tight">
          <p class="text-sm font-medium group-hover:text-primary transition-colors">
            {{ user.fullName?.split(' ')[0] }}
          </p>
          <p class="text-[11px] text-muted-foreground">
            {{ user.accountType === 'user_agent' ? 'Agent ONG' : 'Partenaire' }}
          </p>
        </div>
        <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
          {{ userInitials }}
        </div>
      </NuxtLink>

      <UButton
        variant="ghost"
        size="sm"
        color="red"
        :loading="loggingOut"
        aria-label="Déconnexion"
        title="Déconnexion"
        @click="handleLogout"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </UButton>
    </div>
  </template>

  <div v-else>
    <NuxtLink to="/auth/login">
      <UButton color="primary" size="sm">
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

  if (user.value?.accountType === 'user_agent') {
    watchUnreadMessages(supabase, session.access_token)
  }
})

async function watchUnreadMessages(supabase: any, token: string) {
  try {
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
  // Déclenche l'ouverture du widget flottant via un event custom
  window.dispatchEvent(new CustomEvent('open-floating-chat'))
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
