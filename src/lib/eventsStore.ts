import { EVENTS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { EventStatus } from '@/types/common.types'

export type Meetup = {
  id: string
  title: string
  city: string
  date: string
  host: string
  attendees: number
  status: EventStatus
}

const store = createStore<Meetup>(EVENTS_STORAGE_KEY, [
  { id: 'e1', title: 'Sunset walk in Alfama', city: 'Lisbon', date: '2026-08-14', host: 'Amelia Hart', attendees: 8, status: 'upcoming' },
  { id: 'e2', title: 'Yoga in the rice fields', city: 'Ubud', date: '2026-08-22', host: 'Priya Shah', attendees: 12, status: 'upcoming' },
  { id: 'e3', title: 'Museum morning', city: 'Paris', date: '2026-09-04', host: 'Elena Rossi', attendees: 6, status: 'upcoming' },
  { id: 'e4', title: 'Coffee crawl', city: 'Copenhagen', date: '2026-07-12', host: 'Clara Nielsen', attendees: 9, status: 'ended' },
])

export const eventsStore = store
