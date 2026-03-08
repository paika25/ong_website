/**
 * Mutations ONG (INSERT, UPDATE, DELETE)
 * Toutes les fonctions qui modifient des données dans Supabase.
 */

import type { OngFormPayload, OngServiceResult, DeleteOngResult } from './ong.types'
import { isClient } from './ong.helpers'
import { toSupabasePayload, fromSupabaseRow } from './ong.mapper'

// ============================================
// UPDATE ONG
// ============================================

/**
 * Met à jour une ONG existante dans Supabase.
 *
 * @param ongId   - UUID de l'ONG à modifier
 * @param payload - Données du formulaire (camelCase)
 * @returns       - { success, data, error }
 *
 * RLS : seul le owner (account_id = auth.uid()) peut UPDATE.
 */
export const updateOng = async (
  ongId: string,
  payload: OngFormPayload
): Promise<OngServiceResult> => {
  if (!isClient()) {
    console.warn('⚠️ [updateOng] appelé côté serveur, ignoré')
    return { success: false, data: null, error: 'Opération client-only' }
  }

  const supabase = useSupabase()
  if (!supabase) {
    console.error('❌ [updateOng] Supabase non disponible')
    return { success: false, data: null, error: 'Supabase non disponible' }
  }

  try {
    console.log(`📝 [updateOng] Mise à jour ONG ${ongId}...`)

    const { data, error } = await supabase
      .from('ongs')
      .update(toSupabasePayload(payload))
      .eq('id', ongId)
      .select()
      .maybeSingle()

    if (error) {
      console.error('❌ [updateOng] Erreur Supabase:', error.message)
      return { success: false, data: null, error: error.message }
    }

    if (!data) {
      console.error('❌ [updateOng] Aucune ONG trouvée avec cet ID')
      return { success: false, data: null, error: 'ONG non trouvée' }
    }

    const updatedOng = fromSupabaseRow(data)
    console.log(`✅ [updateOng] ONG "${updatedOng.name}" mise à jour`)
    return { success: true, data: updatedOng, error: null }
  } catch (err: any) {
    console.error('❌ [updateOng] Exception:', err)
    return { success: false, data: null, error: err.message || 'Erreur inconnue' }
  }
}

// ============================================
// CREATE ONG
// ============================================

/**
 * Crée une nouvelle ONG dans Supabase.
 *
 * @param accountId - UUID du compte agent (colonne account_id dans ongs)
 * @param payload   - Données du formulaire (camelCase)
 * @returns         - { success, data, error }
 *
 * Règle métier : 1 agent = 1 ONG (vérifié avant l'insert).
 * Trigger DB : ensure_ong_owned_by_agent vérifie le type de compte.
 * RLS : auth.uid() doit correspondre au account_id.
 */
export const createOng = async (
  accountId: string,
  payload: OngFormPayload
): Promise<OngServiceResult> => {
  if (!isClient()) {
    console.warn('⚠️ [createOng] appelé côté serveur, ignoré')
    return { success: false, data: null, error: 'Opération client-only' }
  }

  const supabase = useSupabase()
  if (!supabase) {
    console.error('❌ [createOng] Supabase non disponible')
    return { success: false, data: null, error: 'Supabase non disponible' }
  }

  try {
    console.log(`🏗️ [createOng] Création ONG pour le compte ${accountId}...`)

    // Vérifier que l'agent n'a pas déjà une ONG (règle 1 agent = 1 ONG)
    const { data: existing, error: checkError } = await supabase
      .from('ongs')
      .select('id, name')
      .eq('account_id', accountId)
      .maybeSingle()

    if (checkError) {
      console.error('❌ [createOng] Erreur vérification existante:', checkError.message)
      return { success: false, data: null, error: checkError.message }
    }

    if (existing) {
      console.warn(`⚠️ [createOng] L'agent possède déjà l'ONG "${existing.name}"`)
      return {
        success: false,
        data: null,
        error: `Vous possédez déjà une ONG ("${existing.name}"). Un agent ne peut gérer qu'une seule organisation.`,
      }
    }

    // Insérer la nouvelle ONG
    const insertPayload = {
      account_id: accountId,
      status: 'pending' as const,
      ...toSupabasePayload(payload),
    }

    const { data, error } = await supabase
      .from('ongs')
      .insert(insertPayload)
      .select()
      .maybeSingle()

    if (error) {
      console.error('❌ [createOng] Erreur Supabase:', error.message)
      return { success: false, data: null, error: error.message }
    }

    if (!data) {
      return { success: false, data: null, error: 'Erreur lors de la création' }
    }

    const newOng = fromSupabaseRow(data)
    console.log(`✅ [createOng] ONG "${newOng.name}" créée (id: ${newOng.id}, status: pending)`)
    return { success: true, data: newOng, error: null }
  } catch (err: any) {
    console.error('❌ [createOng] Exception:', err)
    return { success: false, data: null, error: err.message || 'Erreur inconnue' }
  }
}

// ============================================
// DELETE ONG
// ============================================

/**
 * Supprime une ONG dans Supabase.
 * La suppression est en cascade (ON DELETE CASCADE dans la DB)
 * pour agent_ong_managers et donations.
 */
export const deleteOng = async (ongId: string): Promise<DeleteOngResult> => {
  if (!isClient()) {
    return { success: false, error: 'Opération client-only' }
  }

  const supabase = useSupabase()
  if (!supabase) {
    return { success: false, error: 'Supabase non disponible' }
  }

  try {
    console.log(`🗑️ [deleteOng] Suppression ONG ${ongId}...`)

    const { error } = await supabase
      .from('ongs')
      .delete()
      .eq('id', ongId)

    if (error) {
      console.error('❌ [deleteOng] Erreur Supabase:', error.message)
      return { success: false, error: error.message }
    }

    console.log(`✅ [deleteOng] ONG ${ongId} supprimée`)
    return { success: true, error: null }
  } catch (err: any) {
    console.error('❌ [deleteOng] Exception:', err)
    return { success: false, error: err.message || 'Erreur inconnue' }
  }
}
