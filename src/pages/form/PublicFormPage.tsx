import { useState, useEffect } from 'react'
import * as z from 'zod'
import type { FormSchema, FormField } from '../../types/form'

function buildZodSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const field of fields) {
    if (field.type === 'checkbox') {
      shape[field.id] = field.required
        ? z.array(z.string()).min(1, 'Select at least one option')
        : z.array(z.string())
    } else if (field.type === 'confirmation') {
      shape[field.id] = field.required
        ? z.literal(true, { message: 'This field is required' })
        : z.boolean()
    } else if (field.type === 'star-rating') {
      shape[field.id] = field.required ? z.number().min(1, 'Please select a rating') : z.number()
    } else if (field.type === 'screenshot-upload' || field.type === 'video-upload') {
      shape[field.id] = field.required
        ? z.array(z.any()).min(1, 'Please upload at least one file')
        : z.array(z.any())
    } else {
      shape[field.id] = field.required ? z.string().min(1, 'This field is required') : z.string()
    }
  }
  return z.object(shape)
}

export function PublicFormPage() {
  const params = new URLSearchParams(window.location.search)
  // Support both new short URL (?id=0x...) and legacy (?formId=...&formObjectId=0x...)
  const formObjectId = params.get('id') || params.get('formObjectId')
  const legacyFormId = params.get('formId')

  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!!(formObjectId || legacyFormId))
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!formObjectId && !legacyFormId) return

    async function loadSchema() {
      const { downloadJsonFromWalrus } = await import('../../lazy/walrus-download')

      let downloadId = legacyFormId
      if (!downloadId && formObjectId) {
        // Read schema_download_id from on-chain Form object
        const { Form } = await import('../../contract/taskform/taskform')
        const { getSuiClient } = await import('../../lazy/sui-client')
        const client = getSuiClient()
        const formObj = await Form.get({ client, objectId: formObjectId })
        const rawDownloadId = formObj.json.schema_download_id as number[]
        downloadId = new TextDecoder().decode(new Uint8Array(rawDownloadId))
      }

      if (!downloadId) throw new Error('Could not resolve form download ID')
      return downloadJsonFromWalrus<FormSchema>(downloadId)
    }

    loadSchema()
      .then((data) => {
        setSchema(data)
        const initial: Record<string, unknown> = {}
        for (const f of data.fields) {
          if (f.type === 'checkbox') initial[f.id] = []
          else if (f.type === 'star-rating') initial[f.id] = 0
          else if (f.type === 'confirmation') initial[f.id] = false
          else if (f.type === 'screenshot-upload' || f.type === 'video-upload') initial[f.id] = []
          else initial[f.id] = ''
        }
        setValues(initial)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load form'))
      .finally(() => setLoading(false))
  }, [formObjectId, legacyFormId])

  const setValue = (fieldId: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
    setValidationErrors((prev) => {
      const next = { ...prev }
      delete next[fieldId]
      return next
    })
  }

  const validate = (): boolean => {
    if (!schema) return false
    const zodSchema = buildZodSchema(schema.fields)
    const result = zodSchema.safeParse(values)
    if (result.success) {
      setValidationErrors({})
      return true
    }
    const errors: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0])
      if (!errors[key]) errors[key] = issue.message
    }
    setValidationErrors(errors)
    return false
  }

  const handleSubmit = async () => {
    if (!validate() || !schema) return
    // Ensure wallet connected
    const { dAppKit } = await import('../../lazy/sui-client')
    const conn = dAppKit.stores.$connection.get()
    if (!conn.isConnected) {
      const wallets = dAppKit.stores.$wallets.get()
      if (!wallets.length) {
        setError('No Sui wallet detected.')
        return
      }
      await dAppKit.connectWallet({ wallet: wallets[0] })
    }
    setSubmitting(true)
    setError(null)
    try {
      const { uploadToWalrus } = await import('../../lazy/walrus-upload')
      const epochs = schema.storagePolicy.submissionDuration

      // Setup encrypt if any sensitive fields
      const hasSensitive = schema.fields.some((f) => f.sensitive)
      let encryptFn:
        | ((p: { creatorAddress: string; plaintext: string }) => Promise<Uint8Array>)
        | null = null
      if (hasSensitive && schema.creatorAddress) {
        const { encryptField } = await import('../../lazy/seal-encrypt')
        encryptFn = encryptField
      }

      // Upload attachments first
      const attachments: Record<string, string[]> = {}
      for (const field of schema.fields) {
        if (field.type !== 'screenshot-upload' && field.type !== 'video-upload') continue
        const files = values[field.id] as File[]
        if (!files?.length) continue
        const blobIds: string[] = []
        for (let i = 0; i < files.length; i++) {
          let data: Uint8Array = new Uint8Array(await files[i].arrayBuffer())
          // Encrypt file if field is sensitive
          if (field.sensitive && encryptFn && schema.creatorAddress) {
            data = await encryptFn({
              creatorAddress: schema.creatorAddress,
              plaintext: btoa(String.fromCharCode(...data)),
            })
          }
          const result = await uploadToWalrus({ data, epochs })
          blobIds.push(result.downloadId)
        }
        attachments[field.id] = blobIds
      }

      // Build submission fields
      const fields = await Promise.all(
        schema.fields.map(async (f) => {
          if (attachments[f.id])
            return { fieldId: f.id, value: attachments[f.id], encrypted: f.sensitive }
          const val = values[f.id]
          if (f.sensitive && encryptFn && schema.creatorAddress && val != null && val !== '') {
            const plaintext = typeof val === 'string' ? val : JSON.stringify(val)
            const encrypted = await encryptFn({ creatorAddress: schema.creatorAddress, plaintext })
            return {
              fieldId: f.id,
              value: btoa(String.fromCharCode(...encrypted)),
              encrypted: true,
            }
          }
          return { fieldId: f.id, value: val, encrypted: false }
        }),
      )

      const submission = { formId: formObjectId, fields, submittedAt: Date.now() }

      // Pre-import submit_form binding for use in appendToCertify
      const { submitForm } = await import('../../contract/taskform/taskform')

      await uploadToWalrus({
        data: JSON.stringify(submission),
        epochs,
        // Gộp certify + submit_form vào 1 PTB — giảm 1 lần ký ví
        appendToCertify: formObjectId
          ? (tx, meta) => {
              tx.add(
                submitForm({
                  arguments: {
                    form: formObjectId,
                    submissionBlobId: Array.from(new TextEncoder().encode(meta.blobId)),
                    submissionBlobObjectId: meta.objectId,
                    submissionDownloadId: Array.from(new TextEncoder().encode(meta.blobId)),
                    expiryEpoch: epochs,
                  },
                }),
              )
            }
          : undefined,
      })

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!formObjectId && !legacyFormId) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="mb-2 text-xl font-semibold">No form specified</h2>
          <p className="text-[#9fb9b1]">Please use a valid form link.</p>
        </div>
      </Shell>
    )
  }

  if (loading) {
    return (
      <Shell>
        <div className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-8">
          <div className="flex items-center gap-3">
            <div className="size-5 animate-spin rounded-full border-2 border-[#80ffd5]/20 border-t-[#80ffd5]" />
            <p className="text-sm text-[#9fb9b1]">Loading form...</p>
          </div>
        </div>
      </Shell>
    )
  }

  if (error && !schema) {
    return (
      <Shell>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </Shell>
    )
  }

  if (submitted) {
    return (
      <Shell>
        <div className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#80ffd5]/10">
            <svg
              className="size-6 text-[#80ffd5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold">Submitted!</h2>
          <p className="text-[#9fb9b1]">Your response has been recorded on Walrus.</p>
        </div>
      </Shell>
    )
  }

  if (!schema) return null

  return (
    <Shell>
      <div className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-8">
        <h2 className="mb-2 text-2xl font-semibold">{schema.title}</h2>
        {schema.description && <p className="mb-8 text-[#9fb9b1]">{schema.description}</p>}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {schema.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={values[field.id]}
              onChange={(val) => setValue(field.id, val)}
              error={validationErrors[field.id]}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-8 w-full cursor-pointer rounded-lg bg-[#80ffd5] px-4 py-3 font-medium text-[#06231d] transition-colors hover:bg-[#28d8c1] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#071011] text-[#effff8]">
      <nav className="fixed top-4 right-4 left-4 z-50 mx-auto max-w-2xl rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">TaskForm</span>
          <span className="text-xs text-[#9fb9b1]/70">Powered by Walrus</span>
        </div>
      </nav>
      <main className="mx-auto max-w-2xl px-4 pt-24 pb-12">{children}</main>
    </div>
  )
}

function FieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: FormField
  value: unknown
  onChange: (val: unknown) => void
  error?: string
}) {
  const label = (
    <label className="mb-1.5 block text-sm font-medium text-[#effff8]/85">
      {field.label}
      {field.required && <span className="ml-1 text-red-400">*</span>}
      {field.sensitive && <span className="ml-2 text-xs text-[#ffc46b]">(encrypted)</span>}
    </label>
  )

  const errorEl = error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null
  const inputClass = `w-full rounded-lg border bg-[#0d1c1d] px-4 py-2.5 text-[#effff8] placeholder-[#9fb9b1]/55 outline-none focus:border-[#80ffd5] ${error ? 'border-red-500/50' : 'border-[rgba(190,255,234,0.16)]'}`

  switch (field.type) {
    case 'short-text':
    case 'url':
      return (
        <div>
          {label}
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
          {errorEl}
        </div>
      )
    case 'rich-text':
      return (
        <div>
          {label}
          <textarea
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
          />
          {errorEl}
        </div>
      )
    case 'dropdown':
      return (
        <div>
          {label}
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled hidden>
              {field.placeholder || 'Select...'}
            </option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errorEl}
        </div>
      )
    case 'checkbox':
      return (
        <div>
          {label}
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={(value as string[]).includes(opt.value)}
                  onChange={(e) => {
                    const arr = value as string[]
                    onChange(
                      e.target.checked ? [...arr, opt.value] : arr.filter((v) => v !== opt.value),
                    )
                  }}
                  className="size-4 rounded accent-[#80ffd5]"
                />
                <span className="text-sm text-[#effff8]/85">{opt.label}</span>
              </label>
            ))}
          </div>
          {errorEl}
        </div>
      )
    case 'star-rating':
      return (
        <div>
          {label}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className={`cursor-pointer text-2xl transition-colors ${n <= (value as number) ? 'text-[#ffc46b]' : 'text-[#9fb9b1]/55 hover:text-[#ffc46b]/50'}`}
              >
                ★
              </button>
            ))}
          </div>
          {errorEl}
        </div>
      )
    case 'screenshot-upload':
    case 'video-upload': {
      const isVideo = field.type === 'video-upload'
      const accept = isVideo ? 'video/*' : 'image/*'
      const files = (value as File[]) || []
      return (
        <div>
          {label}
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-[rgba(12,34,35,0.58)] py-4 transition-colors ${error ? 'border-red-500/50' : 'border-[rgba(190,255,234,0.16)] hover:border-[#80ffd5]/50'}`}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('border-[#80ffd5]/50')
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('border-[#80ffd5]/50')
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-[#80ffd5]/50')
              const dropped = Array.from(e.dataTransfer.files).filter((f) =>
                f.type.startsWith(isVideo ? 'video/' : 'image/'),
              )
              if (dropped.length) onChange([...files, ...dropped])
            }}
          >
            <svg
              className="mb-1 size-5 text-[#9fb9b1]/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="text-sm text-[#9fb9b1]/70">
              {isVideo ? 'Drop video or click to upload' : 'Drop images or click to upload'}
            </p>
            <p className="mt-0.5 text-xs text-[#9fb9b1]/55">
              {isVideo ? 'MP4, WebM, MOV' : 'PNG, JPG, GIF, WebP'}
            </p>
            <input
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={(e) => {
                const added = Array.from(e.target.files || [])
                if (added.length) onChange([...files, ...added])
              }}
            />
          </label>
          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {files.map((file, i) => (
                <div key={`${file.name}-${i}`} className="group relative">
                  {!isVideo && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  )}
                  {isVideo && (
                    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-[#0d1c1d]">
                      <svg
                        className="size-6 text-[#9fb9b1]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-[#effff8] opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ✕
                  </button>
                  <p className="mt-1 truncate text-[10px] text-[#9fb9b1]/70">{file.name}</p>
                </div>
              ))}
            </div>
          )}
          {errorEl}
        </div>
      )
    }
    case 'confirmation':
      return (
        <div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => onChange(e.target.checked)}
              className="size-4 rounded accent-[#80ffd5]"
            />
            <span className="text-sm text-[#effff8]/85">
              {field.label}
              {field.required && <span className="ml-1 text-red-400">*</span>}
            </span>
          </label>
          {errorEl}
        </div>
      )
    default:
      return null
  }
}
