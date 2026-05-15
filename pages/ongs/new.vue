<template>
  <main class="container mx-auto px-4 py-8 max-w-4xl">
      <NuxtLink
        to="/dashboard"
        class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour au dashboard
      </NuxtLink>

      <div class="mb-8">
        <h1 class="text-2xl font-bold tracking-tight mb-1">Constituer mon dossier ONG</h1>
        <p class="text-sm text-muted-foreground">Complétez les 5 étapes pour soumettre votre dossier à validation</p>
      </div>

      <!-- Skeleton loader pendant la restauration Supabase -->
      <div v-if="restoring" class="space-y-4 animate-pulse">
        <div class="h-12 bg-muted rounded-xl" />
        <div class="h-80 bg-muted rounded-xl" />
      </div>

      <OngDossierStepper
        v-else
        :ong-id="existingOngId"
        :initial-step="initialStep"
        @step-change="onStepChange"
        @completed="onCompleted"
      />
  </main>
</template>

<script setup lang="ts">
import OngDossierStepper from '~/features/ong-profile/components/OngDossierStepper.vue'
import { getOwnerOng } from '~/features/ong/services'

definePageMeta({
  middleware: ['auth', 'agent-only']
})

const route = useRoute()
const router = useRouter()

const restoring = ref(true)
const existingOngId = ref<string | undefined>(undefined)
const initialStep = ref<string>((route.query.step as string) || 'identite')

onMounted(async () => {
  const ong = await getOwnerOng()
  if (ong?.id) {
    existingOngId.value = ong.id
  }
  restoring.value = false
})

function onStepChange(step: string) {
  router.replace({ query: { ...route.query, step } })
}

function onCompleted(_ongId: string) {
  navigateTo('/dashboard')
}
</script>
