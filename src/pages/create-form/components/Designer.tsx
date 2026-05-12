import { useState } from 'react'
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

export function Designer() {
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

    // Drop from sidebar → add new element
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
      <div className="flex flex-1 h-[calc(100vh-5rem)] overflow-hidden">
        {/* Sidebar — element palette */}
        <DesignerSidebar />

        {/* Canvas — drop area */}
        <DesignerCanvas />

        {/* Properties panel */}
        <PropertiesPanel />
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeItem && !activeItem.element && (
          <div className="rounded-xl border border-indigo-500/50 bg-zinc-900/95 px-4 py-3 text-sm font-medium shadow-xl">
            {formElementMap[activeItem.type]?.label}
          </div>
        )}
        {activeItem?.element && (
          <div className="w-[500px] rounded-xl border-2 border-indigo-500 bg-zinc-900/95 px-12 py-3 shadow-2xl">
            <p className="text-sm font-medium">
              {activeItem.element.label || activeItem.element.type}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

function DesignerCanvas() {
  const { elements, setSelectedElement } = useDesigner()
  const { setNodeRef, isOver } = useDroppable({
    id: 'designer-drop-area',
    data: { isDesignerDropArea: true },
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-auto bg-zinc-950 ${isOver ? 'bg-indigo-950/20' : ''}`}
      onClick={() => setSelectedElement(null)}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative min-h-full p-6 lg:p-8">
        {elements.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-2xl transition-colors ${
              isOver ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10'
            }`}
          >
            <p className="text-lg font-medium text-zinc-500">Drag elements here</p>
            <p className="mt-1 text-sm text-zinc-600">or click an element in the sidebar</p>
          </div>
        ) : (
          <SortableContext items={elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3 max-w-[640px] mx-auto">
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
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
          : 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/80'
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
        className="absolute left-3 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-4" />
      </button>

      {/* Content */}
      <div className="flex items-center gap-3 px-12 py-4 min-h-[56px]">
        <span className="text-zinc-500">{config?.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {element.label || `Untitled ${element.type}`}
            {element.required && <span className="ml-1 text-red-400">*</span>}
          </p>
          <p className="text-xs text-zinc-500">
            {element.type}
            {element.sensitive ? ' · encrypted' : ''}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedElement(element)
            duplicateElement()
          }}
          className="cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            removeElement(element.id)
          }}
          className="cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
