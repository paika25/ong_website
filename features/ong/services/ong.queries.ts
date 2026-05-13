/**
 * Requêtes de lecture ONG (SELECT)
 * Toutes les fonctions qui lisent des données depuis Supabase.
 */

import type { ONG } from '../type'
import { mockOngs } from '../data'
import { isClient } from './ong.helpers'
import { fromSupabaseRow } from './ong.mapper'

// ============================================
// GET ALL ONGS
// ============================================

export const getOngs = async (): Promise<ONG[]> => {
  if (!isClient()) {
    console.log('🔧 [getOngs] SSR: using mock data')
    return JSON.parse(JSON.stringify(mockOngs))
  }

  const supabase = useSupabase()

  if (supabase) {
    try {
      console.log('🔍 [getOngs] Tentative de récupération depuis Supabase...')

      const { data, error } = await supabase
        .from('ongs')
        .select('*')
        .in('status', ['verified', 'active'])  // marketplace publique : certifiées uniquement
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur Supabase getOngs:', error.message)
        return JSON.parse(JSON.stringify(mockOngs))
      }

      const ongs: ONG[] = data.map((row: any) => fromSupabaseRow(row))
      console.log(`✅ ${ongs.length} ONGs certifiées récupérées depuis Supabase`)
      return ongs
    } catch (err) {
      console.error('❌ Exception Supabase:', err)
      return JSON.parse(JSON.stringify(mockOngs))
    }
  }

  // Mode mock
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('📦 Utilisation des données mockées')
  return JSON.parse(JSON.stringify(mockOngs))
}

// ============================================
// GET ONG BY ID
// ============================================

export const getOngById = async (id: string): Promise<ONG | null> => {
  if (!isClient()) {
    console.log('🔧 [getOngById] SSR: using mock data')
    const ong = mockOngs.find(o => o.id === id) || null
    return ong ? JSON.parse(JSON.stringify(ong)) : null
  }

  const supabase = useSupabase()

  if (supabase) {
    try {
      console.log(`🔍 [getOngById] Recherche ONG ${id}...`)

      const { data, error } = await supabase
        .from('ongs')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        console.error('❌ Erreur Supabase getOngById:', error.message)
        const ong = mockOngs.find(o => o.id === id) || null
        return ong ? JSON.parse(JSON.stringify(ong)) : null
      }

      if (!data) {
        console.log(`ℹ️ [getOngById] Aucune ONG trouvée pour l'id ${id}`)
        const ong = mockOngs.find(o => o.id === id) || null
        return ong ? JSON.parse(JSON.stringify(ong)) : null
      }

      const ong: ONG = fromSupabaseRow(data)
      console.log(`✅ ONG ${id} récupérée depuis Supabase`)
      return ong
    } catch (err) {
      console.error('❌ Exception Supabase:', err)
      const ong = mockOngs.find(o => o.id === id) || null
      return ong ? JSON.parse(JSON.stringify(ong)) : null
    }
  }

  // Mode mock
  await new Promise(resolve => setTimeout(resolve, 300))
  const ong = mockOngs.find(o => o.id === id) || null
  return ong ? JSON.parse(JSON.stringify(ong)) : null
}

// ============================================
// GET ONGS BY CATEGORY
// ============================================

export const getOngsByCategory = async (category: string): Promise<ONG[]> => {
  if (!isClient()) {
    console.log('🔧 [getOngsByCategory] SSR: using mock data')
    const filtered = mockOngs.filter(ong => ong.category === category)
    return JSON.parse(JSON.stringify(filtered))
  }

  await new Promise(resolve => setTimeout(resolve, 500))
  const filtered = mockOngs.filter(ong => ong.category === category)
  return JSON.parse(JSON.stringify(filtered))
}

// ============================================
// SEARCH ONGS
// ============================================

export const searchOngs = async (query: string): Promise<ONG[]> => {
  if (!isClient()) {
    console.log('🔧 [searchOngs] SSR: using mock data')
    const searchTerm = query.toLowerCase()
    const filtered = mockOngs.filter(ong =>
      ong.name.toLowerCase().includes(searchTerm) ||
      ong.description.toLowerCase().includes(searchTerm) ||
      ong.location.toLowerCase().includes(searchTerm)
    )
    return JSON.parse(JSON.stringify(filtered))
  }

  await new Promise(resolve => setTimeout(resolve, 400))
  const searchTerm = query.toLowerCase()
  const filtered = mockOngs.filter(ong =>
    ong.name.toLowerCase().includes(searchTerm) ||
    ong.description.toLowerCase().includes(searchTerm) ||
    ong.location.toLowerCase().includes(searchTerm)
  )
  return JSON.parse(JSON.stringify(filtered))
}

// ============================================
// GET ONG BY ACCOUNT ID
// ============================================

/**
 * Récupère l'ONG unique d'un agent via son account_id.
 */
export const getOngByAccountId = async (accountId: string): Promise<ONG | null> => {
  if (!isClient()) {
    console.log('🔧 [getOngByAccountId] SSR: returning null')
    return null
  }

  const supabase = useSupabase()
  if (!supabase) return null

  try {
    console.log(`🔍 [getOngByAccountId] Recherche ONG pour account ${accountId}...`)

    const { data, error } = await supabase
      .from('ongs')
      .select('*')
      .eq('account_id', accountId)
      .maybeSingle()

    if (error) {
      console.error('❌ [getOngByAccountId] Erreur:', error.message)
      return null
    }

    if (!data) {
      console.log('ℹ️ [getOngByAccountId] Aucune ONG trouvée pour cet agent')
      return null
    }

    const ong = fromSupabaseRow(data)
    console.log(`✅ [getOngByAccountId] ONG "${ong.name}" trouvée`)
    return ong
  } catch (err) {
    console.error('❌ [getOngByAccountId] Exception:', err)
    return null
  }
}

// ============================================
// GET OWNER ONG (agent connecté → son ONG)
// ============================================

/**
 * Récupère l'ONG de l'agent actuellement connecté.
 * Utilise auth.getUser() pour identifier le user,
 * puis cherche l'ONG dont account_id correspond.
 *
 * Différence avec getOngByAccountId :
 *   - getOwnerOng : pas de paramètre, utilise le user connecté
 *   - getOngByAccountId : prend un accountId explicite
 */
export const getOwnerOng = async (): Promise<ONG | null> => {
  if (!isClient()) {
    console.log('🔧 [getOwnerOng] SSR: returning null')
    return null
  }

  const supabase = useSupabase()
  if (!supabase) return null

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ [getOwnerOng] Utilisateur non connecté')
      return null
    }

    console.log(`🔍 [getOwnerOng] Recherche ONG pour l'agent ${user.id}...`)

    const { data, error } = await supabase
      .from('ongs')
      .select('*')
      .eq('account_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('❌ [getOwnerOng] Erreur:', error.message)
      return null
    }

    if (!data) {
      console.log('ℹ️ [getOwnerOng] Aucune ONG trouvée pour cet agent')
      return null
    }

    const ong = fromSupabaseRow(data)
    console.log(`✅ [getOwnerOng] ONG "${ong.name}" trouvée`)
    return ong
  } catch (err) {
    console.error('❌ [getOwnerOng] Exception:', err)
    return null
  }
}
