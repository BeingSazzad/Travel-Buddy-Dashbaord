import { api } from '../api'
import { reportsStore } from '@/lib/reportsStore'
import { reviewsStore } from '@/lib/reviewsStore'
import { dealsStore } from '@/lib/dealsStore'
import { buildDashboardCharts, type DashboardCharts } from '@/lib/dashboardCharts'

export type DashboardMetrics = DashboardCharts & {
  reports: number
  reviews: number
  deals: number
}

export const metricsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      queryFn: async () => {
        const charts = buildDashboardCharts()
        return {
          data: {
            ...charts,
            reports: reportsStore.list().filter((r) => r.status === 'pending').length,
            reviews: reviewsStore.list().length,
            deals: dealsStore.list().filter((d) => d.active).length,
          },
        }
      },
      providesTags: ['Metrics'],
    }),
  }),
})

export const { useGetDashboardMetricsQuery } = metricsApi
