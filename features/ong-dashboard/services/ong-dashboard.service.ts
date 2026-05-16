import { getOwnerOng } from '~/features/ong/services'
import type { ONG } from '~/features/ong/type'

export interface OngDonation {
  id: string
  ong_id: string
  amount: number
  currency: string
  status: string
  provider: string
  donor_email: string | null
  created_at: string
  stripe_payment_intent_id: string | null
  metadata: Record<string, unknown> | null
}

export interface OngDashboardStats {
  totalDonations: number
  totalAmountCents: number
  totalProjects: number
  totalVolunteers: number
  status: ONG['status']
}

export async function fetchOwnerOng(): Promise<ONG | null> {
  return getOwnerOng()
}

export async function fetchOngDonations(ongId: string): Promise<OngDonation[]> {
  const supabase = useSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('ong_id', ongId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[fetchOngDonations]', error.message)
    return []
  }

  return (data ?? []) as OngDonation[]
}

export function computeOngStats(ong: ONG, donations: OngDonation[]): OngDashboardStats {
  const completed = donations.filter(d => d.status === 'completed' && d.currency === 'eur')
  return {
    totalDonations: completed.length,
    totalAmountCents: completed.reduce((sum, d) => sum + d.amount, 0),
    totalProjects: ong.projects?.length ?? 0,
    totalVolunteers: ong.volunteers ?? 0,
    status: ong.status,
  }
}

export function formatEur(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_LABELS: Record<string, string> = {
  pending:             'En attente',
  submitted:           'Soumis',
  under_review:        'En révision',
  complement_required: 'Complément requis',
  verified:            'Vérifié',
  active:              'Actif',
  rejected:            'Rejeté',
  suspended:           'Suspendu',
  inactive:            'Inactif',
}

const STATUS_CLASSES: Record<string, string> = {
  verified:            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  active:              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  pending:             'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  submitted:           'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  under_review:        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  complement_required: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  rejected:            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  suspended:           'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  inactive:            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export function ongStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function ongStatusClass(status: string): string {
  return STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-600'
}
