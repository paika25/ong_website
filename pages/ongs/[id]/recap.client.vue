<template>
  <div class="min-h-screen bg-white text-gray-900 print:bg-white">
    <!-- Barre actions (masquée à l'impression) -->
    <div class="print:hidden bg-background border-b border-border px-6 py-3 flex items-center justify-between">
      <NuxtLink :to="`/ongs/${ongId}`" class="text-sm text-muted-foreground hover:text-foreground">
        ← Retour au profil
      </NuxtLink>
      <UButton size="sm" @click="() => window.print()">
        Imprimer / Sauvegarder en PDF
      </UButton>
    </div>

    <!-- Contenu imprimable -->
    <main class="max-w-3xl mx-auto px-8 py-10 space-y-8">
      <!-- Skeleton loader -->
      <div v-if="loading" class="space-y-4 animate-pulse print:hidden">
        <div class="h-8 bg-gray-200 rounded w-1/2" />
        <div class="h-4 bg-gray-200 rounded w-3/4" />
        <div class="h-32 bg-gray-200 rounded" />
      </div>

      <template v-else-if="ong">
        <!-- En-tête -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ ong.name }}</h1>
              <p class="text-gray-500 mt-1">{{ ong.location }}</p>
            </div>
            <div class="text-right text-sm text-gray-400">
              <div>Récapitulatif dossier</div>
              <div>{{ formatDate(new Date().toISOString()) }}</div>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {{ ong.category }}
            </span>
            <span :class="['px-3 py-1 text-xs font-medium rounded-full', statusBadgeClass]">
              {{ statusLabel }}
            </span>
          </div>
        </div>

        <!-- Mission -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Mission</h2>
          <p class="text-gray-600 leading-relaxed">{{ ong.description || '—' }}</p>
        </section>

        <!-- Contacts -->
        <section v-if="ong.email || ong.phone || ong.website">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Contacts</h2>
          <dl class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <template v-if="ong.email">
              <dt class="text-gray-500">Email</dt>
              <dd class="text-gray-800">{{ ong.email }}</dd>
            </template>
            <template v-if="ong.phone">
              <dt class="text-gray-500">Téléphone</dt>
              <dd class="text-gray-800">{{ ong.phone }}</dd>
            </template>
            <template v-if="ong.website">
              <dt class="text-gray-500">Site web</dt>
              <dd class="text-gray-800">{{ ong.website }}</dd>
            </template>
          </dl>
        </section>

        <!-- Projets -->
        <section v-if="ong.projects?.length">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Projets ({{ ong.projects.length }})</h2>
          <div class="space-y-3">
            <div
              v-for="(projet, i) in ong.projects"
              :key="i"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-sm">{{ projet.title || projet.name }}</span>
                <span class="text-xs text-gray-400 capitalize">{{ projet.status }}</span>
              </div>
              <p v-if="projet.description" class="text-xs text-gray-500">{{ projet.description }}</p>
            </div>
          </div>
        </section>

        <!-- Pied de page -->
        <footer class="border-t border-gray-200 pt-6 text-xs text-gray-400 text-center">
          Récapitulatif généré le {{ formatDate(new Date().toISOString()) }} — Plateforme Paika
        </footer>
      </template>

      <div v-else class="text-center py-20 text-gray-400 print:hidden">
        ONG introuvable
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '~/features/ong/type'
import { getOngById } from '~/features/ong/services'

definePageMeta({
  layout: false,
  middleware: ['auth']
})

const route = useRoute()
const ongId = route.params.id as string

const loading = ref(true)
const ong = ref<ONG | null>(null)

const STATUS_LABELS: Record<string, string> = {
  pending: 'En cours', submitted: 'Soumis', under_review: 'En révision',
  complement_required: 'Complément requis', verified: '✓ Vérifié',
  active: '✓ Vérifié', rejected: 'Rejeté', inactive: 'Inactif',
}

const statusLabel = computed(() => STATUS_LABELS[ong.value?.status ?? 'pending'] ?? 'Inconnu')
const statusBadgeClass = computed(() => {
  const s = ong.value?.status ?? ''
  if (s === 'verified' || s === 'active') return 'bg-green-100 text-green-700'
  if (s === 'rejected') return 'bg-red-100 text-red-700'
  if (s === 'submitted' || s === 'under_review') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-600'
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    ong.value = await getOngById(ongId)
  } finally {
    loading.value = false
  }
})
</script>

<style>
@media print {
  @page { margin: 2cm; }
}
</style>
