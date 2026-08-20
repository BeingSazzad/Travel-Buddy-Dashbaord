import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { ConfirmAction } from '@/components/shared/ConfirmAction'
import { Tabs } from '@/components/shared/Tabs'
import { personPhoto } from '@/lib/photos'
import { formatDisplayDate } from '@/lib/utils'
import { staffStore, type StaffMember } from '@/lib/staffStore'
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

  // Admin Team States
  const [adminList, setAdminList] = useState(() => staffStore.list())
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [addAdminError, setAddAdminError] = useState('')
  const [revokingAdmin, setRevokingAdmin] = useState<StaffMember | null>(null)

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
          { id: 'team', label: 'Admin Team & Roles', icon: 'people' },
        ]}
      />

      <div className="max-w-2xl space-y-6">
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
        ) : tab === 'password' ? (
          <Card>
            <p className="text-sm text-muted">Change the password you use to sign in to this admin workspace.</p>
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
        ) : (
          /* Admin Team & Access Control Tab */
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
                <div>
                  <h3 className="text-base font-semibold text-ink">Admin Team Members</h3>
                  <p className="text-xs text-muted">Manage administrators with access to Seluna Admin</p>
                </div>
                <Button size="sm" onClick={() => setShowAddAdmin(true)}>
                  <Icon name="plus" className="mr-1.5 h-3.5 w-3.5" />
                  Add New Admin
                </Button>
              </div>

              <div className="divide-y divide-line/60">
                {adminList.map((adm) => (
                  <div key={adm.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar name={adm.name} image={adm.avatar || personPhoto(adm.id)} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{adm.name}</p>
                          <Badge tone={adm.email === 'admin@seluna.app' ? 'success' : 'info'}>
                            {adm.email === 'admin@seluna.app' ? 'Owner / Super Admin' : 'Admin'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted">{adm.email} · Added {formatDisplayDate(adm.createdAt)}</p>
                      </div>
                    </div>

                    {adm.email !== 'admin@seluna.app' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                        onClick={() => setRevokingAdmin(adm)}
                      >
                        <Icon name="trash" className="h-3.5 w-3.5 mr-1" />
                        Revoke Access
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-muted bg-surface px-2.5 py-1 rounded-md">Primary Account</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
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

        {/* Modal: Add New Admin */}
        <Modal open={showAddAdmin} title="Add New Admin" onClose={() => setShowAddAdmin(false)}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              setAddAdminError('')
              if (!newAdminName.trim() || !newAdminEmail.trim()) return
              const res = staffStore.addAdmin(newAdminName, newAdminEmail)
              if (res.error) {
                setAddAdminError(res.error)
                return
              }
              setAdminList(staffStore.list())
              setNewAdminName('')
              setNewAdminEmail('')
              setShowAddAdmin(false)
            }}
          >
            <Input
              label="Full Name"
              placeholder="e.g. Sarah Jenkins"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. sarah@seluna.app"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              required
            />
            {addAdminError ? <p className="text-xs text-rose-600">{addAdminError}</p> : null}
            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <Button variant="secondary" type="button" onClick={() => setShowAddAdmin(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Admin
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Confirm Revoke Admin */}
        <ConfirmAction
          open={Boolean(revokingAdmin)}
          title="Revoke Admin Access?"
          body={`${revokingAdmin?.name} (${revokingAdmin?.email}) will no longer be able to log in to Seluna Admin.`}
          confirmLabel="Revoke Access"
          danger
          onClose={() => setRevokingAdmin(null)}
          onConfirm={() => {
            if (revokingAdmin) {
              staffStore.removeAdmin(revokingAdmin.id)
              setAdminList(staffStore.list())
            }
            setRevokingAdmin(null)
          }}
        />
      </div>
    </div>
  )
}
