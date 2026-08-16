import { api } from '../api'
import { venuesStore, type Venue } from '@/lib/venuesStore'

export const venuesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVenues: build.query<Venue[], void>({
      queryFn: async () => ({ data: venuesStore.list() }),
      providesTags: ['Venues'],
    }),
    toggleVenueFeatured: build.mutation<Venue | null, string>({
      queryFn: async (id) => {
        const row = venuesStore.get(id)
        if (!row) return { data: null }
        return { data: venuesStore.patch(id, { featured: !row.featured }) }
      },
      invalidatesTags: ['Venues'],
    }),
  }),
})

export const { useGetVenuesQuery, useToggleVenueFeaturedMutation } = venuesApi
