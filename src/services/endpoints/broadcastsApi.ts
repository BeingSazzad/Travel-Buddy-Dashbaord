import { api } from '../api'
import { broadcastsStore, type Broadcast, type BroadcastAudience } from '@/lib/broadcastsStore'

export const broadcastsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBroadcasts: build.query<Broadcast[], void>({
      queryFn: async () => ({ data: broadcastsStore.list() }),
      providesTags: ['Broadcasts'],
    }),
    sendBroadcast: build.mutation<Broadcast, { title: string; body: string; audience: BroadcastAudience }>({
      queryFn: async (body) => ({ data: broadcastsStore.send(body) }),
      invalidatesTags: ['Broadcasts', 'Notifications'],
    }),
  }),
})

export const { useGetBroadcastsQuery, useSendBroadcastMutation } = broadcastsApi
