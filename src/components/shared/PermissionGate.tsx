import type { ReactNode } from 'react'
import { useAppSelector } from '@/store/hooks'
import type { Role } from '@/types/common.types'

export function PermissionGate({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const role = useAppSelector((s) => s.auth.user?.role)
  if (!role || !allow.includes(role)) return null
  return <>{children}</>
}
