export interface User {
  id: string
  email: string
  accountType: 'user_partner' | 'user_agent'
  firstName: string
  lastName: string
  fullName: string
  companyName?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  verified: boolean
  createdAt: string
  updatedAt: string
  stats?: {
    ongs: number
    projects: number
    donations?: number
    totalDonated?: number
  }
}

export interface UserUpdateData {
  firstName?: string
  lastName?: string
  companyName?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
}

interface SupabaseAccount {
  id: string
  email: string
  account_type: string
  first_name: string
  last_name: string
  company_name?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  verified: boolean
  created_at: string
  updated_at: string
}

// Mock data (fallback)
const mockUsers: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'marius@example.com',
    accountType: 'user_agent',
    firstName: 'Marius',
    lastName: 'Razafitsalama',
    fullName: 'Marius Razafitsalama',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    bio: 'Développeur passionné par les technologies web et l\'aide aux communautés locales. Spécialisé en Laravel, Vue.js et architecture logicielle.',
    location: 'Antananarivo, Madagascar',
    website: 'https://marius-portfolio.com',
    verified: true,
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
    stats: {
      ongs: 3,
      projects: 12,
      donations: 0,
      totalDonated: 0
    }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'marie.dubois@example.com',
    accountType: 'user_agent',
    firstName: 'Marie',
    lastName: 'Dubois',
    fullName: 'Marie Dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
    bio: 'Coordinatrice de projets humanitaires avec 8 ans d\'expérience dans le développement communautaire.',
    location: 'Fianarantsoa, Madagascar',
    verified: true,
    createdAt: '2021-03-20T00:00:00Z',
    updatedAt: new Date().toISOString(),
    stats: {
      ongs: 2,
      projects: 8,
      donations: 0,
      totalDonated: 0
    }
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'contact@techforgood.mg',
    accountType: 'user_partner',
    firstName: 'Tech',
    lastName: 'ForGood',
    fullName: 'Tech ForGood',
    companyName: 'TechForGood Madagascar',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    bio: 'Entreprise technologique engagée dans la transformation digitale pour le bien social.',
    location: 'Antananarivo, Madagascar',
    website: 'https://techforgood.mg',
    verified: true,
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    stats: {
      ongs: 3,
      projects: 0,
      donations: 12,
      totalDonated: 12000
    }
  }
]

// Helper pour mapper les données Supabase vers User
const mapSupabaseToUser = (account: SupabaseAccount): User => {
  return {
    id: account.id,
    email: account.email,
    accountType: account.account_type as 'user_partner' | 'user_agent',
    firstName: account.first_name || '',
    lastName: account.last_name || '',
    fullName: `${account.first_name || ''} ${account.last_name || ''}`.trim(),
    companyName: account.company_name,
    avatar: account.avatar,
    bio: account.bio,
    location: account.location,
    website: account.website,
    verified: account.verified || false,
    createdAt: account.created_at,
    updatedAt: account.updated_at
  }
}

export const useUserService = () => {
  const getCurrentUser = async (): Promise<User | null> => {
    const supabase = useSupabase()
    
    if (supabase) {
      try {
        // TODO: Récupérer l'utilisateur connecté depuis la session Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          console.warn('⚠️ Pas d\'utilisateur connecté')
          return null
        }

        // Récupérer les détails du compte
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('email', user.email)
          .single()

        if (error || !data) {
          console.error('❌ Erreur Supabase getCurrentUser:', error?.message)
          return mockUsers[0] // Fallback
        }

        const userData = mapSupabaseToUser(data)
        
        // Enrichir avec les stats
        userData.stats = await getUserStats(userData.id, userData.accountType)

        console.log('✅ Utilisateur courant récupéré depuis Supabase')
        return userData
      } catch (err) {
        console.error('❌ Exception Supabase getCurrentUser:', err)
        return mockUsers[0]
      }
    }

    // Mode mock
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUsers[0]
  }

  const getUserById = async (id: string): Promise<User | null> => {
    const supabase = useSupabase()
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) {
          console.error('❌ Erreur Supabase getUserById:', error?.message)
          const user = mockUsers.find(u => u.id === id) || null
          return user ? JSON.parse(JSON.stringify(user)) : null
        }

        const userData = mapSupabaseToUser(data)
        
        // Enrichir avec les stats
        userData.stats = await getUserStats(userData.id, userData.accountType)

        console.log(`✅ Utilisateur ${id} récupéré depuis Supabase`)
        return userData
      } catch (err) {
        console.error('❌ Exception Supabase getUserById:', err)
        const user = mockUsers.find(u => u.id === id) || null
        return user ? JSON.parse(JSON.stringify(user)) : null
      }
    }

    // Mode mock
    await new Promise(resolve => setTimeout(resolve, 300))
    const user = mockUsers.find(u => u.id === id) || null
    return user ? JSON.parse(JSON.stringify(user)) : null
  }

  const getUserStats = async (userId: string, accountType: string) => {
    const supabase = useSupabase()
    
    if (!supabase) {
      return { ongs: 0, projects: 0, donations: 0, totalDonated: 0 }
    }

    try {
      if (accountType === 'user_agent') {
        // Stats pour les agents (gestionnaires d'ONG)
        const { data: ongs } = await supabase
          .from('agent_ong_managers')
          .select('ong_id')
          .eq('agent_account_id', userId)

        const { data: ongsData } = await supabase
          .from('ongs')
          .select('projects')
          .in('id', ongs?.map((o: any) => o.ong_id) || [])

        const totalProjects = ongsData?.reduce((sum: number, ong: any) => {
          const projects = ong.projects || []
          return sum + (Array.isArray(projects) ? projects.length : 0)
        }, 0) || 0

        return {
          ongs: ongs?.length || 0,
          projects: totalProjects,
          donations: 0,
          totalDonated: 0
        }
      } else {
        // Stats pour les partenaires (donateurs)
        const { data: donations } = await supabase
          .from('donations')
          .select('amount, status')
          .eq('donor_account_id', userId)
          .eq('status', 'completed')

        const totalDonated = donations?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0
        const uniqueOngs = new Set(donations?.map((d: any) => d.ong_id) || []).size

        return {
          ongs: uniqueOngs,
          projects: 0,
          donations: donations?.length || 0,
          totalDonated
        }
      }
    } catch (err) {
      console.error('❌ Erreur calcul stats:', err)
      return { ongs: 0, projects: 0, donations: 0, totalDonated: 0 }
    }
  }

  const updateUser = async (userData: UserUpdateData): Promise<User> => {
    const supabase = useSupabase()
    
    if (supabase) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          throw new Error('Utilisateur non connecté')
        }

        // Préparer les données pour Supabase (snake_case)
        const updateData: any = {}
        if (userData.firstName) updateData.first_name = userData.firstName
        if (userData.lastName) updateData.last_name = userData.lastName
        if (userData.companyName !== undefined) updateData.company_name = userData.companyName
        if (userData.bio !== undefined) updateData.bio = userData.bio
        if (userData.location !== undefined) updateData.location = userData.location
        if (userData.website !== undefined) updateData.website = userData.website
        if (userData.avatar !== undefined) updateData.avatar = userData.avatar
        updateData.updated_at = new Date().toISOString()

        const { data, error } = await supabase
          .from('accounts')
          .update(updateData)
          .eq('email', user.email)
          .select()
          .single()

        if (error || !data) {
          throw new Error(error?.message || 'Erreur lors de la mise à jour')
        }

        const updatedUser = mapSupabaseToUser(data)
        updatedUser.stats = await getUserStats(updatedUser.id, updatedUser.accountType)

        console.log('✅ Profil utilisateur mis à jour dans Supabase')
        return updatedUser
      } catch (err: any) {
        console.error('❌ Exception updateUser:', err)
        throw err
      }
    }

    // Mode mock
    await new Promise(resolve => setTimeout(resolve, 1000))
    const currentUser = mockUsers[0]
    const updatedUser: User = {
      ...currentUser,
      ...userData,
      firstName: userData.firstName || currentUser.firstName,
      lastName: userData.lastName || currentUser.lastName,
      fullName: userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}` 
        : currentUser.fullName,
      updatedAt: new Date().toISOString()
    }
    mockUsers[0] = updatedUser
    return updatedUser
  }

  const updateAvatar = async (file: File): Promise<string> => {
    const supabase = useSupabase()
    
    if (supabase) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          throw new Error('Utilisateur non connecté')
        }

        // Upload vers Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        // Obtenir l'URL publique
        const { data } = supabase.storage
          .from('public')
          .getPublicUrl(filePath)

        const avatarUrl = data.publicUrl

        // Mettre à jour le profil
        await supabase
          .from('accounts')
          .update({ avatar: avatarUrl, updated_at: new Date().toISOString() })
          .eq('email', user.email)

        console.log('✅ Avatar uploadé avec succès')
        return avatarUrl
      } catch (err: any) {
        console.error('❌ Erreur upload avatar:', err)
        throw err
      }
    }

    // Mode mock
    await new Promise(resolve => setTimeout(resolve, 2000))
    return `https://images.unsplash.com/photo-${Date.now()}?w=200`
  }

  const searchUsers = async (query: string): Promise<User[]> => {
    const supabase = useSupabase()
    
    if (supabase) {
      try {
        const searchTerm = `%${query}%`
        
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},bio.ilike.${searchTerm}`)
          .limit(20)

        if (error) {
          console.error('❌ Erreur Supabase searchUsers:', error.message)
          return []
        }

        const users = data.map(mapSupabaseToUser)
        console.log(`✅ ${users.length} utilisateurs trouvés`)
        return users
      } catch (err) {
        console.error('❌ Exception searchUsers:', err)
        return []
      }
    }

    // Mode mock
    await new Promise(resolve => setTimeout(resolve, 300))
    const searchTerm = query.toLowerCase()
    return mockUsers.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.bio?.toLowerCase().includes(searchTerm)
    )
  }

  const deleteAccount = async (): Promise<boolean> => {
    const supabase = useSupabase()
    
    if (supabase) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          throw new Error('Utilisateur non connecté')
        }

        // Supprimer le compte
        const { error } = await supabase
          .from('accounts')
          .delete()
          .eq('email', user.email)

        if (error) {
          throw error
        }

        // Déconnecter l'utilisateur
        await supabase.auth.signOut()

        console.log('✅ Compte supprimé avec succès')
        return true
      } catch (err) {
        console.error('❌ Erreur deleteAccount:', err)
        return false
      }
    }

    // Mode mock
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Compte supprimé avec succès')
    return true
  }

  return {
    getCurrentUser,
    getUserById,
    updateUser,
    updateAvatar,
    searchUsers,
    deleteAccount,
    getUserStats
  }
}