<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="mb-2 md:mb-8 md:block hidden">
        <h1 class="text-xl md:text-4xl font-bold mb-2">Liste des ONGs</h1>
        <p class="text-muted-foreground text-sm md:text-lg">Découvrez et rejoignez les organisations à but non lucratif</p>
      </div>
      <ClientOnly>
        <OngList />
        <template #fallback>
          <div class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p class="mt-4 text-muted-foreground">Chargement des ONGs...</p>
          </div>
        </template>
      </ClientOnly>
    </main>
    <Footer />
  </div>
</template>



<script setup lang="ts" client:only>
import { onMounted } from 'vue'
import OngList  from "../features/ong/components/OngList.client.vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.client.vue"

// Meta tags pour SEO
useHead({
  title: 'ONGs - Paika',
  meta: [
    { name: 'description', content: 'Découvrez les organisations à but non lucratif et rejoignez leurs projets' },
    { name: 'keywords', content: 'ONG, bénévolat, associations, projets sociaux' }
  ]
})

</script>