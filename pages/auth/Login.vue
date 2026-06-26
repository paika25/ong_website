<template>
  <div class="min-h-screen flex">

    <!-- Panneau gauche : brand -->
    <div class="hidden md:flex md:w-[45%] bg-primary flex-col justify-between p-10 relative overflow-hidden">
      <!-- Cercles décoratifs -->
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5" />
      <div class="absolute -bottom-40 -right-40 w-[580px] h-[580px] rounded-full bg-white/5" />
      <div class="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-white/[0.04]" />

      <!-- Grid décoratif -->
      <div class="absolute inset-0 opacity-[0.04]" style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 40px 40px;" />

      <div class="relative z-10 flex-1 flex flex-col justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name="i-heroicons-heart" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-white text-lg tracking-tight">Paika</span>
        </div>

        <!-- Texte principal -->
        <div class="space-y-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-medium mb-6">
              <Icon name="i-heroicons-shield-check" class="w-3.5 h-3.5" />
              Plateforme certifiée & sécurisée
            </div>

            <h2 class="text-4xl font-bold text-white leading-tight mb-4">
              Financez les projets<br>qui transforment<br>le monde
            </h2>
            <p class="text-white/65 text-sm leading-relaxed max-w-sm">
              Une plateforme transparente pour connecter bailleurs de fonds et organisations à impact réel.
            </p>
          </div>

          <!-- Features -->
          <div class="space-y-3.5">
            <div v-for="f in features" :key="f.title" class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Icon :name="f.icon" class="w-3 h-3 text-white" />
              </div>
              <span class="text-white/80 text-sm">{{ f.title }}</span>
            </div>
          </div>
        </div>

        <p class="text-white/25 text-xs">© 2025 Paika · Tous droits réservés</p>
      </div>
    </div>

    <!-- Panneau droit : formulaire -->
    <div class="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-background overflow-y-auto">

      <!-- Logo (mobile only) -->
      <div class="md:hidden mb-10 flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name="i-heroicons-heart" class="w-5 h-5 text-primary" />
        </div>
        <span class="font-bold text-xl tracking-tight">Paika</span>
      </div>

      <div class="w-full max-w-md">
        <ClientOnly>
          <AuthLogin
            @login-success="onLoginSuccess"
            @switch-to-signup="onSwitchToSignup"
            @forgot-password="onForgotPassword"
          />
        </ClientOnly>
      </div>

      <NuxtLink
        to="/"
        class="mt-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Retour à l'accueil
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import AuthLogin from '~/features/auth/components/Login.client.vue'
import { useAuthStore } from '~/features/auth/stores/auth.client'
import type { User } from '~/features/auth/types/auth.types'

definePageMeta({ layout: false, middleware: ['guest-client'] })

const route     = useRoute()
const authStore = useAuthStore()

const features = [
  { icon: 'i-heroicons-shield-check',      title: 'ONGs vérifiées et certifiées par notre équipe' },
  { icon: 'i-heroicons-chart-bar',         title: 'Score de transparence en temps réel' },
  { icon: 'i-heroicons-lock-closed',       title: 'Paiements chiffrés, commissions reversées' },
  { icon: 'i-heroicons-building-office-2', title: 'Bailleurs institutionnels et donateurs privés' },
]

const onLoginSuccess = async (payload: { user: User } | any) => {
  if (payload?.user) authStore.setUser(payload.user)
  else authStore.setConnected()
  const redirect = route.query.redirect as string
  await navigateTo(redirect || '/dashboard')
}

const onSwitchToSignup = () => navigateTo('/auth/signup')
const onForgotPassword = () => navigateTo('/auth/forgot')
</script>
