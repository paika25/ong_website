import type { User, LoginCredentials, SignUpData, AuthResult, AuthResponse } from '../types/auth.types'

// Interface pour mapper les données Supabase
interface SupabaseAccount {
  id: string
  email: string
  account_type: 'user_partner' | 'user_agent'
  first_name: string | null
  last_name: string | null
  company_name?: string | null
  avatar?: string | null
  cover?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

/**
 * Mapper les données Supabase vers l'interface User
 */
const mapSupabaseToUser = (account: SupabaseAccount): User => {
  return {
    id: account.id,
    email: account.email,
    accountType: account.account_type,
    firstName: account.first_name,
    lastName: account.last_name,
    fullName: [account.first_name, account.last_name].filter(Boolean).join(' ') || account.email.split('@')[0],
    companyName: account.company_name,
    avatar: account.avatar,
    cover: account.cover,
    bio: account.bio,
    location: account.location,
    website: account.website,
    verified: account.verified,
    createdAt: account.created_at,
    updatedAt: account.updated_at
  }
}

/**
 * Messages d'erreur lisibles
 */
const getReadableError = (error: string): string => {
  const errorMap: Record<string, string> = {
    'User already registered': 'Cet email est déjà utilisé',
    'Invalid email': 'Email invalide',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
    'Email not confirmed': 'Veuillez confirmer votre email',
    'Invalid login credentials': 'Email ou mot de passe incorrect',
    'Email rate limit exceeded': 'Trop de tentatives. Réessayez plus tard.',
    'Signup requires a valid password': 'Le mot de passe est requis',
    'Unable to validate email address: invalid format': 'Format d\'email invalide'
  }
  return errorMap[error] || error
}

export const useAuthService = () => {
  const supabase = useSupabase()

  /**
   * Inscription avec toutes les informations
   */
  const signUp = async (signUpData: SignUpData): Promise<AuthResult> => {
    if (!supabase) {
      console.warn('⚠️ Supabase non configuré')
      return { user: null, error: 'Service non disponible. Veuillez réessayer plus tard.' }
    }

    try {
      // Valider les données
      if (!signUpData.email || !signUpData.password) {
        return { user: null, error: 'Email et mot de passe requis' }
      }

      if (signUpData.password.length < 8) {
        return { user: null, error: 'Le mot de passe doit contenir au moins 8 caractères' }
      }

      // Préparer les métadonnées pour le trigger
      const metadata = {
        account_type: signUpData.accountType,
        first_name: signUpData.firstName || null,
        last_name: signUpData.lastName || null,
        company_name: signUpData.companyName || null,
        bio: signUpData.bio || null,
        location: signUpData.location || null,
        website: signUpData.website || null
      }

      console.log('📝 Inscription avec metadata:', metadata)

      // Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: metadata,
          emailRedirectTo: typeof window !== 'undefined' 
            ? `${window.location.origin}/auth/callback`
            : undefined
        }
      })

      if (authError) {
        console.error('❌ Erreur inscription:', authError)
        return { user: null, error: getReadableError(authError.message) }
      }

      if (!authData.user) {
        return { user: null, error: 'Erreur lors de la création du compte' }
      }

      console.log('✅ Utilisateur créé dans auth.users:', authData.user.id)

      // Attendre que le trigger s'exécute (si configuré)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Vérifier que l'account a été créé par le trigger
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle() // Utiliser maybeSingle au lieu de single pour éviter l'erreur 406

      if (accountData) {
        console.log('✅ Account créé par le trigger:', accountData)
        return {
          user: mapSupabaseToUser(accountData),
          error: null,
          needsEmailVerification: !authData.user.email_confirmed_at
        }
      }

      console.warn('⚠️ Le trigger n\'a pas créé l\'account, tentative de création manuelle...')

      // Fallback : créer manuellement (nécessite les bonnes politiques RLS)
      const { data: insertedAccount, error: insertError } = await supabase
        .from('accounts')
        .insert({
          id: authData.user.id,
          email: signUpData.email,
          account_type: signUpData.accountType,
          first_name: signUpData.firstName || null,
          last_name: signUpData.lastName || null,
          company_name: signUpData.companyName || null,
          bio: signUpData.bio || null,
          location: signUpData.location || null,
          website: signUpData.website || null,
          verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        console.error('❌ Erreur création manuelle account:', insertError)
        
        // Fallback ultime : retourner un user basé sur les métadonnées auth
        // L'utilisateur pourra se connecter plus tard quand le trigger sera en place
        const fallbackUser: User = {
          id: authData.user.id,
          email: signUpData.email,
          accountType: signUpData.accountType,
          firstName: signUpData.firstName || null,
          lastName: signUpData.lastName || null,
          fullName: [signUpData.firstName, signUpData.lastName].filter(Boolean).join(' ') || signUpData.email.split('@')[0],
          companyName: signUpData.companyName || null,
          bio: signUpData.bio || null,
          location: signUpData.location || null,
          website: signUpData.website || null,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        console.log('⚠️ Retour user depuis metadata (trigger non configuré):', fallbackUser)
        
        return {
          user: fallbackUser,
          error: null,
          needsEmailVerification: true
        }
      }

      console.log('✅ Account créé manuellement:', insertedAccount)

      return {
        user: mapSupabaseToUser(insertedAccount),
        error: null,
        needsEmailVerification: !authData.user.email_confirmed_at
      }
    } catch (err: any) {
      console.error('❌ Erreur signUp:', err)
      return { user: null, error: err.message || 'Erreur inattendue' }
    }
  }

  /**
   * Connexion
   */
  const signIn = async (credentials: LoginCredentials): Promise<AuthResult> => {
    if (!supabase) {
      console.warn('⚠️ Supabase non configuré')
      return { user: null, error: 'Service non disponible' }
    }

    try {
      // Connexion via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (authError) {
        console.error('❌ Erreur connexion:', authError)
        return { user: null, error: getReadableError(authError.message) }
      }

      if (!authData.user) {
        return { user: null, error: 'Erreur de connexion' }
      }

      console.log('✅ Connexion auth réussie:', authData.user.id)

      // Stocker le token si rememberMe
      if (typeof window !== 'undefined' && credentials.rememberMe) {
        localStorage.setItem('auth-token', authData.session?.access_token || '')
        localStorage.setItem('refresh-token', authData.session?.refresh_token || '')
      }

      // Récupérer les données du compte
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (accountError || !accountData) {
        console.error('❌ Erreur récupération account:', accountError)
        
        // Le compte auth existe mais pas le profil - créer un profil basique
        const { error: insertError } = await supabase
          .from('accounts')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            account_type: 'user_partner',
            verified: authData.user.email_confirmed_at !== null,
            created_at: authData.user.created_at,
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          return { user: null, error: 'Erreur de synchronisation du profil' }
        }

        // Récupérer le profil créé
        const { data: newAccount } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (newAccount) {
          return { user: mapSupabaseToUser(newAccount), error: null }
        }
      }

      console.log('✅ Account récupéré:', accountData)

      return { user: mapSupabaseToUser(accountData), error: null }
    } catch (err: any) {
      console.error('❌ Erreur signIn:', err)
      return { user: null, error: err.message || 'Erreur de connexion' }
    }
  }

  /**
   * Déconnexion
   */
  const signOut = async (): Promise<{ error: string | null }> => {
    if (!supabase) {
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      
      // Nettoyer le localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('refresh-token')
        localStorage.removeItem('login')
        localStorage.removeItem('user')
        sessionStorage.clear()
      }

      if (error) {
        console.error('❌ Erreur déconnexion:', error)
        return { error: error.message }
      }

      console.log('✅ Déconnexion réussie')
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  /**
   * Récupérer l'utilisateur connecté
   */
  const getCurrentUser = async (): Promise<User | null> => {
    if (!supabase) {
      return null
    }

    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        return null
      }

      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (accountError || !accountData) {
        return null
      }

      return mapSupabaseToUser(accountData)
    } catch (err) {
      console.error('❌ Erreur getCurrentUser:', err)
      return null
    }
  }

  /**
   * Réinitialiser le mot de passe
   */
  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) {
      return { error: 'Service non disponible' }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/reset-password`
          : undefined
      })

      if (error) {
        return { error: getReadableError(error.message) }
      }

      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  const isAuthenticated = async (): Promise<boolean> => {
    if (!supabase) return false

    try {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session
    } catch {
      return false
    }
  }

  return {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    resetPassword,
    isAuthenticated
  }
}

// Export legacy pour compatibilité
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { signIn } = useAuthService()
    const result = await signIn(credentials)
    
    if (result.error || !result.user) {
      throw new Error(result.error || 'Erreur de connexion')
    }

    return {
      user: result.user as any,
      token: 'supabase-managed',
      refreshToken: 'supabase-managed'
    }
  },

  async signup(data: SignUpData): Promise<AuthResponse> {
    const { signUp } = useAuthService()
    const result = await signUp(data)
    
    if (result.error || !result.user) {
      throw new Error(result.error || 'Erreur d\'inscription')
    }

    return {
      user: result.user as any,
      token: 'supabase-managed',
      refreshToken: 'supabase-managed'
    }
  },

  async logout(): Promise<void> {
    const { signOut } = useAuthService()
    await signOut()
  },

  async getCurrentUser(): Promise<User | null> {
    const { getCurrentUser } = useAuthService()
    return getCurrentUser()
  },

  async refreshToken(): Promise<string | null> {
    // Supabase gère automatiquement le refresh token
    return 'supabase-managed'
  }
}

// Re-export types for backward compatibility
export type { User, LoginCredentials, SignUpData, AuthResult, AuthResponse }
