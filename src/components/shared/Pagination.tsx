import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export function Pagination({
  page,
  pages,
  total,
  onPage,
}: {
  page: number
  pages: number
  total: number
  onPage: (p: number) => void
}) {
  const noun = total === 1 ? 'result' : 'results'

  return (
    <div className="flex items-center justify-between border-t border-line px-6 py-3.5 text-xs text-muted">
      <span>
        {total} {noun}
        {pages > 1 ? ` · page ${page} of ${pages}` : ''}
      </span>
      {pages > 1 ? (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            <Icon name="chevronLeft" className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
            Next
            <Icon name="chevronRight" className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
