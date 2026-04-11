import { useSupabase } from '~/composables/useSupabase.client'

export interface UserActivity {
  id: string
  user: string
  action: string
  target: string
  avatar: string
  createdAt: string
}

export const useUserActivityService = () => {
  const fetchUserActivity = async (
    userId: string,
    userFirstName: string,
    userAvatar: string,
    userCreatedAt: string
  ): Promise<UserActivity[]> => {
    const supabase = useSupabase()
    if (!supabase) return []

    try {
      const { data: donations, error } = await supabase
        .from('donations')
        .select('id, amount, created_at, ong:ongs (name)')
        .eq('donor_account_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Erreur chargement activité:', error.message)
        return []
      }

      if (donations && donations.length > 0) {
        return donations.map((d: any) => ({
          id: d.id,
          user: userFirstName || 'Utilisateur',
          action: `a fait un don de ${d.amount?.toLocaleString('fr-FR')} Ar à`,
          target: d.ong?.name || 'une ONG',
          avatar: userAvatar || '',
          createdAt: d.created_at
        }))
      }

      return [{
        id: 'joined',
        user: userFirstName || 'Utilisateur',
        action: 'a rejoint la plateforme',
        target: '',
        avatar: userAvatar || '',
        createdAt: userCreatedAt || new Date().toISOString()
      }]
    } catch (err) {
      console.error('Erreur chargement activité:', err)
      return []
    }
  }

  return { fetchUserActivity }
}
