<template>
  <div class="min-h-screen flex-col">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8">
      <ClientOnly>
        <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-muted-foreground">Chargement de l'ONG...</p>
          </div>
        </div>
        
        <div v-else-if="error" class="text-center py-12">
          <Icon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 class="text-2xl font-bold mb-2">ONG introuvable</h2>
          <p class="text-muted-foreground mb-6">{{ error }}</p>
          <UButton @click="handleBack">
            Retour à la liste
          </UButton>
        </div>

        <div v-else-if="ong" class="py-12">
          <button @click="handleBack" aria-label="Retour" class="inline-flex items-center text-primary hover:text-primary-700 mb-6 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" role="img" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Retour à la liste</span>
          </button>
          <div class="text-center">
            <OngDetail  :ong="ong" />
          </div>
        </div>
        
      </ClientOnly>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import OngDetail from '~/features/ong/components/OngDetail.client.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.client.vue'
import { getOngById } from '@/features/ong/services/ongService'
import { onMounted, ref } from 'vue'
import type { ONG } from '@/features/ong/type'
import { useRoute } from '#app'

const ong = ref<ONG | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const route = useRoute()

const handleBack = () => {
  navigateTo('/')
}

// ✅ Charger les données côté client uniquement pour éviter SSR
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Récupérer l'ID depuis la route Nuxt (SSR-safe)
    const id = route.params.id as string
    
    if (!id) {
      error.value = 'ID de l\'ONG manquant'
      return
    }
    
    const result = await getOngById(id)
    
    if (result) {
      ong.value = result
    } else {
      error.value = 'Cette ONG n\'existe pas'
    }
  } catch (e) {
    console.error('Erreur lors du chargement de l\'ONG:', e)
    error.value = 'Une erreur est survenue lors du chargement'
  } finally {
    isLoading.value = false
  }
})
</script>
