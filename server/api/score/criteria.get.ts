import { createClient } from '@supabase/supabase-js'

// Route publique — exposée aux ONGs et bailleurs pour comprendre le scoring
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Fallback si pas de service role key (build / CI)
  if (!config.supabaseServiceRoleKey || !config.public.supabaseUrl) {
    return { version: '1.0.0', criteria: DEFAULT_CRITERIA }
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { data: algo } = await supabase
    .from('algorithm_versions')
    .select('version, params_json')
    .eq('status', 'active')
    .maybeSingle()

  if (!algo) return { version: '1.0.0', criteria: DEFAULT_CRITERIA }

  const weights = algo.params_json?.weights ?? {}

  return {
    version: algo.version,
    criteria: [
      { key: 'documents_uploaded',   label: 'Documents obligatoires uploadés (statuts + récépissé)', points: weights.documents_uploaded   ?? 20 },
      { key: 'profile_complete',     label: 'Profil complet (nom, mission, localisation, email, téléphone)', points: weights.profile_complete     ?? 25 },
      { key: 'backoffice_validated', label: 'Dossier validé par l\'équipe de certification',         points: weights.backoffice_validated  ?? 30 },
      { key: 'financial_reports',    label: 'Rapport financier audité fourni',                       points: weights.financial_reports     ?? 15 },
      { key: 'projects_declared',    label: 'Au moins un projet déclaré',                            points: weights.projects_declared     ?? 10 },
    ],
    thresholds: algo.params_json?.thresholds ?? { submission_minimum: 40, verified_badge: 70 },
  }
})

const DEFAULT_CRITERIA = [
  { key: 'documents_uploaded',   label: 'Documents obligatoires uploadés', points: 20 },
  { key: 'profile_complete',     label: 'Profil complet',                  points: 25 },
  { key: 'backoffice_validated', label: 'Validation back-office',          points: 30 },
  { key: 'financial_reports',    label: 'Rapport financier audité',        points: 15 },
  { key: 'projects_declared',    label: 'Projets déclarés',                points: 10 },
]
