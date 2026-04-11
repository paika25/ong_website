import type { UserOng } from '../services/user.ongs'
import type { UserProject } from '../services/user.projects'
import type { UserActivity } from '../services/user.activity'

export interface ProfileUser {
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
  skills: string[]
  stats: {
    ongs: number
    projects: number
    donations: number
    totalDonated: number
  }
}

export interface ProfileData {
  user: ProfileUser
  ongs: UserOng[]
  projects: UserProject[]
  activities: UserActivity[]
}
