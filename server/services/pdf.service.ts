import { ServiceError } from '../utils/errors'

// Stub — implémentation complète en Story 6.1 (Playwright via Supabase Edge Function)
// Stockage : Supabase Storage /reports/{ong_id}/{report_id}.pdf
export async function generateDossierSummary(_ongId: string): Promise<string> {
  throw new ServiceError('NOT_IMPLEMENTED', 'pdf.generateDossierSummary not yet implemented')
}

export async function generateVerificationReport(_ongId: string): Promise<string> {
  throw new ServiceError('NOT_IMPLEMENTED', 'pdf.generateVerificationReport not yet implemented')
}
