import { z } from 'zod'
import { createAdminWriteClient, createAdminReadClient } from '~/server/utils/admin-supabase'

const WeightsSchema = z.object({
  documents_uploaded:   z.number().int().min(0).max(100),
  profile_complete:     z.number().int().min(0).max(100),
  backoffice_validated: z.number().int().min(0).max(100),
  financial_reports:    z.number().int().min(0).max(100),
  projects_declared:    z.number().int().min(0).max(100),
})

const BodySchema = z.object({
  weights:            WeightsSchema.optional(),
  thresholds:         z.object({
    submission_minimum: z.number().int().min(0).max(100),
    verified_badge:     z.number().int().min(0).max(100),
  }).optional(),
  required_documents: z.array(z.string().min(1)).optional(),
})

export default defineEventHandler(async (event) => {
  const versionId = getRouterParam(event, 'id')
  if (!versionId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const raw    = await readBody(event)
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Données invalides' })

  const config = useRuntimeConfig()
  const token  = getRequestHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  // Lecture : client avec fallback
  const reader = createAdminReadClient(config, token)
  const { data: current, error: readErr } = await reader
    .from('algorithm_versions')
    .select('status, params_json')
    .eq('id', versionId)
    .single()

  if (readErr || !current) throw createError({ statusCode: 404, statusMessage: 'Version introuvable' })
  if (current.status !== 'draft') {
    throw createError({ statusCode: 409, statusMessage: 'Seuls les brouillons sont modifiables' })
  }

  const updatedParams = {
    ...current.params_json,
    ...(parsed.data.weights            && { weights:            parsed.data.weights }),
    ...(parsed.data.thresholds         && { thresholds:         parsed.data.thresholds }),
    ...(parsed.data.required_documents && { required_documents: parsed.data.required_documents }),
  }

  // Écriture : service role obligatoire
  const writer = createAdminWriteClient(config)
  const { data, error } = await writer
    .from('algorithm_versions')
    .update({ params_json: updatedParams })
    .eq('id', versionId)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
