import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FormField, FieldType } from '../../../types/form'

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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onMove(oldIndex, newIndex)
    }
  }

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

      {/* Field list with drag-to-reorder */}
      {fields.length === 0 ? (
        <p className="text-center text-sm text-zinc-600">No fields yet. Add one above.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {fields.map((field) => (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  isSelected={field.id === selectedFieldId}
                  onSelect={onSelect}
                  onRemove={onRemove}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

interface SortableFieldItemProps {
  field: FormField
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

function SortableFieldItem({ field, isSelected, onSelect, onRemove }: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors cursor-pointer ${
        isSelected
          ? 'border-indigo-500/50 bg-indigo-500/10'
          : 'border-white/5 hover:border-white/10 hover:bg-white/5'
      }`}
      onClick={() => onSelect(field.id)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(field.id)}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-zinc-600 hover:text-zinc-400 active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="3" r="1.5" />
          <circle cx="12" cy="3" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="12" cy="8" r="1.5" />
          <circle cx="4" cy="13" r="1.5" />
          <circle cx="12" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Field info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{field.label || `Untitled ${field.type}`}</p>
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
          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">enc</span>
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
  )
}
