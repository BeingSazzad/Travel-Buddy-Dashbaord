import { api } from '../api'
import { subscriptionsStore, type Subscription } from '@/lib/subscriptionsStore'

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptions: build.query<Subscription[], void>({
      queryFn: async () => ({ data: subscriptionsStore.list() }),
      providesTags: ['Subscriptions'],
    }),
  }),
})

export const { useGetSubscriptionsQuery } = subscriptionsApi
