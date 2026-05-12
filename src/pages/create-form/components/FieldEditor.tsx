import type { FormField, FieldOption } from '../../../types/form'

interface FieldEditorProps {
  field: FormField
  onChange: (updates: Partial<FormField>) => void
}

export function FieldEditor({ field, onChange }: FieldEditorProps) {
  const hasOptions = field.type === 'dropdown' || field.type === 'checkbox'
  const hasUpload = field.type === 'screenshot-upload' || field.type === 'video-upload'

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    const options = [...(field.options ?? [])]
    options[index] = { ...options[index], ...updates }
    onChange({ options })
  }

  const addOption = () => {
    onChange({ options: [...(field.options ?? []), { label: '', value: '' }] })
  }

  const removeOption = (index: number) => {
    const options = [...(field.options ?? [])]
    options.splice(index, 1)
    onChange({ options })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
      <h3 className="mb-6 text-lg font-medium">
        Edit Field <span className="text-zinc-500">— {field.type}</span>
      </h3>

      <div className="space-y-5">
        {/* Label */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-400">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="e.g. What happened?"
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Placeholder */}
        {field.type !== 'confirmation' && field.type !== 'star-rating' && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">Placeholder</label>
            <input
              type="text"
              value={field.placeholder ?? ''}
              onChange={(e) => onChange({ placeholder: e.target.value })}
              placeholder="Hint text shown in the field"
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="size-4 rounded border-white/20 bg-zinc-800 accent-indigo-500"
            />
            <span className="text-sm">Required</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.sensitive}
              onChange={(e) => onChange({ sensitive: e.target.checked })}
              className="size-4 rounded border-white/20 bg-zinc-800 accent-indigo-500"
            />
            <span className="text-sm">Sensitive (encrypt with Seal)</span>
          </label>
        </div>

        {/* Options editor (dropdown/checkbox) */}
        {hasOptions && (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Options</label>
            <div className="space-y-2">
              {(field.options ?? []).map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) =>
                      updateOption(i, {
                        label: e.target.value,
                        value: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-500 hover:border-red-500/50 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 cursor-pointer text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add option
            </button>
          </div>
        )}

        {/* Upload settings */}
        {hasUpload && field.uploadSettings && (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Upload Settings</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-zinc-500">Max size (MB)</label>
                <input
                  type="number"
                  value={field.uploadSettings.maxSizeMB}
                  onChange={(e) =>
                    onChange({
                      uploadSettings: {
                        ...field.uploadSettings!,
                        maxSizeMB: Number(e.target.value),
                      },
                    })
                  }
                  min={1}
                  max={100}
                  className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-zinc-500">Allowed types</label>
                <input
                  type="text"
                  value={field.uploadSettings.allowedTypes.join(', ')}
                  onChange={(e) =>
                    onChange({
                      uploadSettings: {
                        ...field.uploadSettings!,
                        allowedTypes: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
