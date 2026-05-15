<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-semibold mb-1">Documents justificatifs</h3>
      <p class="text-sm text-muted-foreground">
        Ces documents permettent au back-office de certifier votre organisation.
        Formats acceptés : PDF, DOC, DOCX, JPG, PNG — Max 10 Mo chacun.
      </p>
    </div>

    <div v-if="errors.documents" class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
      {{ errors.documents }}
    </div>

    <!-- Liste des documents requis -->
    <div class="space-y-4">
      <div
        v-for="docType in REQUIRED_DOCS"
        :key="docType.key"
        class="space-y-2"
      >
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">
            {{ docType.label }}
            <span v-if="docType.required" class="text-destructive ml-1">*</span>
            <span v-else class="text-muted-foreground text-xs ml-1">(recommandé)</span>
          </label>
          <div v-if="getUploadedDoc(docType.key)" class="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Déposé
          </div>
        </div>

        <DocumentUploadZone
          :accept="ACCEPTED_TYPES"
          :max-size="10 * 1024 * 1024"
          :existing-file="getUploadedDoc(docType.key)?.name"
          :aria-label="`Zone de dépôt — ${docType.label}`"
          :on-upload="(file, onProgress) => handleUpload(file, docType.key, onProgress)"
        />
      </div>
    </div>

    <!-- Documents uploadés -->
    <div v-if="documents.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium text-muted-foreground">Documents déposés ({{ documents.length }})</h4>
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
      >
        <div class="flex items-center gap-3 min-w-0">
          <svg class="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ doc.name }}</p>
            <p class="text-xs text-muted-foreground">{{ formatSize(doc.fileSize) }}</p>
          </div>
        </div>
        <UButton
          variant="ghost"
          size="xs"
          color="red"
          icon="i-heroicons-trash"
          @click="emit('remove-document', doc.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentUploadZone from './DocumentUploadZone.vue'
import { uploadDocumentWithProgress } from '../services/document.service'
import { REQUIRED_DOCS, type DossierDocument } from '../composables/useOngDossierForm'

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]

const props = defineProps<{
  ongId: string
  documents: DossierDocument[]
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  'add-document': [doc: DossierDocument]
  'remove-document': [docId: string]
}>()

function getUploadedDoc(key: string) {
  return props.documents.find(d =>
    d.name.toLowerCase().includes(key.replace('_', ' ')) ||
    d.name.toLowerCase().includes(key)
  )
}

async function handleUpload(file: File, docKey: string, onProgress: (pct: number) => void) {
  const result = await uploadDocumentWithProgress(
    props.ongId,
    file,
    file.name,
    docKey === 'rapport_financier' ? 'activity' : 'legal',
    onProgress
  )
  emit('add-document', {
    id: result.docId,
    name: file.name,
    category: docKey === 'rapport_financier' ? 'activity' : 'legal',
    fileUrl: result.fileUrl,
    fileSize: file.size,
    mimeType: file.type,
  })
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
}
</script>
