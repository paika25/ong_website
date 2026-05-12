export type MiddlewareKey = "agent-only-client" | "agent-only" | "auth-client" | "auth" | "back-office" | "guest-client" | "partner-only-client"
declare module 'nitropack' {
  interface NitroRouteConfig {
    appMiddleware?: MiddlewareKey | MiddlewareKey[] | Record<MiddlewareKey, boolean>
  }
}