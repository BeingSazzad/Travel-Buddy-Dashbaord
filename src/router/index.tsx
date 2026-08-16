import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { AppShell } from '@/components/layout/AppShell'
import { GuestOnly } from '@/components/auth/components/GuestOnly'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { UserDetailPage } from '@/pages/users/UserDetailPage'
import { TripsPage } from '@/pages/trips/TripsPage'
import { EventsPage } from '@/pages/events/EventsPage'
import { DestinationsPage } from '@/pages/destinations/DestinationsPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { SubscriptionsPage } from '@/pages/subscriptions/SubscriptionsPage'
import { SubscribersPage } from '@/pages/subscribers/SubscribersPage'
import { ReviewsPage } from '@/pages/reviews/ReviewsPage'
import { DealsPage } from '@/pages/deals/DealsPage'
import { ContentPage } from '@/pages/content/ContentPage'
import { NotificationsPage } from '@/pages/notifications/NotificationsPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { CmsPage } from '@/pages/cms/CmsPage'
import { BroadcastPage } from '@/pages/broadcast/BroadcastPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ROUTES } from '@/constants/routes'

export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    ),
  },
  {
    path: ROUTES.register,
    element: (
      <GuestOnly>
        <RegisterPage />
      </GuestOnly>
    ),
  },
  {
    path: ROUTES.forgotPassword,
    element: (
      <GuestOnly>
        <ForgotPasswordPage />
      </GuestOnly>
    ),
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: ROUTES.dashboard, element: <DashboardPage /> },
          { path: ROUTES.analytics, element: <Navigate to={ROUTES.dashboard} replace /> },
          { path: ROUTES.users, element: <UsersPage /> },
          { path: ROUTES.userDetail, element: <UserDetailPage /> },
          { path: ROUTES.trips, element: <TripsPage /> },
          { path: ROUTES.events, element: <EventsPage /> },
          { path: ROUTES.destinations, element: <DestinationsPage /> },
          { path: ROUTES.reports, element: <ReportsPage /> },
          { path: ROUTES.subscriptions, element: <SubscriptionsPage /> },
          { path: ROUTES.subscribers, element: <SubscribersPage /> },
          { path: ROUTES.reviews, element: <ReviewsPage /> },
          { path: ROUTES.deals, element: <DealsPage /> },
          { path: ROUTES.content, element: <ContentPage /> },
          { path: ROUTES.notifications, element: <NotificationsPage /> },
          { path: ROUTES.settings, element: <SettingsPage /> },
          { path: ROUTES.cms, element: <CmsPage /> },
          { path: ROUTES.broadcast, element: <BroadcastPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
