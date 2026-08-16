export const ROUTES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/',
  analytics: '/analytics',
  users: '/users',
  userDetail: '/users/:id',
  trips: '/trips',
  events: '/events',
  destinations: '/destinations',
  reports: '/reports',
  subscriptions: '/subscriptions',
  subscribers: '/subscribers',
  reviews: '/reviews',
  deals: '/deals',
  content: '/content',
  notifications: '/notifications',
  settings: '/settings',
  cms: '/cms',
  broadcast: '/broadcast',
} as const

export function userPath(id: string) {
  return `/users/${id}`
}
