import { SUBS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { SubStatus } from '@/types/common.types'

export type Subscription = {
  id: string
  member: string
  plan: string
  status: SubStatus
  amount: number
  renews: string
}

const store = createStore<Subscription>(SUBS_STORAGE_KEY, [
  { id: 's1', member: 'Clara Nielsen', plan: 'Monthly', status: 'active', amount: 12, renews: '2026-09-11' },
  { id: 's2', member: 'Amelia Hart', plan: 'Annual', status: 'active', amount: 99, renews: '2027-04-02' },
  { id: 's3', member: 'Nora Berg', plan: 'Monthly', status: 'active', amount: 12, renews: '2026-09-11' },
  { id: 's4', member: 'Maya Chen', plan: 'Monthly', status: 'cancelled', amount: 12, renews: '2026-08-09' },
  { id: 's5', member: 'Elena Rossi', plan: 'Monthly', status: 'expired', amount: 12, renews: '2026-07-22' },
])

export const subscriptionsStore = store
