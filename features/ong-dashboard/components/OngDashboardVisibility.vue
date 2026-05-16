<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
    <div class="px-5 py-4 border-b border-border">
      <h2 class="font-semibold">Visibilité des sections</h2>
      <p class="text-xs text-muted-foreground mt-0.5">
        Choisissez les sections visibles sur votre page publique
      </p>
    </div>

    <div class="divide-y divide-border">
      <div
        v-for="section in SECTIONS"
        :key="section.key"
        class="flex items-center justify-between px-5 py-4"
      >
        <div class="flex items-center gap-3">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', section.iconBg]">
            <Icon :name="section.icon" class="w-4 h-4" :class="section.iconColor" />
          </div>
          <div>
            <div class="text-sm font-medium">{{ section.label }}</div>
            <div class="text-xs text-muted-foreground">{{ section.description }}</div>
          </div>
        </div>
        <button
          type="button"
          :disabled="saving"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary',
            local[section.key] ? 'bg-emerald-600' : 'bg-muted-foreground/30'
          ]"
          @click="toggle(section.key)"
        >
          <span
            :class="[
              'inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform',
              local[section.key] ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
      </div>
    </div>

    <div class="px-5 py-4 border-t border-border flex items-center justify-between">
      <p v-if="saved" class="text-xs text-emerald-600 flex items-center gap-1.5">
        <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
        Modifications enregistrées
      </p>
      <span v-else class="text-xs text-muted-foreground">Les changements sont sauvegardés automatiquement</span>
      <UButton v-if="hasChanges" size="sm" color="primary" :loading="saving" @click="save">
        Enregistrer
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SectionVisibility } from '~/features/ong/type'
import { updateOngVisibility } from '~/features/ong/services/ong.mutations'

const SECTIONS: Array<{
  key: keyof SectionVisibility
  label: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
}> = [
  {
    key:         'identite',
    label:       'Identité',
    description: 'Nom, catégorie, localisation, contacts',
    icon:        'i-heroicons-identification',
    iconBg:      'bg-blue-100 dark:bg-blue-900',
    iconColor:   'text-blue-600 dark:text-blue-400',
  },
  {
    key:         'mission',
    label:       'Mission',
    description: 'Description et objectifs de l\'ONG',
    icon:        'i-heroicons-light-bulb',
    iconBg:      'bg-amber-100 dark:bg-amber-900',
    iconColor:   'text-amber-600 dark:text-amber-400',
  },
  {
    key:         'projets',
    label:       'Projets',
    description: 'Liste des projets en cours et passés',
    icon:        'i-heroicons-folder-open',
    iconBg:      'bg-violet-100 dark:bg-violet-900',
    iconColor:   'text-violet-600 dark:text-violet-400',
  },
  {
    key:         'documents',
    label:       'Documents',
    description: 'Rapports, statuts et pièces légales',
    icon:        'i-heroicons-document-text',
    iconBg:      'bg-green-100 dark:bg-green-900',
    iconColor:   'text-green-600 dark:text-green-400',
  },
  {
    key:         'contacts',
    label:       'Contacts',
    description: 'Email, téléphone, site web',
    icon:        'i-heroicons-phone',
    iconBg:      'bg-rose-100 dark:bg-rose-900',
    iconColor:   'text-rose-600 dark:text-rose-400',
  },
]

const props = defineProps<{
  ongId: string
  visibility: SectionVisibility
}>()

const toast = useToast()
const saving = ref(false)
const saved = ref(false)

const local = reactive<SectionVisibility>({ ...props.visibility })

const hasChanges = computed(() =>
  SECTIONS.some(s => local[s.key] !== props.visibility[s.key])
)

function toggle(key: keyof SectionVisibility) {
  local[key] = !local[key]
  saved.value = false
}

async function save() {
  saving.value = true
  saved.value = false
  const result = await updateOngVisibility(props.ongId, { ...local })
  if (result.success) {
    saved.value = true
    toast.add({ title: 'Visibilité mise à jour', color: 'green' })
    setTimeout(() => { saved.value = false }, 3000)
  } else {
    toast.add({ title: 'Erreur', description: result.error ?? '', color: 'red' })
  }
  saving.value = false
}
</script>
