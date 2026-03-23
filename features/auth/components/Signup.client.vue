<template>
  <div class="max-w-lg mx-auto p-6 bg-card rounded-xl border border-border">
    <h2 class="text-2xl font-bold text-center mb-2">Créer un compte</h2>
    <p class="text-sm text-muted-foreground text-center mb-6">
      Rejoignez notre communauté et commencez à contribuer
    </p>
    
    <!-- Succès modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card p-8 rounded-xl max-w-md mx-4 text-center border border-border">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Inscription réussie !</h3>
        <p class="text-muted-foreground mb-4">
          Un email de confirmation a été envoyé à <strong>{{ form.email }}</strong>. 
          Veuillez vérifier votre boîte mail pour activer votre compte.
        </p>
        <UButton color="primary" @click="goToLogin">
          Aller à la connexion
        </UButton>
      </div>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-5">
      <!-- Sélection du type de compte -->
      <div>
        <label class="block text-sm font-medium mb-3">Type de compte</label>
        <div class="grid grid-cols-2 gap-4">
          <div
            @click="form.accountType = 'user_partner'"
            :class="[
              'p-4 border rounded-lg cursor-pointer transition-all',
              form.accountType === 'user_partner' 
                ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                : 'border-border hover:border-primary/50'
            ]"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium">Partenaire</p>
                <p class="text-xs text-muted-foreground">Donateur / Bénévole</p>
              </div>
            </div>
          </div>

          <div
            @click="form.accountType = 'user_agent'"
            :class="[
              'p-4 border rounded-lg cursor-pointer transition-all',
              form.accountType === 'user_agent' 
                ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                : 'border-border hover:border-primary/50'
            ]"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium">Agent ONG</p>
                <p class="text-xs text-muted-foreground">Gestionnaire ONG</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations de base -->
      <div class="grid grid-cols-2 gap-4">
        <UFormGroup 
          label="Prénom" 
          :error="errors.firstName"
        >
          <UInput
            v-model="form.firstName"
            placeholder="Jean"
            :color="errors.firstName ? 'red' : 'primary'"
          />
        </UFormGroup>

        <UFormGroup 
          label="Nom" 
          :error="errors.lastName"
        >
          <UInput
            v-model="form.lastName"
            placeholder="Dupont"
            :color="errors.lastName ? 'red' : 'primary'"
          />
        </UFormGroup>
      </div>

      <!-- Email -->
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

      <!-- Mots de passe -->
      <div class="grid grid-cols-2 gap-4">
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

        <UFormGroup 
          label="Confirmer" 
          :error="errors.confirmPassword"
          required
        >
          <UInput
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            :color="errors.confirmPassword ? 'red' : 'primary'"
          />
        </UFormGroup>
      </div>

      <!-- Indicateur de force du mot de passe -->
      <div v-if="form.password" class="space-y-2">
        <div class="flex gap-1">
          <div 
            v-for="i in 4" 
            :key="i"
            :class="[
              'h-1 flex-1 rounded-full transition-colors',
              i <= passwordStrengthLevel ? passwordStrengthColors[passwordStrengthLevel - 1] : 'bg-muted'
            ]"
          />
        </div>
        <p class="text-xs text-muted-foreground">
          Force: {{ passwordStrengthLabels[passwordStrengthLevel - 1] || 'Très faible' }}
        </p>
      </div>

      <!-- Informations optionnelles (accordion) -->
      <div class="border rounded-lg border-border">
        <button
          type="button"
          @click="showOptional = !showOptional"
          class="flex items-center justify-between w-full p-4 text-left"
        >
          <span class="font-medium">Informations supplémentaires (optionnel)</span>
          <svg 
            :class="['w-5 h-5 transition-transform', showOptional ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div v-if="showOptional" class="px-4 pb-4 space-y-4 border-t border-border">
          <!-- Nom d'entreprise (visible pour agents) -->
          <UFormGroup 
            v-if="form.accountType === 'user_agent'"
            label="Nom de l'organisation"
          >
            <UInput
              v-model="form.companyName"
              placeholder="Nom de votre ONG"
            />
          </UFormGroup>

          <!-- Bio -->
          <UFormGroup label="Bio">
            <UTextarea
              v-model="form.bio"
              placeholder="Parlez-nous de vous..."
              :rows="3"
            />
          </UFormGroup>

          <!-- Localisation -->
          <UFormGroup label="Localisation">
            <UInput
              v-model="form.location"
              placeholder="Paris, France"
            />
          </UFormGroup>

          <!-- Site web -->
          <UFormGroup label="Site web">
            <UInput
              v-model="form.website"
              placeholder="https://www.monsite.com"
            />
          </UFormGroup>
        </div>
      </div>

      <!-- Conditions d'utilisation -->
      <div class="flex items-start gap-2">
        <UCheckbox
          v-model="form.acceptTerms"
          class="mt-1"
        />
        <label class="text-sm text-muted-foreground">
          J'accepte les 
          <NuxtLink to="/terms" class="text-primary hover:underline">conditions d'utilisation</NuxtLink>
          et la 
          <NuxtLink to="/privacy" class="text-primary hover:underline">politique de confidentialité</NuxtLink>
        </label>
      </div>
      <p v-if="errors.acceptTerms" class="text-sm text-red-500">{{ errors.acceptTerms }}</p>

      <!-- Erreur globale -->
      <div v-if="globalError" class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
        {{ globalError }}
      </div>

      <!-- Bouton de soumission -->
      <UButton
        type="submit"
        block
        size="lg"
        :loading="isLoading"
        :disabled="!isFormValid"
      >
        Créer mon compte
      </UButton>

      <!-- Lien vers connexion -->
      <div class="text-center">
        <span class="text-sm text-muted-foreground">
          Vous avez déjà un compte ?
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
import { ref, reactive, computed, watch } from 'vue'
import { useAuthService } from '../services/authService'
import type { SignUpData } from '../types/auth.types'

const emit = defineEmits(['switch-to-login', 'signup-success'])

const { signUp } = useAuthService()

// Form state
const form = reactive({
  accountType: 'user_partner' as 'user_partner' | 'user_agent',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  bio: '',
  location: '',
  website: '',
  acceptTerms: false
})

// UI state
const showPassword = ref(false)
const showOptional = ref(false)
const isLoading = ref(false)
const showSuccessModal = ref(false)
const globalError = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

// Password strength
const passwordStrengthLabels = ['Faible', 'Moyen', 'Bon', 'Excellent']
const passwordStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']

const passwordStrengthLevel = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  return strength
})

// Validation
const validateForm = () => {
  const newErrors: Record<string, string> = {}
  
  // Email
  if (!form.email) {
    newErrors.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Email invalide'
  }
  
  // Password
  if (!form.password) {
    newErrors.password = 'Le mot de passe est requis'
  } else if (form.password.length < 8) {
    newErrors.password = 'Minimum 8 caractères'
  }
  
  // Confirm password
  if (!form.confirmPassword) {
    newErrors.confirmPassword = 'Confirmation requise'
  } else if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
  }
  
  // Accept terms
  if (!form.acceptTerms) {
    newErrors.acceptTerms = 'Vous devez accepter les conditions'
  }
  
  // Website format
  if (form.website && !/^https?:\/\//.test(form.website)) {
    form.website = 'https://' + form.website
  }
  
  return newErrors
}

const isFormValid = computed(() => {
  return form.email && 
         form.password && 
         form.password === form.confirmPassword && 
         form.acceptTerms &&
         Object.keys(errors.value).length === 0
})

// Watch for validation
watch(form, () => {
  errors.value = validateForm()
  globalError.value = null
}, { deep: true })

// Handle signup
const handleSignup = async () => {
  const validationErrors = validateForm()
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  isLoading.value = true
  globalError.value = null

  try {
    const signUpData: SignUpData = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      accountType: form.accountType,
      firstName: form.firstName.trim() || null,
      lastName: form.lastName.trim() || null,
      companyName: form.companyName.trim() || null,
      bio: form.bio.trim() || null,
      location: form.location.trim() || null,
      website: form.website.trim() || null
    }

    console.log('📝 Données inscription:', signUpData)

    const result = await signUp(signUpData)

    if (result.error) {
      globalError.value = result.error
      return
    }

    if (result.user) {
      console.log('✅ Inscription réussie:', result.user)
      
      if (result.needsEmailVerification) {
        showSuccessModal.value = true
      } else {
        emit('signup-success', result.user)
      }
    }
  } catch (err: any) {
    console.error('❌ Erreur inscription:', err)
    globalError.value = err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  showSuccessModal.value = false
  emit('switch-to-login')
}
</script>