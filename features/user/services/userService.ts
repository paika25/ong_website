export interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  skills?: string[]
  verified: boolean
  joinedAt: string
  stats: {
    ongs: number
    projects: number
    followers: number
    following: number
  }
}

export interface UserUpdateData {
  firstName?: string
  lastName?: string
  bio?: string
  location?: string
  website?: string
  skills?: string[]
  avatar?: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Marius',
    lastName: 'Razafitsalama',
    fullName: 'Marius Razafitsalama',
    email: 'marius@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    bio: 'Développeur passionné par les technologies web et l\'aide aux communautés locales. Spécialisé en Laravel, Vue.js et architecture logicielle.',
    location: 'Antananarivo, Madagascar',
    website: 'https://marius-portfolio.com',
    skills: ['Laravel', 'Vue.js', 'PHP', 'JavaScript', 'Docker'],
    verified: true,
    joinedAt: '2022-01-15T00:00:00Z',
    stats: {
      ongs: 3,
      projects: 12,
      followers: 156,
      following: 89
    }
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Dubois',
    fullName: 'Marie Dubois',
    email: 'marie.dubois@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
    bio: 'Coordinatrice de projets humanitaires avec 8 ans d\'expérience dans le développement communautaire.',
    location: 'Fianarantsoa, Madagascar',
    skills: ['Gestion de projet', 'Développement communautaire', 'Formation'],
    verified: true,
    joinedAt: '2021-03-20T00:00:00Z',
    stats: {
      ongs: 2,
      projects: 8,
      followers: 234,
      following: 45
    }
  }
]

export const useUserService = () => {
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // En réalité, vous récupéreriez l'utilisateur connecté depuis le token/session
      // const token = getAuthToken()
      // const response = await $fetch('/api/user/me', {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // return response.data

      return mockUsers[0] // Simulation de l'utilisateur connecté
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  const getUserById = async (id: string): Promise<User | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // const response = await $fetch(`/api/users/${id}`)
      // return response.data
      
      return mockUsers.find(user => user.id === id) || null
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  const updateUser = async (userData: UserUpdateData): Promise<User> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // const response = await $fetch('/api/user/profile', {
      //   method: 'PUT',
      //   body: userData
      // })
      
      // Simulation de mise à jour
      const currentUser = mockUsers[0]
      const updatedUser: User = {
        ...currentUser,
        ...userData,
        fullName: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}` 
          : currentUser.fullName
      }
      
      // Mise à jour du mock
      mockUsers[0] = updatedUser
      
      return updatedUser
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    }
  }

  const updateAvatar = async (file: File): Promise<string> => {
    try {
      // Simulation d'upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // const formData = new FormData()
      // formData.append('avatar', file)
      // const response = await $fetch('/api/user/avatar', {
      //   method: 'POST',
      //   body: formData
      // })
      // return response.url
      
      // Simulation d'URL d'avatar
      return `https://images.unsplash.com/photo-${Date.now()}?w=200`
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error)
      throw error
    }
  }

  const followUser = async (userId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // const response = await $fetch(`/api/users/${userId}/follow`, {
      //   method: 'POST'
      // })
      
      console.log(`Utilisateur ${userId} suivi avec succès`)
      return true
    } catch (error) {
      console.error('Erreur lors du suivi de l\'utilisateur:', error)
      return false
    }
  }

  const unfollowUser = async (userId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // const response = await $fetch(`/api/users/${userId}/unfollow`, {
      //   method: 'POST'
      // })
      
      console.log(`Utilisateur ${userId} non suivi avec succès`)
      return true
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du suivi:', error)
      return false
    }
  }

  const getFollowers = async (userId: string): Promise<User[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // const response = await $fetch(`/api/users/${userId}/followers`)
      // return response.data
      
      // Simulation
      return mockUsers.slice(0, 2)
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnés:', error)
      return []
    }
  }

  const getFollowing = async (userId: string): Promise<User[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // const response = await $fetch(`/api/users/${userId}/following`)
      // return response.data
      
      // Simulation
      return mockUsers.slice(1)
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements:', error)
      return []
    }
  }

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // const response = await $fetch('/api/users/search', {
      //   query: { q: query }
      // })
      // return response.data
      
      // Simulation
      const searchTerm = query.toLowerCase()
      return mockUsers.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.bio?.toLowerCase().includes(searchTerm)
      )
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error)
      return []
    }
  }

  const deleteAccount = async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // const response = await $fetch('/api/user/account', {
      //   method: 'DELETE'
      // })
      
      console.log('Compte supprimé avec succès')
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error)
      return false
    }
  }

  return {
    getCurrentUser,
    getUserById,
    updateUser,
    updateAvatar,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    searchUsers,
    deleteAccount
  }
}