<template>
  <div class="space-y-4">
    <p class="text-sm text-muted-foreground">
      Sections actuellement visibles sur la page publique de l'ONG. En tant qu'admin, vous pouvez forcer la visibilité indépendamment de ce que l'ONG a configuré.
    </p>

    <div class="divide-y divide-border border border-border rounded-xl overflow-hidden">
      <div
        v-for="section in SECTIONS"
        :key="section.key"
        class="flex items-center justify-between px-4 py-3.5 bg-card"
      >
        <div class="flex items-center gap-3">
          <div :class="['w-7 h-7 rounded-lg flex items-center justify-center', section.iconBg]">
            <Icon :name="section.icon" class="w-3.5 h-3.5" :class="section.iconColor" />
          </div>
          <div>
            <div class="text-sm font-medium">{{ section.label }}</div>
            <div class="text-xs text-muted-foreground">{{ section.description }}</div>
          </div>
        </div>
        <UToggle
          :model-value="local[section.key]"
          :disabled="saving"
          @update:model-value="toggle(section.key)"
        />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <span v-if="saved" class="text-xs text-green-600 flex items-center gap-1.5">
        <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
        Visibilité mise à jour
      </span>
      <span v-else class="text-xs text-muted-foreground">Modifications non enregistrées</span>
      <UButton size="sm" color="primary" :loading="saving" :disabled="!hasChanges" @click="save">
        Enregistrer
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SectionVisibility } from '~/features/ong/type'
import { updateAdminOngVisibility } from '../services/admin.ong.service'

const SECTIONS: Array<{
  key: keyof SectionVisibility
  label: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
}> = [
  { key: 'identite',  label: 'Identité',   description: 'Nom, catégorie, localisation', icon: 'i-heroicons-identification',          iconBg: 'bg-blue-100 dark:bg-blue-900',   iconColor: 'text-blue-600 dark:text-blue-400' },
  { key: 'mission',   label: 'Mission',    description: 'Description et objectifs',      icon: 'i-heroicons-light-bulb',               iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-400' },
  { key: 'projets',   label: 'Projets',    description: 'Projets de l\'ONG',             icon: 'i-heroicons-folder-open',              iconBg: 'bg-violet-100 dark:bg-violet-900', iconColor: 'text-violet-600 dark:text-violet-400' },
  { key: 'documents', label: 'Documents',  description: 'Rapports et pièces légales',    icon: 'i-heroicons-document-text',            iconBg: 'bg-green-100 dark:bg-green-900', iconColor: 'text-green-600 dark:text-green-400' },
  { key: 'contacts',  label: 'Contacts',   description: 'Email, téléphone, site web',    icon: 'i-heroicons-phone',                    iconBg: 'bg-rose-100 dark:bg-rose-900',   iconColor: 'text-rose-600 dark:text-rose-400' },
]

const props = defineProps<{
  ongId:      string
  visibility: SectionVisibility | null
}>()

const DEFAULT_VIS: SectionVisibility = { identite: true, mission: true, documents: true, projets: true, contacts: true }

const toast   = useToast()
const saving  = ref(false)
const saved   = ref(false)
const local   = reactive<SectionVisibility>({ ...(props.visibility ?? DEFAULT_VIS) })

const hasChanges = computed(() =>
  SECTIONS.some(s => local[s.key] !== (props.visibility ?? DEFAULT_VIS)[s.key])
)

function toggle(key: keyof SectionVisibility) {
  local[key] = !local[key]
  saved.value = false
}

async function save() {
  saving.value = true
  try {
    await updateAdminOngVisibility(props.ongId, { ...local })
    saved.value = true
    toast.add({ title: 'Visibilité mise à jour', color: 'green' })
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    saving.value = false
  }
}
</script>
