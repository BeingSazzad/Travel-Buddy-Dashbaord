export const ROUTES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/',
  analytics: '/analytics',
  users: '/users',
  userDetail: '/users/:id',
  trips: '/trips',
  tripDetail: '/trips/:id',
  events: '/events',
  eventDetail: '/events/:id',
  destinations: '/destinations',
  reports: '/reports',
  subscriptions: '/subscriptions',
  subscribers: '/subscribers',
  transactions: '/transactions',
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

export function tripPath(id: string) {
  return `/trips/${id}`
}

export function eventPath(id: string) {
  return `/events/${id}`
}
