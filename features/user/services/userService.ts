import type { User } from '../types/user.types'

export interface UserUpdateData {
  firstName?: string
  lastName?: string
  companyName?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
  cover?: string
}

interface SupabaseAccount {
  id: string
  email: string
  account_type: string
  first_name: string
  last_name: string
  company_name?: string
  avatar?: string
  cover?: string
  bio?: string
  location?: string
  website?: string
  verified: boolean
  created_at: string
  updated_at: string
}


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
    cover: account.cover,
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
    console.log('📊 getUserStats:', userId, accountType)
    const supabase = useSupabase()

    if (!supabase) {
      console.log('⚠️ Supabase non disponible')
      return { ongs: 0, projects: 0, donations: 0, totalDonated: 0 }
    }

    try {
      if (accountType === 'user_agent') {
        // Stats pour les agents (gestionnaires d'ONG)
        console.log('📊 Chargement stats agent...')

        // Récupérer les IDs via agent_ong_managers
        const { data: managedOngs, error: ongsError } = await supabase
          .from('agent_ong_managers')
          .select('ong_id')
          .eq('agent_account_id', userId)

        if (ongsError) {
          console.warn('⚠️ Erreur agent_ong_managers:', ongsError.message)
        }

        // Récupérer les ONGs créées directement par l'agent
        const { data: ownedOngs, error: ownedError } = await supabase
          .from('ongs')
          .select('id')
          .eq('account_id', userId)

        if (ownedError) {
          console.warn('⚠️ Erreur ongs account_id:', ownedError.message)
        }

        // Fusionner sans doublons
        const allOngIds = new Set<string>()
        for (const o of managedOngs || []) allOngIds.add((o as any).ong_id)
        for (const o of ownedOngs || []) allOngIds.add((o as any).id)

        let totalProjects = 0
        if (allOngIds.size > 0) {
          const { data: ongsData, error: projectsError } = await supabase
            .from('ongs')
            .select('projects')
            .in('id', Array.from(allOngIds))

          if (projectsError) {
            console.warn('⚠️ Erreur ongs projects:', projectsError.message)
          }

          totalProjects = ongsData?.reduce((sum: number, ong: any) => {
            const projects = ong.projects || []
            return sum + (Array.isArray(projects) ? projects.length : 0)
          }, 0) || 0
        }

        console.log('✅ Stats agent:', { ongs: allOngIds.size, projects: totalProjects })
        return {
          ongs: allOngIds.size,
          projects: totalProjects,
          donations: 0,
          totalDonated: 0
        }
      } else {
        // Stats pour les partenaires (donateurs)
        console.log('📊 Chargement stats partenaire pour:', userId)

        console.log('📊 supabase :', supabase)
        
        try {
          // Timeout de 5 secondes
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          const { data: donations, error: donationsError } = await supabase
            .from('donations')
            .select('amount, status, ong_id')
            .eq('donor_account_id', userId)
            .eq('status', 'completed')

          clearTimeout(timeoutId)

          if (donationsError) {
            console.warn('⚠️ Erreur donations (RLS?):', donationsError.message, donationsError.code)
            return { ongs: 0, projects: 0, donations: 0, totalDonated: 0 }
          }

          console.log('📊 Donations trouvées:', donations?.length || 0)
          const totalDonated = donations?.reduce((sum: number, d: any) => sum + (d.amount || 0), 0) || 0
          const uniqueOngs = new Set(donations?.map((d: any) => d.ong_id).filter(Boolean) || []).size

          console.log('✅ Stats partenaire:', { donations: donations?.length || 0, totalDonated, ongs: uniqueOngs })
          return {
            ongs: uniqueOngs,
            projects: 0,
            donations: donations?.length || 0,
            totalDonated
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            console.warn('⚠️ Timeout requête donations')
          } else {
            console.error('❌ Erreur donations:', err)
          }
          return { ongs: 0, projects: 0, donations: 0, totalDonated: 0 }
        }
      }
    } catch (err: any) {
      console.error('❌ Erreur calcul stats:', err?.message || err)
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
        if (userData.cover !== undefined) updateData.cover = userData.cover
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
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type,
          })

        if (uploadError) {
          throw uploadError
        }

        // Obtenir l'URL publique
        const { data } = supabase.storage
          .from('avatars')
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

  const updateCover = async (file: File): Promise<string> => {
    const supabase = useSupabase()
    
    if (supabase) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          throw new Error('Utilisateur non connect\u00e9')
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`
        const filePath = `covers/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        const coverUrl = data.publicUrl

        await supabase
          .from('accounts')
          .update({ cover: coverUrl, updated_at: new Date().toISOString() })
          .eq('email', user.email)

        console.log('\u2705 Couverture upload\u00e9e avec succ\u00e8s')
        return coverUrl
      } catch (err: any) {
        console.error('\u274c Erreur upload couverture:', err)
        throw err
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
    return `https://images.unsplash.com/photo-${Date.now()}?w=1200`
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
    updateCover,
    searchUsers,
    deleteAccount,
    getUserStats
  }
}