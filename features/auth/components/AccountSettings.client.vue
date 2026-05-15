<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Paramètres du compte</h1>

    <!-- ── Section email ──────────────────────────────────────── -->
    <div class="bg-card rounded-xl border border-border p-6 space-y-4">
      <h2 class="text-lg font-semibold">Adresse email</h2>
      <p class="text-sm text-muted-foreground">
        Email actuel : <span class="font-medium text-foreground">{{ currentEmail }}</span>
      </p>

      <form @submit.prevent="handleEmailUpdate" class="space-y-4">
        <UFormGroup label="Nouvelle adresse email" :error="emailErrors.email" required>
          <UInput
            v-model="emailForm.newEmail"
            type="email"
            placeholder="nouvelle@adresse.com"
            :color="emailErrors.email ? 'red' : 'primary'"
            @blur="validateEmailField"
          />
        </UFormGroup>

        <div v-if="emailStatus.message" :class="['p-3 rounded-lg text-sm', emailStatus.success ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400']">
          {{ emailStatus.message }}
        </div>

        <UButton type="submit" :loading="emailStatus.loading" :disabled="emailStatus.loading">
          Changer l'email
        </UButton>
      </form>
    </div>

    <!-- ── Section mot de passe ───────────────────────────────── -->
    <div class="bg-card rounded-xl border border-border p-6 space-y-4">
      <h2 class="text-lg font-semibold">Mot de passe</h2>

      <form @submit.prevent="handlePasswordUpdate" class="space-y-4">
        <UFormGroup label="Mot de passe actuel" :error="pwErrors.current" required>
          <UInput
            v-model="pwForm.current"
            type="password"
            placeholder="••••••••"
            :color="pwErrors.current ? 'red' : 'primary'"
            @blur="() => { if (pwForm.current) pwErrors.current = '' }"
          />
        </UFormGroup>

        <UFormGroup label="Nouveau mot de passe" :error="pwErrors.newPw" required>
          <UInput
            v-model="pwForm.newPw"
            type="password"
            placeholder="••••••••"
            :color="pwErrors.newPw ? 'red' : 'primary'"
            @blur="validatePwField('newPw')"
          />
        </UFormGroup>

        <UFormGroup label="Confirmer le nouveau mot de passe" :error="pwErrors.confirm" required>
          <UInput
            v-model="pwForm.confirm"
            type="password"
            placeholder="••••••••"
            :color="pwErrors.confirm ? 'red' : 'primary'"
            @blur="validatePwField('confirm')"
          />
        </UFormGroup>

        <div v-if="pwStatus.message" :class="['p-3 rounded-lg text-sm', pwStatus.success ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400']">
          {{ pwStatus.message }}
        </div>

        <UButton type="submit" :loading="pwStatus.loading" :disabled="pwStatus.loading">
          Changer le mot de passe
        </UButton>
      </form>
    </div>

    <!-- ── Section déconnexion globale ───────────────────────── -->
    <div class="bg-card rounded-xl border border-border p-6 space-y-4">
      <h2 class="text-lg font-semibold">Sessions actives</h2>
      <p class="text-sm text-muted-foreground">
        Déconnectez tous les appareils sur lesquels votre compte est actuellement connecté.
      </p>

      <div v-if="signOutError" class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
        {{ signOutError }}
      </div>

      <UButton
        color="red"
        variant="outline"
        :loading="signOutLoading"
        @click="handleGlobalSignOut"
      >
        Se déconnecter de tous les appareils
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthService } from '~/features/auth/services/authService'
import { useAuthStore } from '~/features/auth/stores/auth.client'

const { updateEmail, verifyAndUpdatePassword, signOut } = useAuthService()
const authStore = useAuthStore()

const currentEmail = computed(() => authStore.currentUser?.email ?? '')

// ── Email ────────────────────────────────────────────────────────
const emailForm = reactive({ newEmail: '' })
const emailErrors = reactive({ email: '' })
const emailStatus = reactive({ loading: false, message: '', success: false })

const validateEmailField = () => {
  if (!emailForm.newEmail) {
    emailErrors.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail)) {
    emailErrors.email = 'Format d\'email invalide'
  } else if (emailForm.newEmail === currentEmail.value) {
    emailErrors.email = 'Cette adresse est déjà utilisée'
  } else {
    emailErrors.email = ''
  }
}

const handleEmailUpdate = async () => {
  validateEmailField()
  if (emailErrors.email) return

  emailStatus.loading = true
  emailStatus.message = ''

  const { error } = await updateEmail(emailForm.newEmail)

  emailStatus.loading = false
  if (error) {
    emailStatus.success = false
    emailStatus.message = error
  } else {
    emailStatus.success = true
    emailStatus.message = `Un email de confirmation a été envoyé à ${emailForm.newEmail}. Cliquez sur le lien pour valider le changement.`
    emailForm.newEmail = ''
  }
}

// ── Mot de passe ─────────────────────────────────────────────────
const pwForm = reactive({ current: '', newPw: '', confirm: '' })
const pwErrors = reactive({ current: '', newPw: '', confirm: '' })
const pwStatus = reactive({ loading: false, message: '', success: false })

const validatePwField = (field: 'newPw' | 'confirm') => {
  if (field === 'newPw') {
    if (!pwForm.newPw) {
      pwErrors.newPw = 'Le nouveau mot de passe est requis'
    } else if (pwForm.newPw.length < 8) {
      pwErrors.newPw = 'Au moins 8 caractères'
    } else {
      pwErrors.newPw = ''
    }
    if (pwForm.confirm) validatePwField('confirm')
  }
  if (field === 'confirm') {
    if (!pwForm.confirm) {
      pwErrors.confirm = 'La confirmation est requise'
    } else if (pwForm.confirm !== pwForm.newPw) {
      pwErrors.confirm = 'Les mots de passe ne correspondent pas'
    } else {
      pwErrors.confirm = ''
    }
  }
}

const handlePasswordUpdate = async () => {
  // on-submit : révèle tous les invalides (UX-DR22)
  if (!pwForm.current) pwErrors.current = 'Le mot de passe actuel est requis'
  validatePwField('newPw')
  validatePwField('confirm')

  if (pwErrors.current || pwErrors.newPw || pwErrors.confirm) return

  pwStatus.loading = true
  pwStatus.message = ''

  const { error } = await verifyAndUpdatePassword(
    currentEmail.value,
    pwForm.current,
    pwForm.newPw
  )

  pwStatus.loading = false
  if (error) {
    pwStatus.success = false
    pwStatus.message = error
    if (error.includes('actuel')) pwErrors.current = error
  } else {
    pwStatus.success = true
    pwStatus.message = 'Mot de passe modifié avec succès.'
    pwForm.current = ''
    pwForm.newPw = ''
    pwForm.confirm = ''
  }
}

// ── Déconnexion globale ──────────────────────────────────────────
const signOutLoading = ref(false)
const signOutError = ref('')

const handleGlobalSignOut = async () => {
  signOutLoading.value = true
  signOutError.value = ''

  const { error } = await signOut(true) // global = true

  if (error) {
    signOutLoading.value = false
    signOutError.value = error
    return
  }

  authStore.setDisconnected()
  await navigateTo('/auth/login')
}
</script>
