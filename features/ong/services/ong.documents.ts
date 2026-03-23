/**
 * Service de gestion des documents ONG.
 * Utilise Supabase Storage (bucket "ong-documents") et la table `ong_documents`.
 *
 * Flux upload :
 *   1. Validation du fichier (type + taille)
 *   2. Upload dans le bucket Supabase Storage
 *   3. Récupération de l'URL publique
 *   4. Insertion dans la table `ong_documents`
 */

import { isClient } from './ong.helpers'
import type { OngDocument, DocumentCategory } from '../type'

const BUCKET = 'ong-documents'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 Mo
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]

export interface DocumentResult {
  success: boolean
  data: OngDocument | null
  error: string | null
}

/**
 * Valide un fichier document avant upload.
 */
function validateDocumentFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Format non supporté (${file.type}). Formats acceptés : PDF, DOC, DOCX, JPG, PNG.`
  }
  if (file.size > MAX_FILE_SIZE) {
    const sizeMb = (file.size / 1024 / 1024).toFixed(1)
    return `Fichier trop volumineux (${sizeMb} Mo). Maximum : 10 Mo.`
  }
  return null
}

/**
 * Récupère tous les documents d'une ONG.
 */
export const getOngDocuments = async (ongId: string): Promise<OngDocument[]> => {
  if (!isClient()) return []

  const supabase = useSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('ong_documents')
    .select('*')
    .eq('ong_id', ongId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ [getOngDocuments] Erreur:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    ongId: row.ong_id,
    name: row.name,
    category: row.category as DocumentCategory,
    fileUrl: row.file_url,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  }))
}

/**
 * Upload un document pour une ONG.
 *
 * @param ongId    - UUID de l'ONG
 * @param file     - Fichier à uploader
 * @param name     - Nom affiché du document
 * @param category - Catégorie ('legal' | 'activity')
 */
export const uploadOngDocument = async (
  ongId: string,
  file: File,
  name: string,
  category: DocumentCategory
): Promise<DocumentResult> => {
  if (!isClient()) {
    return { success: false, data: null, error: 'Opération client-only' }
  }

  const supabase = useSupabase()
  if (!supabase) {
    return { success: false, data: null, error: 'Supabase non disponible' }
  }

  // Validation
  const validationError = validateDocumentFile(file)
  if (validationError) {
    return { success: false, data: null, error: validationError }
  }

  try {
    // Chemin unique : {ongId}/{category}/{timestamp}-{filename}
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `${ongId}/${category}/${timestamp}-${safeName}`

    console.log(`📤 [uploadOngDocument] Upload vers ${BUCKET}/${filePath}...`)

    // Upload
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      console.error('❌ [uploadOngDocument] Erreur upload:', uploadError.message)
      return { success: false, data: null, error: uploadError.message }
    }

    // URL publique
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl
    if (!publicUrl) {
      return { success: false, data: null, error: "Impossible de récupérer l'URL publique" }
    }

    // Insérer dans la table ong_documents
    const { data: insertData, error: insertError } = await supabase
      .from('ong_documents')
      .insert({
        ong_id: ongId,
        name,
        category,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ [uploadOngDocument] Erreur insert:', insertError.message)
      // Nettoyage : supprimer le fichier uploadé
      await supabase.storage.from(BUCKET).remove([filePath])
      return { success: false, data: null, error: insertError.message }
    }

    const doc: OngDocument = {
      id: insertData.id,
      ongId: insertData.ong_id,
      name: insertData.name,
      category: insertData.category,
      fileUrl: insertData.file_url,
      fileSize: insertData.file_size,
      mimeType: insertData.mime_type,
      createdAt: insertData.created_at,
    }

    console.log(`✅ [uploadOngDocument] Document uploadé → ${publicUrl}`)
    return { success: true, data: doc, error: null }
  } catch (err: any) {
    console.error('❌ [uploadOngDocument] Exception:', err)
    return { success: false, data: null, error: err.message || 'Erreur inconnue' }
  }
}

/**
 * Supprime un document (storage + table).
 *
 * @param docId   - UUID du document dans la table
 * @param fileUrl - URL publique du fichier (pour extraire le chemin storage)
 */
export const deleteOngDocument = async (
  docId: string,
  fileUrl: string
): Promise<{ success: boolean; error: string | null }> => {
  if (!isClient()) {
    return { success: false, error: 'Opération client-only' }
  }

  const supabase = useSupabase()
  if (!supabase) {
    return { success: false, error: 'Supabase non disponible' }
  }

  try {
    console.log(`🗑️ [deleteOngDocument] Suppression doc ${docId}...`)

    // Extraire le chemin relatif depuis l'URL publique
    const bucketSegment = `/storage/v1/object/public/${BUCKET}/`
    const idx = fileUrl.indexOf(bucketSegment)
    if (idx !== -1) {
      const storagePath = decodeURIComponent(fileUrl.substring(idx + bucketSegment.length))
      await supabase.storage.from(BUCKET).remove([storagePath])
    }

    // Supprimer de la table
    const { error: deleteError } = await supabase
      .from('ong_documents')
      .delete()
      .eq('id', docId)

    if (deleteError) {
      console.error('❌ [deleteOngDocument] Erreur delete:', deleteError.message)
      return { success: false, error: deleteError.message }
    }

    console.log('✅ [deleteOngDocument] Document supprimé')
    return { success: true, error: null }
  } catch (err: any) {
    console.error('❌ [deleteOngDocument] Exception:', err)
    return { success: false, error: err.message || 'Erreur inconnue' }
  }
}
