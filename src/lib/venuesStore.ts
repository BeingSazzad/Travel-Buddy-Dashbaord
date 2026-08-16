import { VENUES_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { VenueKind } from '@/types/common.types'

export type Venue = {
  id: string
  name: string
  kind: VenueKind
  city: string
  featured: boolean
}

const store = createStore<Venue>(VENUES_STORAGE_KEY, [
  { id: 'v1', name: 'Fábrica Coffee Roasters', kind: 'cafe', city: 'Lisbon', featured: true },
  { id: 'v2', name: 'Cervejaria Ramiro', kind: 'restaurant', city: 'Lisbon', featured: true },
  { id: 'v3', name: 'Santa Clara 1728', kind: 'hotel', city: 'Lisbon', featured: false },
  { id: 'v4', name: 'Seniman Coffee', kind: 'cafe', city: 'Ubud', featured: true },
  { id: 'v5', name: 'Locavore', kind: 'restaurant', city: 'Ubud', featured: false },
])

export const venuesStore = store
