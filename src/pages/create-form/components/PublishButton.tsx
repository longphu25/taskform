import { useState } from 'react'
import type { FormField, StoragePolicy, SponsorSettings, FormSchema } from '../../../types/form'
import { formSchemaValidator } from '../../../schemas/form'
import { pagePath } from '../../../utils/paths'
import { useWalletAddress } from '../hooks/useWalletAddress'

interface PublishButtonProps {
  title: string
  description: string
  fields: FormField[]
  storagePolicy: StoragePolicy
  sponsorSettings: SponsorSettings
  onPublishingChange?: (publishing: boolean) => void
  onStepChange?: (step: number) => void
}

type PublishState = 'idle' | 'validating' | 'uploading' | 'success' | 'error'

export function PublishButton({
  title,
  description,
  fields,
  storagePolicy,
  sponsorSettings,
  onPublishingChange,
  onStepChange,
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
    onPublishingChange?.(true)
    onStepChange?.(1)

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
        onStep: (step) => {
          const stepMap = { swap: 2, encode: 3, register: 4, upload: 5, certify: 6 }
          onStepChange?.(stepMap[step])
        },
      })

      // Create form on-chain
      onStepChange?.(7)
      const { createFormOnChain, publishFormOnChain } = await import('../../../lazy/contract')
      const { formObjectId, creatorCapId } = await createFormOnChain({
        title,
        schemaBlobId: uploadResult.blobId,
        schemaBlobObjectId: uploadResult.objectId ?? '',
        expiryEpoch: storagePolicy.schemaDuration,
      })

      // Publish form on-chain
      onStepChange?.(8)
      await publishFormOnChain({ formObjectId, creatorCapId })

      // Generate public link
      const baseUrl = window.location.origin + pagePath('/form.html')
      const link = `${baseUrl}?formId=${uploadResult.downloadId}&formObjectId=${formObjectId}`
      setPublicLink(link)
      setState('success')
      onPublishingChange?.(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setState('error')
      onPublishingChange?.(false)
    }
  }

  const canPublish = title.trim().length > 0 && fields.length > 0

  return (
    <div className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-6">
      {state === 'success' && publicLink ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#80ffd5]" />
            <span className="text-sm font-medium text-[#80ffd5]">Published successfully</span>
          </div>
          <div className="rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] p-3">
            <p className="mb-1 text-xs text-[#9fb9b1]/70">Public form link:</p>
            <a
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-[#80ffd5] hover:text-[#28d8c1]"
            >
              {publicLink}
            </a>
          </div>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(publicLink)}
            className="cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] px-4 py-2 text-sm transition-colors hover:bg-[#80ffd5]/10"
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
            className="w-full cursor-pointer rounded-lg bg-[#80ffd5] px-4 py-3 font-medium text-[#06231d] transition-colors hover:bg-[#28d8c1] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === 'validating' && 'Validating...'}
            {state === 'uploading' && 'Uploading to Walrus...'}
            {(state === 'idle' || state === 'error') && 'Publish Form'}
          </button>

          {!canPublish && (
            <p className="text-center text-xs text-[#9fb9b1]/55">
              Add a title and at least one field to publish
            </p>
          )}
        </div>
      )}
    </div>
  )
}
