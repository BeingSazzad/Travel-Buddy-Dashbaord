import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { staffStore } from '@/lib/staffStore'
import { peopleStore } from '@/lib/peopleStore'
import { tripsStore } from '@/lib/tripsStore'
import { eventsStore } from '@/lib/eventsStore'
import { destinationsStore } from '@/lib/destinationsStore'
import { reportsStore } from '@/lib/reportsStore'
import { subscriptionsStore } from '@/lib/subscriptionsStore'
import { reviewsStore } from '@/lib/reviewsStore'
import { dealsStore } from '@/lib/dealsStore'
import { venuesStore } from '@/lib/venuesStore'
import { notificationsStore } from '@/lib/notificationsStore'
import App from './App'
import '@/styles/index.css'

staffStore.list()
peopleStore.list()
tripsStore.list()
eventsStore.list()
destinationsStore.list()
reportsStore.list()
subscriptionsStore.list()
reviewsStore.list()
dealsStore.list()
venuesStore.list()
notificationsStore.list()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
