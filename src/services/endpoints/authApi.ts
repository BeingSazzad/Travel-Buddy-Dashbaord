import { api, authBase, type AuthUser } from '../api'

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthUser, { email: string; password: string }>({
      queryFn: async (body) => {
        try {
          return { data: await authBase.login(body) }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: ['Auth'],
    }),
    logout: build.mutation<boolean, void>({
      queryFn: async () => {
        authBase.logout()
        return { data: true }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
