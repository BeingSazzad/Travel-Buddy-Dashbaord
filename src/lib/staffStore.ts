import { STAFF_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { Role } from '@/types/common.types'

export type StaffMember = {
  id: string
  name: string
  email: string
  role: Role
  password: string
  createdAt: string
  avatar: string
}

const store = createStore<StaffMember>(STAFF_STORAGE_KEY, [
  {
    id: 'adm-1',
    name: 'Seluna Admin',
    email: 'admin@seluna.app',
    role: 'admin',
    password: 'admin123',
    createdAt: '2026-07-01',
    avatar: '',
  },
])

export const staffStore = {
  list: store.list,
  findByEmail(email: string) {
    return store.list().find((s) => s.email.toLowerCase() === email.toLowerCase()) ?? null
  },
  requestReset(email: string) {
    return Boolean(this.findByEmail(email))
  },
}
