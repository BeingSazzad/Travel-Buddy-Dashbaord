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
  get: store.get,
  findByEmail(email: string) {
    return store.list().find((s) => s.email.toLowerCase() === email.toLowerCase()) ?? null
  },
  updateProfile(id: string, partial: Pick<StaffMember, 'name' | 'email'>) {
    const current = store.get(id)
    if (!current) return null
    const emailTaken = store
      .list()
      .some((s) => s.id !== id && s.email.toLowerCase() === partial.email.toLowerCase())
    if (emailTaken) return { error: 'Email already in use' as const }
    return { data: store.patch(id, { name: partial.name.trim(), email: partial.email.trim().toLowerCase() }) }
  },
  changePassword(id: string, currentPassword: string, nextPassword: string) {
    const current = store.get(id)
    if (!current) return { error: 'Account not found' as const }
    if (current.password !== currentPassword) return { error: 'Current password is wrong' as const }
    if (nextPassword.length < 6) return { error: 'New password must be at least 6 characters' as const }
    return { data: store.patch(id, { password: nextPassword }) }
  },
  requestReset(email: string) {
    return Boolean(this.findByEmail(email))
  },
}
