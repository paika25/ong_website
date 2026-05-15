export interface OngScoreResult {
  score: number
}

export interface ScoreCriterion {
  id: string
  label: string
  weight: number
  [key: string]: unknown
}

export interface ScoreCriteriaResult {
  criteria: ScoreCriterion[]
  version: string
}

export async function getOngScore(ongId: string): Promise<OngScoreResult> {
  return $fetch<OngScoreResult>(`/api/score/ong/${ongId}`)
}

export async function getScoreCriteria(): Promise<ScoreCriteriaResult> {
  return $fetch<ScoreCriteriaResult>('/api/score/criteria')
}
