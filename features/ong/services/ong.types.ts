/**
 * Types du service ONG
 * Interfaces pour les payloads, résultats et helpers
 */

// ============================================
// Payload formulaire (camelCase côté front)
// ============================================

export interface OngFormPayload {
  name: string
  description: string
  category: string
  location: string
  image: string
  email: string
  phone: string
  website: string
  volunteers: number
  projects: any[]
  financials: Record<string, any>
  legal: Record<string, any>
  impact: Record<string, any>
  donationOpportunities?: any[]
  monitoring?: Record<string, any>
}

// ============================================
// Résultats des opérations CRUD
// ============================================

export interface OngServiceResult {
  success: boolean
  data: import('../type').ONG | null
  error: string | null
}

export interface DeleteOngResult {
  success: boolean
  error: string | null
}
