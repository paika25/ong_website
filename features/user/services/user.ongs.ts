import { useSupabase } from '~/composables/useSupabase.client'

export interface UserOng {
  id: string
  name: string
  role: string
  image: string
  volunteers: number
  projects: number
}

export const useUserOngsService = () => {
  const fetchUserOngs = async (userId: string): Promise<UserOng[]> => {
    const supabase = useSupabase()
    if (!supabase) return []

    try {
      const { data: agentOngs, error } = await supabase
        .from('agent_ong_managers')
        .select('role, ong:ongs ( id, name, image, volunteers, projects )')
        .eq('agent_account_id', userId)

      if (error) {
        console.error('Erreur chargement ONGs:', error.message)
        return []
      }

      if (!agentOngs || agentOngs.length === 0) return []

      return agentOngs.map((item: any) => ({
        id: item.ong?.id,
        name: item.ong?.name || 'ONG',
        role: item.role || 'Membre',
        image: item.ong?.image || '',
        volunteers: item.ong?.volunteers || 0,
        projects: Array.isArray(item.ong?.projects) ? item.ong.projects.length : 0
      }))
    } catch (err) {
      console.error('Erreur chargement ONGs:', err)
      return []
    }
  }

  return { fetchUserOngs }
}
