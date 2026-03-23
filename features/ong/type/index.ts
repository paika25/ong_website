export interface ONG {
  id: string
  name: string
  description: string
  category: 'education' | 'health' | 'environment' | 'social' | 'culture'
  status: 'active' | 'pending' | 'inactive'
  location: string
  image?: string
  volunteers: number
  projects: Project[]
  email?: string
  phone?: string
  website?: string
  createdAt: string
  updatedAt: string
  financials?: {
    totalBudget2023: number
    fundingSources: Array<{
      source: string
      percentage: number
      amount: number
    }>
    financialReports: Array<{
      year: number
      url: string
      audited: boolean
    }>
    allocation: {
      programs: number
      administration: number
      fundraising: number
    }
  }
  legal?: {
    siret: string
    registrationDate: string
    compliance: {
      dataProtection: string
      financialTransparency: string
    }
  }
  impact?: {
    totalBeneficiaries: number
    schoolsBuilt?: number
    teachersTrained?: number
    healthcareProvided?: number
    treesPlanted?: number
    wasteCollected?: number
    kpis: Array<{
      metric: string
      value: string | number
    }>
  }
  donationOpportunities?: Array<{
    type: string
    description: string
    minAmount: number
    benefits: string
  }>
  monitoring?: {
    reportsFrequency: string
    evaluation: string
    audits: string
  }
}

export interface OngStats {
  total: number
  active: number
  totalVolunteers: number
  totalProjects: number
}

export interface Project {
  id: string
  name: string
  description: string
  startDate: string
  endDate?: string
  status: 'planned' | 'ongoing' | 'completed' | 'canceled'
  impact?: string
  budget?: number
}

// ── Documents ONG ──────────────────────────

export type DocumentCategory = 'legal' | 'activity'

export interface OngDocument {
  id: string
  ongId: string
  name: string
  category: DocumentCategory
  fileUrl: string
  fileSize: number
  mimeType: string
  createdAt: string
}