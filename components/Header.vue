<template>
  <header class="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
    <div class="container mx-auto px-4 h-14 flex items-center gap-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <div class="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <Icon name="i-heroicons-heart" class="w-4 h-4 text-white" />
        </div>
        <span class="font-bold text-foreground text-lg tracking-tight">Paika</span>
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
