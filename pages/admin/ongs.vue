<template>
  <div>
    <PageHeader title="Gestion des ONGs" :subtitle="`${total} ONGs enregistrées`" class="mb-6">
      <template #actions>
        <UInput v-model="search" placeholder="Rechercher par nom…" class="w-64" icon="i-heroicons-magnifying-glass" />
      </template>
    </PageHeader>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <UTable :rows="filtered" :columns="columns" :loading="loading">
        <template #empty-state>
          <EmptyState icon="i-heroicons-building-office-2" title="Aucune ONG trouvée" />
        </template>
        <template #ongName-data="{ row }">
          <p class="font-medium">{{ row.ongName }}</p>
          <p class="text-xs text-muted-foreground font-mono">{{ row.id.slice(0, 8) }}…</p>
        </template>
        <template #status-data="{ row }">
          <OngStatus :status="row.status" />
        </template>
        <template #agentEmail-data="{ row }">
          <span class="text-muted-foreground text-xs">{{ row.agentEmail ?? '—' }}</span>
        </template>
        <template #submittedAt-data="{ row }">
          <span class="text-muted-foreground text-xs whitespace-nowrap">{{ formatDate(row.submittedAt) }}</span>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <NuxtLink :to="`/admin/ongs/${row.id}`">
              <UButton size="xs" variant="outline">Détail</UButton>
            </NuxtLink>
            <NuxtLink :to="`/ongs/${row.id}`" target="_blank">
              <UButton size="xs" variant="ghost">Public</UButton>
            </NuxtLink>
            <UButton
              v-if="['submitted','under_review','complement_required'].includes(row.status)"
              size="xs" variant="soft" color="primary"
              @click="goVerification(row.id)"
            >
              Vérifier
            </UButton>
          </div>
        </template>
      </UTable>
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

const columns = [
  { key: 'ongName', label: 'ONG' },
  { key: 'status', label: 'Statut' },
  { key: 'agentEmail', label: 'Email' },
  { key: 'submittedAt', label: 'Mise à jour' },
  { key: 'actions', label: 'Actions' },
]

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
