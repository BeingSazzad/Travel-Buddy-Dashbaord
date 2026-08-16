import { TRIPS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { TripVisibility } from '@/types/common.types'

export type Trip = {
  id: string
  name: string
  city: string
  country: string
  startDate: string
  endDate: string
  style: string
  owner: string
  visibility: TripVisibility
}

const store = createStore<Trip>(TRIPS_STORAGE_KEY, [
  { id: 't1', name: 'Lisbon Getaway', city: 'Lisbon', country: 'Portugal', startDate: '2026-08-10', endDate: '2026-08-17', style: 'city break', owner: 'Clara Nielsen', visibility: 'public' },
  { id: 't2', name: 'Bali Retreat', city: 'Ubud', country: 'Indonesia', startDate: '2026-08-20', endDate: '2026-08-28', style: 'wellness', owner: 'Clara Nielsen', visibility: 'public' },
  { id: 't3', name: 'Paris Fashion Tour', city: 'Paris', country: 'France', startDate: '2026-09-02', endDate: '2026-09-08', style: 'cultural', owner: 'Amelia Hart', visibility: 'public' },
  { id: 't4', name: 'Explore Bali Temples', city: 'Bali', country: 'Indonesia', startDate: '2026-08-15', endDate: '2026-08-22', style: 'adventure', owner: 'Sofia Reyes', visibility: 'public' },
  { id: 't5', name: 'Oslo Fjord Weekend', city: 'Oslo', country: 'Norway', startDate: '2026-09-12', endDate: '2026-09-15', style: 'nature', owner: 'Nora Berg', visibility: 'hidden' },
])

export const tripsStore = store
