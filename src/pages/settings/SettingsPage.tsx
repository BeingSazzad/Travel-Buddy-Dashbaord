import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { Tabs } from '@/components/shared/Tabs'
import { personPhoto } from '@/lib/photos'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '@/components/auth/authSlice'
import {
  useChangePasswordMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} from '@/services/endpoints/authApi'
import { ROUTES } from '@/constants/routes'

function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

export function SettingsPage() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [profileMsg, setProfileMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: savingPassword }] = useChangePasswordMutation()
  const [logout] = useLogoutMutation()

  useEffect(() => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
  }, [user?.name, user?.email])

  return (
    <div>
      <PageHeader title="Settings" description="Your name, email, and password for this admin workspace." />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: 'profile', label: 'Profile', icon: 'user' },
          { id: 'password', label: 'Password', icon: 'lock' },
        ]}
      />

      <div className="max-w-xl space-y-4">
        {tab === 'profile' ? (
          <Card>
            <div className="mb-5 flex items-center gap-4">
              <Avatar name={name || user?.name || 'Admin'} image={user?.avatar || personPhoto(user?.id ?? 'admin')} size="lg" />
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-ink">{name || user?.name}</p>
                <p className="mt-0.5 text-sm text-muted">{email || user?.email}</p>
                <div className="mt-2">
                  <Badge tone="info">{user?.role ?? 'admin'}</Badge>
                </div>
              </div>
            </div>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                setProfileMsg('')
                setProfileError('')
                const res = await updateProfile({ name: name.trim(), email: email.trim() })
                if ('data' in res && res.data) {
                  dispatch(setUser(res.data))
                  setProfileMsg('Profile saved.')
                  return
                }
                setProfileError(errorMessage('error' in res ? res.error : null, 'Could not save profile.'))
              }}
            >
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={savingProfile || !name.trim() || !email.trim()}>
                {savingProfile ? 'Saving…' : 'Save profile'}
              </Button>
              {profileMsg ? <p className="text-sm text-emerald-700">{profileMsg}</p> : null}
              {profileError ? <p className="text-sm text-rose-600">{profileError}</p> : null}
            </form>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-muted">Change the password you use to sign in to this demo admin.</p>
            <form
              className="mt-5 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                setPasswordMsg('')
                setPasswordError('')
                if (nextPassword !== confirmPassword) {
                  setPasswordError('New passwords do not match.')
                  return
                }
                const res = await changePassword({ currentPassword, nextPassword })
                if ('data' in res && res.data) {
                  setCurrentPassword('')
                  setNextPassword('')
                  setConfirmPassword('')
                  setPasswordMsg('Password updated.')
                  return
                }
                setPasswordError(errorMessage('error' in res ? res.error : null, 'Could not change password.'))
              }}
            >
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <Input
                label="New password"
                type="password"
                value={nextPassword}
                onChange={(e) => setNextPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <Button type="submit" disabled={savingPassword || !currentPassword || !nextPassword}>
                {savingPassword ? 'Updating…' : 'Update password'}
              </Button>
              {passwordMsg ? <p className="text-sm text-emerald-700">{passwordMsg}</p> : null}
              {passwordError ? <p className="text-sm text-rose-600">{passwordError}</p> : null}
            </form>
          </Card>
        )}

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Session</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Sign out of this browser. Demo data stays in local storage until you clear it.
          </p>
          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={async () => {
              await logout()
              dispatch(setUser(null))
              navigate(ROUTES.login)
            }}
          >
            <Icon name="logout" className="h-4 w-4" />
            Sign out
          </Button>
        </Card>
      </div>
    </div>
  )
}
