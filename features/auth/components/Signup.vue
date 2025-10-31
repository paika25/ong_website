<template>
  <div class="max-w-md mx-auto p-6 bg-card rounded-xl border border-border">
    <h2 class="text-2xl font-bold text-center mb-6">Inscription</h2>
    
    <form @submit.prevent="handleSignup" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <UFormGroup 
          label="Prénom" 
          :error="errors.firstName"
          required
        >
          <UInput
            v-model="form.firstName"
            placeholder="John"
            :color="errors.firstName ? 'red' : 'primary'"
          />
        </UFormGroup>

        <UFormGroup 
          label="Nom" 
          :error="errors.lastName"
          required
        >
          <UInput
            v-model="form.lastName"
            placeholder="Doe"
            :color="errors.lastName ? 'red' : 'primary'"
          />
        </UFormGroup>
      </div>

      <UFormGroup 
        label="Email" 
        :error="errors.email"
        required
      >
        <UInput
          v-model="form.email"
          type="email"
          placeholder="votre@email.com"
          :color="errors.email ? 'red' : 'primary'"
        />
      </UFormGroup>

      <UFormGroup 
        label="Mot de passe" 
        :error="errors.password"
        required
      >
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
              @click="showPassword = !showPassword"
              :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              color="gray"
            />
          </template>
        </UInput>
        <template #hint>
          <div class="text-xs space-y-1 mt-2">
            <div :class="passwordStrength.minLength ? 'text-green-600' : 'text-red-600'">
              ✓ Au moins 8 caractères
            </div>
            <div :class="passwordStrength.hasUppercase ? 'text-green-600' : 'text-red-600'">
              ✓ Une majuscule
            </div>
            <div :class="passwordStrength.hasNumber ? 'text-green-600' : 'text-red-600'">
              ✓ Un chiffre
            </div>
          </div>
        </template>
      </UFormGroup>

      <UFormGroup 
        label="Confirmer le mot de passe" 
        :error="errors.confirmPassword"
        required
      >
        <UInput
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="••••••••"
          :color="errors.confirmPassword ? 'red' : 'primary'"
        >
          <template #trailing>
            <UButton
              variant="ghost"
              size="2xs"
              @click="showConfirmPassword = !showConfirmPassword"
              :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              color="gray"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UCheckbox
        v-model="form.acceptTerms"
        label="J'accepte les conditions d'utilisation"
        :error="errors.acceptTerms"
        required
      />

      <UButton
        type="submit"
        block
        :loading="isLoading"
        :disabled="!isFormValid"
      >
        S'inscrire
      </UButton>

      <div class="text-center">
        <span class="text-sm text-muted-foreground">
          Déjà un compte ?
        </span>
        <UButton
          variant="link"
          size="xs"
          color="primary"
          @click="$emit('switch-to-login')"
        >
          Se connecter
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthValidation } from '../composables/useAuthValidation'

const emit = defineEmits(['switch-to-login', 'signup-success'])

const { validateSignup, checkPasswordStrength } = useAuthValidation()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const passwordStrength = computed(() => checkPasswordStrength(form.password))

const isFormValid = computed(() => {
  return form.firstName && 
         form.lastName && 
         form.email && 
         form.password && 
         form.confirmPassword && 
         form.acceptTerms &&
         Object.keys(errors.value).length === 0
})

watch(form, () => {
  errors.value = validateSignup(form)
}, { deep: true })

const handleSignup = async () => {
  const validationErrors = validateSignup(form)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  isLoading.value = true
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Ici vous appelleriez votre service d'authentification
    // const response = await authService.signup(form)
    
    emit('signup-success', { 
      user: { 
        email: form.email, 
        firstName: form.firstName, 
        lastName: form.lastName 
      } 
    })
    
    // Redirection ou notification de succès
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
    // Afficher une notification d'erreur
  } finally {
    isLoading.value = false
  }
}
</script>