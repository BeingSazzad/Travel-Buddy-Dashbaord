import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'

export function TransactionsPage() {
  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Money collected from Seluna Plus — new plans, renewals, and refunds."
      />
      <TransactionsTable />
    </div>
  )
}
