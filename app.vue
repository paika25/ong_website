<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<script setup lang="ts">
// Configuration globale pour l'application Nuxt
useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})
</script>