// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-14',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },
  ui: {
    global: true,
    icons: ['heroicons', 'lucide']
  },
  app: {
    head: {
      title: 'Portfolio - Marius',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Portfolio personnel de Marius' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})