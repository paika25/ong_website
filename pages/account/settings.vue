<template>
  <main class="container mx-auto px-4 py-8 max-w-2xl">
      <div class="mb-6">
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
