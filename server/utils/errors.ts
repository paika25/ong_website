export type ServiceErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'WEBHOOK_FAILED'
  | 'NOT_IMPLEMENTED'

export const codeToStatus: Record<ServiceErrorCode, number> = {
  NOT_FOUND:       404,
  VALIDATION:      422,
  FORBIDDEN:       403,
  CONFLICT:        409,
  WEBHOOK_FAILED:  502,
  NOT_IMPLEMENTED: 501,
}

export class ServiceError extends Error {
  constructor(
    public code: ServiceErrorCode,
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ServiceError'
  }
}
