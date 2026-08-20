import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function SubscribersPage() {
  return <Navigate to={ROUTES.users} replace />
}
