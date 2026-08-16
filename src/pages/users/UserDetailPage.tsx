import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { formatDisplayDate } from '@/lib/utils'
import { useGetUserQuery, useSetUserStatusMutation } from '@/services/endpoints/usersApi'

export function UserDetailPage() {
  const { id = '' } = useParams()
  const { data } = useGetUserQuery(id)
  const [setStatus] = useSetUserStatusMutation()

  if (!data) {
    return (
      <div>
        <PageHeader title="Member not found" />
        <Link to={ROUTES.users} className="text-sm text-primary-700">
          Back to users
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={data.name} description={data.email} />
      <Card className="flex flex-wrap items-start gap-6">
        <Avatar name={data.name} size="lg" />
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <p className="text-sm text-muted">
            City <span className="block font-medium text-ink">{data.city}, {data.country}</span>
          </p>
          <p className="text-sm text-muted">
            Joined <span className="block font-medium text-ink">{formatDisplayDate(data.joined)}</span>
          </p>
          <p className="text-sm text-muted">
            Status <span className="mt-1 block"><Badge tone={data.status === 'active' ? 'success' : 'danger'}>{data.status}</Badge></span>
          </p>
          <p className="text-sm text-muted">
            Subscription <span className="mt-1 block"><Badge tone="info">{data.subscription}</Badge></span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="warn" size="sm" onClick={() => setStatus({ id: data.id, status: 'suspended' })}>
            Suspend
          </Button>
          <Button variant="danger" size="sm" onClick={() => setStatus({ id: data.id, status: 'banned' })}>
            Ban
          </Button>
        </div>
      </Card>
    </div>
  )
}
