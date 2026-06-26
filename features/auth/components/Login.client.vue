<template>
  <div class="w-full">
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-1.5">Bon retour</h2>
      <p class="text-muted-foreground text-sm">Connectez-vous à votre espace Paika.</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">

      <!-- Champs dans une section encadrée -->
      <div class="rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3.5 border-b border-border">
          <UFormGroup label="Adresse email" :error="errors.email" required>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="votre@email.com"
              :color="errors.email ? 'red' : 'primary'"
            />
          </UFormGroup>
        </div>
        <div class="px-4 py-3.5">
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
                  @click="showPassword = !showPassword"
                  :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  color="gray"
                />
              </template>
            </UInput>
          </UFormGroup>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <UCheckbox v-model="form.rememberMe" label="Se souvenir de moi" />
        <UButton variant="link" size="xs" color="primary" @click="$emit('forgot-password')">
          Mot de passe oublié ?
        </UButton>
      </div>

      <UAlert
        v-if="globalError"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        :description="globalError"
      />

      <UButton
        type="submit"
        block
        size="lg"
        :loading="isLoading"
        :disabled="!isFormValid"
        icon="i-heroicons-arrow-right-on-rectangle"
      >
        Se connecter
      </UButton>

      <p class="text-center text-sm text-muted-foreground">
        Pas encore de compte ?
        <UButton variant="link" size="sm" color="primary" class="font-medium" @click="$emit('switch-to-signup')">
          Créer un compte
        </UButton>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthValidation } from '../composables/useAuthValidation'
import { useAuthService } from '../services/authService'
import { ref, reactive, computed, watch } from 'vue'
import type { LoginCredentials } from '../types/auth.types'

const emit = defineEmits(['switch-to-signup', 'forgot-password', 'login-success'])

const { validateLogin } = useAuthValidation()
const { signIn } = useAuthService()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const globalError = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  return form.email && form.password && Object.keys(errors.value).length === 0
})

watch(form, () => {
  errors.value = validateLogin(form)
  globalError.value = null
}, { deep: true })

const handleLogin = async () => {
  const validationErrors = validateLogin(form)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  isLoading.value = true
  globalError.value = null

  try {
    const credentials: LoginCredentials = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      rememberMe: form.rememberMe
    }

    console.log('🔐 Tentative de connexion:', credentials.email)

    const result = await signIn(credentials)

    if (result.error) {
      globalError.value = result.error
      return
    }

    if (result.user) {
      console.log('✅ Connexion réussie:', result.user.email)
      emit('login-success', { user: result.user })
    }
  } catch (error: any) {
    console.error('❌ Erreur de connexion:', error)
    globalError.value = error.message || 'Erreur de connexion'
  } finally {
    isLoading.value = false
  }
}
</script>