import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'

export function SettingsPage() {
  const { user } = useAuth()
  return (
    <div>
      <PageHeader title="Settings" description="This dashboard is frontend-only demo data." />
      <Card className="max-w-xl space-y-3">
        <p className="text-sm text-muted">Signed in as</p>
        <p className="font-medium text-ink">{user?.name}</p>
        <p className="text-sm text-muted">{user?.email} · {user?.role}</p>
      </Card>
    </div>
  )
}
