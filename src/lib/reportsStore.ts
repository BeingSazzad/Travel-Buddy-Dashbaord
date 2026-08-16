import { REPORTS_STORAGE_KEY } from '@/lib/constants'
import { createStore } from '@/lib/createStore'
import type { ReportStatus } from '@/types/common.types'

export type Report = {
  id: string
  target: string
  type: 'user' | 'trip' | 'event' | 'review'
  reason: string
  reporter: string
  status: ReportStatus
  createdAt: string
}

const store = createStore<Report>(REPORTS_STORAGE_KEY, [
  { id: 'r1', target: 'Hana Kim', type: 'user', reason: 'Harassment', reporter: 'Nora Berg', status: 'pending', createdAt: '2026-08-12' },
  { id: 'r2', target: 'Paris Fashion Tour', type: 'trip', reason: 'Spam', reporter: 'Amelia Hart', status: 'reviewing', createdAt: '2026-08-10' },
  { id: 'r3', target: 'Coffee crawl', type: 'event', reason: 'Safety concern', reporter: 'Clara Nielsen', status: 'resolved', createdAt: '2026-07-20' },
])

export const reportsStore = store
