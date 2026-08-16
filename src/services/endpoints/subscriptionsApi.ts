import { api } from '../api'
import { subscribersStore, type Subscriber } from '@/lib/subscribersStore'

export type { Subscriber }

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscribers: build.query<Subscriber[], void>({
      queryFn: async () => ({ data: subscribersStore.list() }),
      providesTags: ['Subscriptions'],
    }),
    saveSubscriber: build.mutation<Subscriber, Subscriber>({
      queryFn: async (row) => ({ data: subscribersStore.save(row) }),
      invalidatesTags: ['Subscriptions', 'Users', 'Metrics'],
    }),
    removeSubscriber: build.mutation<null, string>({
      queryFn: async (id) => {
        subscribersStore.remove(id)
        return { data: null }
      },
      invalidatesTags: ['Subscriptions', 'Users', 'Metrics'],
    }),
  }),
})

export const { useGetSubscribersQuery, useSaveSubscriberMutation, useRemoveSubscriberMutation } = subscriptionsApi
