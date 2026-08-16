import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { personPhoto } from '@/lib/photos'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '@/components/auth/authSlice'
import { useLogoutMutation } from '@/services/endpoints/authApi'
import { ROUTES } from '@/constants/routes'

export function SettingsPage() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="Settings" description="Your admin profile for this demo workspace." />
      <div className="grid max-w-3xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="flex items-start gap-4">
          <Avatar name={user?.name ?? 'Admin'} image={user?.avatar || personPhoto(user?.id ?? 'admin')} size="lg" />
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold text-ink">{user?.name}</p>
            <p className="mt-1 text-sm text-muted">{user?.email}</p>
            <div className="mt-3">
              <Badge tone="info">{user?.role ?? 'admin'}</Badge>
            </div>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Workspace</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Seluna admin is frontend-only. Changes stay in this browser — there is no live backend.
          </p>
          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={async () => {
              await logout()
              dispatch(setUser(null))
              navigate(ROUTES.login)
            }}
          >
            <Icon name="logout" className="h-4 w-4" />
            Sign out
          </Button>
        </Card>
      </div>
    </div>
  )
}
