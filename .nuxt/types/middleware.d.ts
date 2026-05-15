import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "agent-only-client" | "agent-only" | "auth-client" | "auth" | "back-office" | "guest-client" | "partner-only-client"
declare module 'nuxt/app' {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}