import { PageHeader } from '@/components/layout/PageHeader'
import { UsersTable } from '@/components/users/UsersTable'

export function UsersPage() {
  return (
    <div>
      <PageHeader title="Members" description="Who’s on Seluna — verification, status, and plans." />
      <UsersTable />
    </div>
  )
}
