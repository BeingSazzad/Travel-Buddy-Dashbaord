import { useAppSelector } from '@/store/hooks'

export function useAuth() {
  const user = useAppSelector((s) => s.auth.user)
  return { user, isAuthenticated: Boolean(user) }
}
