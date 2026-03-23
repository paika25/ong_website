<template>
  <div class="bg-card md:p-6 p-3 rounded-xl border border-border">
      <div class="grid md:grid-rows-2 md:grid-cols-2 gap-4">
        <!-- Recherche -->
        <div class="md:col-span-2">
          <UInput
            v-model="filters.search"
            placeholder="Rechercher une ONG..."
            icon="i-heroicons-magnifying-glass"
          />
        </div>

        <!-- Filtre par catégorie -->
        <USelect
          v-model="filters.category"
          :options="categoryOptions"
          placeholder="Toutes catégories"
        />

        <!-- Filtre par statut -->
        <USelect
          v-model="filters.status"
          :options="statusOptions"
          placeholder="Tous statuts"
        />
      </div>

      <!-- Filtres avancés (collapsible) -->
      <div class="mt-4">
        <UButton
          variant="ghost"
          size="sm"
          @click="showAdvancedFilters = !showAdvancedFilters"
        >
          Filtres avancés
          <Icon 
            :name="showAdvancedFilters ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
            class="w-4 h-4 ml-1" 
          />
        </UButton>

        <div v-if="showAdvancedFilters" class="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <!-- Filtre par localisation -->
          <UInput
            v-model="filters.location"
            placeholder="Localisation..."
            icon="i-heroicons-map-pin"
          />

          <!-- Tri -->
          <USelect
            v-model="filters.sortBy"
            :options="sortOptions"
            placeholder="Trier par..."
          />

          <!-- Nombre de bénévoles minimum -->
          <UInput
            v-model.number="filters.minVolunteers"
            type="number"
            placeholder="Min. bénévoles"
            min="0"
          />
        </div>
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


