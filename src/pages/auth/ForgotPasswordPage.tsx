import { Link } from 'react-router-dom'
import { useState } from 'react'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { staffStore } from '@/lib/staffStore'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8 shadow-[0_24px_60px_rgba(44,34,23,0.12)]">
        <BrandLogo size="sm" tone="dark" />
        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Admin Dashboard</p>
        <p className="mt-6 font-display text-xl font-semibold tracking-tight">Forgot password</p>
        <p className="mt-2 text-sm leading-6 text-muted">Enter the admin email. Demo only — no mail is sent.</p>
        {sent ? (
          <p className="mt-6 text-sm text-emerald-700">If that email is an admin, a reset was queued.</p>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              staffStore.requestReset(email)
              setSent(true)
            }}
          >
            <Input label="Email" type="email" icon="mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" className="w-full">
              <Icon name="send" className="h-4 w-4" />
              Send reset
            </Button>
          </form>
        )}
        <Link to={ROUTES.login} className="mt-6 inline-flex text-sm font-medium text-muted hover:text-ink">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
