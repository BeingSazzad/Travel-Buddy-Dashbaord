import { TRIPS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { TripVisibility } from '@/types/common.types'

export type TripStop = {
  day: number
  title: string
  detail: string
}

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
  description: string
  meetingPoint: string
  spots: number
  spotsTaken: number
  budgetPerDay: string
  createdAt: string
  itinerary: TripStop[]
  companions: string[]
  notes: string
}

const store = createStore<Trip>(TRIPS_STORAGE_KEY, [
  {
    id: 't1',
    name: 'Lisbon Getaway',
    city: 'Lisbon',
    country: 'Portugal',
    startDate: '2026-08-10',
    endDate: '2026-08-17',
    style: 'city break',
    owner: 'Clara Nielsen',
    visibility: 'public',
    description:
      'A week of tram rides, miradouros, and late dinners in Alfama. Clara is hosting a small group who want the city at a slower pace — markets in the morning, viewpoints at golden hour.',
    meetingPoint: 'Rossio Square, by the column',
    spots: 4,
    spotsTaken: 3,
    budgetPerDay: '€80–120',
    createdAt: '2026-06-02',
    itinerary: [
      { day: 1, title: 'Arrive & Alfama walk', detail: 'Check in near Baixa, sunset at Portas do Sol.' },
      { day: 2, title: 'Belém & pastéis', detail: 'Jerónimos, tower, and a long lunch by the river.' },
      { day: 3, title: 'Trams & LX Factory', detail: 'Tram 28, then coffee and shops at LX Factory.' },
      { day: 4, title: 'Sintra day trip', detail: 'Pena Palace and a coastal stop in Cascais.' },
      { day: 5, title: 'Free day', detail: 'Beach or museums — group decides over breakfast.' },
    ],
    companions: ['Amelia Hart', 'Sofia Reyes'],
    notes: 'Host verified. Two companions already confirmed. Public listing is live in the member app.',
  },
  {
    id: 't2',
    name: 'Bali Retreat',
    city: 'Ubud',
    country: 'Indonesia',
    startDate: '2026-08-20',
    endDate: '2026-08-28',
    style: 'wellness',
    owner: 'Clara Nielsen',
    visibility: 'public',
    description:
      'Yoga at sunrise, rice-terrace walks, and quiet evenings. Shared villa in Ubud with a pool; cooking class mid-week. Open to members who want rest more than nightlife.',
    meetingPoint: 'Ubud Palace, main courtyard',
    spots: 6,
    spotsTaken: 4,
    budgetPerDay: '€50–80',
    createdAt: '2026-05-18',
    itinerary: [
      { day: 1, title: 'Villa check-in', detail: 'Welcome dinner and stretch session by the pool.' },
      { day: 2, title: 'Sunrise yoga', detail: 'Class at 6:30, then Tegalalang terraces.' },
      { day: 3, title: 'Cooking class', detail: 'Market shop in the morning, cook together at noon.' },
      { day: 4, title: 'Temple circuit', detail: 'Tirta Empul and a slow afternoon in town.' },
    ],
    companions: ['Priya Shah', 'Maya Chen', 'Nora Berg'],
    notes: 'Wellness trip. Priya is helping with the yoga sessions. No reports on this listing.',
  },
  {
    id: 't3',
    name: 'Paris Fashion Tour',
    city: 'Paris',
    country: 'France',
    startDate: '2026-09-02',
    endDate: '2026-09-08',
    style: 'cultural',
    owner: 'Amelia Hart',
    visibility: 'public',
    description:
      'Museum mornings and Marais window-shopping. Amelia planned a mix of classic rooms (Orsay, Picasso) and independent boutiques. Evenings are reserved for long dinners, not clubs.',
    meetingPoint: 'Place des Vosges, southwest corner',
    spots: 3,
    spotsTaken: 2,
    budgetPerDay: '€120–180',
    createdAt: '2026-07-01',
    itinerary: [
      { day: 1, title: 'Marais walk', detail: 'Check in, then Place des Vosges and a wine bar.' },
      { day: 2, title: 'Musée d’Orsay', detail: 'Morning museum, afternoon Left Bank bookshops.' },
      { day: 3, title: 'Atelier visit', detail: 'Private showroom in the 3rd, then canal stroll.' },
    ],
    companions: ['Elena Rossi'],
    notes: 'Higher budget trip. Elena already joined. Host asked members to pack smart-casual.',
  },
  {
    id: 't4',
    name: 'Explore Bali Temples',
    city: 'Bali',
    country: 'Indonesia',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    style: 'adventure',
    owner: 'Sofia Reyes',
    visibility: 'public',
    description:
      'Temple-hopping across south and east Bali with early starts and scooter days. Sofia wants people who are happy on two wheels and okay with sarongs at temple gates.',
    meetingPoint: 'Sanur Beach, in front of the Inna Grand',
    spots: 5,
    spotsTaken: 2,
    budgetPerDay: '€40–70',
    createdAt: '2026-06-20',
    itinerary: [
      { day: 1, title: 'Sanur arrival', detail: 'Beach sunset and trip briefing.' },
      { day: 2, title: 'Uluwatu', detail: 'Cliff temple and kecak dance at dusk.' },
      { day: 3, title: 'East coast', detail: 'Lempuyang and a swim at Blue Lagoon.' },
    ],
    companions: ['Maya Chen'],
    notes: 'Adventure listing. Host reminded members to bring a temple-appropriate cover-up.',
  },
  {
    id: 't5',
    name: 'Oslo Fjord Weekend',
    city: 'Oslo',
    country: 'Norway',
    startDate: '2026-09-12',
    endDate: '2026-09-15',
    style: 'nature',
    owner: 'Nora Berg',
    visibility: 'hidden',
    description:
      'A short fjord weekend with a cabin night and a ferry back. Hidden from the public feed — Nora is only inviting people she has already met in the app.',
    meetingPoint: 'Aker Brygge ferry terminal',
    spots: 3,
    spotsTaken: 1,
    budgetPerDay: '€90–130',
    createdAt: '2026-07-22',
    itinerary: [
      { day: 1, title: 'Ferry out', detail: 'Afternoon boat, cabin check-in, simple dinner.' },
      { day: 2, title: 'Hike & sauna', detail: 'Coastal trail, then a public sauna by the water.' },
      { day: 3, title: 'Return', detail: 'Morning ferry back to Oslo.' },
    ],
    companions: [],
    notes: 'Hidden by host. Do not surface in the public trip feed until she turns visibility on.',
  },
])

])

function normalizeTrip(row: Trip): Trip {
  return {
    ...row,
    country: row.country ?? '',
    description: row.description ?? '',
    meetingPoint: row.meetingPoint ?? '—',
    spots: row.spots ?? 0,
    spotsTaken: row.spotsTaken ?? 0,
    budgetPerDay: row.budgetPerDay ?? '—',
    createdAt: row.createdAt ?? row.startDate,
    itinerary: row.itinerary ?? [],
    companions: row.companions ?? [],
    notes: row.notes ?? '',
  }
}

export const tripsStore = {
  list: () => store.list().map(normalizeTrip),
  get(id: string) {
    const row = store.get(id)
    return row ? normalizeTrip(row) : null
  },
  patch: store.patch,
  remove: store.remove,
}
