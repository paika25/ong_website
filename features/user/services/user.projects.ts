import { useSupabase } from '~/composables/useSupabase.client'

export interface UserProject {
  id: string
  name: string
  ong: string
  description: string
  status: string
  startDate: string
  participants: number
}

export const useUserProjectsService = () => {
  const fetchUserProjects = async (userId: string): Promise<UserProject[]> => {
    const supabase = useSupabase()
    if (!supabase) return []

    try {
      const { data: agentOngs, error: ongsError } = await supabase
        .from('agent_ong_managers')
        .select('ong_id')
        .eq('agent_account_id', userId)

      if (ongsError) {
        console.error('Erreur chargement projets (ong_managers):', ongsError.message)
        return []
      }

      if (!agentOngs || agentOngs.length === 0) return []

      const ongIds = agentOngs.map((o: any) => o.ong_id)

      const { data: ongs, error: projError } = await supabase
        .from('ongs')
        .select('id, name, projects')
        .in('id', ongIds)

      if (projError) {
        console.error('Erreur chargement projets (ongs):', projError.message)
        return []
      }

      if (!ongs) return []

      const allProjects: UserProject[] = []
      ongs.forEach((ong: any) => {
        if (Array.isArray(ong.projects)) {
          ong.projects.forEach((project: any) => {
            allProjects.push({
              id: project.id || `${ong.id}-${allProjects.length}`,
              name: project.name || project.title || 'Projet sans nom',
              ong: ong.name,
              description: project.description || '',
              status: project.status || 'En cours',
              startDate: project.start_date || project.startDate || new Date().toISOString(),
              participants: project.participants || project.volunteers || 0
            })
          })
        }
      })

      return allProjects
    } catch (err) {
      console.error('Erreur chargement projets:', err)
      return []
    }
  }

  return { fetchUserProjects }
}
