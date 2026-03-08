/**
 * Mappers ONG : conversion entre le format Supabase (snake_case)
 * et le format TypeScript front (camelCase).
 */

import type { ONG } from '../type'
import type { OngFormPayload } from './ong.types'

/**
 * Transforme les données du formulaire (camelCase côté front)
 * en payload compatible avec la table `ongs` Supabase (snake_case).
 *
 * Colonnes Supabase concernées :
 *   name, description, category, status, location, image,
 *   volunteers, email, phone, website,
 *   projects (JSONB), financials (JSONB), legal (JSONB),
 *   impact (JSONB), donation_opportunities (JSONB),
 *   monitoring (JSONB)
 */
export const toSupabasePayload = (formData: OngFormPayload) => ({
  name: formData.name,
  description: formData.description,
  category: formData.category,
  location: formData.location,
  image: formData.image || null,
  volunteers: formData.volunteers || 0,
  email: formData.email || null,
  phone: formData.phone || null,
  website: formData.website || null,
  projects: formData.projects || [],
  financials: formData.financials || {},
  legal: formData.legal || {},
  impact: formData.impact || {},
  donation_opportunities: formData.donationOpportunities || [],
  monitoring: formData.monitoring || {},
})

/**
 * Mapper une ligne brute Supabase → type ONG front (camelCase).
 */
export const fromSupabaseRow = (row: any): ONG => ({
  id: row.id,
  name: row.name,
  description: row.description,
  category: row.category,
  status: row.status,
  location: row.location,
  image: row.image || '',
  volunteers: row.volunteers || 0,
  email: row.email,
  phone: row.phone || '',
  website: row.website || '',
  projects: row.projects || [],
  financials: row.financials || {},
  legal: row.legal || {},
  impact: row.impact || {},
  donationOpportunities: row.donation_opportunities || [],
  monitoring: row.monitoring || {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})
