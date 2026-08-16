import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8 shadow-[0_24px_60px_rgba(13,20,37,0.12)]">
        <BrandLogo size="sm" tone="dark" />
        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Admin Dashboard</p>
        <p className="mt-6 font-display text-xl font-semibold tracking-tight">Invite only</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Admin accounts are created by an existing admin. There is no public signup.
        </p>
        <Link to={ROUTES.login} className="mt-6 inline-flex">
          <Button>Back to sign in</Button>
        </Link>
      </div>
    </div>
  )
}
