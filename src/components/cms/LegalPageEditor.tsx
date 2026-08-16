import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import type { CmsPageContent } from '@/lib/cmsStore'

function newSectionId() {
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
}

export function LegalPageEditor({
  value,
  onChange,
  icon = 'cms',
}: {
  value: CmsPageContent
  onChange: (next: CmsPageContent) => void
  icon?: IconName
}) {
  const patch = (partial: Partial<CmsPageContent>) => onChange({ ...value, ...partial })

  return (
    <div className="mx-auto max-w-[520px] space-y-5">
      <div className="rounded-2xl border border-line bg-white px-6 py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <input
          value={value.headline}
          onChange={(e) => patch({ headline: e.target.value })}
          placeholder="Headline"
          required
          className="w-full bg-transparent text-center font-display text-lg font-semibold text-ink outline-none placeholder:text-muted"
        />
        <textarea
          value={value.subtitle}
          onChange={(e) => patch({ subtitle: e.target.value })}
          placeholder="Short intro"
          rows={2}
          className="mt-1 w-full resize-none border-0 bg-transparent px-0 text-center text-sm leading-6 text-muted outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {value.sections.map((item, index) => (
          <div key={item.id} className="border-b border-line p-4 last:border-b-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {value.numbered ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-semibold text-primary-700">
                    {index + 1}
                  </span>
                ) : null}
                <input
                  value={item.title}
                  onChange={(e) =>
                    patch({
                      sections: value.sections.map((row) =>
                        row.id === item.id ? { ...row, title: e.target.value } : row,
                      ),
                    })
                  }
                  placeholder="Section title"
                  required
                  className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => patch({ sections: value.sections.filter((row) => row.id !== item.id) })}
              >
                Remove
              </Button>
            </div>
            <Textarea
              value={item.body}
              onChange={(e) =>
                patch({
                  sections: value.sections.map((row) =>
                    row.id === item.id ? { ...row, body: e.target.value } : row,
                  ),
                })
              }
              placeholder="Section text as shown in the app"
              required
              className="min-h-[88px]"
            />
          </div>
        ))}
        <div className="p-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() =>
              patch({
                sections: [...value.sections, { id: newSectionId(), title: '', body: '' }],
              })
            }
          >
            <Icon name="plus" className="h-4 w-4" />
            Add section
          </Button>
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl border border-primary-100 bg-primary-50/70 p-4">
        <Icon name="shield" className="mt-1 h-5 w-5 shrink-0 text-primary-600" />
        <textarea
          value={value.footer}
          onChange={(e) => patch({ footer: e.target.value })}
          placeholder="Footer note under the page"
          rows={3}
          className="w-full resize-y bg-transparent text-sm leading-6 text-ink outline-none"
        />
      </div>
    </div>
  )
}
