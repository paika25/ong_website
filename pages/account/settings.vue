<template>
  <main class="container mx-auto px-4 py-8 max-w-2xl">
      <div class="mb-6">
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au dashboard
        </NuxtLink>
      </div>

      <ClientOnly>
        <AuthAccountSettings />
      </ClientOnly>
  </main>
</template>

<script setup lang="ts">
import AuthAccountSettings from '~/features/auth/components/AccountSettings.client.vue'

definePageMeta({
  middleware: ['auth']
})
</script>
