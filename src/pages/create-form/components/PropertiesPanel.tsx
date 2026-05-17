import { useDesigner } from '../lib/designer-context'
import type { FieldOption } from '../../../types/form'

export function PropertiesPanel() {
  const { selectedElement, updateElement } = useDesigner()

  if (!selectedElement) {
    return (
      <section className="rounded-xl border border-[rgba(190,255,234,0.16)] bg-[rgba(12,34,35,0.72)] p-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-[#9fb9b1]/75">
          Field inspector
        </h2>
        <div className="mt-4 rounded-lg border border-dashed border-[rgba(190,255,234,0.16)] bg-[#071011]/45 px-4 py-6 text-center">
          <p className="text-sm text-[#effff8]">No field selected</p>
          <p className="mt-1 text-xs text-[#9fb9b1]/70">
            Select a field on the canvas to edit label, options, privacy, and validation.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-[rgba(190,255,234,0.16)] bg-[rgba(12,34,35,0.72)] p-4">
      <div className="space-y-5">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-[#9fb9b1]/75">
            Field inspector
          </h2>
          <p className="mt-1 truncate text-sm text-[#effff8]">{selectedElement.label}</p>
        </div>

        {/* Label */}
        <Field label="Label">
          <input
            type="text"
            value={selectedElement.label}
            onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
            className="w-full rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-3 py-2 text-sm text-[#effff8] outline-none focus:border-[#80ffd5]"
          />
        </Field>

        {/* Placeholder */}
        {selectedElement.type !== 'confirmation' && selectedElement.type !== 'star-rating' && (
          <Field label="Placeholder">
            <input
              type="text"
              value={selectedElement.placeholder ?? ''}
              onChange={(e) => updateElement(selectedElement.id, { placeholder: e.target.value })}
              className="w-full rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-3 py-2 text-sm text-[#effff8] outline-none focus:border-[#80ffd5]"
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
                className="w-full rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-3 py-2 text-sm text-[#effff8] outline-none focus:border-[#80ffd5]"
              />
            </Field>
          )}
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#9fb9b1]">{label}</label>
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
        className="size-4 rounded border-[rgba(190,255,234,0.34)] bg-[#0d1c1d] accent-[#80ffd5]"
      />
      <span className="text-sm text-[#effff8]/85">{label}</span>
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
      <label className="mb-1.5 block text-xs font-medium text-[#9fb9b1]">Options</label>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              type="text"
              value={opt.label}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-3 py-1.5 text-sm text-[#effff8] outline-none focus:border-[#80ffd5]"
            />
            <button
              type="button"
              onClick={() => removeOption(i)}
              className="cursor-pointer rounded-lg px-2 text-[#9fb9b1]/55 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addOption}
        className="mt-2 cursor-pointer text-xs text-[#80ffd5] hover:text-[#28d8c1]"
      >
        + Add option
      </button>
    </div>
  )
}
