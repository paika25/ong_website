<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-background">
    <div class="text-center max-w-md mx-auto p-6">
      <!-- Loading -->
      <div v-if="status === 'loading'" class="space-y-4">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 class="text-xl font-semibold">{{ message }}</h2>
      </div>
      
      <!-- Error -->
      <div v-else-if="status === 'error'" class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-red-600">Erreur</h2>
        <p class="text-muted-foreground">{{ message }}</p>
        <UButton to="/auth/login" color="primary">
          Retour à la connexion
        </UButton>
      </div>
      
      <!-- Success -->
      <div v-else class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-green-600">{{ message }}</h2>
        <p class="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'

definePageMeta({
  layout: false
})

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Vérification en cours...')

const route = useRoute()

// Initialiser le store seulement côté client
const authStore = import.meta.client ? useAuthStore() : null

onMounted(async () => {
  if (!import.meta.client) return
  
  const store = useAuthStore()
  const supabase = useSupabase()
  
  if (!supabase) {
    status.value = 'error'
    message.value = 'Service non disponible'
    return
  }

  try {
    message.value = 'Récupération de la session...'

    // Supabase détecte automatiquement le token dans l'URL
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw new Error(sessionError.message)
    }

    if (!session) {
      // Essayer de récupérer depuis le hash
      const hash = window.location.hash.substring(1)
      if (hash) {
        const params = new URLSearchParams(hash)
        const accessToken = params.get('access_token')
        
        if (accessToken) {
          // Attendre que Supabase traite le token
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (!retrySession) {
            throw new Error('Session non trouvée')
          }
        } else {
          throw new Error('Token manquant')
        }
      } else {
        throw new Error('Aucune information d\'authentification')
      }
    }

    // Récupérer la session finale
    const { data: { session: finalSession } } = await supabase.auth.getSession()
    
    if (!finalSession?.user) {
      throw new Error('Utilisateur non trouvé')
    }

    message.value = 'Chargement du profil...'

    // Vérifier/créer l'account
    let { data: account } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', finalSession.user.id)
      .maybeSingle()

    if (!account) {
      console.log('📝 Création du compte...')
      
      const meta = finalSession.user.user_metadata
      
      const { data: newAccount, error: insertError } = await supabase
        .from('accounts')
        .insert({
          id: finalSession.user.id,
          email: finalSession.user.email!,
          account_type: meta?.account_type || 'user_partner',
          first_name: meta?.first_name || null,
          last_name: meta?.last_name || null,
          company_name: meta?.company_name || null,
          bio: meta?.bio || null,
          location: meta?.location || null,
          website: meta?.website || null,
          verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (!insertError && newAccount) {
        account = newAccount
      }
    } else if (!account.verified) {
      // Mettre à jour verified
      await supabase
        .from('accounts')
        .update({ verified: true, updated_at: new Date().toISOString() })
        .eq('id', finalSession.user.id)
      
      account.verified = true
    }

    // Construire l'utilisateur
    const user = account ? {
      id: account.id,
      email: account.email,
      accountType: account.account_type,
      firstName: account.first_name,
      lastName: account.last_name,
      fullName: [account.first_name, account.last_name].filter(Boolean).join(' ') || account.email,
      companyName: account.company_name,
      avatar: account.avatar,
      bio: account.bio,
      location: account.location,
      website: account.website,
      verified: account.verified,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    } : {
      id: finalSession.user.id,
      email: finalSession.user.email!,
      accountType: finalSession.user.user_metadata?.account_type || 'user_partner',
      firstName: finalSession.user.user_metadata?.first_name || null,
      lastName: finalSession.user.user_metadata?.last_name || null,
      fullName: [finalSession.user.user_metadata?.first_name, finalSession.user.user_metadata?.last_name].filter(Boolean).join(' ') || finalSession.user.email!,
      verified: true,
      createdAt: finalSession.user.created_at,
      updatedAt: finalSession.user.created_at
    }

    // Persister dans le store
    store.setUser(user as any)

    status.value = 'success'
    message.value = 'Connexion réussie !'

    // Redirection selon le rôle
    const redirect = route.query.redirect as string
    if (!redirect) {
      try {
        const payload = JSON.parse(atob(finalSession.access_token.split('.')[1]))
        const role = payload?.app_metadata?.role ?? payload?.role
        if (role === 'admin' || role === 'back_office') {
          setTimeout(() => navigateTo('/admin/verification'), 1500)
          return
        }
      } catch {}
    }
    setTimeout(() => navigateTo(redirect || '/dashboard'), 1500)

  } catch (err: any) {
    console.error('❌ Erreur callback:', err)
    status.value = 'error'
    message.value = err.message || 'Une erreur est survenue'
  }
})
</script>
