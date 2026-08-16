import { useAppSelector } from '@/store/hooks'

export function useSession() {
  const user = useAppSelector((s) => s.auth.user)
  return { user, isAuthenticated: Boolean(user) }
}
