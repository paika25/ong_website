export type MiddlewareKey = "agent-only-client" | "auth-client" | "guest-client" | "partner-only-client"
declare module 'nitropack' {
  interface NitroRouteConfig {
    appMiddleware?: MiddlewareKey | MiddlewareKey[] | Record<MiddlewareKey, boolean>
  }
}