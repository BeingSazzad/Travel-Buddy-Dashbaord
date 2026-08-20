import { api } from '../api'
import { tripsStore, type Trip } from '@/lib/tripsStore'

export const tripsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTrips: build.query<Trip[], void>({
      queryFn: async () => ({ data: tripsStore.list() }),
      providesTags: ['Trips'],
    }),
    getTrip: build.query<Trip | null, string>({
      queryFn: async (id) => ({ data: tripsStore.get(id) }),
      providesTags: ['Trips'],
    }),
    setTripVisibility: build.mutation<Trip | null, { id: string; visibility: Trip['visibility'] }>({
      queryFn: async ({ id, visibility }) => ({ data: tripsStore.patch(id, { visibility }) }),
      invalidatesTags: ['Trips', 'Metrics'],
    }),
    deleteTrip: build.mutation<{ id: string }, string>({
      queryFn: async (id) => {
        tripsStore.remove(id)
        return { data: { id } }
      },
      invalidatesTags: ['Trips', 'Metrics'],
    }),
  }),
})

export const { useGetTripsQuery, useGetTripQuery, useSetTripVisibilityMutation, useDeleteTripMutation } = tripsApi
