<template>
  <main class="container mx-auto px-4 py-8 max-w-2xl">
      <NuxtLink
        :to="ong ? `/ongs/${ong.id}/edit` : '/dashboard'"
        class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <Icon name="i-heroicons-arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Retour
      </NuxtLink>

      <PageHeader
        title="Visibilité publique"
        subtitle="Choisissez les sections visibles par les bailleurs sur votre profil public."
        class="mb-8"
      />

      <div v-if="loading" class="space-y-4 animate-pulse">
        <div v-for="i in 5" :key="i" class="h-16 bg-muted rounded-xl" />
      </div>

      <div v-else-if="!ong" class="bg-card border border-border rounded-xl">
        <EmptyState icon="i-heroicons-building-office-2" title="Aucune ONG trouvée">
          <template #action>
            <NuxtLink to="/ongs/new">
              <UButton size="sm" color="primary">Créer mon ONG</UButton>
            </NuxtLink>
          </template>
        </EmptyState>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="section in SECTIONS"
          :key="section.key"
          class="flex items-center justify-between p-4 bg-card border border-border rounded-xl"
        >
          <div>
            <p class="text-sm font-medium">{{ section.label }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ section.description }}</p>
          </div>
          <UToggle v-model="visibility[section.key]" />
        </div>

        <div class="pt-4 flex justify-end gap-3">
          <UButton variant="outline" @click="resetToSaved">Annuler</UButton>
          <UButton :loading="saving" @click="save">Enregistrer</UButton>
        </div>
      </div>
  </main>
</template>

<script setup lang="ts">
import { getOwnerOng, updateOngVisibility } from '~/features/ong/services'
import type { ONG, SectionVisibility } from '~/features/ong/type'
import { DEFAULT_SECTION_VISIBILITY } from '~/features/ong/type'

definePageMeta({
  middleware: ['auth', 'agent-only']
})

const toast = useToast()

const SECTIONS: Array<{ key: keyof SectionVisibility; label: string; description: string }> = [
  { key: 'identite',   label: 'Identité',    description: 'Nom, forme juridique, adresse, contacts de base' },
  { key: 'mission',    label: 'Mission',     description: 'Mission principale, secteurs d\'intervention, zones géographiques' },
  { key: 'documents',  label: 'Documents',   description: 'Statuts, récépissé, rapports financiers uploadés' },
  { key: 'projets',    label: 'Projets',     description: 'Liste des projets actifs et passés' },
  { key: 'contacts',   label: 'Contacts',    description: 'Responsable légal et contact communication' },
]

const loading = ref(true)
const saving  = ref(false)
const ong     = ref<ONG | null>(null)
const visibility = reactive<SectionVisibility>({ ...DEFAULT_SECTION_VISIBILITY })

function resetToSaved() {
  const saved = ong.value?.sectionVisibility ?? DEFAULT_SECTION_VISIBILITY
  Object.assign(visibility, saved)
}

async function save() {
  if (!ong.value) return
  saving.value = true
  try {
    const result = await updateOngVisibility(ong.value.id, { ...visibility })
    if (!result.success) {
      toast.add({ title: 'Erreur', description: result.error ?? 'Erreur lors de la sauvegarde', color: 'red', timeout: 5000 })
      return
    }
    if (ong.value) ong.value.sectionVisibility = { ...visibility }
    toast.add({ title: 'Visibilité mise à jour', color: 'green', timeout: 4000 })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    ong.value = await getOwnerOng()
    if (ong.value?.sectionVisibility) {
      Object.assign(visibility, ong.value.sectionVisibility)
    }
  } finally {
    loading.value = false
  }
})
</script>
