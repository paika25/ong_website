<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Gestion des ONGs</h1>
        <p class="text-sm text-muted-foreground">{{ total }} ONGs enregistrées</p>
      </div>
      <UInput v-model="search" placeholder="Rechercher par nom…" class="w-64" icon="i-heroicons-magnifying-glass" />
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th class="px-4 py-3 text-left">ONG</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Mise à jour</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="i in 8" :key="i" class="border-t border-border animate-pulse">
                <td v-for="j in 5" :key="j" class="px-4 py-3">
                  <div class="h-4 bg-muted rounded w-3/4" />
                </td>
              </tr>
            </template>

            <tr v-else-if="!filtered.length">
              <td colspan="5" class="px-4 py-16 text-center text-muted-foreground">
                <Icon name="i-heroicons-building-office-2" class="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Aucune ONG trouvée</p>
              </td>
            </tr>

            <tr
              v-for="ong in filtered"
              :key="ong.id"
              class="border-t border-border hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3">
                <p class="font-medium">{{ ong.ongName }}</p>
                <p class="text-xs text-muted-foreground font-mono">{{ ong.id.slice(0, 8) }}…</p>
              </td>
              <td class="px-4 py-3">
                <OngStatus :status="ong.status" />
              </td>
              <td class="px-4 py-3 text-muted-foreground text-xs">{{ ong.agentEmail ?? '—' }}</td>
              <td class="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                {{ formatDate(ong.submittedAt) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <NuxtLink :to="`/admin/ongs/${ong.id}`">
                    <UButton size="xs" variant="outline">Détail</UButton>
                  </NuxtLink>
                  <NuxtLink :to="`/ongs/${ong.id}`" target="_blank">
                    <UButton size="xs" variant="ghost">Public</UButton>
                  </NuxtLink>
                  <UButton
                    v-if="['submitted','under_review','complement_required'].includes(ong.status)"
                    size="xs" variant="soft" color="primary"
                    @click="goVerification(ong.id)"
                  >
                    Vérifier
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

interface OngRow {
  id: string
  ongName: string
  status: string
  agentEmail: string | null
  submittedAt: string
}

const loading = ref(true)
const ongs = ref<OngRow[]>([])
const search = ref('')

const filtered = computed(() => {
  if (!search.value.trim()) return ongs.value
  const q = search.value.toLowerCase()
  return ongs.value.filter(o => o.ongName.toLowerCase().includes(q) || o.agentEmail?.toLowerCase().includes(q))
})

const total = computed(() => ongs.value.length)


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function goVerification(_id: string) {
  navigateTo('/admin/verification')
}

onMounted(async () => {
  const { getDossiers } = await import('~/features/verification/services/dossier.service')
  try {
    ongs.value = await getDossiers()
  } catch (e: any) {
    useToast().add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
})
</script>
