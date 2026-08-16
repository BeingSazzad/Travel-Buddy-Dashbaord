import { REVIEWS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'

export type Review = {
  id: string
  place: string
  city: string
  author: string
  rating: number
  excerpt: string
  flagged: boolean
}

const store = createStore<Review>(REVIEWS_STORAGE_KEY, [
  { id: 'rv1', place: 'Pastéis de Belém', city: 'Lisbon', author: 'Clara Nielsen', rating: 5, excerpt: 'Worth the queue. Warm custard, kind staff.', flagged: false },
  { id: 'rv2', place: 'Tegallalang', city: 'Ubud', author: 'Priya Shah', rating: 4, excerpt: 'Crowded at noon — go early.', flagged: false },
  { id: 'rv3', place: 'Hidden alley café', city: 'Paris', author: 'Elena Rossi', rating: 2, excerpt: 'Rude host. Not what was listed.', flagged: true },
])

export const reviewsStore = store
