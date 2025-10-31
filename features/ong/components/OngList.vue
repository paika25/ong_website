<template>
  <div class="space-y-6">
    <!-- Filtres et recherche -->
    <div class="bg-card p-6 rounded-xl border border-border">
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

    <!-- Statistiques -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-card p-4 rounded-lg border border-border text-center">
        <div class="text-2xl font-bold text-primary">{{ stats.total }}</div>
        <div class="text-sm text-muted-foreground">Total ONGs</div>
      </div>
      <div class="bg-card p-4 rounded-lg border border-border text-center">
        <div class="text-2xl font-bold text-green-600">{{ stats.active }}</div>
        <div class="text-sm text-muted-foreground">Actives</div>
      </div>
      <div class="bg-card p-4 rounded-lg border border-border text-center">
        <div class="text-2xl font-bold text-blue-600">{{ stats.totalVolunteers }}</div>
        <div class="text-sm text-muted-foreground">Bénévoles</div>
      </div>
      <div class="bg-card p-4 rounded-lg border border-border text-center">
        <div class="text-2xl font-bold text-purple-600">{{ stats.totalProjects }}</div>
        <div class="text-sm text-muted-foreground">Projets</div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-96 w-full rounded-xl"
      />
    </div>

    <!-- Empty state -->
    <div 
      v-else-if="filteredOngs.length === 0"
      class="text-center py-12"
    >
      <Icon name="i-heroicons-building-office-2" class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-semibold mb-2">Aucune ONG trouvée</h3>
      <p class="text-muted-foreground mb-4">
        Essayez de modifier vos critères de recherche
      </p>
      <UButton @click="resetFilters">
        Réinitialiser les filtres
      </UButton>
    </div>

    <!-- Liste des ONGs -->
    <div 
      v-else
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Card
        v-for="ong in paginatedOngs"
        :key="ong.id"
        :ong="ong"
        @view-details="handleViewDetails"
        @join="handleJoin"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="currentPage"
        :total="filteredOngs.length"
        :page-count="itemsPerPage"
        show-last
        show-first
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useOngService } from '../services/ongService'
import type { ONG } from '../services/ongService'
import Card from './Card.vue'

const { getOngs, getOngStats } = useOngService()

// État
const isLoading = ref(true)
const ongsData = ref<ONG[]>([])
const showAdvancedFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = 9

// Filtres - utiliser ref avec un objet simple au lieu de reactive
const filters = ref({
  search: '',
  category: '',
  status: '',
  location: '',
  sortBy: 'name',
  minVolunteers: null as number | null
})

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

// Computed
const filteredOngs = computed(() => {
  let result = [...ongsData.value]

  // Filtre par recherche
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(ong => 
      ong.name.toLowerCase().includes(searchTerm) ||
      ong.description.toLowerCase().includes(searchTerm)
    )
  }

  // Filtre par catégorie
  if (filters.value.category) {
    result = result.filter(ong => ong.category === filters.value.category)
  }

  // Filtre par statut
  if (filters.value.status) {
    result = result.filter(ong => ong.status === filters.value.status)
  }

  // Filtre par localisation
  if (filters.value.location) {
    const locationTerm = filters.value.location.toLowerCase()
    result = result.filter(ong => 
      ong.location.toLowerCase().includes(locationTerm)
    )
  }

  // Filtre par nombre de bénévoles minimum
  if (filters.value.minVolunteers !== null && filters.value.minVolunteers > 0) {
    result = result.filter(ong => ong.volunteers >= filters.value.minVolunteers!)
  }

  // Tri
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'volunteers':
        return b.volunteers - a.volunteers
      case 'projects':
        return b.projects - a.projects
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return result
})

const paginatedOngs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOngs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredOngs.value.length / itemsPerPage)
})

const stats = computed(() => {
  return getOngStats(ongsData.value)
})

// Méthodes
const loadOngs = async () => {
  try {
    isLoading.value = true
    ongsData.value = await getOngs()
  } catch (error) {
    console.error('Erreur lors du chargement des ONGs:', error)
  } finally {
    isLoading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    status: '',
    location: '',
    sortBy: 'name',
    minVolunteers: null
  }
  currentPage.value = 1
}

const handleViewDetails = (ong: ONG) => {
  // Navigation vers la page de détail
  navigateTo(`/ongs/${ong.id}`)
}

const handleJoin = (ong: ONG) => {
  // Logique pour rejoindre l'ONG
  console.log('Rejoindre ONG:', ong.name)
  // Ici vous pourriez ouvrir une modal ou rediriger vers un formulaire
}

// Watchers
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Lifecycle - charger uniquement côté client pour éviter les problèmes SSR
onMounted(() => {
  loadOngs()
})

// Alternative: utiliser useAsyncData pour SSR compatible
// const { data: ongsData, pending: isLoading } = await useAsyncData('ongs', () => getOngs())
</script>