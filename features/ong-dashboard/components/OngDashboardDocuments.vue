<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
    <div class="px-5 py-4 border-b border-border flex items-center justify-between">
      <div>
        <h2 class="font-semibold">Mes documents</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Statuts, rapports et pièces légales</p>
      </div>
      <UButton size="sm" variant="outline" @click="showUpload = !showUpload">
        <Icon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
        Ajouter
      </UButton>
    </div>

    <!-- Zone upload -->
    <div v-if="showUpload" class="px-5 py-4 border-b border-border bg-muted/30 space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-medium text-muted-foreground mb-1 block">Nom du document</label>
          <input
            v-model="uploadForm.name"
            type="text"
            placeholder="Ex : Rapport annuel 2024"
            class="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-muted-foreground mb-1 block">Catégorie</label>
          <select
            v-model="uploadForm.category"
            class="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="legal">Légal</option>
            <option value="activity">Activité</option>
          </select>
        </div>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground mb-1 block">Visibilité</label>
        <select
          v-model="uploadForm.visibility"
          class="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="public">Public — visible par tous</option>
          <option value="partners">Partenaires — utilisateurs connectés uniquement</option>
          <option value="private">Privé — ONG et administrateurs uniquement</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-medium text-muted-foreground mb-1 block">Fichier (PDF, DOC, JPG, PNG — max 10 Mo)</label>
        <input
          ref="fileInput"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          class="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground cursor-pointer"
          @change="onFileChange"
        />
      </div>
      <div v-if="uploadError" class="text-xs text-destructive flex items-center gap-1.5">
        <Icon name="i-heroicons-exclamation-circle" class="w-4 h-4" />
        {{ uploadError }}
      </div>
      <div class="flex gap-2">
        <UButton size="sm" color="primary" :loading="uploading" :disabled="!canUpload" @click="doUpload">
          Téléverser
        </UButton>
        <UButton size="sm" variant="ghost" @click="resetUpload">Annuler</UButton>
      </div>
    </div>

    <!-- Liste -->
    <div class="divide-y divide-border">
      <div v-if="loading" class="p-5 space-y-3 animate-pulse">
        <div v-for="i in 3" :key="i" class="h-12 bg-muted rounded-lg" />
      </div>

      <div v-else-if="!documents.length" class="px-5 py-16 text-center text-muted-foreground">
        <Icon name="i-heroicons-document-text" class="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>Aucun document uploadé</p>
      </div>

      <div
        v-for="doc in documents"
        :key="doc.id"
        class="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
      >
        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', categoryBg(doc.category)]">
          <Icon :name="categoryIcon(doc.mimeType)" class="w-4 h-4" :class="categoryColor(doc.category)" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate">{{ doc.name }}</div>
          <div class="flex items-center gap-2 flex-wrap mt-0.5">
            <span class="text-xs text-muted-foreground">
              {{ categoryLabel(doc.category) }} · {{ formatSize(doc.fileSize) }} · {{ formatDateShort(doc.createdAt) }}
            </span>
            <span :class="['inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium', visibilityClass(doc.visibility)]">
              <Icon :name="visibilityIcon(doc.visibility)" class="w-3 h-3" />
              {{ visibilityLabel(doc.visibility) }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a :href="doc.fileUrl" target="_blank" rel="noopener">
            <UButton size="xs" variant="ghost">
              <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5" />
            </UButton>
          </a>
          <UButton size="xs" variant="ghost" color="red" :loading="deletingId === doc.id" @click="doDelete(doc)">
            <Icon name="i-heroicons-trash" class="w-3.5 h-3.5" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OngDocument, DocumentCategory, DocumentVisibility } from '~/features/ong/type'
import { getOngDocuments, uploadOngDocument, deleteOngDocument } from '~/features/ong/services/ong.documents'

const props = defineProps<{ ongId: string }>()
const toast = useToast()

const documents = ref<OngDocument[]>([])
const loading = ref(true)
const showUpload = ref(false)
const uploading = ref(false)
const deletingId = ref<string | null>(null)
const uploadError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

const uploadForm = reactive({
  name:       '',
  category:   'legal' as DocumentCategory,
  visibility: 'private' as DocumentVisibility,
})

const canUpload = computed(() =>
  !uploading.value && uploadForm.name.trim().length > 0 && !!selectedFile.value
)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
  uploadError.value = null
}

function resetUpload() {
  showUpload.value = false
  uploadForm.name = ''
  uploadForm.category = 'legal'
  uploadForm.visibility = 'private'
  selectedFile.value = null
  uploadError.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function doUpload() {
  if (!selectedFile.value || !uploadForm.name.trim()) return
  uploading.value = true
  uploadError.value = null

  const result = await uploadOngDocument(
    props.ongId,
    selectedFile.value,
    uploadForm.name.trim(),
    uploadForm.category,
    uploadForm.visibility,
  )

  if (!result.success || !result.data) {
    uploadError.value = result.error ?? 'Erreur lors de l\'upload'
    uploading.value = false
    return
  }

  documents.value.unshift(result.data)
  toast.add({ title: 'Document uploadé', color: 'green' })
  resetUpload()
  uploading.value = false
}

async function doDelete(doc: OngDocument) {
  deletingId.value = doc.id
  const result = await deleteOngDocument(doc.id, doc.fileUrl)
  if (result.success) {
    documents.value = documents.value.filter(d => d.id !== doc.id)
    toast.add({ title: 'Document supprimé', color: 'green' })
  } else {
    toast.add({ title: 'Erreur suppression', description: result.error ?? '', color: 'red' })
  }
  deletingId.value = null
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function categoryLabel(cat: DocumentCategory): string {
  return cat === 'legal' ? 'Légal' : 'Activité'
}

function categoryIcon(mime: string): string {
  if (mime === 'application/pdf') return 'i-heroicons-document'
  if (mime.startsWith('image/')) return 'i-heroicons-photo'
  return 'i-heroicons-document-text'
}

function categoryBg(cat: DocumentCategory): string {
  return cat === 'legal'
    ? 'bg-blue-100 dark:bg-blue-900'
    : 'bg-amber-100 dark:bg-amber-900'
}

function categoryColor(cat: DocumentCategory): string {
  return cat === 'legal'
    ? 'text-blue-600 dark:text-blue-400'
    : 'text-amber-600 dark:text-amber-400'
}

function visibilityLabel(v: DocumentVisibility): string {
  if (v === 'partners') return 'Partenaires'
  if (v === 'private')  return 'Privé'
  return 'Public'
}

function visibilityIcon(v: DocumentVisibility): string {
  if (v === 'partners') return 'i-heroicons-user-group'
  if (v === 'private')  return 'i-heroicons-lock-closed'
  return 'i-heroicons-globe-alt'
}

function visibilityClass(v: DocumentVisibility): string {
  if (v === 'partners') return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  if (v === 'private')  return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
}

onMounted(async () => {
  documents.value = await getOngDocuments(props.ongId)
  loading.value = false
})
</script>
