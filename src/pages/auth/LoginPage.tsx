import { LoginForm } from '@/components/auth/components/LoginForm'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { DEMO_ADMIN } from '@/lib/constants'

const HERO =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=80'

export function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.2fr_0.8fr]">
      <aside className="relative hidden min-h-screen overflow-hidden text-white lg:flex lg:flex-col">
        <img src={HERO} alt="Travel" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2c2217] via-[#2c2217]/78 to-[#2c2217]/25" />
        <div className="relative z-10 flex h-full flex-col px-12 py-12 xl:px-16">
          <div>
            <BrandLogo size="md" />
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">Admin Dashboard</p>
          </div>
          <div className="mt-auto max-w-lg pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-200">Admin</p>
            <p className="mt-3 font-display text-[42px] font-semibold leading-[1.08] tracking-tight">
              Run Seluna from one place.
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              Members, trips, events, reports, and subscriptions — light web console, separate from the app.
            </p>
          </div>
        </div>
      </aside>
      <div className="relative flex items-center justify-center bg-surface p-6 sm:p-10">
        <div className="relative w-full max-w-[400px] rounded-2xl border border-line bg-white/95 p-8 shadow-[0_24px_60px_rgba(13,20,37,0.12)]">
          <div className="mb-7 lg:hidden">
            <BrandLogo size="sm" tone="dark" />
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Admin Dashboard</p>
          </div>
          <p className="font-display text-xl font-semibold tracking-tight">Sign in</p>
          <p className="mb-8 mt-2 text-sm leading-6 text-muted">
            Demo: {DEMO_ADMIN.email} / {DEMO_ADMIN.password}
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
