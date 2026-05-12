import { useState, useCallback } from 'react'
import { pagePath } from '../../utils/paths'
import { FieldEditor } from './components/FieldEditor'
import { FieldList } from './components/FieldList'
import { FormPreview } from './components/FormPreview'
import { StoragePolicyPanel } from './components/StoragePolicyPanel'
import { SponsorPanel } from './components/SponsorPanel'
import { PublishButton } from './components/PublishButton'
import type { FormField, FieldType, StoragePolicy, SponsorSettings } from '../../types/form'
import { DEFAULT_STORAGE_POLICY, DEFAULT_SPONSOR_SETTINGS } from '../../schemas/form'

function generateId(): string {
  return crypto.randomUUID()
}

function createDefaultField(type: FieldType): FormField {
  const base: FormField = {
    id: generateId(),
    type,
    label: '',
    placeholder: '',
    required: false,
    sensitive: false,
  }
  if (type === 'dropdown' || type === 'checkbox') {
    base.options = [{ label: '', value: '' }]
  }
  if (type === 'screenshot-upload' || type === 'video-upload') {
    base.uploadSettings = {
      maxSizeMB: type === 'video-upload' ? 50 : 10,
      allowedTypes:
        type === 'video-upload'
          ? ['video/mp4', 'video/webm']
          : ['image/png', 'image/jpeg', 'image/webp'],
    }
  }
  return base
}

export function CreateFormPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [storagePolicy, setStoragePolicy] = useState<StoragePolicy>({ ...DEFAULT_STORAGE_POLICY })
  const [sponsorSettings, setSponsorSettings] = useState<SponsorSettings>({
    ...DEFAULT_SPONSOR_SETTINGS,
  })
  const [showPreview, setShowPreview] = useState(false)

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null

  const addField = useCallback((type: FieldType) => {
    const field = createDefaultField(type)
    setFields((prev) => [...prev, field])
    setSelectedFieldId(field.id)
  }, [])

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }, [])

  const removeField = useCallback(
    (id: string) => {
      setFields((prev) => prev.filter((f) => f.id !== id))
      if (selectedFieldId === id) setSelectedFieldId(null)
    },
    [selectedFieldId],
  )

  const moveField = useCallback((fromIndex: number, toIndex: number) => {
    setFields((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl border border-white/10 bg-zinc-900/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <a href={pagePath('/')} className="text-lg font-semibold tracking-tight cursor-pointer">
            TaskForm
          </a>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-white/20 hover:bg-white/5"
            >
              {showPreview ? 'Editor' : 'Preview'}
            </button>
            <a
              href={pagePath('/dashboard.html')}
              className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-white/20 hover:bg-white/5"
            >
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-12">
        {showPreview ? (
          <FormPreview title={title} description={description} fields={fields} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Form meta + field list */}
            <div className="space-y-6 lg:col-span-1">
              {/* Title & Description */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                <label className="mb-2 block text-sm font-medium text-zinc-400">Form Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bug Report"
                  className="mb-4 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 outline-none transition-colors focus:border-indigo-500"
                />
                <label className="mb-2 block text-sm font-medium text-zinc-400">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this form collects..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 outline-none transition-colors focus:border-indigo-500"
                />
              </div>

              {/* Field List */}
              <FieldList
                fields={fields}
                selectedFieldId={selectedFieldId}
                onSelect={setSelectedFieldId}
                onAdd={addField}
                onRemove={removeField}
                onMove={moveField}
              />

              {/* Storage Policy */}
              <StoragePolicyPanel policy={storagePolicy} onChange={setStoragePolicy} />

              {/* Sponsor Settings */}
              <SponsorPanel settings={sponsorSettings} onChange={setSponsorSettings} />
            </div>

            {/* Right: Field editor */}
            <div className="lg:col-span-2">
              {selectedField ? (
                <FieldEditor
                  field={selectedField}
                  onChange={(updates) => updateField(selectedField.id, updates)}
                />
              ) : (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30">
                  <p className="text-zinc-500">Select a field to edit, or add a new one</p>
                </div>
              )}

              {/* Publish */}
              <div className="mt-6">
                <PublishButton
                  title={title}
                  description={description}
                  fields={fields}
                  storagePolicy={storagePolicy}
                  sponsorSettings={sponsorSettings}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
