import { useDraggable } from '@dnd-kit/core'
import { formElementConfigs } from '../lib/form-elements'
import { useDesigner } from '../lib/designer-context'
import type { FieldType } from '../../../types/form'

export function DesignerSidebar() {
  const { addElement, elements } = useDesigner()

  return (
    <aside className="w-[220px] shrink-0 border-r border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] overflow-y-auto">
      <div className="p-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9fb9b1]/70">
          Elements
        </h3>
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
      </div>
    </aside>
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
      className={`flex items-center gap-2.5 rounded-lg border border-[rgba(190,255,234,0.10)] px-3 py-2.5 text-left text-sm transition-all cursor-grab active:cursor-grabbing hover:border-[#80ffd5]/30 hover:bg-[#80ffd5]/5 ${
        isDragging ? 'opacity-50 border-[#80ffd5]/50' : ''
      }`}
    >
      <span className="text-[#9fb9b1]">{icon}</span>
      <span className="text-[#effff8]/85">{label}</span>
    </button>
  )
}
