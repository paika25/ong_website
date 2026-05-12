<template>
  <div
    role="region"
    :aria-label="ariaLabel"
    aria-live="polite"
    :class="[
      'relative rounded-xl border-2 border-dashed transition-colors duration-200',
      stateClasses,
    ]"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- ── État : idle ─────────────────────────────────────────── -->
    <div v-if="state === 'idle'" class="flex flex-col items-center justify-center gap-3 p-8 cursor-pointer" @click="triggerInput">
      <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div class="text-center">
        <p class="text-sm font-medium">Glissez un fichier ici ou <span class="text-primary underline">parcourez</span></p>
        <p class="text-xs text-muted-foreground mt-1">{{ formatsLabel }} — Max {{ maxSizeMb }} Mo</p>
      </div>
      <div v-if="existingFile" class="text-xs text-muted-foreground flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Fichier existant : {{ existingFile }}
      </div>
    </div>

    <!-- ── État : dragging ────────────────────────────────────── -->
    <div v-else-if="state === 'dragging'" class="flex flex-col items-center justify-center gap-3 p-8">
      <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      <p class="text-sm font-medium text-primary">Relâchez pour déposer le fichier</p>
    </div>

    <!-- ── État : uploading ───────────────────────────────────── -->
    <div v-else-if="state === 'uploading'" class="flex flex-col items-center justify-center gap-4 p-8">
      <p class="text-sm font-medium">Upload en cours...</p>
      <div class="w-full max-w-xs">
        <div class="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{{ uploadFileName }}</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
      </div>
    </div>

    <!-- ── État : success ─────────────────────────────────────── -->
    <div v-else-if="state === 'success'" class="flex flex-col items-center justify-center gap-3 p-8">
      <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p class="text-sm font-medium text-green-700 dark:text-green-400">Document uploadé avec succès</p>
      <p class="text-xs text-muted-foreground">{{ uploadFileName }}</p>
      <UButton variant="ghost" size="xs" @click="reset">Remplacer</UButton>
    </div>

    <!-- ── État : error ───────────────────────────────────────── -->
    <div v-else-if="state === 'error'" class="flex flex-col items-center justify-center gap-3 p-8">
      <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div class="text-center">
        <p class="text-sm font-medium text-red-600 dark:text-red-400">{{ errorMessage }}</p>
        <p class="text-xs text-muted-foreground mt-1">Formats acceptés : {{ formatsLabel }}</p>
      </div>
      <UButton variant="outline" size="sm" @click="reset">Réessayer</UButton>
    </div>

    <!-- Input file caché -->
    <input
      ref="fileInput"
      type="file"
      class="sr-only"
      :accept="accept.join(',')"
      @change="onFileSelected"
    />
  </div>
</template>

<script setup lang="ts">
type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error'

const props = withDefaults(defineProps<{
  accept?: string[]
  maxSize?: number            // en octets, défaut 10 Mo
  onUpload: (file: File, onProgress: (pct: number) => void) => Promise<void>
  existingFile?: string       // nom du fichier existant
  ariaLabel?: string
}>(), {
  accept: () => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'],
  maxSize: 10 * 1024 * 1024,
  ariaLabel: 'Zone de dépôt de document',
})

const state = ref<UploadState>('idle')
const errorMessage = ref('')
const uploadProgress = ref(0)
const uploadFileName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const maxSizeMb = computed(() => Math.round(props.maxSize / 1024 / 1024))

const formatsLabel = computed(() => {
  const map: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
  }
  return props.accept.map(t => map[t] ?? t).join(', ')
})

const stateClasses = computed(() => ({
  'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40': state.value === 'idle',
  'border-primary bg-primary/5': state.value === 'dragging',
  'border-primary/30 bg-muted/20': state.value === 'uploading',
  'border-green-400 bg-green-50 dark:bg-green-950/20': state.value === 'success',
  'border-red-400 bg-red-50 dark:bg-red-950/20': state.value === 'error',
}))

function triggerInput() {
  fileInput.value?.click()
}

function onDragOver() {
  if (state.value !== 'uploading') state.value = 'dragging'
}

function onDragLeave() {
  if (state.value === 'dragging') state.value = 'idle'
}

function onDrop(e: DragEvent) {
  if (state.value === 'uploading') return
  const file = e.dataTransfer?.files[0]
  if (file) processFile(file)
}

function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
  // Reset input pour permettre re-sélection du même fichier
  if (fileInput.value) fileInput.value.value = ''
}

function validate(file: File): string | null {
  if (!props.accept.includes(file.type)) {
    return `Format non supporté. Formats acceptés : ${formatsLabel.value}`
  }
  if (file.size > props.maxSize) {
    return `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum : ${maxSizeMb.value} Mo`
  }
  return null
}

async function processFile(file: File) {
  const err = validate(file)
  if (err) {
    state.value = 'error'
    errorMessage.value = err
    return
  }

  state.value = 'uploading'
  uploadFileName.value = file.name
  uploadProgress.value = 0
  errorMessage.value = ''

  try {
    await props.onUpload(file, (pct: number) => {
      uploadProgress.value = pct
    })
    uploadProgress.value = 100
    state.value = 'success'
  } catch (e: any) {
    state.value = 'error'
    errorMessage.value = e?.message ?? 'Erreur lors de l\'upload'
  }
}

function reset() {
  state.value = 'idle'
  errorMessage.value = ''
  uploadProgress.value = 0
  uploadFileName.value = ''
}
</script>
