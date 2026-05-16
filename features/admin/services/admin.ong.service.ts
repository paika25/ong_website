import { getToken } from '~/features/auth/utils/getToken'
import type { SectionVisibility } from '~/features/ong/type'

export interface AdminOngFull {
  id:                string
  name:              string
  description:       string
  category:          string
  status:            string
  location:          string
  email:             string | null
  phone:             string | null
  website:           string | null
  volunteers:        number
  projects:          any[]
  financials:        any | null
  legal:             any | null
  impact:            any | null
  sectionVisibility: SectionVisibility | null
  createdAt:         string
  updatedAt:         string
}

export interface AdminOngDocument {
  name: string
  url:  string | null
}

export interface AdminOngDetail {
  ong:       AdminOngFull
  documents: AdminOngDocument[]
  score:     number
  criteria:  ScoreCriterion[]
}

export interface ScoreCriterion {
  key:      string
  label:    string
  points:   number
  achieved: boolean
}

export async function getAdminOngDetail(ongId: string): Promise<AdminOngDetail> {
  const token = await getToken()

  const [dossier, scoreData, criteriaData] = await Promise.all([
    $fetch<{ ong: any; documents: AdminOngDocument[] }>(`/api/admin/dossiers/${ongId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    $fetch<{ score: number }>(`/api/score/ong/${ongId}`),
    $fetch<{ criteria: any[] }>('/api/score/criteria'),
  ])

  const o = dossier.ong

  const ong: AdminOngFull = {
    id:                o.id,
    name:              o.name,
    description:       o.description,
    category:          o.category,
    status:            o.status,
    location:          o.location,
    email:             o.email ?? null,
    phone:             o.phone ?? null,
    website:           o.website ?? null,
    volunteers:        o.volunteers ?? 0,
    projects:          o.projects ?? [],
    financials:        o.financials ?? null,
    legal:             o.legal ?? null,
    impact:            o.impact ?? null,
    sectionVisibility: o.section_visibility ?? null,
    createdAt:         o.created_at,
    updatedAt:         o.updated_at,
  }

  const achieved: Record<string, boolean> = {
    profile_complete:     !!(ong.name && ong.description && ong.location && ong.email),
    projects_declared:    (ong.projects?.length ?? 0) > 0,
    backoffice_validated: ong.status === 'verified' || ong.status === 'active',
    financial_reports:    Array.isArray(ong.financials?.financialReports) && ong.financials.financialReports.length > 0,
    documents_uploaded:   (dossier.documents?.length ?? 0) > 0,
  }

  const criteria: ScoreCriterion[] = criteriaData.criteria.map((c: any) => ({
    key:      c.key,
    label:    c.label,
    points:   c.points,
    achieved: achieved[c.key] ?? false,
  }))

  return { ong, documents: dossier.documents ?? [], score: scoreData.score, criteria }
}

export async function updateAdminOngVisibility(
  ongId: string,
  visibility: SectionVisibility
): Promise<void> {
  const token = await getToken()
  await $fetch(`/api/admin/ongs/${ongId}/visibility`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: visibility,
  })
}
