import type { FormField, FieldType } from '../../../types/form'
import { useState } from 'react'

const FIELD_TYPES: { type: FieldType; label: string }[] = [
  { type: 'short-text', label: 'Short Text' },
  { type: 'rich-text', label: 'Rich Text' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'star-rating', label: 'Star Rating' },
  { type: 'screenshot-upload', label: 'Screenshot' },
  { type: 'video-upload', label: 'Video' },
  { type: 'url', label: 'URL' },
  { type: 'confirmation', label: 'Confirmation' },
]

interface FieldListProps {
  fields: FormField[]
  selectedFieldId: string | null
  onSelect: (id: string) => void
  onAdd: (type: FieldType) => void
  onRemove: (id: string) => void
  onMove: (from: number, to: number) => void
}

export function FieldList({
  fields,
  selectedFieldId,
  onSelect,
  onAdd,
  onRemove,
  onMove,
}: FieldListProps) {
  const [showTypeMenu, setShowTypeMenu] = useState(false)

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">Fields ({fields.length})</h3>
        <button
          type="button"
          onClick={() => setShowTypeMenu(!showTypeMenu)}
          className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-indigo-500"
        >
          + Add Field
        </button>
      </div>

      {/* Type selector dropdown */}
      {showTypeMenu && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {FIELD_TYPES.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type)
                setShowTypeMenu(false)
              }}
              className="cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-left text-xs transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Field list */}
      {fields.length === 0 ? (
        <p className="text-center text-sm text-zinc-600">No fields yet. Add one above.</p>
      ) : (
        <ul className="space-y-2">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className={`group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors cursor-pointer ${
                field.id === selectedFieldId
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-white/5 hover:border-white/10 hover:bg-white/5'
              }`}
              onClick={() => onSelect(field.id)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(field.id)}
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onMove(index, index - 1)
                  }}
                  className="cursor-pointer text-zinc-500 hover:text-white disabled:opacity-30 text-xs"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    onMove(index, index + 1)
                  }}
                  className="cursor-pointer text-zinc-500 hover:text-white disabled:opacity-30 text-xs"
                >
                  ▼
                </button>
              </div>

              {/* Field info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {field.label || `Untitled ${field.type}`}
                </p>
                <p className="text-xs text-zinc-500">{field.type}</p>
              </div>

              {/* Badges */}
              <div className="flex gap-1">
                {field.required && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400">
                    req
                  </span>
                )}
                {field.sensitive && (
                  <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">
                    enc
                  </span>
                )}
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(field.id)
                }}
                className="cursor-pointer text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
