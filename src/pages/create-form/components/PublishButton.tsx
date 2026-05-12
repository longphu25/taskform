import { useState } from 'react'
import type { FormField, StoragePolicy, SponsorSettings, FormSchema } from '../../../types/form'
import { formSchemaValidator } from '../../../schemas/form'
import { pagePath } from '../../../utils/paths'
import { useWalletAddress } from './WalletConnect'

interface PublishButtonProps {
  title: string
  description: string
  fields: FormField[]
  storagePolicy: StoragePolicy
  sponsorSettings: SponsorSettings
}

type PublishState = 'idle' | 'validating' | 'uploading' | 'success' | 'error'

export function PublishButton({
  title,
  description,
  fields,
  storagePolicy,
  sponsorSettings,
}: PublishButtonProps) {
  const [state, setState] = useState<PublishState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [publicLink, setPublicLink] = useState<string | null>(null)
  const walletAddress = useWalletAddress()

  const handlePublish = async () => {
    setError(null)

    if (!walletAddress) {
      setError('Please connect your wallet first')
      setState('error')
      return
    }

    setState('validating')

    // Build schema object
    const schema: FormSchema = {
      id: crypto.randomUUID(),
      title,
      description,
      fields,
      storagePolicy,
      sponsor: sponsorSettings,
      createdAt: Date.now(),
      creatorAddress: walletAddress,
    }

    // Validate with Zod
    const result = formSchemaValidator.safeParse(schema)
    if (!result.success) {
      const firstError = result.error.issues[0]
      setError(`Validation: ${firstError.path.join('.')} — ${firstError.message}`)
      setState('error')
      return
    }

    // Upload to Walrus
    setState('uploading')
    try {
      const jsonData = JSON.stringify(schema)
      const { uploadToWalrus } = await import('../../../lazy/walrus-upload')
      const uploadResult = await uploadToWalrus({
        data: jsonData,
        epochs: storagePolicy.schemaDuration,
      })

      // Generate public link
      const baseUrl = window.location.origin + pagePath('/form.html')
      const link = `${baseUrl}?formId=${uploadResult.blobId}`
      setPublicLink(link)
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setState('error')
    }
  }

  const canPublish = title.trim().length > 0 && fields.length > 0

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
      {state === 'success' && publicLink ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-400" />
            <span className="text-sm font-medium text-green-400">Published successfully</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-zinc-800 p-3">
            <p className="mb-1 text-xs text-zinc-500">Public form link:</p>
            <a
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-indigo-400 hover:text-indigo-300"
            >
              {publicLink}
            </a>
          </div>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(publicLink)}
            className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/5"
          >
            Copy Link
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish || state === 'validating' || state === 'uploading'}
            className="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-3 font-medium transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === 'validating' && 'Validating...'}
            {state === 'uploading' && 'Uploading to Walrus...'}
            {(state === 'idle' || state === 'error') && 'Publish Form'}
          </button>

          {!canPublish && (
            <p className="text-center text-xs text-zinc-600">
              Add a title and at least one field to publish
            </p>
          )}
        </div>
      )}
    </div>
  )
}
