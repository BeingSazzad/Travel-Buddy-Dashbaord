import { configureStore } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import { rootReducer } from './rootReducer'
import '@/services/endpoints/authApi'
import '@/services/endpoints/usersApi'
import '@/services/endpoints/tripsApi'
import '@/services/endpoints/eventsApi'
import '@/services/endpoints/destinationsApi'
import '@/services/endpoints/reportsApi'
import '@/services/endpoints/plansApi'
import '@/services/endpoints/subscriptionsApi'
import '@/services/endpoints/reviewsApi'
import '@/services/endpoints/dealsApi'
import '@/services/endpoints/venuesApi'
import '@/services/endpoints/notificationsApi'
import '@/services/endpoints/metricsApi'
import '@/services/endpoints/cmsApi'
import '@/services/endpoints/broadcastsApi'
import '@/services/endpoints/transactionsApi'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
