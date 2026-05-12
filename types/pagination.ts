export interface PaginatedResponse<T> {
  data: T[]
  cursor: string | null
  total: number
}
