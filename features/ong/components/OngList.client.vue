<template>
  <div class="space-y-6">
    <!-- Filtres et recherche (masqués en mode preview) -->
    <OngListFilter v-if="!preview" :filter="filters" @filterChange="handleFilterChange" />

    <!-- Compteur résultats (masqué en mode preview) -->
    <div v-if="!preview" class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        <span v-if="!isLoading" class="font-semibold text-foreground">{{ filteredOngs.length }}</span>
        <span v-else class="inline-block w-6 h-4 bg-muted rounded animate-pulse align-middle" />
        {{ isLoading ? '' : ` ONG${filteredOngs.length > 1 ? 's' : ''} trouvée${filteredOngs.length > 1 ? 's' : ''}` }}
      </p>
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
    <EmptyState
      v-else-if="filteredOngs.length === 0"
      icon="i-heroicons-building-office-2"
      title="Aucune ONG trouvée"
      description="Essayez de modifier vos critères de recherche"
    >
      <template #action>
        <UButton @click="resetFilters">
          Réinitialiser les filtres
        </UButton>
      </template>
    </EmptyState>

    <!-- Liste des ONGs -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="ong in visibleOngs"
        :key="ong.id"
        :ong="ong"
        @view-details="handleViewDetails"
        @join="handleJoin"
      />
    </div>

    <!-- Bouton Voir plus (mode preview) → redirige vers la page dédiée -->
    <div v-if="preview && filteredOngs.length > previewCount" class="flex flex-col items-center gap-3 pt-4">
      <p class="text-sm text-muted-foreground">
        {{ filteredOngs.length - previewCount }} autre{{ filteredOngs.length - previewCount > 1 ? 's' : '' }} ONG{{ filteredOngs.length - previewCount > 1 ? 's' : '' }} disponible{{ filteredOngs.length - previewCount > 1 ? 's' : '' }}
      </p>
      <NuxtLink to="/ongs">
        <UButton variant="outline" trailing-icon="i-heroicons-arrow-right">
          Voir toutes les ONGs
        </UButton>
      </NuxtLink>
    </div>

    <!-- Pagination (mode normal ou après "voir plus") -->
    <div v-if="(!preview || showAll) && totalPages > 1" class="flex justify-center">
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
import { getOngs, getOngStats } from '../services/ongService'
import type { ONG } from '../type'
import Card from './Card.vue'
import OngListFilter from './OngListFilter.vue'

const props = withDefaults(defineProps<{ preview?: boolean }>(), { preview: false })

const previewCount = 3

// État
const isLoading = ref(true)
const ongsData = ref<ONG[]>([])
const currentPage = ref(1)
const itemsPerPage = 9
const showAll = ref(false)

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

const visibleOngs = computed(() => {
  if (props.preview && !showAll.value) {
    return filteredOngs.value.slice(0, previewCount)
  }
  return paginatedOngs.value
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
  console.log('Voir les détails de l\'ONG:', ong.name, ong)
  // Utilise navigateTo qui est SSR-safe et auto-importé par Nuxt
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
  showAll.value = false
}, { deep: true })

// Lifecycle - charger uniquement côté client pour éviter les problèmes SSR
onMounted(() => {
  loadOngs()
})

// Alternative: utiliser useAsyncData pour SSR compatible
// const { data: ongsData, pending: isLoading } = await useAsyncData('ongs', () => getOngs())
</script>