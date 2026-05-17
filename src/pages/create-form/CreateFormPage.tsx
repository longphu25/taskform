import { useState, useEffect, useCallback, useRef } from 'react'
import { pagePath } from '../../utils/paths'
import { DesignerProvider, useDesigner } from './lib/designer-context'
import { Designer } from './components/Designer'
import { FormPreview } from './components/FormPreview'
import { StoragePolicyPanel } from './components/StoragePolicyPanel'
import { SponsorPanel } from './components/SponsorPanel'
import { PublishButton } from './components/PublishButton'
import { StorageCostEstimate } from './components/StorageCostEstimate'
import { WalletConnect } from './components/WalletConnect'
import { saveDraft, loadDraft, clearDraft } from './lib/draft-storage'
import type { StoragePolicy, SponsorSettings, FormCategory, FormField } from '../../types/form'
import { DEFAULT_STORAGE_POLICY, DEFAULT_SPONSOR_SETTINGS } from '../../schemas/form'
import type { FormTemplate } from './lib/form-templates'
import {
  Undo2,
  Redo2,
  Eye,
  Pencil,
  LayoutDashboard,
  LockKeyhole,
  Database,
  Wallet,
  AlertTriangle,
  Check,
  Save,
} from 'lucide-react'

// --- Inline validation ---
interface ReadinessIssue {
  id: string
  severity: 'error' | 'warning'
  message: string
}

function computeReadinessIssues(
  title: string,
  description: string,
  fields: FormField[],
): ReadinessIssue[] {
  const issues: ReadinessIssue[] = []

  if (!title.trim()) {
    issues.push({ id: 'no-title', severity: 'error', message: 'Form title is required' })
  }
  if (title.trim().length > 200) {
    issues.push({ id: 'title-long', severity: 'error', message: 'Title exceeds 200 characters' })
  }
  if (description.length > 2000) {
    issues.push({
      id: 'desc-long',
      severity: 'error',
      message: 'Description exceeds 2000 characters',
    })
  }
  if (fields.length === 0) {
    issues.push({ id: 'no-fields', severity: 'error', message: 'Add at least one field' })
  }
  if (fields.length > 50) {
    issues.push({ id: 'too-many-fields', severity: 'error', message: 'Maximum 50 fields allowed' })
  }

  for (const field of fields) {
    if (!field.label.trim()) {
      issues.push({
        id: `empty-label-${field.id}`,
        severity: 'error',
        message: `Field "${field.type}" has an empty label`,
      })
    }
    if (field.options) {
      for (let i = 0; i < field.options.length; i++) {
        const opt = field.options[i]
        if (!opt.label.trim() || !opt.value.trim()) {
          issues.push({
            id: `empty-option-${field.id}-${i}`,
            severity: 'error',
            message: `"${field.label || field.type}" has an empty option (row ${i + 1})`,
          })
        }
      }
    }
    if (field.uploadSettings) {
      if (field.uploadSettings.maxSizeMB < 1 || field.uploadSettings.maxSizeMB > 100) {
        issues.push({
          id: `upload-size-${field.id}`,
          severity: 'error',
          message: `"${field.label}" upload limit must be 1–100 MB`,
        })
      }
    }
  }

  return issues
}

// --- Category options ---
const CATEGORY_OPTIONS: { value: FormCategory; label: string }[] = [
  { value: 'feedback', label: 'Feedback' },
  { value: 'bug-report', label: 'Bug Report' },
  { value: 'feature-request', label: 'Feature Request' },
  { value: 'survey', label: 'Survey' },
  { value: 'application', label: 'Application' },
  { value: 'general', label: 'General' },
]

function FormBuilderInner() {
  const {
    elements,
    setElements,
    canUndo,
    canRedo,
    undo,
    redo,
    setSelectedElement,
    saveStatus,
    setSaveStatus,
  } = useDesigner()

  // Load draft once for initial state (avoids setState-in-effect lint error)
  const [initialDraft] = useState(() => loadDraft())

  const [title, setTitle] = useState(() => initialDraft?.title ?? '')
  const [description, setDescription] = useState(() => initialDraft?.description ?? '')
  const [category, setCategory] = useState<FormCategory>(() => initialDraft?.category ?? 'general')
  const [submitButtonText, setSubmitButtonText] = useState(
    () => initialDraft?.submitButtonText ?? '',
  )
  const [storagePolicy, setStoragePolicy] = useState<StoragePolicy>(
    () => initialDraft?.storagePolicy ?? { ...DEFAULT_STORAGE_POLICY },
  )
  const [sponsorSettings, setSponsorSettings] = useState<SponsorSettings>(
    () => initialDraft?.sponsorSettings ?? { ...DEFAULT_SPONSOR_SETTINGS },
  )
  const [showPreview, setShowPreview] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishStep, setPublishStep] = useState(0)
  const [didSwap, setDidSwap] = useState(false)

  // Template overwrite confirmation
  const [pendingTemplate, setPendingTemplate] = useState<FormTemplate | null>(null)

  // Draft restore flag
  const didRestore = useRef(false)

  // Restore draft fields into designer context on mount
  useEffect(() => {
    if (didRestore.current) return
    didRestore.current = true
    if (initialDraft) {
      setElements(initialDraft.fields)
      setSaveStatus('saved')
    }
  }, [initialDraft, setElements, setSaveStatus])

  // --- Autosave debounce ---
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerAutosave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus('unsaved')
    saveTimer.current = setTimeout(() => {
      saveDraft({
        title,
        description,
        category,
        submitButtonText,
        fields: elements,
        storagePolicy,
        sponsorSettings,
        savedAt: Date.now(),
      })
      setSaveStatus('saved')
    }, 1500)
  }, [
    title,
    description,
    category,
    submitButtonText,
    elements,
    storagePolicy,
    sponsorSettings,
    setSaveStatus,
  ])

  // Trigger autosave on any state change (skip initial mount)
  useEffect(() => {
    if (!didRestore.current) return
    triggerAutosave()
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [
    title,
    description,
    category,
    submitButtonText,
    elements,
    storagePolicy,
    sponsorSettings,
    triggerAutosave,
  ])

  const requiredCount = elements.filter((field) => field.required).length
  const encryptedCount = elements.filter((field) => field.sensitive).length
  const uploadCount = elements.filter(
    (field) => field.type === 'screenshot-upload' || field.type === 'video-upload',
  ).length

  // Inline readiness
  const readinessIssues = computeReadinessIssues(title, description, elements)
  const hasErrors = readinessIssues.some((i) => i.severity === 'error')
  const isReady = !hasErrors && elements.length > 0 && title.trim().length > 0

  // Template apply with confirmation
  const applyTemplate = (template: FormTemplate) => {
    const hasContent = title.trim() || description.trim() || elements.length > 0
    if (hasContent) {
      setPendingTemplate(template)
    } else {
      doApplyTemplate(template)
    }
  }

  const doApplyTemplate = (template: FormTemplate) => {
    const nextFields = template.createFields()
    setTitle(template.title)
    setDescription(template.formDescription)
    setCategory(template.category)
    setElements(nextFields)
    setSelectedElement(nextFields[0] ?? null)
    setPendingTemplate(null)
  }

  return (
    <div className="flex h-screen flex-col bg-[#071011] text-[#effff8]">
      {/* Template overwrite confirmation modal */}
      {pendingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071011]/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#effff8]">Replace current draft?</h3>
            <p className="mt-2 text-sm text-[#9fb9b1]">
              Applying <span className="font-medium text-[#effff8]">{pendingTemplate.name}</span>{' '}
              will replace your current title, description, and all fields. This cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingTemplate(null)}
                className="cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] px-4 py-2 text-sm text-[#9fb9b1] transition-colors hover:bg-[#80ffd5]/10 hover:text-[#effff8]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => doApplyTemplate(pendingTemplate)}
                className="cursor-pointer rounded-lg bg-[#80ffd5] px-4 py-2 text-sm font-medium text-[#06231d] transition-colors hover:bg-[#28d8c1]"
              >
                Replace draft
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="flex shrink-0 items-center justify-between border-b border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.86)] px-4 py-3 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <a
            href={pagePath('/')}
            className="cursor-pointer text-lg font-semibold tracking-tight text-[#effff8]"
          >
            TaskForm
          </a>
          <span className="hidden rounded-full border border-[rgba(190,255,234,0.16)] px-2.5 py-1 text-xs text-[#9fb9b1] sm:inline-flex">
            Form builder
          </span>
          {/* Save status indicator */}
          <span className="hidden items-center gap-1.5 text-xs sm:inline-flex">
            {saveStatus === 'saved' && (
              <>
                <Save className="size-3 text-[#80ffd5]" />
                <span className="text-[#80ffd5]/70">Saved</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <Save className="size-3 text-[#ffc46b]" />
                <span className="text-[#ffc46b]/70">Unsaved</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="cursor-pointer rounded-lg border border-transparent p-2 text-[#9fb9b1] hover:border-[rgba(190,255,234,0.16)] hover:bg-[#80ffd5]/10 hover:text-[#effff8] disabled:cursor-not-allowed disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="cursor-pointer rounded-lg border border-transparent p-2 text-[#9fb9b1] hover:border-[rgba(190,255,234,0.16)] hover:bg-[#80ffd5]/10 hover:text-[#effff8] disabled:cursor-not-allowed disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="size-4" />
          </button>

          <span className="mx-2 h-5 w-px bg-[rgba(190,255,234,0.16)]" />

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2 text-sm whitespace-nowrap transition-colors hover:bg-[#80ffd5]/10"
          >
            {showPreview ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
            {showPreview ? 'Editor' : 'Preview'}
          </button>

          <a
            href={pagePath('/dashboard.html')}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2 text-sm whitespace-nowrap transition-colors hover:bg-[#80ffd5]/10"
          >
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </a>

          <WalletConnect />
        </div>
      </nav>

      {/* Publishing overlay */}
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
                {publishStep === 6 && 'Certify blob + create form on-chain...'}
                {publishStep === 7 && 'Parsing form IDs...'}
                {publishStep === 8 && 'Publishing form on-chain...'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {(() => {
                const steps = didSwap
                  ? ['Swap', 'Encode', 'Register', 'Upload', 'Certify+Create', 'Publish']
                  : ['Encode', 'Register', 'Upload', 'Certify+Create', 'Publish']
                return steps.map((label, i) => {
                  const stepNum = didSwap ? i + 2 : i + 3
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1 ${stepNum <= publishStep ? 'text-[#80ffd5]' : 'text-[#9fb9b1]/55'}`}
                      >
                        <span
                          className={`size-2 rounded-full ${stepNum < publishStep ? 'bg-[#80ffd5]' : stepNum === publishStep ? 'animate-pulse bg-[#ffc46b]' : 'bg-[rgba(190,255,234,0.16)]'}`}
                        />
                        {label}
                      </span>
                      {i < steps.length - 1 && <span className="text-[#9fb9b1]/55">-&gt;</span>}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>
      )}

      {showPreview ? (
        <div className="flex-1 overflow-auto bg-[#071011] p-6 lg:p-8">
          <FormPreview title={title} description={description} fields={elements} />
        </div>
      ) : (
        <Designer
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onApplyTemplate={applyTemplate}
          inspector={
            <div className="space-y-4">
              {/* Category & submit button */}
              <section className="rounded-xl border border-[rgba(190,255,234,0.16)] bg-[rgba(12,34,35,0.72)] p-4">
                <label
                  htmlFor="form-category"
                  className="mb-2 block text-xs font-medium tracking-wider text-[#9fb9b1]/75 uppercase"
                >
                  Category
                </label>
                <select
                  id="form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FormCategory)}
                  className="w-full cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#071011]/70 px-3 py-2 text-sm text-[#effff8] outline-none focus:border-[#80ffd5]"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="submit-btn-text"
                  className="mt-3 mb-1.5 block text-xs font-medium tracking-wider text-[#9fb9b1]/75 uppercase"
                >
                  Submit button text
                </label>
                <input
                  id="submit-btn-text"
                  type="text"
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                  placeholder="Submit"
                  maxLength={50}
                  className="w-full rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#071011]/70 px-3 py-2 text-sm text-[#effff8] outline-none placeholder:text-[#9fb9b1]/45 focus:border-[#80ffd5]"
                />
              </section>

              {/* Readiness panel with inline validation */}
              <section className="rounded-xl border border-[rgba(190,255,234,0.16)] bg-[rgba(12,34,35,0.72)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs font-medium tracking-wider text-[#9fb9b1]/75 uppercase">
                    Readiness
                  </h2>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] ${
                      isReady ? 'bg-[#80ffd5]/10 text-[#80ffd5]' : 'bg-[#ffc46b]/10 text-[#ffc46b]'
                    }`}
                  >
                    {isReady ? 'Ready' : 'Not ready'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <BuilderMetric label="Fields" value={elements.length} />
                  <BuilderMetric label="Required" value={requiredCount} />
                  <BuilderMetric
                    label="Encrypted"
                    value={encryptedCount}
                    icon={<LockKeyhole className="size-3" />}
                  />
                  <BuilderMetric
                    label="Uploads"
                    value={uploadCount}
                    icon={<Database className="size-3" />}
                  />
                </div>

                {/* Inline validation issues */}
                {readinessIssues.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {readinessIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                          issue.severity === 'error'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-[#ffc46b]/10 text-[#ffc46b]'
                        }`}
                      >
                        <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                        <span>{issue.message}</span>
                      </div>
                    ))}
                  </div>
                )}
                {readinessIssues.length === 0 && elements.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#80ffd5]/10 px-2.5 py-1.5 text-xs text-[#80ffd5]">
                    <Check className="size-3 shrink-0" />
                    <span>All checks passed</span>
                  </div>
                )}
              </section>

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

              <section className="rounded-xl border border-[rgba(190,255,234,0.16)] bg-[rgba(12,34,35,0.72)] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wider text-[#9fb9b1]/75 uppercase">
                  <Wallet className="size-3.5 text-[#6fbcf0]" />
                  Publish
                </div>
                <PublishButton
                  title={title}
                  description={description}
                  category={category}
                  submitButtonText={submitButtonText}
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
                  onPublished={clearDraft}
                />
              </section>
            </div>
          }
        />
      )}
    </div>
  )
}

function BuilderMetric({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-[rgba(190,255,234,0.12)] bg-[#071011]/45 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[#9fb9b1]/70">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold text-[#effff8]">{value}</p>
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
