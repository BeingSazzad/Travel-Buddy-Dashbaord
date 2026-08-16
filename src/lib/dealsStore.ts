import { DEALS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'

export type Deal = {
  id: string
  title: string
  partner: string
  city: string
  discount: string
  active: boolean
}

const store = createStore<Deal>(DEALS_STORAGE_KEY, [
  { id: 'dl1', title: 'Member spa hour', partner: 'Ubud Wellness', city: 'Ubud', discount: '20%', active: true },
  { id: 'dl2', title: 'Coffee flight', partner: 'The Mill', city: 'Lisbon', discount: '15%', active: true },
  { id: 'dl3', title: 'Museum pass', partner: 'Orsay Circle', city: 'Paris', discount: '10%', active: false },
])

export const dealsStore = store
