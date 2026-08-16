import { DESTINATIONS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'

export type Destination = {
  id: string
  city: string
  country: string
  travellers: number
  featured: boolean
}

const store = createStore<Destination>(DESTINATIONS_STORAGE_KEY, [
  { id: 'd1', city: 'Lisbon', country: 'Portugal', travellers: 24, featured: true },
  { id: 'd2', city: 'Ubud', country: 'Indonesia', travellers: 18, featured: true },
  { id: 'd3', city: 'Paris', country: 'France', travellers: 31, featured: false },
  { id: 'd4', city: 'Copenhagen', country: 'Denmark', travellers: 12, featured: false },
  { id: 'd5', city: 'Cape Town', country: 'South Africa', travellers: 9, featured: true },
])

export const destinationsStore = store
