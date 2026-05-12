import { useState } from 'react'
import { pagePath } from '../../utils/paths'
import { DesignerProvider, useDesigner } from './lib/designer-context'
import { Designer } from './components/Designer'
import { FormPreview } from './components/FormPreview'
import { StoragePolicyPanel } from './components/StoragePolicyPanel'
import { SponsorPanel } from './components/SponsorPanel'
import { PublishButton } from './components/PublishButton'
import type { StoragePolicy, SponsorSettings } from '../../types/form'
import { DEFAULT_STORAGE_POLICY, DEFAULT_SPONSOR_SETTINGS } from '../../schemas/form'
import { Undo2, Redo2, Eye, Pencil } from 'lucide-react'

function FormBuilderInner() {
  const { elements, canUndo, canRedo, undo, redo } = useDesigner()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [storagePolicy, setStoragePolicy] = useState<StoragePolicy>({ ...DEFAULT_STORAGE_POLICY })
  const [sponsorSettings, setSponsorSettings] = useState<SponsorSettings>({
    ...DEFAULT_SPONSOR_SETTINGS,
  })
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="shrink-0 flex items-center justify-between border-b border-white/10 bg-zinc-900/80 px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <a href={pagePath('/')} className="text-lg font-semibold tracking-tight cursor-pointer">
            TaskForm
          </a>
          <span className="text-zinc-600">|</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form title..."
            className="bg-transparent text-sm font-medium outline-none placeholder-zinc-600 w-48"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="cursor-pointer rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="cursor-pointer rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="size-4" />
          </button>

          <span className="mx-2 h-5 w-px bg-white/10" />

          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="cursor-pointer flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
          >
            {showPreview ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
            {showPreview ? 'Editor' : 'Preview'}
          </button>

          <a
            href={pagePath('/dashboard.html')}
            className="cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
          >
            Dashboard
          </a>
        </div>
      </nav>

      {/* Main content */}
      {showPreview ? (
        <div className="flex-1 overflow-auto p-8">
          <FormPreview title={title} description={description} fields={elements} />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Designer (sidebar + canvas + properties) */}
          <div className="flex-1 flex overflow-hidden">
            <Designer />
          </div>

          {/* Right panel: form meta + storage + sponsor + publish */}
          <div className="w-[260px] shrink-0 border-l border-white/10 bg-zinc-900/30 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this form collect?"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500"
                />
              </div>

              <StoragePolicyPanel policy={storagePolicy} onChange={setStoragePolicy} />
              <SponsorPanel settings={sponsorSettings} onChange={setSponsorSettings} />

              <PublishButton
                title={title}
                description={description}
                fields={elements}
                storagePolicy={storagePolicy}
                sponsorSettings={sponsorSettings}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function CreateFormPage() {
  return (
    <DesignerProvider>
      <FormBuilderInner />
    </DesignerProvider>
  )
}
