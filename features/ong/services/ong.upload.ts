/**
 * Service d'upload d'image principale pour une ONG.
 * Utilise Supabase Storage (bucket "ong-images").
 *
 * Flux :
 *   1. Upload du fichier dans le bucket Supabase Storage
 *   2. Récupération de l'URL publique
 *   3. Mise à jour du champ `image` de la table `ongs`
 */

import { isClient } from './ong.helpers'

const BUCKET = 'ong-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface UploadImageResult {
  success: boolean
  url: string | null
  error: string | null
}

/**
 * Valide un fichier image avant upload.
 */
function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Format non supporté (${file.type}). Formats acceptés : JPG, PNG, WebP.`
  }
  if (file.size > MAX_FILE_SIZE) {
    const sizeMb = (file.size / 1024 / 1024).toFixed(1)
    return `Fichier trop volumineux (${sizeMb} Mo). Maximum : 5 Mo.`
  }
  return null
}

/**
 * Upload l'image principale d'une ONG dans Supabase Storage
 * et met à jour le champ `image` de la table `ongs`.
 *
 * @param ongId - UUID de l'ONG
 * @param file  - Fichier image (File)
 * @returns     - { success, url, error }
 */
export const uploadOngImage = async (
  ongId: string,
  file: File
): Promise<UploadImageResult> => {
  if (!isClient()) {
    return { success: false, url: null, error: 'Opération client-only' }
  }

  const supabase = useSupabase()
  if (!supabase) {
    return { success: false, url: null, error: 'Supabase non disponible' }
  }

  // Validation
  const validationError = validateImageFile(file)
  if (validationError) {
    return { success: false, url: null, error: validationError }
  }

  try {
    // Déterminer l'extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${ongId}/cover.${ext}`

    console.log(`📤 [uploadOngImage] Upload vers ${BUCKET}/${filePath}...`)

    // Upload (upsert pour écraser l'ancienne image)
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error('❌ [uploadOngImage] Erreur upload:', uploadError.message)
      return { success: false, url: null, error: uploadError.message }
    }

    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl
    if (!publicUrl) {
      return { success: false, url: null, error: 'Impossible de récupérer l\'URL publique' }
    }

    // Mettre à jour le champ image dans la table ongs
    const { error: updateError } = await supabase
      .from('ongs')
      .update({ image: publicUrl })
      .eq('id', ongId)

    if (updateError) {
      console.error('❌ [uploadOngImage] Erreur mise à jour BDD:', updateError.message)
      return { success: false, url: null, error: updateError.message }
    }

    console.log(`✅ [uploadOngImage] Image uploadée → ${publicUrl}`)
    return { success: true, url: publicUrl, error: null }
  } catch (err: any) {
    console.error('❌ [uploadOngImage] Exception:', err)
    return { success: false, url: null, error: err.message || 'Erreur inconnue' }
  }
}

/**
 * Supprime l'image principale d'une ONG
 * (supprime du storage + vide le champ `image` dans la table `ongs`).
 */
export const deleteOngImage = async (ongId: string): Promise<UploadImageResult> => {
  if (!isClient()) {
    return { success: false, url: null, error: 'Opération client-only' }
  }

  const supabase = useSupabase()
  if (!supabase) {
    return { success: false, url: null, error: 'Supabase non disponible' }
  }

  try {
    console.log(`🗑️ [deleteOngImage] Suppression image ONG ${ongId}...`)

    // Lister les fichiers dans le dossier de l'ONG pour trouver le cover
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(ongId, { search: 'cover' })

    if (files && files.length > 0) {
      const paths = files.map((f: { name: string }) => `${ongId}/${f.name}`)
      await supabase.storage.from(BUCKET).remove(paths)
    }

    // Vider le champ image dans la table
    const { error: updateError } = await supabase
      .from('ongs')
      .update({ image: null })
      .eq('id', ongId)

    if (updateError) {
      return { success: false, url: null, error: updateError.message }
    }

    console.log('✅ [deleteOngImage] Image supprimée')
    return { success: true, url: null, error: null }
  } catch (err: any) {
    console.error('❌ [deleteOngImage] Exception:', err)
    return { success: false, url: null, error: err.message || 'Erreur inconnue' }
  }
}
