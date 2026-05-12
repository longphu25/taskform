import type { FormField } from '../../../types/form'

interface FormPreviewProps {
  title: string
  description: string
  fields: FormField[]
}

export function FormPreview({ title, description, fields }: FormPreviewProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8">
        <h2 className="mb-2 text-2xl font-semibold">{title || 'Untitled Form'}</h2>
        {description && <p className="mb-8 text-zinc-400">{description}</p>}

        {fields.length === 0 ? (
          <p className="text-center text-zinc-600">No fields added yet</p>
        ) : (
          <div className="space-y-6">
            {fields.map((field) => (
              <PreviewField key={field.id} field={field} />
            ))}
          </div>
        )}

        <button
          type="button"
          disabled
          className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium opacity-50 cursor-not-allowed"
        >
          Submit (preview only)
        </button>
      </div>
    </div>
  )
}

function PreviewField({ field }: { field: FormField }) {
  const label = (
    <label className="mb-1.5 block text-sm font-medium text-zinc-300">
      {field.label || 'Untitled'}
      {field.required && <span className="ml-1 text-red-400">*</span>}
      {field.sensitive && <span className="ml-2 text-xs text-amber-400">(encrypted)</span>}
    </label>
  )

  switch (field.type) {
    case 'short-text':
    case 'url':
      return (
        <div>
          {label}
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            disabled
            placeholder={field.placeholder}
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-600"
          />
        </div>
      )
    case 'rich-text':
      return (
        <div>
          {label}
          <textarea
            disabled
            placeholder={field.placeholder}
            rows={4}
            className="w-full resize-none rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-600"
          />
        </div>
      )
    case 'dropdown':
      return (
        <div>
          {label}
          <select
            disabled
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-zinc-500"
          >
            <option>{field.placeholder || 'Select...'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )
    case 'checkbox':
      return (
        <div>
          {label}
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input type="checkbox" disabled className="size-4 rounded accent-indigo-500" />
                <span className="text-sm text-zinc-300">{opt.label || 'Option'}</span>
              </label>
            ))}
          </div>
        </div>
      )
    case 'star-rating':
      return (
        <div>
          {label}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="text-2xl text-zinc-600">
                ★
              </span>
            ))}
          </div>
        </div>
      )
    case 'screenshot-upload':
    case 'video-upload':
      return (
        <div>
          {label}
          <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-zinc-800/50 py-8">
            <p className="text-sm text-zinc-500">
              {field.type === 'video-upload'
                ? 'Drop video or click to upload'
                : 'Drop image or click to upload'}
            </p>
          </div>
        </div>
      )
    case 'confirmation':
      return (
        <label className="flex items-center gap-3">
          <input type="checkbox" disabled className="size-4 rounded accent-indigo-500" />
          <span className="text-sm text-zinc-300">{field.label || 'I confirm'}</span>
          {field.required && <span className="text-red-400">*</span>}
        </label>
      )
    default:
      return null
  }
}
