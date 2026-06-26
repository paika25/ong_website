<template>
  <div class="min-h-screen flex">

    <!-- Panneau gauche : brand -->
    <div class="hidden md:flex md:w-[42%] bg-primary flex-col justify-between p-10 relative overflow-hidden">
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5" />
      <div class="absolute -bottom-40 -right-40 w-[580px] h-[580px] rounded-full bg-white/5" />
      <div class="absolute inset-0 opacity-[0.04]" style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 40px 40px;" />

      <div class="relative z-10 flex-1 flex flex-col justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name="i-heroicons-heart" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-white text-lg tracking-tight">Paika</span>
        </div>

        <div class="space-y-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-medium mb-6">
              <Icon name="i-heroicons-user-group" class="w-3.5 h-3.5" />
              +120 ONGs déjà présentes
            </div>
            <h2 class="text-3xl font-bold text-white leading-tight mb-4">
              Rejoignez<br>l'écosystème du<br>financement solidaire
            </h2>
            <p class="text-white/65 text-sm leading-relaxed max-w-xs">
              En quelques minutes, créez votre compte et accédez à un réseau d'organisations certifiées.
            </p>
          </div>

          <!-- Étapes -->
          <div class="space-y-5">
            <div v-for="step in steps" :key="step.num" class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white font-bold text-sm mt-0.5">
                {{ step.num }}
              </div>
              <div>
                <p class="text-white font-semibold text-sm">{{ step.title }}</p>
                <p class="text-white/55 text-xs mt-0.5 leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Témoignage -->
          <div class="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10">
            <div class="flex gap-0.5 mb-3">
              <Icon v-for="i in 5" :key="i" name="i-heroicons-star" class="w-3.5 h-3.5 text-yellow-300" />
            </div>
            <p class="text-white/85 text-sm leading-relaxed italic">
              "Paika nous a permis de structurer notre financement et d'attirer des bailleurs institutionnels en moins de 3 mois."
            </p>
            <div class="flex items-center gap-2.5 mt-4">
              <div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">M</div>
              <div>
                <p class="text-white/80 text-xs font-medium">Marie R.</p>
                <p class="text-white/45 text-xs">Directrice, ONG Éducation Madagascar</p>
              </div>
            </div>
          </div>
        </div>

        <p class="text-white/25 text-xs">© 2025 Paika · Tous droits réservés</p>
      </div>
    </div>

    <!-- Panneau droit : formulaire scrollable -->
    <div class="flex-1 flex flex-col items-center px-8 py-10 bg-background overflow-y-auto">

      <!-- Logo (mobile only) -->
      <div class="md:hidden flex items-center gap-2.5 mb-8 self-start">
        <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name="i-heroicons-heart" class="w-5 h-5 text-primary" />
        </div>
        <span class="font-bold text-xl tracking-tight">Paika</span>
      </div>

      <div class="w-full max-w-xl">
        <!-- En-tête form -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-1.5">Créer un compte</h1>
          <p class="text-muted-foreground text-sm">
            Rejoignez la plateforme de référence pour le financement des ONGs.
          </p>
        </div>

        <AuthSignup
          @signup-success="onSignupSuccess"
          @switch-to-login="onSwitchToLogin"
        />
      </div>

      <NuxtLink
        to="/"
        class="mt-8 mb-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Retour à l'accueil
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import AuthSignup from '~/features/auth/components/Signup.client.vue'
import type { User } from '~/features/auth/types/auth.types'

definePageMeta({ layout: false, middleware: ['guest-client'] })

const steps = [
  { num: 1, title: 'Choisissez votre profil',     desc: 'Bailleur institutionnel ou agent d\'ONG.' },
  { num: 2, title: 'Renseignez vos informations',  desc: 'Identité, organisation et justificatif de mandat.' },
  { num: 3, title: 'Confirmation par email',        desc: 'Lien sécurisé envoyé à votre adresse.' },
]

const onSignupSuccess = async (user: User) => {
  const { useAuthStore } = await import('~/features/auth/stores/auth.client')
  const authStore = useAuthStore()
  authStore.setUser(user)
  await navigateTo('/dashboard')
}

const onSwitchToLogin = () => navigateTo('/auth/login')
</script>
