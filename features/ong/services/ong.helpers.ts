/**
 * Helpers utilitaires pour les services ONG
 */

import type { ONG, OngStats } from '../type'

/**
 * Vérifie si on est côté client (navigateur).
 * Supabase ne doit être appelé que côté client dans Nuxt.
 */
export const isClient = () => typeof window !== 'undefined'

/**
 * Calcule les statistiques agrégées d'une liste d'ONGs.
 */
export const getOngStats = (ongs: ONG[]): OngStats => {
  return {
    total: ongs.length,
    active: ongs.filter(ong => ong.status === 'active').length,
    totalVolunteers: ongs.reduce((sum, ong) => sum + ong.volunteers, 0),
    totalProjects: ongs.reduce((sum, ong) => {
      const p = (ong as any).projects
      const count = Array.isArray(p) ? p.length : Number(p) || 0
      return sum + count
    }, 0),
  }
}
