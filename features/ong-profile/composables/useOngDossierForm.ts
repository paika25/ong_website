/**
 * État partagé du dossier ONG sur les 3 premières étapes.
 * Persisté dans localStorage (NFR19 — perte de connexion ne fait pas perdre les données).
 * Synchronisé vers Supabase à chaque navigation entre étapes.
 */
import { useStorage } from '@vueuse/core'

export interface DossierIdentite {
  nomOng: string
  formeJuridique: string
  dateCreation: string
  numeroRecepisse: string
  adresseSiege: string
  email: string
  telephone: string
  siteWeb: string
}

export interface DossierMission {
  missionPrincipale: string
  secteurs: string[]
  zonesGeographiques: string[]
}

export interface DossierDocument {
  id: string
  name: string
  docKey: string
  category: 'legal' | 'activity'
  fileUrl: string
  fileSize: number
  mimeType: string
}

export const SECTEURS = [
  'Éducation', 'Santé', 'Environnement', 'Social',
  'Culture', 'Agriculture', 'Eau & Assainissement',
  'Droits humains', 'Genre & Inclusion', 'Développement économique',
]

export const ZONES = [
  'Antananarivo', 'Toamasina', 'Fianarantsoa', 'Mahajanga',
  'Toliara', 'Antsiranana', 'National', 'International',
]

export const REQUIRED_DOCS = [
  { key: 'statuts',          label: 'Statuts de l\'association',       required: true  },
  { key: 'recepisse',        label: 'Récépissé officiel d\'enregistrement', required: true  },
  { key: 'rapport_financier', label: 'Dernier rapport financier audité',  required: true  },
]

export function useOngDossierForm(ongId?: string) {
  const storageKey = `ong-dossier-${ongId ?? 'new'}`

  // Persister identité dans localStorage
  const identite = useStorage<DossierIdentite>(`${storageKey}-identite`, {
    nomOng: '', formeJuridique: '', dateCreation: '', numeroRecepisse: '',
    adresseSiege: '', email: '', telephone: '', siteWeb: '',
  })

  const mission = useStorage<DossierMission>(`${storageKey}-mission`, {
    missionPrincipale: '', secteurs: [], zonesGeographiques: [],
  })

  const documents = useStorage<DossierDocument[]>(`${storageKey}-documents`, [])

  // Erreurs de validation
  const errors = reactive<Record<string, string>>({})

  function validateIdentite(): boolean {
    errors.nomOng = identite.value.nomOng.trim() ? '' : 'Le nom est requis'
    errors.formeJuridique = identite.value.formeJuridique ? '' : 'La forme juridique est requise'
    errors.numeroRecepisse = identite.value.numeroRecepisse.trim() ? '' : 'Le numéro de récépissé est requis'
    errors.adresseSiege = identite.value.adresseSiege.trim() ? '' : 'L\'adresse du siège est requise'
    errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identite.value.email) ? '' : 'Email invalide'
    return !Object.values(errors).some(Boolean)
  }

  function validateMission(): boolean {
    errors.missionPrincipale = identite.value.nomOng && mission.value.missionPrincipale.trim().length >= 20
      ? '' : 'La mission doit comporter au moins 20 caractères'
    errors.secteurs = mission.value.secteurs.length > 0 ? '' : 'Sélectionnez au moins un secteur'
    errors.zones = mission.value.zonesGeographiques.length > 0 ? '' : 'Sélectionnez au moins une zone'
    return !Object.values(errors).some(Boolean)
  }

  function validateDocuments(): boolean {
    const requiredDocs = REQUIRED_DOCS.filter(d => d.required)
    errors.documents = requiredDocs.every(req =>
      documents.value.some(d => d.docKey === req.key)
    ) ? '' : 'Les documents obligatoires (statuts, récépissé et rapport financier audité) sont requis'
    return !errors.documents
  }

  function addDocument(doc: DossierDocument) {
    const idx = documents.value.findIndex(d => d.docKey === doc.docKey)
    if (idx >= 0) documents.value[idx] = doc
    else documents.value.push(doc)
  }

  function removeDocument(docId: string) {
    documents.value = documents.value.filter(d => d.id !== docId)
  }

  function clearStorage() {
    localStorage.removeItem(`${storageKey}-identite`)
    localStorage.removeItem(`${storageKey}-mission`)
    localStorage.removeItem(`${storageKey}-documents`)
  }

  return {
    identite, mission, documents, errors,
    validateIdentite, validateMission, validateDocuments,
    addDocument, removeDocument, clearStorage,
  }
}
