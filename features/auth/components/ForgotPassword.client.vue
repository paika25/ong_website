<template>
  <div class="max-w-md mx-auto p-6 bg-card rounded-xl border border-border">
    <h2 class="text-2xl font-bold text-center mb-2">Mot de passe oublié</h2>
    <p class="text-sm text-muted-foreground text-center mb-6">
      Entrez votre adresse email pour recevoir un lien de réinitialisation.
    </p>

    <!-- État succès -->
    <div v-if="submitted" class="text-center space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <Icon name="i-heroicons-envelope" class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <p class="font-medium">Vérifiez votre boîte mail</p>
      <p class="text-sm text-muted-foreground">
        Si un compte existe pour cette adresse, vous recevrez un email avec un lien de réinitialisation valable 1 heure.
      </p>
      <UButton variant="outline" @click="submitted = false">
        Renvoyer un lien
      </UButton>
    </div>

    <!-- Formulaire email -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <UFormGroup
        label="Adresse email"
        :error="emailError"
        required
      >
        <UInput
          v-model="email"
          type="email"
          placeholder="votre@email.com"
          :color="emailError ? 'red' : 'primary'"
          @blur="validateEmail"
        />
      </UFormGroup>

      <UAlert
        v-if="globalError"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        :description="globalError"
      />

      <UButton type="submit" block :loading="isLoading">
        Envoyer le lien de réinitialisation
      </UButton>

      <div class="text-center">
        <UButton variant="link" size="sm" @click="$emit('back-to-login')">
          Retour à la connexion
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthService } from '~/features/auth/services/authService'

const emit = defineEmits<{
  'back-to-login': []
}>()

const { resetPassword } = useAuthService()

const email = ref('')
const emailError = ref('')
const globalError = ref('')
const isLoading = ref(false)
const submitted = ref(false)

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Format d\'email invalide'
  } else {
    emailError.value = ''
  }
}

const handleSubmit = async () => {
  validateEmail()
  if (emailError.value) return

  isLoading.value = true
  globalError.value = ''

  try {
    // Appelle le service existant — même message succès quelle que soit la réponse (anti user enumeration)
    await resetPassword(email.value)
    submitted.value = true
  } catch {
    // Afficher une erreur générique uniquement en cas de panne réseau
    globalError.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>
