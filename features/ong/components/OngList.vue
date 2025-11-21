<template>
  <div class="space-y-6">
    <!-- Filtres et recherche -->
    <OngListFilter :filter="filters" @filterChange="handleFilterChange" />

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
        @view-details="() => handleViewDetails(ong)"
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
// navigateTo est auto-importé dans Nuxt
import { getOngs, getOngStats } from '../services/ongService'
import type { ONG } from '../services/ongService'
import Card from './Card.vue'
import OngListFilter from './OngListFilter.vue'

// État
const isLoading = ref(true)
const ongsData = ref<ONG[]>([])
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
        const aCount = Array.isArray((a as any).projects) ? (a as any).projects.length : Number((a as any).projects) || 0
        const bCount = Array.isArray((b as any).projects) ? (b as any).projects.length : Number((b as any).projects) || 0
        return bCount - aCount
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

// Receives filter updates from OngListFilter child
const handleFilterChange = (newFilters: Partial<typeof filters.value>) => {
  filters.value = { ...filters.value, ...newFilters }
  currentPage.value = 1
}

const handleViewDetails = (ong: ONG) => {
  // Navigation vers la page de détail
  if (typeof window !== 'undefined') {
    window.location.href = `/ongs/${ong.id}`
  }
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