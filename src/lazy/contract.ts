/**
 * On-chain contract interactions — lazy-loaded when TX needed.
 *
 * Uses codegen named-argument style. The codegen's normalizeMoveArguments
 * handles BCS serialization (String, vector<u8>, ID, u64) and auto-injects
 * Clock automatically — no manual tx.pure.* needed.
 */
import { Transaction } from '@mysten/sui/transactions'
import type { SuiClientTypes } from '@mysten/sui/client'
import {
  createForm,
  publishForm,
  submitForm,
  configureSponsoredMode,
} from '../contract/taskform/taskform'
import { REGISTRY_ID, dAppKit } from './sui-client'

/**
 * Create form on-chain. Returns formObjectId and creatorCapId.
 */
export async function createFormOnChain(params: {
  title: string
  schemaBlobId: string
  schemaBlobObjectId: string
  schemaDownloadId: string
  expiryEpoch: number
}): Promise<{ formObjectId: string; creatorCapId: string }> {
  const tx = new Transaction()

  tx.add(
    createForm({
      arguments: {
        registry: REGISTRY_ID,
        title: params.title,
        schemaBlobId: Array.from(new TextEncoder().encode(params.schemaBlobId)),
        schemaBlobObjectId: params.schemaBlobObjectId,
        schemaDownloadId: Array.from(new TextEncoder().encode(params.schemaDownloadId)),
        expiryEpoch: params.expiryEpoch,
      },
    }),
  )

  const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
  const txResult = result.Transaction ?? result.FailedTransaction
  if (!txResult || ('status' in txResult && txResult.status?.error)) {
    throw new Error('create_form transaction failed')
  }

  // Parse created objects from changedObjects in effects
  const changedObjects: SuiClientTypes.ChangedObject[] = txResult.effects?.changedObjects ?? []
  let formObjectId = ''
  let creatorCapId = ''

  for (const obj of changedObjects) {
    if (obj.idOperation !== 'Created') continue
    const owner = obj.outputOwner
    if (owner && 'Shared' in owner) {
      formObjectId = obj.objectId
    } else if (owner && 'AddressOwner' in owner) {
      creatorCapId = obj.objectId
    }
  }

  if (!formObjectId || !creatorCapId) {
    throw new Error('Failed to parse form/cap IDs from transaction')
  }

  return { formObjectId, creatorCapId }
}

/**
 * Publish form + optionally configure sponsored mode in a single PTB.
 * Reduces wallet signatures by combining publish + sponsor into 1 TX.
 */
export async function publishFormOnChain(params: {
  formObjectId: string
  creatorCapId: string
  sponsoredEnabled?: boolean
}): Promise<void> {
  const tx = new Transaction()

  tx.add(
    publishForm({
      arguments: {
        form: params.formObjectId,
        cap: params.creatorCapId,
      },
    }),
  )

  // Append configure_sponsored_mode in same PTB if enabled
  if (params.sponsoredEnabled) {
    tx.add(
      configureSponsoredMode({
        arguments: {
          form: params.formObjectId,
          cap: params.creatorCapId,
          sponsoredEnabled: true,
        },
      }),
    )
  }

  const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
  const txResult = result.Transaction ?? result.FailedTransaction
  if (!txResult || ('status' in txResult && txResult.status?.error)) {
    throw new Error('publish_form transaction failed')
  }
}

/**
 * Submit form on-chain (anchor submission metadata).
 */
export async function submitFormOnChain(params: {
  formObjectId: string
  submissionBlobId: string
  submissionBlobObjectId: string
  submissionDownloadId: string
  expiryEpoch: number
}): Promise<void> {
  const tx = new Transaction()

  tx.add(
    submitForm({
      arguments: {
        form: params.formObjectId,
        submissionBlobId: Array.from(new TextEncoder().encode(params.submissionBlobId)),
        submissionBlobObjectId: params.submissionBlobObjectId,
        submissionDownloadId: Array.from(new TextEncoder().encode(params.submissionDownloadId)),
        expiryEpoch: params.expiryEpoch,
      },
    }),
  )

  const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
  const txResult = result.Transaction ?? result.FailedTransaction
  if (!txResult || ('status' in txResult && txResult.status?.error)) {
    throw new Error('submit_form transaction failed')
  }
}

/**
 * Configure sponsored mode on-chain. Requires CreatorCap.
 */
export async function configureSponsoredModeOnChain(params: {
  formObjectId: string
  creatorCapId: string
  sponsoredEnabled: boolean
}): Promise<void> {
  const tx = new Transaction()

  tx.add(
    configureSponsoredMode({
      arguments: {
        form: params.formObjectId,
        cap: params.creatorCapId,
        sponsoredEnabled: params.sponsoredEnabled,
      },
    }),
  )

  const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
  const txResult = result.Transaction ?? result.FailedTransaction
  if (!txResult || ('status' in txResult && txResult.status?.error)) {
    throw new Error('configure_sponsored_mode transaction failed')
  }
}
