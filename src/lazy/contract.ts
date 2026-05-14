/**
 * On-chain contract interactions — lazy-loaded when TX needed.
 */
import { Transaction } from '@mysten/sui/transactions'
import type { SuiClientTypes } from '@mysten/sui/client'
import { PACKAGE_ID, REGISTRY_ID, dAppKit } from './sui-client'

const CLOCK_ID = '0x6'

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

  tx.moveCall({
    package: PACKAGE_ID,
    module: 'taskform',
    function: 'create_form',
    arguments: [
      tx.object(REGISTRY_ID),
      tx.pure.string(params.title),
      tx.pure('vector<u8>', Array.from(new TextEncoder().encode(params.schemaBlobId))),
      tx.pure.id(params.schemaBlobObjectId),
      tx.pure('vector<u8>', Array.from(new TextEncoder().encode(params.schemaDownloadId))),
      tx.pure.u64(params.expiryEpoch),
      tx.object(CLOCK_ID),
    ],
  })

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
 * Publish form on-chain (make it publicly submittable).
 */
export async function publishFormOnChain(params: {
  formObjectId: string
  creatorCapId: string
}): Promise<void> {
  const tx = new Transaction()

  tx.moveCall({
    package: PACKAGE_ID,
    module: 'taskform',
    function: 'publish_form',
    arguments: [
      tx.object(params.formObjectId),
      tx.object(params.creatorCapId),
      tx.object(CLOCK_ID),
    ],
  })

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
  expiryEpoch: number
}): Promise<void> {
  const tx = new Transaction()

  tx.moveCall({
    package: PACKAGE_ID,
    module: 'taskform',
    function: 'submit_form',
    arguments: [
      tx.object(params.formObjectId),
      tx.pure('vector<u8>', Array.from(new TextEncoder().encode(params.submissionBlobId))),
      tx.pure.id(params.submissionBlobObjectId),
      tx.pure.u64(params.expiryEpoch),
      tx.object(CLOCK_ID),
    ],
  })

  const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
  const txResult = result.Transaction ?? result.FailedTransaction
  if (!txResult || ('status' in txResult && txResult.status?.error)) {
    throw new Error('submit_form transaction failed')
  }
}
