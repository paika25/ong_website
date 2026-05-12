import { z } from 'zod'

// Aligne avec la table ongs existante (brownfield)
export const OngStatusSchema = z.enum(['active', 'pending', 'inactive'])
export type OngStatus = z.infer<typeof OngStatusSchema>

export const OngCategorySchema = z.enum([
  'education', 'health', 'environment', 'social', 'culture',
])
export type OngCategory = z.infer<typeof OngCategorySchema>

export const OngBaseSchema = z.object({
  id:          z.string().uuid(),
  name:        z.string().min(1),
  description: z.string(),
  category:    OngCategorySchema,
  status:      OngStatusSchema,
  location:    z.string(),
  accountId:   z.string().uuid(),
})
export type OngBase = z.infer<typeof OngBaseSchema>
