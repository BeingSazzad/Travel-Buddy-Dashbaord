import { BROADCASTS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import { peopleStore } from '@/lib/peopleStore'
import { subscribersStore } from '@/lib/subscribersStore'
import { notificationsStore } from '@/lib/notificationsStore'

export type BroadcastAudience = 'all' | 'subscribers'

export type Broadcast = {
  id: string
  title: string
  body: string
  audience: BroadcastAudience
  sentAt: string
  sent: number
}

const store = createStore<Broadcast>(BROADCASTS_STORAGE_KEY, [
  {
    id: 'b1',
    title: 'Lisbon weekend reminder',
    body: 'Hosts: keep meetup capacity honest. Members: RSVP only if you can show up.',
    audience: 'all',
    sentAt: '2026-08-08',
    sent: 8,
  },
])

export const broadcastsStore = {
  list: store.list,
  send(input: { title: string; body: string; audience: BroadcastAudience }) {
    const peopleCount =
      input.audience === 'subscribers' ? subscribersStore.active().length : peopleStore.list().length
    const row: Broadcast = {
      id: `b_${Date.now()}`,
      title: input.title.trim(),
      body: input.body.trim(),
      audience: input.audience,
      sentAt: new Date().toISOString().slice(0, 10),
      sent: peopleCount,
    }
    store.upsert(row)
    notificationsStore.upsert({
      id: `n_${row.id}`,
      title: row.title,
      body: row.body || `Broadcast to ${row.audience}`,
      audience: input.audience === 'subscribers' ? 'subscribers' : 'all',
      sentAt: row.sentAt,
      read: false,
    })
    return row
  },
}
