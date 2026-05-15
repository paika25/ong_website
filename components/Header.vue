<template>
  <header class="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
    <div class="container mx-auto px-4 h-14 flex items-center gap-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 21s-7-4.978-10-8.2C-1.02 9.17 3.03 3 7.5 6.5 9.6 8.34 12 10.2 12 10.2s2.4-1.86 4.5-3.7C20.97 3 25.02 9.17 22 12.8 19 16.022 12 21 12 21z"/>
        </svg>
        <span class="font-bold text-primary text-lg hidden sm:inline">ONG Platform</span>
      </NuxtLink>

      <div class="flex-1" />

      <ClientOnly>
        <UserHeader />
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import UserHeader from '../features/auth/components/UserHeader.client.vue'
</script>
