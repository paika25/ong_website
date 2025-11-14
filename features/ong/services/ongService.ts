import type { ONG, OngStats } from "../type"
import { mockOngs } from "../data"

// ✅ Fonctions simples au lieu de composable pour éviter problèmes SSR
export const getOngs = async (): Promise<ONG[]> => {
  // Simulation d'appel API
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Retourner une copie simple des données pour éviter les problèmes de sérialisation SSR
  return JSON.parse(JSON.stringify(mockOngs))
}

export const getOngById = async (id: string): Promise<ONG | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const ong = mockOngs.find(ong => ong.id === id) || null
  return ong ? JSON.parse(JSON.stringify(ong)) : null
}

export const getOngsByCategory = async (category: string): Promise<ONG[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const filtered = mockOngs.filter(ong => ong.category === category)
  return JSON.parse(JSON.stringify(filtered))
}

export const searchOngs = async (query: string): Promise<ONG[]> => {
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