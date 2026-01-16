<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-muted-foreground">Vérification en cours...</p>
      </div>
      
      <div v-else-if="error" class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-red-600">Erreur de vérification</h2>
        <p class="text-muted-foreground">{{ error }}</p>
        <UButton to="/auth/login" color="primary">
          Retour à la connexion
        </UButton>
      </div>
      
      <div v-else class="space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold">Email vérifié !</h2>
        <p class="text-muted-foreground">Votre compte a été activé avec succès.</p>
        <p class="text-sm text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useAuthStore from '../../features/auth/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // Récupérer le hash de l'URL (contient access_token, etc.)
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type') // 'signup', 'recovery', 'invite'
    
    console.log('🔐 Callback auth - type:', type)
    
    if (!accessToken) {
      // Peut-être un callback avec code (PKCE flow)
      const queryParams = new URLSearchParams(window.location.search)
      const code = queryParams.get('code')
      
      if (code) {
        // Échanger le code contre une session
        const supabase = useSupabase()
        if (supabase) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            throw new Error(exchangeError.message)
          }
          console.log('✅ Session échangée:', data.user?.email)
        }
      } else {
        throw new Error('Token d\'accès manquant')
      }
    }
    
    // Récupérer la session courante
    const supabase = useSupabase()
    if (!supabase) {
      throw new Error('Supabase non configuré')
    }
    
    // Supabase détecte automatiquement le token dans l'URL
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      throw new Error(sessionError.message)
    }
    
    if (!session?.user) {
      throw new Error('Session non trouvée')
    }
    
    console.log('✅ Session récupérée:', session.user.email)
    
    // Vérifier/créer l'account dans la table accounts
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
    
    let user = accountData
    
    if (!accountData) {
      console.log('⚠️ Account non trouvé, création...')
      
      // Créer l'account à partir des métadonnées
      const metadata = session.user.user_metadata
      
      const { data: newAccount, error: insertError } = await supabase
        .from('accounts')
        .insert({
          id: session.user.id,
          email: session.user.email,
          account_type: metadata?.account_type || 'user_partner',
          first_name: metadata?.first_name || null,
          last_name: metadata?.last_name || null,
          company_name: metadata?.company_name || null,
          bio: metadata?.bio || null,
          location: metadata?.location || null,
          website: metadata?.website || null,
          verified: true, // Email confirmé !
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Erreur création account:', insertError)
        // Continuer quand même avec les données de session
      } else {
        user = newAccount
        console.log('✅ Account créé:', newAccount)
      }
    } else {
      console.log('✅ Account existant:', accountData)
      
      // Mettre à jour verified si besoin
      if (!accountData.verified) {
        await supabase
          .from('accounts')
          .update({ verified: true, updated_at: new Date().toISOString() })
          .eq('id', session.user.id)
      }
    }
    
    // Mapper et stocker l'utilisateur
    const mappedUser = user ? {
      id: user.id,
      email: user.email,
      accountType: user.account_type,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email?.split('@')[0],
      companyName: user.company_name,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
      verified: true,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    } : {
      id: session.user.id,
      email: session.user.email!,
      accountType: session.user.user_metadata?.account_type || 'user_partner',
      firstName: session.user.user_metadata?.first_name || null,
      lastName: session.user.user_metadata?.last_name || null,
      fullName: [session.user.user_metadata?.first_name, session.user.user_metadata?.last_name].filter(Boolean).join(' ') || session.user.email?.split('@')[0],
      verified: true,
      createdAt: session.user.created_at,
      updatedAt: new Date().toISOString()
    }
    
    // Persister dans le store
    authStore.setUser(mappedUser as any)
    
    loading.value = false
    
    // Redirection après 2 secondes
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
    
  } catch (err: any) {
    console.error('❌ Erreur callback:', err)
    error.value = err.message || 'Erreur lors de la vérification'
    loading.value = false
  }
})
</script>
