export interface ONG {
  id: string
  name: string
  description: string
  category: 'education' | 'health' | 'environment' | 'social' | 'culture'
  status: 'active' | 'pending' | 'inactive'
  location: string
  image?: string
  volunteers: number
  projects: number
  email?: string
  phone?: string
  website?: string
  createdAt: string
  updatedAt: string
}

export interface OngStats {
  total: number
  active: number
  totalVolunteers: number
  totalProjects: number
}

// Mock data
const mockOngs: ONG[] = [
  {
    id: '1',
    name: 'Éducation pour Tous Madagascar',
    description: 'Organisation dédiée à l\'amélioration de l\'accès à l\'éducation dans les zones rurales de Madagascar. Nous construisons des écoles et formons des enseignants.',
    category: 'education',
    status: 'active',
    location: 'Antananarivo, Madagascar',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400',
    volunteers: 245,
    projects: 12,
    email: 'contact@education-madagascar.org',
    phone: '+261 34 12 345 67',
    website: 'https://education-madagascar.org',
    createdAt: '2022-01-15T10:00:00Z',
    updatedAt: '2024-10-30T15:30:00Z'
  },
  {
    id: '2',
    name: 'Santé Communautaire Océan Indien',
    description: 'Amélioration des soins de santé primaires dans les communautés isolées. Programme de vaccination et de sensibilisation sanitaire.',
    category: 'health',
    status: 'active',
    location: 'Toamasina, Madagascar',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    volunteers: 156,
    projects: 8,
    email: 'info@sante-oi.mg',
    phone: '+261 32 98 765 43',
    website: 'https://sante-oi.mg',
    createdAt: '2021-06-20T14:15:00Z',
    updatedAt: '2024-10-28T09:45:00Z'
  },
  {
    id: '3',
    name: 'Reboisement Vert Madagascar',
    description: 'Protection et restauration des forêts malgaches. Plantation d\'arbres endémiques et sensibilisation environnementale.',
    category: 'environment',
    status: 'active',
    location: 'Andasibe, Madagascar',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    volunteers: 89,
    projects: 15,
    email: 'contact@reboisement-mg.org',
    phone: '+261 33 44 556 78',
    createdAt: '2023-03-10T08:30:00Z',
    updatedAt: '2024-10-25T16:20:00Z'
  },
  {
    id: '4',
    name: 'Solidarité Urbaine Tana',
    description: 'Aide aux familles défavorisées d\'Antananarivo. Distribution de nourriture, vêtements et accompagnement social.',
    category: 'social',
    status: 'pending',
    location: 'Antananarivo, Madagascar',
    volunteers: 67,
    projects: 5,
    email: 'aide@solidarite-tana.mg',
    phone: '+261 34 77 889 90',
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-10-20T11:15:00Z'
  },
  {
    id: '5',
    name: 'Culture et Patrimoine Malagasy',
    description: 'Préservation et promotion de la culture traditionnelle malgache. Organisation d\'événements culturels et formation artistique.',
    category: 'culture',
    status: 'active',
    location: 'Fianarantsoa, Madagascar',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    volunteers: 134,
    projects: 9,
    email: 'culture@patrimoine-mg.org',
    website: 'https://patrimoine-mg.org',
    createdAt: '2022-09-12T16:45:00Z',
    updatedAt: '2024-10-22T14:30:00Z'
  },
  {
    id: '6',
    name: 'Eau Pure pour Villages',
    description: 'Construction de puits et systèmes d\'assainissement dans les villages ruraux. Amélioration de l\'accès à l\'eau potable.',
    category: 'health',
    status: 'active',
    location: 'Mahajanga, Madagascar',
    volunteers: 78,
    projects: 11,
    email: 'eau@villages-mg.org',
    phone: '+261 32 11 223 44',
    createdAt: '2023-07-18T10:20:00Z',
    updatedAt: '2024-10-26T13:50:00Z'
  }
]

export const useOngService = () => {
  const getOngs = async (): Promise<ONG[]> => {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // En réalité, vous feriez un appel à votre API
    // const response = await $fetch('/api/ongs')
    // return response.data
    
    // Retourner une copie simple des données pour éviter les problèmes de sérialisation SSR
    return JSON.parse(JSON.stringify(mockOngs))
  }

  const getOngById = async (id: string): Promise<ONG | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // const response = await $fetch(`/api/ongs/${id}`)
    // return response.data
    
    const ong = mockOngs.find(ong => ong.id === id) || null
    return ong ? JSON.parse(JSON.stringify(ong)) : null
  }

  const getOngsByCategory = async (category: string): Promise<ONG[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const filtered = mockOngs.filter(ong => ong.category === category)
    return JSON.parse(JSON.stringify(filtered))
  }

  const searchOngs = async (query: string): Promise<ONG[]> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const searchTerm = query.toLowerCase()
    const filtered = mockOngs.filter(ong => 
      ong.name.toLowerCase().includes(searchTerm) ||
      ong.description.toLowerCase().includes(searchTerm) ||
      ong.location.toLowerCase().includes(searchTerm)
    )
    return JSON.parse(JSON.stringify(filtered))
  }

  const getOngStats = (ongs: ONG[]): OngStats => {
    return {
      total: ongs.length,
      active: ongs.filter(ong => ong.status === 'active').length,
      totalVolunteers: ongs.reduce((sum, ong) => sum + ong.volunteers, 0),
      totalProjects: ongs.reduce((sum, ong) => sum + ong.projects, 0)
    }
  }

  const joinOng = async (ongId: string, userData: any): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // const response = await $fetch(`/api/ongs/${ongId}/join`, {
      //   method: 'POST',
      //   body: userData
      // })
      
      console.log('Adhésion à l\'ONG:', ongId, userData)
      return true
    } catch (error) {
      console.error('Erreur lors de l\'adhésion:', error)
      return false
    }
  }

  return {
    getOngs,
    getOngById,
    getOngsByCategory,
    searchOngs,
    getOngStats,
    joinOng
  }
}