/**
 * Point d'entrée du service ONG
 *
 * Architecture :
 *   ong.types.ts      → Interfaces (OngFormPayload, OngServiceResult, DeleteOngResult)
 *   ong.helpers.ts    → Utilitaires (isClient, getOngStats)
 *   ong.mapper.ts     → Conversion Supabase ↔ TypeScript (toSupabasePayload, fromSupabaseRow)
 *   ong.queries.ts    → Lectures (getOngs, getOngById, getOwnerOng, ...)
 *   ong.mutations.ts  → Écritures (createOng, updateOng, deleteOng)
 */

// Types
export type { OngFormPayload, OngServiceResult, DeleteOngResult } from './ong.types'

// Helpers
export { isClient, getOngStats } from './ong.helpers'

// Mappers
export { toSupabasePayload, fromSupabaseRow } from './ong.mapper'

// Queries (lecture)
export {
  getOngs,
  getOngById,
  getOngsByCategory,
  searchOngs,
  getOngByAccountId,
  getOwnerOng,
} from './ong.queries'

// Mutations (écriture)
export {
  createOng,
  updateOng,
  deleteOng,
} from './ong.mutations'

// Legacy : joinOng
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

// Composable backward-compatible
import { getOngs, getOngById, getOngByAccountId, getOwnerOng, getOngsByCategory, searchOngs } from './ong.queries'
import { createOng, updateOng, deleteOng } from './ong.mutations'
import { getOngStats } from './ong.helpers'

export const useOngService = () => ({
  getOngs,
  getOngById,
  getOngByAccountId,
  getOwnerOng,
  getOngsByCategory,
  searchOngs,
  getOngStats,
  createOng,
  updateOng,
  deleteOng,
  joinOng,
})
