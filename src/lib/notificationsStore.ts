import { NOTIFICATIONS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'

export type AdminNotice = {
  id: string
  title: string
  body: string
  audience: 'all' | 'subscribers' | 'admins'
  sentAt: string
  read: boolean
}

const store = createStore<AdminNotice>(NOTIFICATIONS_STORAGE_KEY, [
  { id: 'n1', title: 'New report pending', body: 'Hana Kim was reported for harassment.', audience: 'admins', sentAt: '2026-08-12', read: false },
  { id: 'n2', title: 'August community note', body: 'Lisbon weekends are filling up — remind hosts of capacity.', audience: 'all', sentAt: '2026-08-08', read: true },
])

export const notificationsStore = store
