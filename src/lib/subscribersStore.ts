import { SUBS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import { peopleStore } from '@/lib/peopleStore'
import { plansStore, planMonthlyAmount } from '@/lib/plansStore'
import type { SubStatus } from '@/types/common.types'

export type Subscriber = {
  id: string
  memberId: string
  member: string
  email: string
  planId: string
  status: SubStatus
  renews: string
}

const store = createStore<Subscriber>(SUBS_STORAGE_KEY, [
  { id: 'sub1', memberId: 'u1', member: 'Clara Nielsen', email: 'clara.nielsen@proton.me', planId: 'monthly', status: 'active', renews: '2026-09-11' },
  { id: 'sub2', memberId: 'u2', member: 'Amelia Hart', email: 'amelia@seluna.app', planId: 'yearly', status: 'active', renews: '2027-04-02' },
  { id: 'sub3', memberId: 'u5', member: 'Nora Berg', email: 'nora@seluna.app', planId: 'monthly', status: 'active', renews: '2026-09-11' },
  { id: 'sub4', memberId: 'u3', member: 'Sofia Reyes', email: 'sofia@seluna.app', planId: 'monthly', status: 'pending', renews: '2026-09-18' },
  { id: 'sub5', memberId: 'u4', member: 'Maya Chen', email: 'maya@seluna.app', planId: 'monthly', status: 'cancelled', renews: '2026-08-09' },
  { id: 'sub6', memberId: 'u7', member: 'Elena Rossi', email: 'elena@seluna.app', planId: 'monthly', status: 'expired', renews: '2026-07-22' },
  { id: 'sub7', memberId: 'u8', member: 'Hana Kim', email: 'hana@seluna.app', planId: 'yearly', status: 'cancelled', renews: '2026-02-28' },
])

function syncMember(row: Subscriber) {
  peopleStore.patch(row.memberId, { subscription: row.status })
}

export const subscribersStore = {
  list: store.list,
  get: store.get,
  save(row: Subscriber) {
    store.upsert(row)
    syncMember(row)
    return row
  },
  patch(id: string, partial: Partial<Subscriber>) {
    const next = store.patch(id, partial)
    if (next) syncMember(next)
    return next
  },
  remove(id: string) {
    const row = store.get(id)
    store.remove(id)
    if (row) peopleStore.patch(row.memberId, { subscription: 'expired' })
  },
  active() {
    return store.list().filter((row) => row.status === 'active')
  },
  mrr() {
    return subscribersStore.active().reduce((sum, row) => {
      const plan = plansStore.get(row.planId)
      return sum + (plan ? planMonthlyAmount(plan) : 0)
    }, 0)
  },
}

/** @deprecated use subscribersStore */
export const subscriptionsStore = subscribersStore
