import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { formElementConfigs } from '../lib/form-elements'
import { formTemplates, type FormTemplate } from '../lib/form-templates'
import { useDesigner } from '../lib/designer-context'
import type { FieldType } from '../../../types/form'

interface DesignerSidebarProps {
  onApplyTemplate: (template: FormTemplate) => void
}

const templateRailClass: Record<FormTemplate['rail'], string> = {
  walrus: 'text-[#fbffea]',
  bug: 'text-[#ffc46b]',
  feature: 'text-[#80ffd5]',
  survey: 'text-[#6fbcf0]',
  application: 'text-[#c4b5fd]',
  general: 'text-[#9fb9b1]',
}

export function DesignerSidebar({ onApplyTemplate }: DesignerSidebarProps) {
  const { addElement, elements } = useDesigner()
  const [activeTab, setActiveTab] = useState<'fields' | 'templates'>('fields')

  return (
    <aside className="w-[240px] shrink-0 overflow-y-auto border-r border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)]">
      <div className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg border border-[rgba(190,255,234,0.12)] bg-[#071011]/40 p-1">
          <SidebarTabButton
            active={activeTab === 'fields'}
            label="Fields"
            onClick={() => setActiveTab('fields')}
          />
          <SidebarTabButton
            active={activeTab === 'templates'}
            label="Templates"
            onClick={() => setActiveTab('templates')}
          />
        </div>

        {activeTab === 'fields' ? (
          <section>
            <div className="mb-4">
              <h2 className="text-xs font-medium tracking-wider text-[#9fb9b1]/75 uppercase">
                Field library
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#9fb9b1]/65">
                Click to append, or drag into the form canvas.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {formElementConfigs.map((config) => (
                <SidebarDraggableBtn
                  key={config.type}
                  type={config.type}
                  label={config.label}
                  icon={config.icon}
                  onClick={() => {
                    const newEl = config.defaultField()
                    addElement(elements.length, newEl)
                  }}
                />
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div className="mb-3">
              <h2 className="text-xs font-medium tracking-wider text-[#9fb9b1]/75 uppercase">
                Templates
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#9fb9b1]/65">
                Start from a prepared schema, then edit fields on the canvas.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {formTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onApplyTemplate(template)}
                  className="cursor-pointer rounded-lg border border-[rgba(190,255,234,0.10)] bg-[#071011]/25 px-3 py-2.5 text-left transition-all hover:border-[#80ffd5]/30 hover:bg-[#80ffd5]/5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm text-[#effff8]/90">
                      {template.name}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] tracking-wider uppercase ${templateRailClass[template.rail]}`}
                    >
                      {template.rail}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#9fb9b1]/65">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  )
}

function SidebarTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-md px-2.5 py-1.5 text-xs transition-colors ${
        active
          ? 'bg-[#80ffd5] text-[#06231d]'
          : 'text-[#9fb9b1] hover:bg-[#80ffd5]/10 hover:text-[#effff8]'
      }`}
    >
      {label}
    </button>
  )
}
function SidebarDraggableBtn({
  type,
  label,
  icon,
  onClick,
}: {
  type: FieldType
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { isSidebarBtn: true, type },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`flex cursor-grab items-center gap-2.5 rounded-lg border border-[rgba(190,255,234,0.10)] px-3 py-2.5 text-left text-sm transition-all hover:border-[#80ffd5]/30 hover:bg-[#80ffd5]/5 active:cursor-grabbing ${
        isDragging ? 'border-[#80ffd5]/50 opacity-50' : ''
      }`}
    >
      <span className="text-[#9fb9b1]">{icon}</span>
      <span className="min-w-0 truncate text-[#effff8]/85">{label}</span>
    </button>
  )
}
