<template>
  <div class="max-w-md mx-auto p-6 bg-card rounded-xl border border-border">
    <h2 class="text-2xl font-bold text-center mb-6">Connexion</h2>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
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
      </div>

      <div>
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
        </UFormGroup>
      </div>

      <div class="flex items-center justify-between">
        <UCheckbox
          v-model="form.rememberMe"
          label="Se souvenir de moi"
        />
        <UButton
          variant="link"
          size="xs"
          color="primary"
          @click="$emit('forgot-password')"
        >
          Mot de passe oublié ?
        </UButton>
      </div>

      <UButton
        type="submit"
        block
        :loading="isLoading"
        :disabled="!isFormValid"
      >
        Se connecter
      </UButton>

      <div class="text-center">
        <span class="text-sm text-muted-foreground">
          Pas encore de compte ?
        </span>
        <UButton
          variant="link"
          size="xs"
          color="primary"
          @click="$emit('switch-to-signup')"
        >
          S'inscrire
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthValidation } from '../composables/useAuthValidation'

const emit = defineEmits(['switch-to-signup', 'forgot-password', 'login-success'])

const { validateLogin } = useAuthValidation()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  return form.email && form.password && Object.keys(errors.value).length === 0
})

watch(form, () => {
  errors.value = validateLogin(form)
}, { deep: true })

const handleLogin = async () => {
  const validationErrors = validateLogin(form)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  isLoading.value = true
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Ici vous appelleriez votre service d'authentification
    // const response = await authService.login(form)
    
    emit('login-success', { user: { email: form.email } })
    
    // Redirection ou notification de succès
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('Erreur de connexion:', error)
    // Afficher une notification d'erreur
  } finally {
    isLoading.value = false
  }
}
</script>