/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/

/**
 * Account-based Seal access control for TaskForm. Only the form creator (by
 * address) can decrypt sensitive submissions.
 *
 * Key format: [pkg id][bcs::to_bytes(creator_address)]
 *
 * - Encrypt: use creator address as identity
 * - Decrypt: only creator address can call seal_approve
 */

import { type Transaction } from '@mysten/sui/transactions'
import { normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js'
export interface SealApproveArguments {
  id: RawTransactionArgument<Array<number>>
}
export interface SealApproveOptions {
  package?: string
  arguments: SealApproveArguments | [id: RawTransactionArgument<Array<number>>]
}
export function sealApprove(options: SealApproveOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = ['vector<u8>'] satisfies (string | null)[]
  const parameterNames = ['id']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'seal_policy',
      function: 'seal_approve',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
