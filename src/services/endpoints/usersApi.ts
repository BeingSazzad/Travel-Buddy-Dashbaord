import { api } from '../api'
import { peopleStore, type Member } from '@/lib/peopleStore'
import type { UserStatus } from '@/types/common.types'

export type AdminUser = Member

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<AdminUser[], void>({
      queryFn: async () => ({ data: peopleStore.list() }),
      providesTags: ['Users'],
    }),
    getUser: build.query<AdminUser | null, string>({
      queryFn: async (id) => ({ data: peopleStore.get(id) }),
      providesTags: ['Users'],
    }),
    setUserStatus: build.mutation<AdminUser | null, { id: string; status: UserStatus }>({
      queryFn: async ({ id, status }) => ({ data: peopleStore.patch(id, { status }) }),
      invalidatesTags: ['Users', 'Metrics'],
    }),
  }),
})

export const { useGetUsersQuery, useGetUserQuery, useSetUserStatusMutation } = usersApi
