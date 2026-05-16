import { getToken } from '~/features/auth/utils/getToken'

export interface AdminUser {
  id:          string
  email:       string
  accountType: 'user_agent' | 'user_partner'
  firstName:   string | null
  lastName:    string | null
  companyName: string | null
  verified:    boolean
  createdAt:   string
}

export interface AdminUsersFilter {
  search?: string
  type?:   'user_agent' | 'user_partner' | ''
}

export async function getAdminUsers(filter: AdminUsersFilter = {}): Promise<AdminUser[]> {
  const token = await getToken()
  const qs = new URLSearchParams()
  if (filter.search) qs.set('search', filter.search)
  if (filter.type)   qs.set('type', filter.type)
  return $fetch<AdminUser[]>(`/api/admin/users?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function userDisplayName(user: AdminUser): string {
  if (user.companyName) return user.companyName
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ')
  return full || user.email.split('@')[0]
}

export function userRoleLabel(type: AdminUser['accountType']): string {
  return type === 'user_agent' ? 'Agent ONG' : 'Partenaire'
}

export function userRoleClass(type: AdminUser['accountType']): string {
  return type === 'user_agent'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
}
