export interface User {
  id: string
  email: string
  accountType: 'user_partner' | 'user_agent'
  firstName: string | null
  lastName: string | null
  fullName: string
  companyName?: string | null
  avatar?: string | null
  cover?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpData {
  email: string
  password: string
  accountType: 'user_partner' | 'user_agent'
  firstName?: string | null
  lastName?: string | null
  companyName?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
}

export interface AuthResult {
  user: User | null
  error: string | null
  needsEmailVerification?: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface UserStats {
  totalDonations?: number
  totalAmount?: number
  ongsSupported?: number
  memberSince?: string
  lastActivity?: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: User
}
