import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authBase, type AuthUser } from '@/services/api'

type AuthState = {
  user: AuthUser | null
}

const initialState: AuthState = {
  user: authBase.me(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
    },
  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
