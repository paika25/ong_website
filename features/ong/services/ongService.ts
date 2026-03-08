/**
 * @deprecated Ce fichier est conservé pour backward-compatibility.
 * Utilisez les imports depuis '~/features/ong/services' (index.ts) à la place.
 *
 * Nouvelle architecture :
 *   services/index.ts         → Point d'entrée (ré-exporte tout)
 *   services/ong.types.ts     → Interfaces
 *   services/ong.helpers.ts   → Utilitaires (isClient, getOngStats)
 *   services/ong.mapper.ts    → Conversion Supabase ↔ TypeScript
 *   services/ong.queries.ts   → Lectures (getOngs, getOngById, getOwnerOng, ...)
 *   services/ong.mutations.ts → Écritures (createOng, updateOng, deleteOng)
 */

// Ré-exporter tout depuis index.ts pour backward-compatibility
export {
  getOngs,
  getOngById,
  getOngsByCategory,
  searchOngs,
  getOngByAccountId,
  getOwnerOng,
  getOngStats,
  createOng,
  updateOng,
  deleteOng,
  joinOng,
  useOngService,
} from './index'

export type {
  OngFormPayload,
  OngServiceResult,
  DeleteOngResult,
} from './ong.types'
