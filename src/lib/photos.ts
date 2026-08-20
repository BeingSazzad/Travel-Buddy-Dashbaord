/** Deterministic demo portraits so each member has a face in the admin. */
const PORTRAITS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80',
]

function hashIndex(id: string, length: number) {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n += id.charCodeAt(i) * (i + 3)
  return Math.abs(n) % length
}

export function personPhoto(id: string) {
  return PORTRAITS[hashIndex(id, PORTRAITS.length)]
}

const CITY_PHOTOS: Record<string, string> = {
  lisbon: 'https://images.unsplash.com/photo-1585208703176-09db62f85d08?auto=format&fit=crop&w=1200&q=80',
  ubud: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  copenhagen: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80',
  'cape town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80',
  oslo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
}

const PLACE_FALLBACKS = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
]

export function cityPhoto(city: string) {
  const key = city.trim().toLowerCase()
  return CITY_PHOTOS[key] ?? PLACE_FALLBACKS[hashIndex(key || 'place', PLACE_FALLBACKS.length)]
}

export function cityHero(city: string) {
  return cityPhoto(city)
}

export function placePhoto(id: string, city?: string) {
  if (city) return cityPhoto(city)
  return PLACE_FALLBACKS[hashIndex(id, PLACE_FALLBACKS.length)]
}
