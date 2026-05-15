/**
 * Mutations ONG (INSERT, UPDATE, DELETE)
 * Toutes les fonctions qui modifient des données dans Supabase.
 */

import type { OngFormPayload, OngServiceResult, DeleteOngResult } from './ong.types'
import type { SectionVisibility } from '../type'
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

    // S'assurer que le compte est bien de type user_agent (correction si trigger n'a pas tourné)
    const { data: account, error: accountReadError } = await supabase
      .from('accounts')
      .select('account_type')
      .eq('id', accountId)
      .maybeSingle()

    if (accountReadError) {
      console.error('❌ [createOng] Lecture account:', accountReadError.message)
    }

    if (!account) {
      // Compte introuvable dans accounts : le créer depuis la session auth
      console.warn('⚠️ [createOng] Account absent, création depuis auth.getUser()...')
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const meta = authUser.user_metadata || {}
        const { error: insertAccError } = await supabase
          .from('accounts')
          .insert({
            id: accountId,
            email: authUser.email || '',
            account_type: 'user_agent',
            first_name: meta.first_name || null,
            last_name: meta.last_name || null,
            company_name: meta.company_name || null,
            bio: meta.bio || null,
            location: meta.location || null,
            website: meta.website || null,
            verified: authUser.email_confirmed_at !== null,
            created_at: authUser.created_at,
            updated_at: new Date().toISOString()
          })
        if (insertAccError) {
          console.error('❌ [createOng] Impossible de créer le compte:', insertAccError.message)
          // L'insert peut échouer si le compte existe déjà (race condition) — tenter une relecture
          const { data: retryAccount } = await supabase
            .from('accounts')
            .select('account_type')
            .eq('id', accountId)
            .maybeSingle()
          if (retryAccount) {
            // Compte trouvé après retry → corriger le type si besoin
            if (retryAccount.account_type !== 'user_agent') {
              await supabase
                .from('accounts')
                .update({ account_type: 'user_agent', updated_at: new Date().toISOString() })
                .eq('id', accountId)
            }
            console.log('✅ [createOng] Compte récupéré après retry')
          } else {
            return {
              success: false,
              data: null,
              error: 'Votre profil de compte est manquant. Veuillez vous déconnecter, vous reconnecter et réessayer. Si le problème persiste, exécutez le script fix_accounts_agent.sql dans votre dashboard Supabase.',
            }
          }
        }
        console.log('✅ [createOng] Compte créé en user_agent')
      }
    } else if (account.account_type !== 'user_agent') {
      // Compte existe mais avec le mauvais type → corriger
      console.warn(`⚠️ [createOng] account_type="${account.account_type}", correction en user_agent...`)
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ account_type: 'user_agent', updated_at: new Date().toISOString() })
        .eq('id', accountId)
      if (updateError) {
        console.error('❌ [createOng] Erreur UPDATE account_type:', updateError.message)
        return { success: false, data: null, error: 'Impossible de corriger votre type de compte. Contactez le support.' }
      }
      console.log('✅ [createOng] account_type corrigé en user_agent')
    }

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

    // Enregistrer le créateur comme propriétaire dans agent_ong_managers
    const { error: managerError } = await supabase
      .from('agent_ong_managers')
      .insert({
        agent_account_id: accountId,
        ong_id: newOng.id,
        role: 'Propriétaire',
      })

    if (managerError) {
      console.warn('⚠️ [createOng] Erreur insertion agent_ong_managers:', managerError.message)
    } else {
      console.log(`✅ [createOng] Agent ${accountId} enregistré comme Propriétaire`)
    }

    return { success: true, data: newOng, error: null }
  } catch (err: any) {
    console.error('❌ [createOng] Exception:', err)
    return { success: false, data: null, error: err.message || 'Erreur inconnue' }
  }
}

// ============================================
// UPDATE ONG VISIBILITY
// ============================================

export const updateOngVisibility = async (
  ongId: string,
  visibility: SectionVisibility
): Promise<{ success: boolean; error: string | null }> => {
  if (!isClient()) return { success: false, error: 'Opération client-only' }

  const supabase = useSupabase()
  if (!supabase) return { success: false, error: 'Supabase non disponible' }

  const { error } = await supabase
    .from('ongs')
    .update({ section_visibility: visibility, updated_at: new Date().toISOString() })
    .eq('id', ongId)

  if (error) return { success: false, error: error.message }
  return { success: true, error: null }
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
