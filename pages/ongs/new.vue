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

      <!-- Header page -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-1">Créer mon ONG</h1>
        <p class="text-muted-foreground">Remplissez les informations de votre organisation</p>
      </div>

      <!-- Formulaire réutilisable -->
      <OwnOngForm
        ref="formRef"
        mode="create"
        :saving="saving"
        @submit="handleCreate"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { createOng } from '~/features/ong/services/ongService'
import type { OngFormData } from '~/features/ong/components/OwnOngForm.vue'
import OwnOngForm from '~/features/ong/components/OwnOngForm.vue'

definePageMeta({
  middleware: ['auth-client', 'agent-only-client']
})

const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
const saving = ref(false)
const formRef = ref<InstanceType<typeof OwnOngForm> | null>(null)

async function handleCreate(formData: OngFormData) {
  if (!user.value?.id) {
    alert('Utilisateur non connecté')
    return
  }

  saving.value = true

  try {
    const result = await createOng(user.value.id, formData)

    if (!result.success) {
      console.error('❌ Erreur createOng:', result.error)
      alert('Erreur lors de la création : ' + result.error)
      return
    }

    console.log('✅ ONG créée avec succès:', result.data?.name)
    alert('ONG créée avec succès ! 🎉')

    // Rediriger vers la page d'édition de la nouvelle ONG
    navigateTo(`/ongs/${result.data!.id}/edit`)
  } catch (err) {
    console.error('❌ Erreur création:', err)
    alert('Erreur lors de la création')
  } finally {
    saving.value = false
  }
}
</script>
