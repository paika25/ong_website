<template>
  <div class="w-full">

    <!-- Succès modal -->
    <UModal v-model="showSuccessModal" prevent-close>
      <div class="p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <Icon name="i-heroicons-check" class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-xl font-bold mb-2">Inscription réussie !</h3>
        <p class="text-muted-foreground mb-4">
          Un email de confirmation a été envoyé à <strong>{{ form.email }}</strong>.
          Vérifiez votre boîte mail pour activer votre compte.
        </p>
        <UButton color="primary" @click="goToLogin">Aller à la connexion</UButton>
      </div>
    </UModal>

    <form @submit.prevent="handleSignup" class="space-y-6">

      <!-- Type de compte -->
      <div>
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Je suis…</p>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="form.accountType = 'user_partner'"
            :class="[
              'relative p-4 rounded-xl border-2 text-left transition-all',
              form.accountType === 'user_partner'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40',
            ]"
          >
            <div v-if="form.accountType === 'user_partner'" class="absolute top-2.5 right-2.5">
              <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Icon name="i-heroicons-check" class="w-3 h-3 text-white" />
              </div>
            </div>
            <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-3">
              <Icon name="i-heroicons-building-office-2" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p class="font-semibold text-sm mb-0.5">Bailleur / Partenaire</p>
            <p class="text-xs text-muted-foreground">Financer et soutenir des ONGs</p>
          </button>

          <button
            type="button"
            @click="form.accountType = 'user_agent'"
            :class="[
              'relative p-4 rounded-xl border-2 text-left transition-all',
              form.accountType === 'user_agent'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40',
            ]"
          >
            <div v-if="form.accountType === 'user_agent'" class="absolute top-2.5 right-2.5">
              <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Icon name="i-heroicons-check" class="w-3 h-3 text-white" />
              </div>
            </div>
            <div class="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mb-3">
              <Icon name="i-heroicons-users" class="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <p class="font-semibold text-sm mb-0.5">Agent ONG</p>
            <p class="text-xs text-muted-foreground">Gérer et certifier mon ONG</p>
          </button>
        </div>
      </div>

      <!-- Section : Vos informations -->
      <div class="rounded-xl border border-border overflow-hidden">
        <div class="flex items-center gap-2.5 px-4 py-3 bg-muted/40 border-b border-border">
          <div class="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Icon name="i-heroicons-user" class="w-3.5 h-3.5 text-primary" />
          </div>
          <p class="text-sm font-semibold">Vos informations</p>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="Prénom" :error="errors.firstName">
              <UInput v-model="form.firstName" placeholder="Jean" :color="errors.firstName ? 'red' : 'primary'" />
            </UFormGroup>
            <UFormGroup label="Nom" :error="errors.lastName">
              <UInput v-model="form.lastName" placeholder="Dupont" :color="errors.lastName ? 'red' : 'primary'" />
            </UFormGroup>
          </div>

          <UFormGroup
            :label="form.accountType === 'user_partner' ? 'Email professionnel' : 'Email'"
            :error="errors.email"
            required
          >
            <UInput
              v-model="form.email"
              type="email"
              :placeholder="form.accountType === 'user_partner' ? 'vous@organisation.org' : 'votre@email.com'"
              :color="errors.email ? 'red' : 'primary'"
            />
            <div
              v-if="showGenericDomainWarning && !form.emailDerogation"
              class="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300"
            >
              Les comptes bailleurs requièrent un email professionnel (domaine de votre organisation).
            </div>
            <div v-if="form.accountType === 'user_partner' && (showGenericDomainWarning || form.emailDerogation)" class="mt-2 flex items-start gap-2">
              <UCheckbox v-model="form.emailDerogation" class="mt-0.5" />
              <span class="text-xs text-muted-foreground cursor-pointer select-none" @click="form.emailDerogation = !form.emailDerogation">
                Mon organisation n'a pas de domaine email dédié (justification demandée lors de la validation)
              </span>
            </div>
          </UFormGroup>
        </div>
      </div>

      <!-- Section : Sécurité -->
      <div class="rounded-xl border border-border overflow-hidden">
        <div class="flex items-center gap-2.5 px-4 py-3 bg-muted/40 border-b border-border">
          <div class="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Icon name="i-heroicons-lock-closed" class="w-3.5 h-3.5 text-primary" />
          </div>
          <p class="text-sm font-semibold">Sécurité</p>
        </div>
        <div class="p-4 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="Mot de passe" :error="errors.password" required>
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :color="errors.password ? 'red' : 'primary'"
              >
                <template #trailing>
                  <UButton
                    variant="ghost"
                    size="2xs"
                    class="pointer-events-auto"
                    :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    color="gray"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup label="Confirmation" :error="errors.confirmPassword" required>
              <UInput
                v-model="form.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :color="errors.confirmPassword ? 'red' : 'primary'"
              />
            </UFormGroup>
          </div>

          <div v-if="form.password">
            <div class="flex gap-1.5 mb-1.5">
              <div
                v-for="i in 4"
                :key="i"
                class="h-1.5 flex-1 rounded-full transition-all duration-300"
                :class="i <= passwordStrengthLevel ? passwordStrengthColors[passwordStrengthLevel - 1] : 'bg-muted'"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              Force : <span class="font-medium">{{ passwordStrengthLabels[passwordStrengthLevel - 1] || 'Très faible' }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Section bailleur institutionnel -->
      <template v-if="form.accountType === 'user_partner'">
        <div class="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
          <div class="flex items-center gap-2.5 pb-3 border-b border-border">
            <div class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
              <Icon name="i-heroicons-building-office-2" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p class="text-sm font-semibold">Informations institutionnelles</p>
          </div>

          <UFormGroup label="Nom de l'organisation" :error="errors.organizationName" required>
            <UInput
              v-model="form.organizationName"
              placeholder="Fondation XYZ, Agence ABC, Ministère…"
              :color="errors.organizationName ? 'red' : 'primary'"
            />
          </UFormGroup>

          <UFormGroup label="Fonction / poste" :error="errors.jobTitle" required>
            <UInput
              v-model="form.jobTitle"
              placeholder="Directeur des partenariats, Chargé de mission…"
              :color="errors.jobTitle ? 'red' : 'primary'"
            />
          </UFormGroup>

          <!-- Justificatif de mandat -->
          <div>
            <label class="block text-sm font-medium mb-1.5">
              Justificatif de mandat
              <span class="text-xs text-muted-foreground font-normal ml-1">(lettre de mission, habilitation, délégation…)</span>
            </label>
            <div
              :class="[
                'relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
                mandateDocFile
                  ? 'border-green-400 bg-green-50 dark:bg-green-950/20'
                  : 'border-border hover:border-primary/50 bg-muted/20',
              ]"
              @click="(mandateInputRef as HTMLInputElement)?.click()"
              @dragover.prevent
              @drop.prevent="onMandateDrop"
            >
              <input
                ref="mandateInputRef"
                type="file"
                class="sr-only"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                @change="onMandateFileChange"
              />
              <div v-if="mandateDocFile" class="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <Icon name="i-heroicons-check" class="w-4 h-4 shrink-0" />
                <span class="text-sm font-medium truncate max-w-xs">{{ mandateDocFile.name }}</span>
                <button type="button" class="ml-1 text-muted-foreground hover:text-destructive text-xs leading-none" @click.stop="mandateDocFile = null">✕</button>
              </div>
              <div v-else class="text-muted-foreground">
                <Icon name="i-heroicons-arrow-up-tray" class="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                <p class="text-xs">Glissez un fichier ou cliquez pour choisir</p>
                <p class="text-xs opacity-60 mt-0.5">PDF, DOC, JPG — Max 5 Mo</p>
              </div>
            </div>
            <p v-if="errors.mandateDoc" class="mt-1 text-xs text-destructive">{{ errors.mandateDoc }}</p>
          </div>
        </div>
      </template>

      <!-- Informations optionnelles -->
      <div class="rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          class="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-muted/40 transition-colors"
          @click="showOptional = !showOptional"
        >
          <span class="text-sm font-medium">Informations supplémentaires <span class="text-muted-foreground font-normal">(optionnel)</span></span>
          <Icon name="i-heroicons-chevron-down" :class="['w-4 h-4 text-muted-foreground transition-transform', showOptional ? 'rotate-180' : '']" />
        </button>
        <div v-if="showOptional" class="px-5 pb-5 pt-1 space-y-4 border-t border-border bg-muted/20">
          <UFormGroup v-if="form.accountType === 'user_agent'" label="Nom de l'ONG">
            <UInput v-model="form.companyName" placeholder="Nom de votre ONG" />
          </UFormGroup>
          <UFormGroup label="Bio">
            <UTextarea v-model="form.bio" placeholder="Parlez-nous de vous..." :rows="3" />
          </UFormGroup>
          <UFormGroup label="Localisation">
            <UInput v-model="form.location" placeholder="Paris, France" />
          </UFormGroup>
          <UFormGroup label="Site web">
            <UInput v-model="form.website" placeholder="https://www.monsite.com" />
          </UFormGroup>
        </div>
      </div>

      <!-- CGU -->
      <div class="flex items-start gap-2.5">
        <UCheckbox v-model="form.acceptTerms" class="mt-0.5" />
        <label class="text-sm text-muted-foreground leading-relaxed cursor-pointer" @click="form.acceptTerms = !form.acceptTerms">
          J'accepte les
          <NuxtLink to="/terms" class="text-primary hover:underline" @click.stop>conditions d'utilisation</NuxtLink>
          et la
          <NuxtLink to="/privacy" class="text-primary hover:underline" @click.stop>politique de confidentialité</NuxtLink>
        </label>
      </div>
      <p v-if="errors.acceptTerms" class="text-xs text-destructive">{{ errors.acceptTerms }}</p>

      <!-- Erreur globale -->
      <UAlert
        v-if="globalError"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        :description="globalError"
      />

      <UButton type="submit" block size="lg" :loading="isLoading" :disabled="!isFormValid" icon="i-heroicons-user-plus">
        Créer mon compte
      </UButton>

      <p class="text-center text-sm text-muted-foreground">
        Déjà un compte ?
        <UButton variant="link" size="sm" color="primary" class="font-medium" @click="$emit('switch-to-login')">Se connecter</UButton>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useAuthService } from '../services/authService'
import type { SignUpData } from '../types/auth.types'

const GENERIC_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr',
  'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'free.fr',
  'orange.fr', 'wanadoo.fr', 'icloud.com', 'me.com', 'mac.com',
  'gmx.com', 'gmx.fr', 'laposte.net', 'aol.com', 'protonmail.com', 'pm.me',
]

const emit = defineEmits(['switch-to-login', 'signup-success'])
const { signUp } = useAuthService()

const mandateInputRef = ref<HTMLInputElement | null>(null)
const mandateDocFile  = ref<File | null>(null)

function onMandateFileChange(e: Event) {
  mandateDocFile.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

function onMandateDrop(e: DragEvent) {
  mandateDocFile.value = e.dataTransfer?.files?.[0] ?? null
}

const form = reactive({
  accountType:      'user_partner' as 'user_partner' | 'user_agent',
  firstName:        '',
  lastName:         '',
  email:            '',
  emailDerogation:  false,
  password:         '',
  confirmPassword:  '',
  organizationName: '',
  jobTitle:         '',
  companyName:      '',
  bio:              '',
  location:         '',
  website:          '',
  acceptTerms:      false,
})

const showPassword     = ref(false)
const showOptional     = ref(false)
const isLoading        = ref(false)
const showSuccessModal = ref(false)
const globalError      = ref<string | null>(null)
const errors           = ref<Record<string, string>>({})
const hasSubmitted     = ref(false)

const passwordStrengthLabels = ['Faible', 'Moyen', 'Bon', 'Excellent']
const passwordStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']

const passwordStrengthLevel = computed(() => {
  const p = form.password
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^a-zA-Z0-9]/.test(p)) s++
  return s
})

const emailDomain = computed(() => form.email.split('@')[1]?.toLowerCase() ?? '')

const showGenericDomainWarning = computed(() =>
  form.accountType === 'user_partner' &&
  form.email.includes('@') &&
  GENERIC_DOMAINS.includes(emailDomain.value)
)

function validateForm(): Record<string, string> {
  const errs: Record<string, string> = {}

  if (!form.email) {
    errs.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = 'Email invalide'
  } else if (
    form.accountType === 'user_partner' &&
    GENERIC_DOMAINS.includes(emailDomain.value) &&
    !form.emailDerogation
  ) {
    errs.email = 'Un email professionnel est requis (ou cochez la dérogation ci-dessous)'
  }

  if (!form.password) {
    errs.password = 'Le mot de passe est requis'
  } else if (form.password.length < 8) {
    errs.password = 'Minimum 8 caractères'
  }

  if (!form.confirmPassword) {
    errs.confirmPassword = 'Confirmation requise'
  } else if (form.password !== form.confirmPassword) {
    errs.confirmPassword = 'Les mots de passe ne correspondent pas'
  }

  if (!form.acceptTerms) errs.acceptTerms = 'Vous devez accepter les conditions'

  if (form.accountType === 'user_partner') {
    if (!form.organizationName.trim()) errs.organizationName = 'Le nom de l\'organisation est requis'
    if (!form.jobTitle.trim())         errs.jobTitle = 'La fonction est requise'
    if (mandateDocFile.value && mandateDocFile.value.size > 5 * 1024 * 1024) {
      errs.mandateDoc = 'Le fichier ne doit pas dépasser 5 Mo'
    }
  }

  if (form.website && !/^https?:\/\//.test(form.website)) {
    form.website = 'https://' + form.website
  }

  return errs
}

const isFormValid = computed(() => {
  if (!form.email || !form.password || form.password !== form.confirmPassword || !form.acceptTerms) return false
  if (form.accountType === 'user_partner') {
    if (!form.organizationName.trim() || !form.jobTitle.trim()) return false
    if (GENERIC_DOMAINS.includes(emailDomain.value) && !form.emailDerogation) return false
  }
  return Object.keys(errors.value).length === 0
})

watch(form, () => {
  if (hasSubmitted.value) errors.value = validateForm()
  globalError.value = null
}, { deep: true })

watch(mandateDocFile, () => {
  if (hasSubmitted.value) errors.value = validateForm()
})

async function handleSignup() {
  hasSubmitted.value = true
  const validationErrors = validateForm()
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  isLoading.value = true
  globalError.value = null

  try {
    const signUpData: SignUpData = {
      email:            form.email.trim().toLowerCase(),
      password:         form.password,
      accountType:      form.accountType,
      firstName:        form.firstName.trim()        || null,
      lastName:         form.lastName.trim()         || null,
      companyName:      form.companyName.trim()      || null,
      organizationName: form.organizationName.trim() || null,
      jobTitle:         form.jobTitle.trim()         || null,
      bio:              form.bio.trim()              || null,
      location:         form.location.trim()         || null,
      website:          form.website.trim()          || null,
    }

    const result = await signUp(signUpData)

    if (result.error) {
      globalError.value = result.error
      return
    }

    if (result.user) {
      // Upload du justificatif de mandat (fire & forget — non bloquant sur le signup)
      if (form.accountType === 'user_partner' && mandateDocFile.value) {
        const fd = new FormData()
        fd.append('userId', result.user.id)
        fd.append('file', mandateDocFile.value)
        $fetch('/api/auth/mandate-upload', { method: 'POST', body: fd }).catch(() => {
          // Silencieux — peut être relancé depuis l'espace profil si nécessaire
        })
      }

      if (result.needsEmailVerification) {
        showSuccessModal.value = true
      } else {
        emit('signup-success', result.user)
      }
    }
  } catch (err: any) {
    globalError.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

function goToLogin() {
  showSuccessModal.value = false
  emit('switch-to-login')
}
</script>
