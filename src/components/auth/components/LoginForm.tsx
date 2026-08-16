import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { useLoginMutation } from '@/services/endpoints/authApi'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '@/components/auth/authSlice'
import { ROUTES } from '@/constants/routes'
import { DEMO_ADMIN } from '@/lib/constants'

export function LoginForm() {
  const [email, setEmail] = useState(DEMO_ADMIN.email)
  const [password, setPassword] = useState(DEMO_ADMIN.password)
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const message =
    error && typeof error === 'object' && 'message' in error ? String(error.message) : undefined

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault()
        const result = await login({ email, password })
        if ('data' in result && result.data) {
          dispatch(setUser(result.data))
          navigate(ROUTES.dashboard)
        }
      }}
    >
      <Input label="Email" type="email" icon="mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input
        label="Password"
        type="password"
        icon="lock"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {message ? <p className="text-sm text-rose-600">{message}</p> : null}
      <p className="text-right">
        <Link to={ROUTES.forgotPassword} className="text-sm font-medium text-muted hover:text-ink">
          Forgot password
        </Link>
      </p>
      <Button type="submit" className="w-full" disabled={isLoading}>
        <Icon name="login" className="h-4 w-4" />
        {isLoading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
