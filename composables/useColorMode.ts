import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'nuxt:color-mode'

export type AppColorMode = 'light' | 'dark' | 'system'

export function useAppColorMode() {
  const preference = ref<ColorMode>('dark')
  const value = ref<'light' | 'dark'>('dark')

  // Read from localStorage if present (client only)
  const readPreference = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === 'light' || raw === 'dark' || raw === 'system') {
        preference.value = raw as ColorMode
      }
    } catch (e) {
      // ignore
    }
  }

  const apply = (mode: 'light' | 'dark') => {
    value.value = mode
    const html = document.documentElement
    if (mode === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
  }

  const setPreference = (p: ColorMode) => {
    preference.value = p
    try {
      localStorage.setItem(STORAGE_KEY, p)
    } catch (e) {
      // ignore
    }
    if (p === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      apply(isDark ? 'dark' : 'light')
    } else {
      apply(p === 'dark' ? 'dark' : 'light')
    }
  }

  const toggle = () => {
    setPreference(value.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    readPreference()
    if (preference.value === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      apply(isDark ? 'dark' : 'light')
    } else {
      apply(preference.value === 'dark' ? 'dark' : 'light')
    }

    // listen to system changes
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        if (preference.value === 'system') {
          apply(e.matches ? 'dark' : 'light')
        }
      }
      mq.addEventListener('change', handler)
    } catch (e) {
      // ignore
    }
  })

  return {
    value,
    preference,
    setPreference,
    toggle
  }
}

// Backwards-compatible export name for manual imports
export { useAppColorMode as useColorMode }
