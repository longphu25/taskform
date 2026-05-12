import { useDesigner } from '../lib/designer-context'
import type { FieldOption } from '../../../types/form'

export function PropertiesPanel() {
  const { selectedElement, updateElement } = useDesigner()

  if (!selectedElement) {
    return (
      <aside className="w-[280px] shrink-0 border-l border-white/10 bg-zinc-900/50 flex items-center justify-center">
        <p className="text-sm text-zinc-600">Select an element to edit</p>
      </aside>
    )
  }

  return (
    <aside className="w-[280px] shrink-0 border-l border-white/10 bg-zinc-900/50 overflow-y-auto">
      <div className="p-4 space-y-5">
        <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">Properties</h3>

        {/* Label */}
        <Field label="Label">
          <input
            type="text"
            value={selectedElement.label}
            onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          />
        </Field>

        {/* Placeholder */}
        {selectedElement.type !== 'confirmation' && selectedElement.type !== 'star-rating' && (
          <Field label="Placeholder">
            <input
              type="text"
              value={selectedElement.placeholder ?? ''}
              onChange={(e) => updateElement(selectedElement.id, { placeholder: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </Field>
        )}

        {/* Toggles */}
        <div className="flex flex-col gap-3">
          <Toggle
            label="Required"
            checked={selectedElement.required}
            onChange={(v) => updateElement(selectedElement.id, { required: v })}
          />
          <Toggle
            label="Sensitive (Seal encrypt)"
            checked={selectedElement.sensitive}
            onChange={(v) => updateElement(selectedElement.id, { sensitive: v })}
          />
        </div>

        {/* Options (dropdown/checkbox) */}
        {(selectedElement.type === 'dropdown' || selectedElement.type === 'checkbox') && (
          <OptionsEditor
            options={selectedElement.options ?? []}
            onChange={(options) => updateElement(selectedElement.id, { options })}
          />
        )}

        {/* Upload settings */}
        {(selectedElement.type === 'screenshot-upload' ||
          selectedElement.type === 'video-upload') &&
          selectedElement.uploadSettings && (
            <Field label="Max file size (MB)">
              <input
                type="number"
                value={selectedElement.uploadSettings.maxSizeMB}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    uploadSettings: {
                      ...selectedElement.uploadSettings!,
                      maxSizeMB: Number(e.target.value),
                    },
                  })
                }
                min={1}
                max={100}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </Field>
          )}
      </div>
    </aside>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      {children}
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-white/20 bg-zinc-800 accent-indigo-500"
      />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  )
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: FieldOption[]
  onChange: (opts: FieldOption[]) => void
}) {
  const updateOption = (index: number, label: string) => {
    const next = [...options]
    next[index] = { label, value: label.toLowerCase().replace(/\s+/g, '-') }
    onChange(next)
  }

  const addOption = () => {
    onChange([...options, { label: '', value: '' }])
  }

  const removeOption = (index: number) => {
    const next = [...options]
    next.splice(index, 1)
    onChange(next)
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Options</label>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              type="text"
              value={opt.label}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => removeOption(i)}
              className="cursor-pointer rounded-lg px-2 text-zinc-600 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addOption}
        className="mt-2 cursor-pointer text-xs text-indigo-400 hover:text-indigo-300"
      >
        + Add option
      </button>
    </div>
  )
}
