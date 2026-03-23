<template>
  <div class="min-h-screen bg-background">
    <Header />

    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Retour au dashboard -->
      <NuxtLink to="/dashboard" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group">
        <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour au dashboard
      </NuxtLink>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-muted-foreground">Chargement de l'ONG...</p>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center">
        <svg class="w-12 h-12 text-destructive mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-xl font-semibold text-destructive mb-2">{{ error }}</h3>
        <p class="text-muted-foreground mb-4">Impossible de charger les informations de l'ONG.</p>
        <NuxtLink to="/dashboard">
          <UButton variant="outline">Retour au dashboard</UButton>
        </NuxtLink>
      </div>

      <!-- Contenu -->
      <div v-else-if="ong">
        <!-- Header page -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold mb-1">Gérer mon ONG</h1>
            <p class="text-muted-foreground">Modifiez les informations de <span class="font-medium text-foreground">{{ ong.name }}</span></p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              ong.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            ]"
          >
            {{ ong.status === 'active' ? '● Active' : '● En attente' }}
          </span>
        </div>

        <!-- Formulaire réutilisable -->
        <OwnOngForm
          ref="formRef"
          mode="edit"
          :initial-data="ong"
          :saving="saving"
          @submit="saveChanges"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { getOngById, updateOng } from '~/features/ong/services/ongService'
import type { ONG } from '~/features/ong/type'
import type { OngFormData } from '~/features/ong/components/OwnOngForm.vue'
import OwnOngForm from '~/features/ong/components/OwnOngForm.vue'

definePageMeta({
  middleware: ['auth-client', 'agent-only-client']
})

const route = useRoute()
const ongId = route.params.id as string

// États
const ong = ref<ONG | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formRef = ref<InstanceType<typeof OwnOngForm> | null>(null)

// Sauvegarde
async function saveChanges(formData: OngFormData) {
  saving.value = true

  try {
    const result = await updateOng(ongId, formData)

    if (!result.success) {
      console.error('❌ Erreur updateOng:', result.error)
      alert('Erreur lors de la sauvegarde : ' + result.error)
      return
    }

    // Upload de l'image principale si un fichier a été sélectionné
    if (formRef.value?.hasPendingImage()) {
      const imageUrl = await formRef.value.uploadImage(ongId)
      if (imageUrl && result.data) {
        result.data.image = imageUrl
      }
    }

    // Upload des documents en attente
    if (formRef.value?.hasPendingDocuments()) {
      await formRef.value.uploadDocuments(ongId)
    }

    // Mettre à jour la référence locale avec les données retournées par Supabase
    ong.value = result.data

    // Notifier le formulaire que le save est réussi (reset du snapshot)
    formRef.value?.onSaved()

    console.log('✅ ONG mise à jour avec succès')
    alert('Modifications enregistrées avec succès !')
  } catch (err) {
    console.error('❌ Erreur sauvegarde:', err)
    alert('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

// Chargement des données
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const data = await getOngById(ongId)

    if (!data) {
      error.value = 'ONG introuvable'
      return
    }

    ong.value = data
  } catch (err) {
    console.error('❌ Erreur chargement ONG:', err)
    error.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
})
</script>
