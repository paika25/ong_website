<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8">
      <ClientOnly>
        <Profil /> 
      </ClientOnly>
    </main>
  </div>
</template>

<script setup lang="ts">
import Profil from '@/features/user/components/Profil.vue'
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
</script>