import { PageHeader } from '@/components/layout/PageHeader'
import { ReviewsTable } from '@/components/reviews/ReviewsTable'

export function ReviewsPage() {
  return (
    <div>
      <PageHeader title="Reviews" description="Place reviews and flagged content." />
      <ReviewsTable />
    </div>
  )
}
