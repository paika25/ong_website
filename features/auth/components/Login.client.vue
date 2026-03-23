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
                class="pointer-events-auto"
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

      <!-- Erreur globale -->
      <div v-if="globalError" class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
        {{ globalError }}
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