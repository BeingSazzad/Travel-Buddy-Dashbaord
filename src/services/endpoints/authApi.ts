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
    updateProfile: build.mutation<AuthUser, { name: string; email: string }>({
      queryFn: async (body) => {
        try {
          return { data: await authBase.updateProfile(body) }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: ['Auth'],
    }),
    changePassword: build.mutation<boolean, { currentPassword: string; nextPassword: string }>({
      queryFn: async (body) => {
        try {
          return { data: await authBase.changePassword(body) }
        } catch (error) {
          return { error }
        }
      },
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

export const {
  useLoginMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi
