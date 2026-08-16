import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { BrandLogo } from '@/components/brand/BrandLogo'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-6">
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8 text-center shadow-[0_24px_60px_rgba(13,20,37,0.12)]">
        <div className="flex justify-center">
          <BrandLogo size="sm" tone="dark" />
        </div>
        <p className="mt-6 font-display text-xl font-semibold tracking-tight">Page not found</p>
        <p className="mt-2 text-sm leading-6 text-muted">That URL isn’t in the Seluna admin.</p>
        <Link to={ROUTES.dashboard} className="mt-6 inline-flex">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
