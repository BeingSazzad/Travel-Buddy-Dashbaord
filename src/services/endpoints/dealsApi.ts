import { api } from '../api'
import { dealsStore, type Deal } from '@/lib/dealsStore'

export const dealsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDeals: build.query<Deal[], void>({
      queryFn: async () => ({ data: dealsStore.list() }),
      providesTags: ['Deals'],
    }),
    toggleDeal: build.mutation<Deal | null, string>({
      queryFn: async (id) => {
        const row = dealsStore.get(id)
        if (!row) return { data: null }
        return { data: dealsStore.patch(id, { active: !row.active }) }
      },
      invalidatesTags: ['Deals'],
    }),
  }),
})

export const { useGetDealsQuery, useToggleDealMutation } = dealsApi
