import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function AnalyticsPage() {
  return <Navigate to={ROUTES.dashboard} replace />
}
