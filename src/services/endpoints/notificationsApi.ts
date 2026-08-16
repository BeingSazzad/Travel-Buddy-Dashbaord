import { api } from '../api'
import { notificationsStore, type AdminNotice } from '@/lib/notificationsStore'

export const notificationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<AdminNotice[], void>({
      queryFn: async () => ({ data: notificationsStore.list() }),
      providesTags: ['Notifications'],
    }),
    markRead: build.mutation<AdminNotice | null, string>({
      queryFn: async (id) => ({ data: notificationsStore.patch(id, { read: true }) }),
      invalidatesTags: ['Notifications'],
    }),
  }),
})

export const { useGetNotificationsQuery, useMarkReadMutation } = notificationsApi
