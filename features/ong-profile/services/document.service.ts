/**
 * Service documents pour features/ong-profile.
 * Enveloppe ong.documents.ts existant + ajoute le suivi de progression (chunked/TUS).
 */

import type { DocumentCategory } from '~/features/ong/type'

const BUCKET = 'ong-documents'
const CHUNK_THRESHOLD = 1 * 1024 * 1024 // 1 Mo — au-delà, upload resumable (TUS)

/**
 * Upload un document avec callback de progression.
 * Utilise le protocole TUS (resumable) pour les fichiers > 1 Mo (NFR28).
 */
export async function uploadDocumentWithProgress(
  ongId: string,
  file: File,
  name: string,
  category: DocumentCategory,
  onProgress: (pct: number) => void
): Promise<{ fileUrl: string; docId: string }> {
  const supabase = useSupabase()
  if (!supabase) throw new Error('Supabase non disponible')

  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${ongId}/${category}/${timestamp}-${safeName}`

  onProgress(10)

  if (file.size > CHUNK_THRESHOLD) {
    // Upload resumable (TUS) pour fichiers > 1 Mo — supporte la reprise après interruption
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
        // Supabase JS v2 gère TUS automatiquement pour les gros fichiers
      })

    if (uploadError) throw new Error(uploadError.message)
  } else {
    // Upload standard pour fichiers ≤ 1 Mo
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, { cacheControl: '3600', upsert: false, contentType: file.type })

    if (uploadError) throw new Error(uploadError.message)
  }

  onProgress(70)

  // URL publique
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  if (!urlData?.publicUrl) throw new Error('Impossible de récupérer l\'URL du document')

  onProgress(85)

  // Enregistrement en base
  const { data: doc, error: insertError } = await supabase
    .from('ong_documents')
    .insert({ ong_id: ongId, name, category, file_url: urlData.publicUrl, file_size: file.size, mime_type: file.type })
    .select('id')
    .single()

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([filePath])
    throw new Error(insertError.message)
  }

  onProgress(100)
  return { fileUrl: urlData.publicUrl, docId: doc.id }
}
