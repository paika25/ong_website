<template>
  <div class="bg-card rounded-xl border border-border p-4">
    <div class="flex flex-wrap items-center gap-3">
      <UInput
        v-model="filters.search"
        placeholder="Rechercher une ONG..."
        icon="i-heroicons-magnifying-glass"
        class="flex-1 min-w-[200px]"
      />
      <USelect v-model="filters.category" :options="categoryOptions" class="w-48" />
      <USelect v-model="filters.status" :options="statusOptions" class="w-44" />
      <UButton
        variant="ghost"
        size="sm"
        :icon="showAdvancedFilters ? 'i-heroicons-funnel' : 'i-heroicons-funnel'"
        @click="showAdvancedFilters = !showAdvancedFilters"
      >
        Filtres
        <Icon :name="showAdvancedFilters ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-4 h-4 ml-1" />
      </UButton>
    </div>

    <div v-if="showAdvancedFilters" class="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
      <UInput v-model="filters.location" placeholder="Localisation..." icon="i-heroicons-map-pin" class="w-48" />
      <USelect v-model="filters.sortBy" :options="sortOptions" class="w-48" />
      <UInput v-model.number="filters.minVolunteers" type="number" placeholder="Min. bénévoles" min="0" class="w-40" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, watch, ref } from 'vue'
import type { PropType } from 'vue'

type OngFilters = {
  search: string
  category: string
  status: string
  location: string
  sortBy: string
  minVolunteers: number | null
}


// Options pour les selects
const categoryOptions = [
  { label: 'Toutes catégories', value: '' },
  { label: 'Éducation', value: 'education' },
  { label: 'Santé', value: 'health' },
  { label: 'Environnement', value: 'environment' },
  { label: 'Social', value: 'social' },
  { label: 'Culture', value: 'culture' }
]

const statusOptions = [
  { label: 'Tous statuts', value: '' },
  { label: 'Actif', value: 'active' },
  { label: 'En attente', value: 'pending' },
  { label: 'Inactif', value: 'inactive' }
]

const sortOptions = [
  { label: 'Nom A-Z', value: 'name' },
  { label: 'Plus de bénévoles', value: 'volunteers' },
  { label: 'Plus de projets', value: 'projects' },
  { label: 'Plus récents', value: 'createdAt' }
]


const props = defineProps<{ filter: OngFilters }>()
const emit = defineEmits<{
  (e: 'filterChange', payload: OngFilters): void
}>()

// local copy so we don't mutate prop directly
const filters = reactive<OngFilters>({ ...props.filter })
const showAdvancedFilters = ref(false)

// sync local copy when parent prop changes
watch(
  () => props.filter,
  (newVal) => {
    Object.assign(filters, newVal)
  },
  { deep: true }
)

// emit changes to parent when local filters change
watch(
  () => ({ ...filters }),
  (next) => {
    // send a plain object copy
    emit('filterChange', JSON.parse(JSON.stringify(next)))
  },
  { deep: true }
)

// expose for template
const { search, category, status, location, sortBy, minVolunteers } = toRefs(filters)
</script>


