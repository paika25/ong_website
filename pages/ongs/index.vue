<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />

    <!-- En-tête de page -->
    <section class="border-b border-border bg-card/50">
      <div class="container mx-auto px-4 max-w-6xl py-10">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p class="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Marketplace</p>
            <h1 class="text-3xl font-bold mb-1">Toutes les ONGs</h1>
            <p class="text-sm text-muted-foreground">
              Organisations certifiées, vérifiées et actives sur la plateforme Paika
            </p>
          </div>
          <NuxtLink to="/auth/signup">
            <UButton variant="outline" icon="i-heroicons-building-office-2">
              Inscrire mon ONG
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Liste complète -->
    <main class="flex-1 container mx-auto px-4 max-w-6xl py-8">
      <ClientOnly>
        <OngList />
        <template #fallback>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <USkeleton v-for="i in 6" :key="i" class="h-80 rounded-xl" />
          </div>
        </template>
      </ClientOnly>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import OngList from '~/features/ong/components/OngList.client.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.client.vue'

definePageMeta({ layout: false })

useHead({
  title: 'ONGs certifiées — Paika',
  meta: [
    { name: 'description', content: 'Découvrez toutes les organisations certifiées sur Paika. Filtrez par cause, localisation et score de transparence.' },
  ],
})
</script>
