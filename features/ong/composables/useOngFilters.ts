import { ref, computed } from 'vue'

export interface OngFilters {
  search: string
  category: string
  status: string
  location: string
  sortBy: string
  minVolunteers: number | null
}

export const useOngFilters = () => {
  const filters = ref<OngFilters>({
    search: '',
    category: '',
    status: '',
    location: '',
    sortBy: 'name',
    minVolunteers: null
  })

  const resetFilters = () => {
    filters.value = {
      search: '',
      category: '',
      status: '',
      location: '',
      sortBy: 'name',
      minVolunteers: null
    }
  }

  const hasActiveFilters = computed(() => {
    return !!(filters.value.search || 
             filters.value.category || 
             filters.value.status || 
             filters.value.location || 
             filters.value.minVolunteers)
  })

  const getFilterCount = computed(() => {
    let count = 0
    if (filters.value.search) count++
    if (filters.value.category) count++
    if (filters.value.status) count++
    if (filters.value.location) count++
    if (filters.value.minVolunteers) count++
    return count
  })

  return {
    filters,
    resetFilters,
    hasActiveFilters,
    getFilterCount
  }
}