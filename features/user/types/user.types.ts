export interface User {
  id: string
  email: string
  accountType: 'user_partner' | 'user_agent'
  firstName: string
  lastName: string
  fullName: string
  companyName?: string
  avatar?: string
  cover?: string
  bio?: string
  location?: string
  website?: string
  verified: boolean
  createdAt: string
  updatedAt: string
  joinedAt?: string
  skills?: string[]
  stats?: UserStats
}

interface UserStats { 
  ongs: number
  projects: number
  donations?: number
  totalDonated?: number
}
