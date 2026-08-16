import { api } from '../api'
import { eventsStore, type Meetup } from '@/lib/eventsStore'

export const eventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query<Meetup[], void>({
      queryFn: async () => ({ data: eventsStore.list() }),
      providesTags: ['Events'],
    }),
    setEventStatus: build.mutation<Meetup | null, { id: string; status: Meetup['status'] }>({
      queryFn: async ({ id, status }) => ({ data: eventsStore.patch(id, { status }) }),
      invalidatesTags: ['Events', 'Metrics'],
    }),
  }),
})

export const { useGetEventsQuery, useSetEventStatusMutation } = eventsApi
