import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs } from '@/components/shared/Tabs'
import { CmsEditor } from '@/components/cms/CmsEditor'
import type { IconName } from '@/components/ui/Icon'

const TABS: Array<{ id: string; label: string; icon: IconName }> = [
  { id: 'about', label: 'About us', icon: 'sparkles' },
  { id: 'terms', label: 'T&C', icon: 'cms' },
  { id: 'privacy', label: 'Privacy', icon: 'lock' },
  { id: 'guidelines', label: 'Guidelines', icon: 'shield' },
  { id: 'onboarding', label: 'Onboarding', icon: 'events' },
  { id: 'faq', label: 'FAQ', icon: 'list' },
]

export function CmsPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab') ?? 'about'
  const tab = TABS.some((t) => t.id === requested) ? requested : 'about'

  return (
    <div>
      <PageHeader title="CMS" description="The same pages members read in the app." />
      <Tabs value={tab} onChange={(id) => setParams({ tab: id })} items={TABS} />
      <CmsEditor slug={tab} />
    </div>
  )
}
