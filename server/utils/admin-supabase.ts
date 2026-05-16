import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase pour les LECTURES admin.
 * - Préfère le service role (bypass RLS complet)
 * - Fallback anon + JWT si service role non configuré
 *   (fonctionne si JWT contient app_metadata.role = back_office/admin)
 */
export function createAdminReadClient(
  config: ReturnType<typeof useRuntimeConfig>,
  userToken: string
): SupabaseClient {
  const url        = config.public.supabaseUrl as string
  const serviceKey = config.supabaseServiceRoleKey as string

  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return createClient(url, config.public.supabaseAnonKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  })
}

/**
 * Client Supabase pour les ÉCRITURES admin (INSERT / UPDATE / DELETE).
 * Requiert obligatoirement la service role key.
 *
 * Pourquoi obligatoire :
 *   - Les tables sensibles (algorithm_versions) n'autorisent les écritures
 *     qu'au service_role via RLS — jamais via JWT utilisateur.
 *   - Cela garantit que toute modification passe par l'API serveur admin,
 *     jamais depuis un client direct.
 *
 * Configuration : NUXT_SUPABASE_SERVICE_ROLE_KEY dans .env
 * Valeur disponible sur : Supabase Dashboard > Settings > API > service_role
 */
export function createAdminWriteClient(
  config: ReturnType<typeof useRuntimeConfig>
): SupabaseClient {
  const serviceKey = config.supabaseServiceRoleKey as string

  if (!serviceKey) {
    throw createError({
      statusCode: 503,
      statusMessage:
        'Service role key non configurée. ' +
        'Ajoutez NUXT_SUPABASE_SERVICE_ROLE_KEY dans votre .env ' +
        '(Supabase Dashboard → Settings → API → service_role).',
    })
  }

  return createClient(config.public.supabaseUrl as string, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Extrait le sub (user ID) du JWT sans appel réseau.
 */
export function parseJwtSub(token: string): string | null {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub ?? null
  } catch {
    return null
  }
}
