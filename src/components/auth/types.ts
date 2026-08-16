import type { Role } from '@/types/common.types'

export type AuthFormValues = {
  email: string
  password: string
  name?: string
}

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
}
