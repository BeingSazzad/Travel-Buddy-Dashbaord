import { PageHeader } from '@/components/layout/PageHeader'
import { UsersTable } from '@/components/users/UsersTable'

export function UsersPage() {
  return (
    <div>
      <PageHeader title="Users" description="Members, verification, and account status." />
      <UsersTable />
    </div>
  )
}
