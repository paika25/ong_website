<template>
  <main class="container mx-auto px-4 py-8 max-w-4xl">
      <NuxtLink to="/ong-dashboard" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group">
        <Icon name="i-heroicons-arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Retour à mon espace ONG
      </NuxtLink>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p class="text-muted-foreground">Chargement de l'ONG...</p>
        </div>
      </div>

      <UAlert
        v-else-if="loadError"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        :title="loadError"
      >
        <template #actions>
          <NuxtLink to="/ong-dashboard">
            <UButton variant="outline" size="xs">Retour à mon espace ONG</UButton>
          </NuxtLink>
        </template>
      </UAlert>

      <div v-else-if="ong">
        <PageHeader title="Gérer mon ONG" class="mb-8">
          <template #subtitle>
            Modifiez les informations de <span class="font-medium text-foreground">{{ ong.name }}</span>
          </template>
          <template #actions>
            <NuxtLink :to="`/dashboard/agent/ong/visibility`">
              <UButton variant="outline" size="sm">
                Configurer la visibilité
              </UButton>
            </NuxtLink>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                ong.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
              ]"
            >
              {{ ong.status === 'active' ? '● Active' : '● En attente' }}
            </span>
          </template>
        </PageHeader>

        <OwnOngForm
          ref="formRef"
          mode="edit"
          :initial-data="ong"
          :saving="saving"
          @submit="saveChanges"
        />
      </div>
  </main>
</template>

<script setup lang="ts">
import { getOngById, updateOng } from '~/features/ong/services/ongService'
import type { ONG } from '~/features/ong/type'
import type { OngFormData } from '~/features/ong/components/OwnOngForm.vue'
import OwnOngForm from '~/features/ong/components/OwnOngForm.vue'

definePageMeta({
  middleware: ['auth', 'agent-only']
})

const route   = useRoute()
const ongId   = route.params.id as string
const toast   = useToast()

const ong      = ref<ONG | null>(null)
const loading  = ref(true)
const saving   = ref(false)
const loadError = ref<string | null>(null)
const formRef  = ref<InstanceType<typeof OwnOngForm> | null>(null)

async function saveChanges(formData: OngFormData) {
  saving.value = true
  try {
    const result = await updateOng(ongId, formData)

    if (!result.success) {
      toast.add({ title: 'Erreur', description: result.error ?? 'Erreur lors de la sauvegarde', color: 'red', timeout: 5000 })
      return
    }

    if (formRef.value?.hasPendingImage()) {
      const imageUrl = await formRef.value.uploadImage(ongId)
      if (imageUrl && result.data) result.data.image = imageUrl
    }

    if (formRef.value?.hasPendingDocuments()) {
      await formRef.value.uploadDocuments(ongId)
    }

    ong.value = result.data
    formRef.value?.onSaved()

    toast.add({ title: 'Modifications enregistrées', color: 'green', timeout: 4000 })
  } catch (err: any) {
    toast.add({ title: 'Erreur inattendue', description: err.message, color: 'red', timeout: 5000 })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const data = await getOngById(ongId)
    if (!data) { loadError.value = 'ONG introuvable'; return }
    ong.value = data
  } catch {
    loadError.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
})
</script>
