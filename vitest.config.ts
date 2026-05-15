import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 30000, // Supabase API calls peuvent prendre du temps
    reporters: ['verbose'],
    include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
})
