import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Copy } from 'lucide-react'
import { useDesigner } from '../lib/designer-context'
import { formElementMap } from '../lib/form-elements'
import { DesignerSidebar } from './DesignerSidebar'
import { PropertiesPanel } from './PropertiesPanel'
import type { FormField, FieldType } from '../../../types/form'
import type { FormTemplate } from '../lib/form-templates'

interface DesignerProps {
  title: string
  description: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onApplyTemplate: (template: FormTemplate) => void
  inspector: ReactNode
}

export function Designer({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onApplyTemplate,
  inspector,
}: DesignerProps) {
  const { elements, addElement, setElements } = useDesigner()
  const [activeItem, setActiveItem] = useState<{ type: FieldType; element?: FormField } | null>(
    null,
  )
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragStart = (e: DragStartEvent) => {
    const data = e.active.data.current
    if (data?.isSidebarBtn) {
      setActiveItem({ type: data.type as FieldType })
    } else {
      const el = elements.find((x) => x.id === e.active.id)
      if (el) setActiveItem({ type: el.type, element: el })
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveItem(null)
    const { active, over } = e
    if (!over) return

    // Drop from sidebar -> add new element
    if (active.data.current?.isSidebarBtn) {
      const type = active.data.current.type as FieldType
      const config = formElementMap[type]
      if (config) {
        const newEl = config.defaultField()
        // If dropped on an existing element, insert before it
        const overIndex = elements.findIndex((el) => el.id === over.id)
        const insertIndex = overIndex >= 0 ? overIndex : elements.length
        addElement(insertIndex, newEl)
      }
      return
    }

    // Reorder existing elements
    if (active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id)
      const newIndex = elements.findIndex((el) => el.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const next = [...elements]
        const [moved] = next.splice(oldIndex, 1)
        next.splice(newIndex, 0, moved)
        setElements(next)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <DesignerSidebar onApplyTemplate={onApplyTemplate} />

        <DesignerCanvas
          title={title}
          description={description}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
        />

        <aside className="w-[360px] shrink-0 overflow-y-auto border-l border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.74)]">
          <div className="space-y-4 p-4">
            <PropertiesPanel />
            {inspector}
          </div>
        </aside>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeItem && !activeItem.element && (
          <div className="rounded-xl border border-[#80ffd5]/50 bg-[rgba(12,34,35,0.94)] px-4 py-3 text-sm font-medium shadow-xl">
            {formElementMap[activeItem.type]?.label}
          </div>
        )}
        {activeItem?.element && (
          <div className="w-[500px] rounded-xl border-2 border-[#80ffd5] bg-[rgba(12,34,35,0.94)] px-12 py-3 shadow-2xl">
            <p className="text-sm font-medium">
              {activeItem.element.label || activeItem.element.type}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

interface DesignerCanvasProps {
  title: string
  description: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
}

function DesignerCanvas({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: DesignerCanvasProps) {
  const { elements, setSelectedElement } = useDesigner()
  const { setNodeRef, isOver } = useDroppable({
    id: 'designer-drop-area',
    data: { isDesignerDropArea: true },
  })

  return (
    <div
      ref={setNodeRef}
      className={`relative flex-1 overflow-auto bg-[#071011] ${isOver ? 'bg-[#80ffd5]/10' : ''}`}
      onClick={() => setSelectedElement(null)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(190,255,234,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(190,255,234,0.045)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative min-h-full p-6 lg:p-8">
        <div
          className="mx-auto mb-5 max-w-[720px] rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-5 shadow-2xl shadow-black/20"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#ffc46b]">
                Form setup
              </p>
              <p className="mt-1 text-sm text-[#9fb9b1]">
                This schema is uploaded to Walrus and anchored by the Sui form object.
              </p>
            </div>
            <span className="rounded-full border border-[rgba(190,255,234,0.16)] px-2.5 py-1 text-xs text-[#9fb9b1]">
              Draft schema
            </span>
          </div>

          <label htmlFor="form-title" className="mb-1.5 block text-xs font-medium text-[#9fb9b1]">
            Title
          </label>
          <input
            id="form-title"
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Walrus builder feedback"
            className="w-full rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#071011]/70 px-3 py-2.5 text-lg font-semibold text-[#effff8] outline-none placeholder:text-[#9fb9b1]/45 focus:border-[#80ffd5]"
          />

          <label
            htmlFor="form-description"
            className="mb-1.5 mt-4 block text-xs font-medium text-[#9fb9b1]"
          >
            Description
          </label>
          <textarea
            id="form-description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Tell submitters what feedback, proof, or files you need."
            rows={3}
            className="w-full resize-none rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#071011]/70 px-3 py-2.5 text-sm text-[#effff8] outline-none placeholder:text-[#9fb9b1]/45 focus:border-[#80ffd5]"
          />
        </div>

        {elements.length === 0 ? (
          <div
            className={`mx-auto flex h-[42vh] max-w-[720px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
              isOver ? 'border-[#80ffd5]/50 bg-[#80ffd5]/5' : 'border-[rgba(190,255,234,0.16)]'
            }`}
          >
            <p className="text-lg font-medium text-[#effff8]">Add your first field</p>
            <p className="mt-1 text-sm text-[#9fb9b1]/70">
              Click a field type on the left, or drag it into this canvas.
            </p>
          </div>
        ) : (
          <SortableContext items={elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="mx-auto flex max-w-[720px] flex-col gap-3">
              {elements.map((el) => (
                <SortableFieldElement key={el.id} element={el} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}

function SortableFieldElement({ element }: { element: FormField }) {
  const { selectedElement, setSelectedElement, removeElement, duplicateElement } = useDesigner()
  const isSelected = selectedElement?.id === element.id
  const config = formElementMap[element.type]

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-pointer rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'border-[#80ffd5]/50 bg-[#80ffd5]/5 shadow-lg shadow-[#80ffd5]/10'
          : 'border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] hover:border-[rgba(190,255,234,0.34)] hover:bg-[rgba(8,24,25,0.82)]'
      }`}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-3 top-1/2 -translate-y-1/2 cursor-grab p-1 text-[#9fb9b1]/55 hover:text-[#9fb9b1] active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-4" />
      </button>

      {/* Content */}
      <div className="flex min-h-[64px] items-center gap-3 px-12 py-4">
        <span className="text-[#9fb9b1]/70">{config?.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {element.label || `Untitled ${element.type}`}
            {element.required && <span className="ml-1 text-red-400">*</span>}
          </p>
          <p className="text-xs text-[#9fb9b1]/70">
            {element.type}
            {element.sensitive ? ' · encrypted' : ''}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedElement(element)
            duplicateElement()
          }}
          className="cursor-pointer rounded-lg p-1.5 text-[#9fb9b1]/70 hover:bg-[#80ffd5]/10 hover:text-[#effff8]/85"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            removeElement(element.id)
          }}
          className="cursor-pointer rounded-lg p-1.5 text-[#9fb9b1]/70 hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
