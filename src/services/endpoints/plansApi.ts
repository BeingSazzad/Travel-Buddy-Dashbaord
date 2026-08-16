import { api } from '../api'
import { plansStore, type Plan } from '@/lib/plansStore'

export const plansApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPlans: build.query<Plan[], void>({
      queryFn: async () => ({ data: plansStore.list() }),
      providesTags: ['Plans'],
    }),
    savePlan: build.mutation<Plan, Plan>({
      queryFn: async (row) => ({ data: plansStore.upsert(row) }),
      invalidatesTags: ['Plans', 'Subscriptions', 'Metrics'],
    }),
    removePlan: build.mutation<null, string>({
      queryFn: async (id) => {
        plansStore.remove(id)
        return { data: null }
      },
      invalidatesTags: ['Plans', 'Metrics'],
    }),
  }),
})

export const { useGetPlansQuery, useSavePlanMutation, useRemovePlanMutation } = plansApi
