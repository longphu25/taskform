import { useState } from 'react'
import { pagePath } from '../../utils/paths'
import { DesignerProvider, useDesigner } from './lib/designer-context'
import { Designer } from './components/Designer'
import { FormPreview } from './components/FormPreview'
import { StoragePolicyPanel } from './components/StoragePolicyPanel'
import { SponsorPanel } from './components/SponsorPanel'
import { PublishButton } from './components/PublishButton'
import { StorageCostEstimate } from './components/StorageCostEstimate'
import { WalletConnect } from './components/WalletConnect'
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
  const [publishing, setPublishing] = useState(false)
  const [publishStep, setPublishStep] = useState(0)
  const [didSwap, setDidSwap] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-[#071011] text-[#effff8]">
      {/* Navbar */}
      <nav className="shrink-0 flex items-center justify-between border-b border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <a href={pagePath('/')} className="text-lg font-semibold tracking-tight cursor-pointer">
            TaskForm
          </a>
          <span className="text-[#9fb9b1]/55">|</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form title..."
            className="bg-transparent text-sm font-medium outline-none placeholder-[#9fb9b1]/55 w-48"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="cursor-pointer rounded-lg p-2 text-[#9fb9b1] hover:bg-[#80ffd5]/10 hover:text-[#effff8] disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="cursor-pointer rounded-lg p-2 text-[#9fb9b1] hover:bg-[#80ffd5]/10 hover:text-[#effff8] disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="size-4" />
          </button>

          <span className="mx-2 h-5 w-px bg-[rgba(190,255,234,0.16)]" />

          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="cursor-pointer flex items-center gap-1.5 rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-1.5 text-sm transition-colors hover:bg-[#80ffd5]/10"
          >
            {showPreview ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
            {showPreview ? 'Editor' : 'Preview'}
          </button>

          <a
            href={pagePath('/dashboard.html')}
            className="cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-1.5 text-sm transition-colors hover:bg-[#80ffd5]/10"
          >
            Dashboard
          </a>

          <WalletConnect />
        </div>
      </nav>

      {/* Main content */}
      {publishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071011]/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] p-10 shadow-2xl">
            <div className="relative size-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#80ffd5]/20 border-t-[#80ffd5]" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-[#effff8]">Publishing your form</p>
              <p className="mt-1 text-sm text-[#9fb9b1]">
                {publishStep === 1 && 'Checking WAL balance...'}
                {publishStep === 2 && 'Swapping SUI -> WAL...'}
                {publishStep === 3 && 'Encoding blob...'}
                {publishStep === 4 && 'Sign transaction to register blob...'}
                {publishStep === 5 && 'Uploading to storage nodes...'}
                {publishStep === 6 && 'Sign transaction to certify...'}
                {publishStep === 7 && 'Creating form on-chain...'}
                {publishStep === 8 && 'Publishing form on-chain...'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {(didSwap
                ? ['Swap', 'Encode', 'Register', 'Upload', 'Certify', 'Create', 'Publish']
                : ['Encode', 'Register', 'Upload', 'Certify', 'Create', 'Publish']
              ).map((label, i) => {
                const stepNum = didSwap ? i + 2 : i + 3
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 ${stepNum <= publishStep ? 'text-[#80ffd5]' : 'text-[#9fb9b1]/55'}`}
                    >
                      <span
                        className={`size-2 rounded-full ${stepNum < publishStep ? 'bg-[#80ffd5]' : stepNum === publishStep ? 'bg-[#ffc46b] animate-pulse' : 'bg-[rgba(190,255,234,0.16)]'}`}
                      />
                      {label}
                    </span>
                    {i < (didSwap ? 4 : 3) && <span className="text-[#9fb9b1]/55">-&gt;</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

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
          <div className="w-[260px] shrink-0 border-l border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.58)] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#9fb9b1]/70">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this form collect?"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-3 py-2 text-sm text-[#effff8] placeholder-[#9fb9b1]/55 outline-none focus:border-[#80ffd5]"
                />
              </div>

              <StoragePolicyPanel policy={storagePolicy} onChange={setStoragePolicy} />
              <SponsorPanel settings={sponsorSettings} onChange={setSponsorSettings} />

              {title.trim() && elements.length > 0 && (
                <StorageCostEstimate
                  dataSize={
                    new TextEncoder().encode(
                      JSON.stringify({ title, description, fields: elements }),
                    ).length
                  }
                  epochs={storagePolicy.schemaDuration}
                />
              )}

              <PublishButton
                title={title}
                description={description}
                fields={elements}
                storagePolicy={storagePolicy}
                sponsorSettings={sponsorSettings}
                onPublishingChange={(p) => {
                  setPublishing(p)
                  if (p) setDidSwap(false)
                }}
                onStepChange={(step) => {
                  setPublishStep(step)
                  if (step === 2) setDidSwap(true)
                }}
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
