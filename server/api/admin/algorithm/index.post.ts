import { z } from 'zod'
import { createAdminWriteClient, parseJwtSub } from '~/server/utils/admin-supabase'

const WeightsSchema = z.object({
  documents_uploaded:   z.number().int().min(0).max(100),
  profile_complete:     z.number().int().min(0).max(100),
  backoffice_validated: z.number().int().min(0).max(100),
  financial_reports:    z.number().int().min(0).max(100),
  projects_declared:    z.number().int().min(0).max(100),
})

const BodySchema = z.object({
  version:            z.string().regex(/^\d+\.\d+\.\d+$/, 'Format semver requis (ex: 1.2.0)'),
  weights:            WeightsSchema,
  thresholds:         z.object({
    submission_minimum: z.number().int().min(0).max(100),
    verified_badge:     z.number().int().min(0).max(100),
  }),
  required_documents: z.array(z.string().min(1)).min(1),
})

export default defineEventHandler(async (event) => {
  const raw    = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0]?.message ?? 'Données invalides' })
  }

  const config = useRuntimeConfig()
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const supabase  = createAdminWriteClient(config)
  const createdBy = parseJwtSub(token)

  const { data, error } = await supabase
    .from('algorithm_versions')
    .insert({
      version:     parsed.data.version,
      params_json: {
        weights:            parsed.data.weights,
        thresholds:         parsed.data.thresholds,
        required_documents: parsed.data.required_documents,
      },
      status:     'draft',
      created_by: createdBy,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
