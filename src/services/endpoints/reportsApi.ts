import { api } from '../api'
import { reportsStore, type Report } from '@/lib/reportsStore'

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReports: build.query<Report[], void>({
      queryFn: async () => ({ data: reportsStore.list() }),
      providesTags: ['Reports'],
    }),
    setReportStatus: build.mutation<Report | null, { id: string; status: Report['status'] }>({
      queryFn: async ({ id, status }) => ({ data: reportsStore.patch(id, { status }) }),
      invalidatesTags: ['Reports', 'Metrics'],
    }),
  }),
})

export const { useGetReportsQuery, useSetReportStatusMutation } = reportsApi
