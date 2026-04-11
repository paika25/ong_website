import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export interface LocationSuggestion {
  label: string
  city: string
  country: string
  lat: string
  lon: string
}

export function useLocationAutocomplete() {
  const query = ref('')
  const suggestions = ref<LocationSuggestion[]>([])
  const isLoading = ref(false)

  const fetchSuggestions = useDebounceFn(async (search: string) => {
    if (search.length < 2) {
      suggestions.value = []
      return
    }

    isLoading.value = true

    try {
      const params = new URLSearchParams({
        q: search,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        'accept-language': 'fr'
      })

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { 'User-Agent': 'nuxt-folio-app' } }
      )

      if (!res.ok) return

      const data = await res.json()

      suggestions.value = data.map((item: any) => {
        const addr = item.address || {}
        const city = addr.city || addr.town || addr.village || addr.municipality || ''
        const country = addr.country || ''

        return {
          label: city && country ? `${city}, ${country}` : item.display_name.split(',').slice(0, 2).join(',').trim(),
          city,
          country,
          lat: item.lat,
          lon: item.lon
        }
      })
    } catch (err) {
      console.error('Erreur géolocalisation:', err)
      suggestions.value = []
    } finally {
      isLoading.value = false
    }
  }, 350)

  watch(query, (val) => {
    fetchSuggestions(val)
  })

  const clear = () => {
    suggestions.value = []
  }

  return {
    query,
    suggestions,
    isLoading,
    clear
  }
}
