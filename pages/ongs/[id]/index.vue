<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />

    <main class="flex-1">
      <ClientOnly>
        <!-- Loading -->
        <template v-if="isLoading">
          <div class="h-56 md:h-72 bg-muted animate-pulse" />
          <div class="container mx-auto px-4 max-w-6xl py-8">
            <div class="lg:grid lg:grid-cols-3 lg:gap-8">
              <div class="lg:col-span-2 space-y-4">
                <div class="flex gap-3 mb-6">
                  <USkeleton v-for="i in 4" :key="i" class="h-9 w-24 rounded-full" />
                </div>
                <USkeleton class="h-48 w-full rounded-2xl" />
                <USkeleton class="h-32 w-full rounded-2xl" />
              </div>
              <div class="mt-8 lg:mt-0 space-y-4">
                <USkeleton class="h-32 w-full rounded-2xl" />
                <USkeleton class="h-36 w-full rounded-2xl" />
                <USkeleton class="h-28 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </template>

        <!-- Erreur -->
        <template v-else-if="error || !ong">
          <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-6">
            <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Icon name="i-heroicons-building-office-2" class="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 class="text-xl font-bold mb-2">ONG introuvable</h2>
              <p class="text-muted-foreground text-sm max-w-xs">{{ error ?? 'Cette organisation n\'existe pas ou n\'est plus disponible.' }}</p>
            </div>
            <NuxtLink to="/ongs">
              <UButton icon="i-heroicons-arrow-left">Retour aux ONGs</UButton>
            </NuxtLink>
          </div>
        </template>

        <!-- Contenu -->
        <OngDetail v-else :ong="ong" :donation-status="donationStatus" />

        <template #fallback>
          <div class="h-56 md:h-72 bg-muted animate-pulse" />
        </template>
      </ClientOnly>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import OngDetail from '~/features/ong/components/OngDetail.client.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.client.vue'
import { fromSupabaseRow } from '~/features/ong/services/ong.mapper'
import type { ONG } from '~/features/ong/type'

definePageMeta({ layout: false })

const route = useRoute()
const ong = ref<ONG | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const donationStatus = computed(() => {
  const val = route.query.donation
  if (val === 'success') return 'success' as const
  if (val === 'cancelled') return 'cancelled' as const
  return null
})

useHead({
  title: computed(() => ong.value ? `${ong.value.name} — Paika` : 'ONG — Paika'),
})

onMounted(async () => {
  try {
    const id = route.params.id as string
    const supabase = useSupabase()
    const { data: { session } } = supabase
      ? await supabase.auth.getSession()
      : { data: { session: null } }
    const token = session?.access_token

    const raw = await $fetch<any>(`/api/ongs/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => null)

    ong.value = raw ? fromSupabaseRow(raw) : null
    if (!ong.value) error.value = 'Cette ONG n\'existe pas'
  } catch {
    error.value = 'Une erreur est survenue lors du chargement'
  } finally {
    isLoading.value = false
  }
})
</script>
