import { createClient } from '@supabase/supabase-js'
import type { ScoreTriggerEvent, ScoreContext } from '~/types/schemas/score.schema'

interface AlgorithmWeights {
  documents_uploaded:   number
  profile_complete:     number
  backoffice_validated: number
  financial_reports:    number
  projects_declared:    number
}

interface AlgorithmVersion {
  id:          string
  version:     string
  params_json: { weights: AlgorithmWeights; thresholds: Record<string, number>; required_documents: string[] }
}

function calcScore(ong: any, docs: any[], weights: AlgorithmWeights, isValidated: boolean): number {
  let score = 0

  // documents_uploaded (max 20)
  const requiredUploaded = docs.filter(d =>
    ['statuts', 'recepisse'].some(k => d.name?.toLowerCase().includes(k))
  ).length
  if (requiredUploaded >= 2)     score += weights.documents_uploaded
  else if (requiredUploaded === 1) score += Math.round(weights.documents_uploaded * 0.5)

  // profile_complete (max 25)
  const profileFields = [ong.name, ong.description, ong.location, ong.email, ong.phone].filter(Boolean)
  score += Math.round((profileFields.length / 5) * weights.profile_complete)

  // backoffice_validated (max 30)
  if (isValidated) score += weights.backoffice_validated

  // financial_reports (max 15)
  const hasFinancials = Array.isArray(ong.financials?.financialReports) && ong.financials.financialReports.length > 0
  if (hasFinancials) score += weights.financial_reports

  // projects_declared (max 10)
  if (Array.isArray(ong.projects) && ong.projects.length > 0) score += weights.projects_declared

  return Math.min(Math.max(score, 0), 100)
}

// IMPORTANT : s'exécute toujours HORS transaction DB (ne bloque jamais un COMMIT)
export async function triggerScoreRecalculation(
  ongId: string,
  event: ScoreTriggerEvent,
  _context: ScoreContext
): Promise<void> {
  const config = useRuntimeConfig()
  if (!config.supabaseServiceRoleKey) return

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { data: algo } = await supabase
    .from('algorithm_versions')
    .select('id, version, params_json')
    .eq('status', 'active')
    .maybeSingle() as { data: AlgorithmVersion | null }

  if (!algo) { console.warn('[score] No active algorithm version'); return }

  const [{ data: ong }, { data: docsStorage }] = await Promise.all([
    supabase.from('ongs').select('*').eq('id', ongId).maybeSingle(),
    supabase.storage.from('ong-documents').list(`${ongId}/`, { limit: 100 }),
  ])

  if (!ong) { console.warn(`[score] ONG ${ongId} not found`); return }

  const isValidated = ['verified', 'active'].includes(ong.status)
  const score       = calcScore(ong, docsStorage ?? [], algo.params_json.weights, isValidated)

  await supabase.from('score_history').insert({
    ong_id:        ongId,
    score,
    version_id:    algo.id,
    trigger_event: event,
    context_json:  { event },
  })

  // Rafraîchit la vue matérialisée en arrière-plan — ne bloque pas la réponse
  supabase.rpc('refresh_ong_current_scores').catch(() => {})
}
