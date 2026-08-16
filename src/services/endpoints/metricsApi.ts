import { api } from '../api'
import { peopleStore } from '@/lib/peopleStore'
import { tripsStore } from '@/lib/tripsStore'
import { eventsStore } from '@/lib/eventsStore'
import { reportsStore } from '@/lib/reportsStore'
import { subscriptionsStore } from '@/lib/subscriptionsStore'
import { reviewsStore } from '@/lib/reviewsStore'
import { dealsStore } from '@/lib/dealsStore'

export type DashboardMetrics = {
  users: number
  trips: number
  events: number
  reports: number
  subscribers: number
  reviews: number
  deals: number
  mrr: number
  sparkUsers: number[]
  sparkTrips: number[]
}

export const metricsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      queryFn: async () => {
        const subs = subscriptionsStore.list().filter((s) => s.status === 'active')
        return {
          data: {
            users: peopleStore.list().length,
            trips: tripsStore.list().length,
            events: eventsStore.list().length,
            reports: reportsStore.list().filter((r) => r.status === 'pending').length,
            subscribers: subs.length,
            reviews: reviewsStore.list().length,
            deals: dealsStore.list().filter((d) => d.active).length,
            mrr: subs.reduce((sum, s) => sum + (s.plan === 'Annual' ? Math.round(s.amount / 12) : s.amount), 0),
            sparkUsers: [4, 5, 6, 6, 7, 8, 8],
            sparkTrips: [2, 2, 3, 4, 4, 5, 5],
          },
        }
      },
      providesTags: ['Metrics'],
    }),
  }),
})

export const { useGetDashboardMetricsQuery } = metricsApi
