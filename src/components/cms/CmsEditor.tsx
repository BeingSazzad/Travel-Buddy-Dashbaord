import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon, type IconName } from '@/components/ui/Icon'
import { LegalPageEditor } from '@/components/cms/LegalPageEditor'
import { useGetCmsDocQuery, useSaveCmsDocMutation } from '@/services/endpoints/cmsApi'
import type { CmsPageContent, FaqItem, OnboardSlide } from '@/lib/cmsStore'

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function newFaqId() {
  return `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
}

const PAGE_ICONS: Record<string, IconName> = {
  about: 'sparkles',
  terms: 'cms',
  privacy: 'lock',
  guidelines: 'shield',
}

const EMPTY_PAGE: CmsPageContent = {
  headline: '',
  subtitle: '',
  sections: [],
  footer: '',
  numbered: false,
}

export function CmsEditor({ slug }: { slug: string }) {
  const { data, isLoading: isFetching } = useGetCmsDocQuery(slug)
  const [save, { isLoading }] = useSaveCmsDocMutation()
  const [page, setPage] = useState<CmsPageContent>(EMPTY_PAGE)
  const [slides, setSlides] = useState<OnboardSlide[]>([])
  const [faq, setFaq] = useState<FaqItem[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(false)
  }, [slug])

  useEffect(() => {
    if (!data) return
    setPage(data.page ?? EMPTY_PAGE)
    setSlides(data.slides ?? [])
    setFaq(data.faq ?? [])
  }, [data])

  if (isFetching && !data) return <p className="text-sm text-muted">Loading…</p>
  if (!data) return <p className="text-sm text-muted">Page not found</p>

  return (
    <Card>
      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault()
          await save({
            slug,
            page,
            slides,
            faq,
            status: 'published',
          })
          setSaved(true)
        }}
      >
        <p className="text-sm text-muted">
          {data.kind === 'faq'
            ? 'Questions shown in Help & Support. Add or edit each pair — there is no page editor here.'
            : data.kind === 'onboarding'
              ? 'The three onboarding screens in the app.'
              : `Laid out like the app page at /${slug === 'guidelines' ? 'community-guidelines' : slug}.`}
        </p>

        {data.kind === 'page' ? (
          <LegalPageEditor value={page} onChange={setPage} icon={PAGE_ICONS[slug] ?? 'cms'} />
        ) : null}

        {data.kind === 'onboarding' ? (
          <div className="space-y-5">
            {slides.map((slide, index) => (
              <div key={slide.id} className="grid gap-4 rounded-2xl border border-line p-4 lg:grid-cols-[180px_1fr]">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Screen {index + 1}</p>
                  {slide.image ? (
                    <img src={slide.image} alt="" className="h-48 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl bg-surface text-xs text-muted">No image</div>
                  )}
                </div>
                <div className="space-y-3">
                  <Input
                    label="Title"
                    value={slide.title}
                    onChange={(e) =>
                      setSlides((rows) => rows.map((r) => (r.id === slide.id ? { ...r, title: e.target.value } : r)))
                    }
                    required
                  />
                  <Textarea
                    label="Text"
                    value={slide.description}
                    onChange={(e) =>
                      setSlides((rows) => rows.map((r) => (r.id === slide.id ? { ...r, description: e.target.value } : r)))
                    }
                    required
                  />
                  <Input
                    label="Image URL"
                    value={slide.image.startsWith('data:') ? '' : slide.image}
                    onChange={(e) =>
                      setSlides((rows) => rows.map((r) => (r.id === slide.id ? { ...r, image: e.target.value } : r)))
                    }
                    placeholder="https:// or upload a file"
                  />
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ''
                        if (!file) return
                        const image = await readImageFile(file)
                        setSlides((rows) => rows.map((r) => (r.id === slide.id ? { ...r, image } : r)))
                      }}
                    />
                    <span className="inline-flex h-9 cursor-pointer items-center rounded-xl border border-line bg-white px-3.5 text-sm font-medium text-ink hover:bg-surface">
                      Upload image
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {data.kind === 'faq' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Questions</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setFaq((rows) => [...rows, { id: newFaqId(), question: '', answer: '' }])}
              >
                <Icon name="plus" className="h-4 w-4" />
                Add question
              </Button>
            </div>
            {faq.length === 0 ? <p className="text-sm text-muted">No questions yet.</p> : null}
            {faq.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-2xl border border-line p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-muted">Q{index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFaq((rows) => rows.filter((r) => r.id !== item.id))}
                  >
                    Remove
                  </Button>
                </div>
                <Input
                  label="Question"
                  value={item.question}
                  onChange={(e) =>
                    setFaq((rows) => rows.map((r) => (r.id === item.id ? { ...r, question: e.target.value } : r)))
                  }
                  required
                />
                <Textarea
                  label="Answer"
                  value={item.answer}
                  onChange={(e) =>
                    setFaq((rows) => rows.map((r) => (r.id === item.id ? { ...r, answer: e.target.value } : r)))
                  }
                  required
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          {saved ? <p className="text-sm text-emerald-700">Saved</p> : null}
          <Button type="submit" disabled={isLoading}>
            <Icon name="save" className="h-4 w-4" />
            {isLoading ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
