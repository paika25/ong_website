export interface OngStatusConfig {
  label: string
  class: string
}

export const ONG_STATUS_CONFIG: Record<string, OngStatusConfig> = {
  pending:             { label: 'Brouillon',   class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  submitted:           { label: 'Soumis',      class: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  under_review:        { label: 'En revue',    class: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  complement_required: { label: 'Docs requis', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  suspended:           { label: 'Suspendu',    class: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  verified:            { label: 'Certifié ✓',  class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  active:              { label: 'Actif ✓',     class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  rejected:            { label: 'Rejeté',      class: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' },
  inactive:            { label: 'Inactif',     class: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500' },
}

export function getOngStatusConfig(status: string): OngStatusConfig {
  return ONG_STATUS_CONFIG[status] ?? { label: status, class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' }
}

export function getOngStatusLabel(status: string): string {
  return getOngStatusConfig(status).label
}
