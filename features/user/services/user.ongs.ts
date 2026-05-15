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
      const results: UserOng[] = []
      const seenIds = new Set<string>()

      // Requête 1 : rôles via agent_ong_managers
      const { data: agentOngs, error } = await supabase
        .from('agent_ong_managers')
        .select('role, ong:ongs ( id, name, image, volunteers, projects )')
        .eq('agent_account_id', userId)

      if (error) {
        console.error('Erreur chargement ONGs (agent_ong_managers):', error.message)
      } else if (agentOngs) {
        for (const item of agentOngs as any[]) {
          if (item.ong?.id && !seenIds.has(item.ong.id)) {
            seenIds.add(item.ong.id)
            results.push({
              id: item.ong.id,
              name: item.ong.name || 'ONG',
              role: item.role || 'Membre',
              image: item.ong.image || '',
              volunteers: item.ong.volunteers || 0,
              projects: Array.isArray(item.ong.projects) ? item.ong.projects.length : 0,
            })
          }
        }
      }

      // Requête 2 : ONGs créées directement par cet agent (account_id = userId)
      const { data: ownedOngs, error: ownedError } = await supabase
        .from('ongs')
        .select('id, name, image, volunteers, projects')
        .eq('account_id', userId)

      if (ownedError) {
        console.error('Erreur chargement ONGs (account_id):', ownedError.message)
      } else if (ownedOngs) {
        for (const ong of ownedOngs as any[]) {
          if (ong.id && !seenIds.has(ong.id)) {
            seenIds.add(ong.id)
            results.push({
              id: ong.id,
              name: ong.name || 'ONG',
              role: 'Propriétaire',
              image: ong.image || '',
              volunteers: ong.volunteers || 0,
              projects: Array.isArray(ong.projects) ? ong.projects.length : 0,
            })
          }
        }
      }

      return results
    } catch (err) {
      console.error('Erreur chargement ONGs:', err)
      return []
    }
  }

  return { fetchUserOngs }
}
