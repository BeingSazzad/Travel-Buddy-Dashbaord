import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTH_STORAGE_KEY } from '@/lib/constants'
import { staffStore } from '@/lib/staffStore'
import type { Role } from '@/types/common.types'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
  token: string
  avatar: string
}

function delay(ms = 250) {
  return new Promise((r) => setTimeout(r, ms))
}

function persist(user: AuthUser) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  return user
}

function readUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'Auth',
    'Users',
    'Trips',
    'Events',
    'Destinations',
    'Reports',
    'Subscriptions',
    'Plans',
    'Reviews',
    'Deals',
    'Venues',
    'Notifications',
    'Metrics',
    'Cms',
    'Broadcasts',
    'Transactions',
  ],
  endpoints: () => ({}),
})

function toAuthUser(staff: { id: string; name: string; email: string; role: Role; avatar: string }): AuthUser {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    token: 'demo-jwt',
    avatar: staff.avatar,
  }
}

export const authBase = {
  async login(body: { email: string; password: string }): Promise<AuthUser> {
    await delay()
    const staff = staffStore.findByEmail(body.email)
    if (staff && staff.password === body.password) {
      return persist(toAuthUser(staff))
    }
    throw { status: 401, message: 'Invalid email or password' }
  },
  async updateProfile(body: { name: string; email: string }): Promise<AuthUser> {
    await delay()
    const me = readUser()
    if (!me) throw { status: 401, message: 'Not signed in' }
    const result = staffStore.updateProfile(me.id, body)
    if (!result || 'error' in result) throw { status: 400, message: result?.error ?? 'Could not update profile' }
    if (!result.data) throw { status: 404, message: 'Account not found' }
    return persist(toAuthUser(result.data))
  },
  async changePassword(body: { currentPassword: string; nextPassword: string }): Promise<boolean> {
    await delay()
    const me = readUser()
    if (!me) throw { status: 401, message: 'Not signed in' }
    const result = staffStore.changePassword(me.id, body.currentPassword, body.nextPassword)
    if ('error' in result) throw { status: 400, message: result.error }
    return true
  },
  me: readUser,
  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  },
}
