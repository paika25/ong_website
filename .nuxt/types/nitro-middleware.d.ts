export type MiddlewareKey = "agent-only" | "auth" | "guest" | "partner-only"
declare module 'nitropack' {
  interface NitroRouteConfig {
    appMiddleware?: MiddlewareKey | MiddlewareKey[] | Record<MiddlewareKey, boolean>
  }
}