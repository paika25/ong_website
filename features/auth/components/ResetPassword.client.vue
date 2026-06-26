<template>
  <div class="max-w-md mx-auto p-6 bg-card rounded-xl border border-border">

    <!-- Chargement initial (détection du token) -->
    <div v-if="tokenState === 'loading'" class="text-center space-y-4 py-8">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-muted-foreground text-sm">Vérification du lien...</p>
    </div>

    <!-- Token invalide ou expiré -->
    <div v-else-if="tokenState === 'invalid'" class="text-center space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
        <Icon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 class="text-xl font-bold">Lien invalide ou expiré</h2>
      <p class="text-sm text-muted-foreground">
        Ce lien de réinitialisation n'est plus valide. Les liens expirent après 1 heure ou sont invalidés après utilisation.
      </p>
      <UButton @click="navigateTo('/auth/forgot')">
        Demander un nouveau lien
      </UButton>
      <div>
        <UButton variant="link" size="sm" @click="navigateTo('/auth/login')">
          Retour à la connexion
        </UButton>
      </div>
    </div>

    <!-- Succès -->
    <div v-else-if="tokenState === 'success'" class="text-center space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <Icon name="i-heroicons-check" class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h2 class="text-xl font-bold">Mot de passe modifié</h2>
      <p class="text-sm text-muted-foreground">Votre mot de passe a été réinitialisé avec succès.</p>
      <UButton @click="navigateTo('/auth/login')">
        Se connecter
      </UButton>
    </div>

    <!-- Formulaire de nouveau mot de passe -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <h2 class="text-2xl font-bold text-center mb-2">Nouveau mot de passe</h2>
      <p class="text-sm text-muted-foreground text-center mb-4">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      <UFormGroup
        label="Nouveau mot de passe"
        :error="errors.password"
        required
      >
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          :color="errors.password ? 'red' : 'primary'"
          @blur="validateField('password')"
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

      <UFormGroup
        label="Confirmer le mot de passe"
        :error="errors.confirm"
        required
      >
        <UInput
          v-model="form.confirm"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          :color="errors.confirm ? 'red' : 'primary'"
          @blur="validateField('confirm')"
        />
      </UFormGroup>

      <UAlert
        v-if="globalError"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        :description="globalError"
      />

      <UButton type="submit" block :loading="isLoading" :disabled="isLoading">
        Réinitialiser le mot de passe
      </UButton>
    </form>

  </div>
</template>

<script setup lang="ts">
import { useAuthService } from '~/features/auth/services/authService'

type TokenState = 'loading' | 'valid' | 'invalid' | 'success'

const { updatePassword } = useAuthService()
const supabase = useSupabase()

const tokenState = ref<TokenState>('loading')
const showPassword = ref(false)
const isLoading = ref(false)
const globalError = ref('')

const form = reactive({ password: '', confirm: '' })
const errors = reactive({ password: '', confirm: '' })

// Validation UX-DR22 : on-blur par champ
const validateField = (field: 'password' | 'confirm') => {
  if (field === 'password') {
    if (!form.password) {
      errors.password = 'Le mot de passe est requis'
    } else if (form.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    } else {
      errors.password = ''
    }
    // Re-valider la confirmation si déjà saisie
    if (form.confirm) validateField('confirm')
  }
  if (field === 'confirm') {
    if (!form.confirm) {
      errors.confirm = 'La confirmation est requise'
    } else if (form.confirm !== form.password) {
      errors.confirm = 'Les mots de passe ne correspondent pas'
    } else {
      errors.confirm = ''
    }
  }
}

// on-submit : révéler tous les invalides (UX-DR22)
const validateAll = () => {
  validateField('password')
  validateField('confirm')
}

const isFormValid = computed(() =>
  form.password.length >= 8 &&
  form.confirm === form.password &&
  !errors.password &&
  !errors.confirm
)

const handleSubmit = async () => {
  validateAll()
  if (!isFormValid.value) return

  isLoading.value = true
  globalError.value = ''

  const { error } = await updatePassword(form.password)

  if (error) {
    globalError.value = error
    isLoading.value = false
    return
  }

  tokenState.value = 'success'
  isLoading.value = false
}

// Détection du token de récupération au montage
onMounted(async () => {
  if (!supabase) {
    tokenState.value = 'invalid'
    return
  }

  try {
    // Supabase SDK détecte automatiquement le token (hash ou PKCE code) dans l'URL
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      tokenState.value = 'invalid'
      return
    }

    tokenState.value = 'valid'
  } catch {
    tokenState.value = 'invalid'
  }
})
</script>
