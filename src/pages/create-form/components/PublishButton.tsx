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
      const { createForm } = await import('../../../contract/taskform/taskform')
      const { REGISTRY_ID } = await import('../../../lazy/sui-client')

      // Upload schema + create_form in combined certify PTB (1 sign instead of 2)
      const uploadResult = await uploadToWalrus({
        data: jsonData,
        epochs: storagePolicy.schemaDuration,
        onStep: (step) => {
          const stepMap = { swap: 2, encode: 3, register: 4, upload: 5, certify: 6 }
          onStepChange?.(stepMap[step])
        },
        appendToCertify: (tx, meta) => {
          tx.add(
            createForm({
              arguments: {
                registry: REGISTRY_ID,
                title,
                schemaBlobId: Array.from(new TextEncoder().encode(meta.blobId)),
                schemaBlobObjectId: meta.objectId,
                schemaDownloadId: Array.from(new TextEncoder().encode(meta.blobId)),
                expiryEpoch: storagePolicy.schemaDuration,
              },
            }),
          )
        },
      })

      // Parse formObjectId + creatorCapId from combined certify+create TX effects
      onStepChange?.(7)
      let formObjectId = ''
      let creatorCapId = ''
      const changedObjects = uploadResult.certifyEffects?.changedObjects ?? []
      for (const obj of changedObjects) {
        if (obj.idOperation !== 'Created') continue
        const owner = obj.outputOwner
        if (owner && typeof owner === 'object' && 'Shared' in owner) {
          formObjectId = obj.objectId
        } else if (owner && typeof owner === 'object' && 'AddressOwner' in owner) {
          // CreatorCap is the non-blob owned object (blob object was created in register)
          if (obj.objectId !== uploadResult.objectId) {
            creatorCapId = obj.objectId
          }
        }
      }

      if (!formObjectId || !creatorCapId) {
        throw new Error('Failed to parse form/cap IDs from transaction')
      }

      // Publish form + configure sponsored mode in 1 PTB (1 sign)
      onStepChange?.(8)
      const { publishFormOnChain } = await import('../../../lazy/contract')
      await publishFormOnChain({
        formObjectId,
        creatorCapId,
        sponsoredEnabled: sponsorSettings.enabled,
      })

      // Generate public link (short URL — form.html reads schema_download_id from on-chain)
      const baseUrl = window.location.origin + pagePath('/form.html')
      const link = `${baseUrl}?id=${formObjectId}`
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
              className="text-sm break-all text-[#80ffd5] hover:text-[#28d8c1]"
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
