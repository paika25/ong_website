<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 bg-background relative">
    <NuxtLink
      to="/"
      class="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform">
        <path d="m12 19-7-7 7-7"/>
        <path d="M19 12H5"/>
      </svg>
      <span>Retour à l'accueil</span>
    </NuxtLink>

    <ClientOnly>
      <AuthForgotPassword @back-to-login="navigateTo('/auth/login')" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AuthForgotPassword from '~/features/auth/components/ForgotPassword.client.vue'

definePageMeta({
  middleware: ['guest-client']
})
</script>
