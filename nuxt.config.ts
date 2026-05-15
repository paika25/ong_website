// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-14',
  devtools: { enabled: true },
  
  nitro: {
    preset: 'netlify',
    // Stripe doit rester externe au bundle Nitro pour conserver sa chaîne prototype (StripeError extends Error)
    externals: {
      external: ['stripe'],
    },
  },
  
  runtimeConfig: {
    supabaseServiceRoleKey: '', // NUXT_SUPABASE_SERVICE_ROLE_KEY
    stripeSecretKey: '',        // NUXT_STRIPE_SECRET_KEY
    stripeWebhookSecret: '',    // NUXT_STRIPE_WEBHOOK_SECRET
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      appUrl: '',               // NUXT_PUBLIC_APP_URL (ex: https://paika.mg)
    }
  },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  build: {
    transpile: ['@fortawesome/vue-fontawesome']
  },
  colorMode: {
    preference: 'dark'
  },
  ui: {
    global: true,
    icons: ['heroicons', 'lucide']
  },
  app: {
    head: {
      title: 'Soutenez nos ONG',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Projet Paika Ong ' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
})