import { PEOPLE_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { SubStatus, UserStatus } from '@/types/common.types'

export type Member = {
  id: string
  name: string
  email: string
  city: string
  country: string
  status: UserStatus
  subscription: SubStatus
  verified: boolean
  trips: number
  joined: string
}

const store = createStore<Member>(PEOPLE_STORAGE_KEY, [
  { id: 'u1', name: 'Clara Nielsen', email: 'clara.nielsen@proton.me', city: 'Copenhagen', country: 'Denmark', status: 'active', subscription: 'active', verified: true, trips: 3, joined: '2026-03-14' },
  { id: 'u2', name: 'Amelia Hart', email: 'amelia@seluna.app', city: 'Lisbon', country: 'Portugal', status: 'active', subscription: 'active', verified: true, trips: 2, joined: '2026-04-02' },
  { id: 'u3', name: 'Sofia Reyes', email: 'sofia@seluna.app', city: 'Barcelona', country: 'Spain', status: 'active', subscription: 'pending', verified: false, trips: 1, joined: '2026-05-18' },
  { id: 'u4', name: 'Maya Chen', email: 'maya@seluna.app', city: 'Singapore', country: 'Singapore', status: 'suspended', subscription: 'cancelled', verified: true, trips: 4, joined: '2026-01-09' },
  { id: 'u5', name: 'Nora Berg', email: 'nora@seluna.app', city: 'Oslo', country: 'Norway', status: 'active', subscription: 'active', verified: true, trips: 2, joined: '2026-06-11' },
  { id: 'u6', name: 'Priya Shah', email: 'priya@seluna.app', city: 'Ubud', country: 'Indonesia', status: 'pending', subscription: 'pending', verified: false, trips: 0, joined: '2026-08-01' },
  { id: 'u7', name: 'Elena Rossi', email: 'elena@seluna.app', city: 'Rome', country: 'Italy', status: 'active', subscription: 'expired', verified: true, trips: 5, joined: '2025-11-22' },
  { id: 'u8', name: 'Hana Kim', email: 'hana@seluna.app', city: 'Seoul', country: 'South Korea', status: 'banned', subscription: 'cancelled', verified: false, trips: 1, joined: '2026-02-28' },
])

export const peopleStore = store
