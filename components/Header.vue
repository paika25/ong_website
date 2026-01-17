<template>
      <!-- Header avec info utilisateur -->
    <header class="border-b border-border bg-card">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="items-center gap-4 hidden md:flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7-4.978-10-8.2C-1.02 9.17 3.03 3 7.5 6.5 9.6 8.34 12 10.2 12 10.2s2.4-1.86 4.5-3.7C20.97 3 25.02 9.17 22 12.8 19 16.022 12 21 12 21z"/>
          </svg>
          <NuxtLink to="/" class="text-2xl font-bold text-primary">
            ONG Platform
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4 w-full md:w-[500px] justify-end">
          
          <!-- Afficher l'utilisateur -->
          <ClientOnly>
            <UserHeader />
          </ClientOnly>
        </div>
      </div>
    </header>

</template>


<script setup lang="ts">
import UserHeader from '../features/auth/components/UserHeader.client.vue'
</script> 