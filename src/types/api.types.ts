export type ApiError = {
  status: number
  message: string
}

export type Paginated<T> = {
  items: T[]
  total: number
}
