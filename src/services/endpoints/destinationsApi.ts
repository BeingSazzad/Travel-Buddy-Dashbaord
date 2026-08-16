import { api } from '../api'
import { destinationsStore, type Destination } from '@/lib/destinationsStore'

export const destinationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDestinations: build.query<Destination[], void>({
      queryFn: async () => ({ data: destinationsStore.list() }),
      providesTags: ['Destinations'],
    }),
    toggleFeatured: build.mutation<Destination | null, string>({
      queryFn: async (id) => {
        const row = destinationsStore.get(id)
        if (!row) return { data: null }
        return { data: destinationsStore.patch(id, { featured: !row.featured }) }
      },
      invalidatesTags: ['Destinations'],
    }),
  }),
})

export const { useGetDestinationsQuery, useToggleFeaturedMutation } = destinationsApi
