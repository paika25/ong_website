/**
 * Récupère le JWT de la session Supabase active.
 * À appeler uniquement côté client (composants, pages, composables).
 */
export async function getToken(): Promise<string> {
  const supabase = useSupabase()
  if (!supabase) return ''
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}
