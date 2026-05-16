import { getToken } from '~/features/auth/utils/getToken'

export interface AdminOverview {
  totalOngs:        number
  byStatus:         Record<string, number>
  totalDonations:   number
  totalAmountCents: number
  totalUsers:       number
  totalAgents:      number
  totalPartners:    number
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const token = await getToken()
  return $fetch<AdminOverview>('/api/admin/overview', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function formatEur(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export const ONG_STATUS_LABELS: Record<string, string> = {
  pending:             'En attente',
  submitted:           'Soumis',
  under_review:        'En révision',
  complement_required: 'Complément requis',
  verified:            'Certifiés',
  active:              'Actifs',
  rejected:            'Rejetés',
  suspended:           'Suspendus',
  inactive:            'Inactifs',
}
