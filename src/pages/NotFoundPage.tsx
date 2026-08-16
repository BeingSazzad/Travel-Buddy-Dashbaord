import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface">
      <p className="font-display text-2xl font-semibold">Page not found</p>
      <Link to={ROUTES.dashboard}>
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  )
}
