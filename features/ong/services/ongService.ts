import type { ONG, OngStats } from "../type"
import { mockOngs } from "../data"

// Helper pour vérifier si on est côté client
const isClient = () => typeof window !== 'undefined'

// ✅ Fonctions avec vérification client-only
export const getOngs = async (): Promise<ONG[]> => {
  // Ne tenter Supabase que côté client
  if (!isClient()) {
    console.log('🔧 [getOngs] SSR: using mock data')
    return JSON.parse(JSON.stringify(mockOngs))
  }

  const supabase = useSupabase()
  
  if (supabase) {
    try {
      console.log('🔍 [getOngs] Tentative de récupération depuis Supabase...')
      
      const { data, error } = await supabase
        .from('ongs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur Supabase getOngs:', error.message)
        // Fallback sur les données mockées en cas d'erreur
        return JSON.parse(JSON.stringify(mockOngs))
      }

      // Mapper les données Supabase vers le format ONG
      const ongs: ONG[] = data.map((ong: any) => ({
        id: ong.id,
        name: ong.name,
        description: ong.description,
        category: ong.category,
        status: ong.status,
        location: ong.location,
        image: ong.image || '',
        volunteers: ong.volunteers || 0,
        email: ong.email,
        phone: ong.phone || '',
        website: ong.website || '',
        projects: ong.projects || [],
        financials: ong.financials || {},
        legal: ong.legal || {},
        impact: ong.impact || {},
        donationOpportunities: ong.donation_opportunities || [],
        monitoring: ong.monitoring || {},
        createdAt: ong.created_at,
        updatedAt: ong.updated_at
      }))

      console.log(`✅ ${ongs.length} ONGs récupérées depuis Supabase`)
      return ongs
    } catch (err) {
      console.error('❌ Exception Supabase:', err)
      return JSON.parse(JSON.stringify(mockOngs))
    }
  }

  // Mode mock (développement sans Supabase)
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('📦 Utilisation des données mockées')
  return JSON.parse(JSON.stringify(mockOngs))
}

export const getOngById = async (id: string): Promise<ONG | null> => {
  // Ne tenter Supabase que côté client
  if (!isClient()) {
    console.log('🔧 [getOngById] SSR: using mock data')
    const ong = mockOngs.find(ong => ong.id === id) || null
    return ong ? JSON.parse(JSON.stringify(ong)) : null
  }

  const supabase = useSupabase()
  
  if (supabase) {
    try {
      console.log(`🔍 [getOngById] Recherche ONG ${id}...`)
      
      const { data, error } = await supabase
        .from('ongs')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        console.error('❌ Erreur Supabase getOngById:', error?.message)
        // Fallback sur mock
        const ong = mockOngs.find(ong => ong.id === id) || null
        return ong ? JSON.parse(JSON.stringify(ong)) : null
      }

      const ong: ONG = {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        status: data.status,
        location: data.location,
        image: data.image || '',
        volunteers: data.volunteers || 0,
        email: data.email,
        phone: data.phone || '',
        website: data.website || '',
        projects: data.projects || [],
        financials: data.financials || {},
        legal: data.legal || {},
        impact: data.impact || {},
        donationOpportunities: data.donation_opportunities || [],
        monitoring: data.monitoring || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      console.log(`✅ ONG ${id} récupérée depuis Supabase`)
      return ong
    } catch (err) {
      console.error('❌ Exception Supabase:', err)
      const ong = mockOngs.find(ong => ong.id === id) || null
      return ong ? JSON.parse(JSON.stringify(ong)) : null
    }
  }

  // Mode mock
  await new Promise(resolve => setTimeout(resolve, 300))
  const ong = mockOngs.find(ong => ong.id === id) || null
  return ong ? JSON.parse(JSON.stringify(ong)) : null
}

export const getOngsByCategory = async (category: string): Promise<ONG[]> => {
  // Simple mock function - no Supabase needed yet
  if (!isClient()) {
    console.log('🔧 [getOngsByCategory] SSR: using mock data')
    const filtered = mockOngs.filter(ong => ong.category === category)
    return JSON.parse(JSON.stringify(filtered))
  }

  await new Promise(resolve => setTimeout(resolve, 500))
  
  const filtered = mockOngs.filter(ong => ong.category === category)
  return JSON.parse(JSON.stringify(filtered))
}

export const searchOngs = async (query: string): Promise<ONG[]> => {
  // Simple mock function - no Supabase needed yet
  if (!isClient()) {
    console.log('🔧 [searchOngs] SSR: using mock data')
    const searchTerm = query.toLowerCase()
    const filtered = mockOngs.filter(ong => 
      ong.name.toLowerCase().includes(searchTerm) ||
      ong.description.toLowerCase().includes(searchTerm) ||
      ong.location.toLowerCase().includes(searchTerm)
    )
    return JSON.parse(JSON.stringify(filtered))
  }

  await new Promise(resolve => setTimeout(resolve, 400))
  
  const searchTerm = query.toLowerCase()
  const filtered = mockOngs.filter(ong => 
    ong.name.toLowerCase().includes(searchTerm) ||
    ong.description.toLowerCase().includes(searchTerm) ||
    ong.location.toLowerCase().includes(searchTerm)
  )
  return JSON.parse(JSON.stringify(filtered))
}

export const getOngStats = (ongs: ONG[]): OngStats => {
  return {
    total: ongs.length,
    active: ongs.filter(ong => ong.status === 'active').length,
    totalVolunteers: ongs.reduce((sum, ong) => sum + ong.volunteers, 0),
    totalProjects: ongs.reduce((sum, ong) => {
      const p = (ong as any).projects
      const count = Array.isArray(p) ? p.length : Number(p) || 0
      return sum + count
    }, 0)
  }
}

export const joinOng = async (ongId: string, userData: any): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Adhésion à l\'ONG:', ongId, userData)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'adhésion:', error)
    return false
  }
}

// ✅ Backward compatibility - garder aussi l'export en tant que composable
export const useOngService = () => {
  return {
    getOngs,
    getOngById,
    getOngsByCategory,
    searchOngs,
    getOngStats,
    joinOng
  }
}