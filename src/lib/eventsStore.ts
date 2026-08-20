import { EVENTS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { EventStatus } from '@/types/common.types'

export type EventStop = {
  time: string
  title: string
  detail: string
}

export type Meetup = {
  id: string
  title: string
  city: string
  country: string
  date: string
  time: string
  host: string
  attendees: number
  capacity: number
  status: EventStatus
  venue: string
  description: string
  agenda: EventStop[]
  guests: string[]
  createdAt: string
  notes: string
}

const store = createStore<Meetup>(EVENTS_STORAGE_KEY, [
  {
    id: 'e1',
    title: 'Sunset walk in Alfama',
    city: 'Lisbon',
    country: 'Portugal',
    date: '2026-08-14',
    time: '18:30',
    host: 'Amelia Hart',
    attendees: 8,
    capacity: 12,
    status: 'ended',
    venue: 'Largo das Portas do Sol',
    description:
      'A slow walk through Alfama at golden hour, then a drink with a view. Amelia kept the group small so people could actually talk — no racing between viewpoints.',
    agenda: [
      { time: '18:30', title: 'Meet', detail: 'Portas do Sol, by the terrace railing.' },
      { time: '18:45', title: 'Alfama lanes', detail: 'Miradouros, tiled façades, and a pause at São Vicente.' },
      { time: '20:15', title: 'Drink', detail: 'Wine or mocktail at a terrace overlooking the Tagus.' },
    ],
    guests: ['Clara Nielsen', 'Sofia Reyes', 'Elena Rossi'],
    createdAt: '2026-07-20',
    notes: 'Event ended on time. No reports. Host asked to run it again in September.',
  },
  {
    id: 'e2',
    title: 'Yoga in the rice fields',
    city: 'Ubud',
    country: 'Indonesia',
    date: '2026-08-22',
    time: '06:30',
    host: 'Priya Shah',
    attendees: 12,
    capacity: 14,
    status: 'upcoming',
    venue: 'Tegalalang rice terrace, east lookout',
    description:
      'Sunrise yoga on a platform above the terraces, then fruit and tea. Mats are provided. Priya wants people who can stay for the full 75 minutes.',
    agenda: [
      { time: '06:30', title: 'Arrive & set up', detail: 'Mats laid out; short welcome.' },
      { time: '06:45', title: 'Practice', detail: 'Gentle vinyasa, 60 minutes.' },
      { time: '07:50', title: 'Breakfast', detail: 'Fruit, tea, and a walk back to the road.' },
    ],
    guests: ['Clara Nielsen', 'Maya Chen', 'Nora Berg'],
    createdAt: '2026-07-28',
    notes: 'Almost full. Remind host to confirm the platform booking the day before.',
  },
  {
    id: 'e3',
    title: 'Museum morning',
    city: 'Paris',
    country: 'France',
    date: '2026-09-04',
    time: '10:00',
    host: 'Elena Rossi',
    attendees: 6,
    capacity: 8,
    status: 'upcoming',
    venue: 'Musée d’Orsay, main steps',
    description:
      'A focused two-hour pass through Orsay with Elena as guide, then lunch nearby. Timed tickets are already bought for the group.',
    agenda: [
      { time: '10:00', title: 'Meet', detail: 'Main steps, left of the clock.' },
      { time: '10:15', title: 'Galleries', detail: 'Impressionists first, then sculpture court.' },
      { time: '12:30', title: 'Lunch', detail: 'Simple bistro on Rue de Lille.' },
    ],
    guests: ['Amelia Hart', 'Clara Nielsen'],
    createdAt: '2026-08-02',
    notes: 'Tickets prepaid by host. Two spots still open.',
  },
  {
    id: 'e4',
    title: 'Coffee crawl',
    city: 'Copenhagen',
    country: 'Denmark',
    date: '2026-07-12',
    time: '11:00',
    host: 'Clara Nielsen',
    attendees: 9,
    capacity: 10,
    status: 'ended',
    venue: 'The Coffee Collective, Jægersborggade',
    description:
      'Three specialty shops in Nørrebro, walking between each. Clara set a no-laptop rule so it stayed a meetup, not a work session.',
    agenda: [
      { time: '11:00', title: 'First cup', detail: 'Coffee Collective — pour-over round.' },
      { time: '12:00', title: 'Second stop', detail: 'Prolog in Kødbyen.' },
      { time: '13:15', title: 'Last stop', detail: 'Democratic Coffee, then goodbye.' },
    ],
    guests: ['Nora Berg', 'Amelia Hart'],
    createdAt: '2026-06-15',
    notes: 'Ended. One no-show. Host rated the turnout as strong.',
  },
])

function normalizeEvent(row: Meetup): Meetup {
  return {
    ...row,
    country: row.country ?? '',
    time: row.time ?? '',
    capacity: row.capacity ?? row.attendees ?? 0,
    venue: row.venue ?? '—',
    description: row.description ?? '',
    agenda: row.agenda ?? [],
    guests: row.guests ?? [],
    createdAt: row.createdAt ?? row.date,
    notes: row.notes ?? '',
  }
}

export const eventsStore = {
  list: () => store.list().map(normalizeEvent),
  get(id: string) {
    const row = store.get(id)
    return row ? normalizeEvent(row) : null
  },
  patch: store.patch,
  remove: store.remove,
}
