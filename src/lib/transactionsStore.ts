import { TRANSACTIONS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'

export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed'
export type PaymentKind = 'subscription' | 'renewal' | 'refund'

export type Transaction = {
  id: string
  memberId: string
  member: string
  email: string
  plan: string
  kind: PaymentKind
  amount: number
  status: PaymentStatus
  method: string
  reference: string
  paidAt: string
}

const store = createStore<Transaction>(TRANSACTIONS_STORAGE_KEY, [
  { id: 'tx12', memberId: 'u1', member: 'Clara Nielsen', email: 'clara.nielsen@proton.me', plan: 'Monthly', kind: 'renewal', amount: 5.29, status: 'paid', method: 'Visa · 4242', reference: 'pi_8k2n1c', paidAt: '2026-08-11' },
  { id: 'tx11', memberId: 'u5', member: 'Nora Berg', email: 'nora@seluna.app', plan: 'Monthly', kind: 'renewal', amount: 5.29, status: 'paid', method: 'Visa · 1881', reference: 'pi_7q9m2a', paidAt: '2026-08-11' },
  { id: 'tx10', memberId: 'u3', member: 'Sofia Reyes', email: 'sofia@seluna.app', plan: 'Monthly', kind: 'subscription', amount: 5.29, status: 'pending', method: 'Mastercard · 5510', reference: 'pi_6w4t8d', paidAt: '2026-08-18' },
  { id: 'tx9', memberId: 'u6', member: 'Priya Shah', email: 'priya@seluna.app', plan: 'Monthly', kind: 'subscription', amount: 5.29, status: 'pending', method: 'Visa · 3012', reference: 'pi_5r1b9e', paidAt: '2026-08-01' },
  { id: 'tx8', memberId: 'u2', member: 'Amelia Hart', email: 'amelia@seluna.app', plan: 'Yearly', kind: 'subscription', amount: 44.49, status: 'paid', method: 'Visa · 8890', reference: 'pi_4h8c3f', paidAt: '2026-04-02' },
  { id: 'tx7', memberId: 'u1', member: 'Clara Nielsen', email: 'clara.nielsen@proton.me', plan: 'Monthly', kind: 'renewal', amount: 5.29, status: 'paid', method: 'Visa · 4242', reference: 'pi_3n7j2g', paidAt: '2026-07-11' },
  { id: 'tx6', memberId: 'u5', member: 'Nora Berg', email: 'nora@seluna.app', plan: 'Monthly', kind: 'renewal', amount: 5.29, status: 'paid', method: 'Visa · 1881', reference: 'pi_2p5k6h', paidAt: '2026-07-11' },
  { id: 'tx5', memberId: 'u4', member: 'Maya Chen', email: 'maya@seluna.app', plan: 'Monthly', kind: 'refund', amount: -5.29, status: 'refunded', method: 'Visa · 6621', reference: 're_1m4s0i', paidAt: '2026-08-09' },
  { id: 'tx4', memberId: 'u4', member: 'Maya Chen', email: 'maya@seluna.app', plan: 'Monthly', kind: 'subscription', amount: 5.29, status: 'paid', method: 'Visa · 6621', reference: 'pi_0l3d7j', paidAt: '2026-07-09' },
  { id: 'tx3', memberId: 'u7', member: 'Elena Rossi', email: 'elena@seluna.app', plan: 'Monthly', kind: 'renewal', amount: 5.29, status: 'failed', method: 'Visa · 1194', reference: 'pi_9c2e8k', paidAt: '2026-07-22' },
  { id: 'tx2', memberId: 'u7', member: 'Elena Rossi', email: 'elena@seluna.app', plan: 'Monthly', kind: 'subscription', amount: 5.29, status: 'paid', method: 'Visa · 1194', reference: 'pi_8b1f4l', paidAt: '2026-06-22' },
  { id: 'tx1', memberId: 'u8', member: 'Hana Kim', email: 'hana@seluna.app', plan: 'Yearly', kind: 'refund', amount: -44.49, status: 'refunded', method: 'Mastercard · 4401', reference: 're_7a0g5m', paidAt: '2026-02-28' },
])

export function transactionTotals(rows: Transaction[], now = new Date()) {
  const paid = rows.filter((r) => r.status === 'paid')
  const collected = paid.reduce((sum, r) => sum + r.amount, 0)
  const refunded = rows.filter((r) => r.status === 'refunded').reduce((sum, r) => sum + Math.abs(r.amount), 0)
  const pending = rows.filter((r) => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const thisMonth = paid.filter((r) => r.paidAt.startsWith(monthKey)).reduce((sum, r) => sum + r.amount, 0)
  return { collected, refunded, pending, thisMonth, count: paid.length }
}

export const transactionsStore = store
