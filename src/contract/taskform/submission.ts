/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js'
import { bcs } from '@mysten/sui/bcs'
import { type Transaction } from '@mysten/sui/transactions'
const $moduleName = '@local-pkg/taskform::submission'
export const SubmissionMeta = new MoveStruct({
  name: `${$moduleName}::SubmissionMeta`,
  fields: {
    id: bcs.Address,
    form_id: bcs.Address,
    submitter: bcs.Address,
    submission_blob_id: bcs.vector(bcs.u8()),
    submission_blob_object_id: bcs.Address,
    submission_download_id: bcs.vector(bcs.u8()),
    expiry_epoch: bcs.u64(),
    created_at_ms: bcs.u64(),
    status: bcs.u8(),
    priority: bcs.u8(),
    admin_note_blob_id: bcs.vector(bcs.u8()),
    admin_note_blob_object_id: bcs.option(bcs.Address),
    admin_note_updated_at_ms: bcs.u64(),
  },
})
export interface IdArguments {
  sub: RawTransactionArgument<string>
}
export interface IdOptions {
  package?: string
  arguments: IdArguments | [sub: RawTransactionArgument<string>]
}
export function id(options: IdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface FormIdArguments {
  sub: RawTransactionArgument<string>
}
export interface FormIdOptions {
  package?: string
  arguments: FormIdArguments | [sub: RawTransactionArgument<string>]
}
export function formId(options: FormIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'form_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SubmitterArguments {
  sub: RawTransactionArgument<string>
}
export interface SubmitterOptions {
  package?: string
  arguments: SubmitterArguments | [sub: RawTransactionArgument<string>]
}
export function submitter(options: SubmitterOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'submitter',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface StatusArguments {
  sub: RawTransactionArgument<string>
}
export interface StatusOptions {
  package?: string
  arguments: StatusArguments | [sub: RawTransactionArgument<string>]
}
export function status(options: StatusOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'status',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface PriorityArguments {
  sub: RawTransactionArgument<string>
}
export interface PriorityOptions {
  package?: string
  arguments: PriorityArguments | [sub: RawTransactionArgument<string>]
}
export function priority(options: PriorityOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'priority',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SubmissionBlobIdArguments {
  sub: RawTransactionArgument<string>
}
export interface SubmissionBlobIdOptions {
  package?: string
  arguments: SubmissionBlobIdArguments | [sub: RawTransactionArgument<string>]
}
export function submissionBlobId(options: SubmissionBlobIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'submission_blob_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface AdminNoteBlobIdArguments {
  sub: RawTransactionArgument<string>
}
export interface AdminNoteBlobIdOptions {
  package?: string
  arguments: AdminNoteBlobIdArguments | [sub: RawTransactionArgument<string>]
}
export function adminNoteBlobId(options: AdminNoteBlobIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'admin_note_blob_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface AdminNoteUpdatedAtMsArguments {
  sub: RawTransactionArgument<string>
}
export interface AdminNoteUpdatedAtMsOptions {
  package?: string
  arguments: AdminNoteUpdatedAtMsArguments | [sub: RawTransactionArgument<string>]
}
export function adminNoteUpdatedAtMs(options: AdminNoteUpdatedAtMsOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['sub']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'admin_note_updated_at_ms',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface IsValidStatusArguments {
  status: RawTransactionArgument<number>
}
export interface IsValidStatusOptions {
  package?: string
  arguments: IsValidStatusArguments | [status: RawTransactionArgument<number>]
}
export function isValidStatus(options: IsValidStatusOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = ['u8'] satisfies (string | null)[]
  const parameterNames = ['status']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'is_valid_status',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface IsValidPriorityArguments {
  priority: RawTransactionArgument<number>
}
export interface IsValidPriorityOptions {
  package?: string
  arguments: IsValidPriorityArguments | [priority: RawTransactionArgument<number>]
}
export function isValidPriority(options: IsValidPriorityOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = ['u8'] satisfies (string | null)[]
  const parameterNames = ['priority']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'submission',
      function: 'is_valid_priority',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
