import { PLANS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'

export type BillingPeriod = 'month' | 'year'

export type Plan = {
  id: string
  name: string
  price: number
  period: BillingPeriod
  badge: string
  blurb: string
  featured: boolean
  active: boolean
  benefits: string[]
}

const store = createStore<Plan>(PLANS_STORAGE_KEY, [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 5.29,
    period: 'month',
    badge: '',
    blurb: 'Billed monthly',
    featured: false,
    active: true,
    benefits: ['Match with travellers on the same dates', 'Join local meetups', 'Member-only places and deals'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 44.49,
    period: 'year',
    badge: 'Save 30%',
    blurb: 'Best value',
    featured: true,
    active: true,
    benefits: ['Everything in Monthly', 'Two months free vs paying monthly', 'Priority access to popular events'],
  },
])

export function planMonthlyAmount(plan: Plan) {
  return plan.period === 'year' ? plan.price / 12 : plan.price
}

export const plansStore = store
