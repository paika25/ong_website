<template>
  <div class="min-h-screen bg-background">
    <Header />
    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <ClientOnly>
        <Profil />
        <template #fallback>
          <div class="space-y-4">
            <USkeleton class="h-56 w-full rounded-2xl" />
            <div class="grid grid-cols-3 gap-4">
              <USkeleton v-for="i in 3" :key="i" class="h-20 rounded-xl" />
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Profil from '@/features/user/components/Profil.client.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.client.vue'

definePageMeta({ layout: false, middleware: ['auth'] })
</script>
