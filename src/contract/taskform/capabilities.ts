/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js'
import { bcs } from '@mysten/sui/bcs'
import { type Transaction } from '@mysten/sui/transactions'
const $moduleName = '@local-pkg/taskform::capabilities'
export const CreatorCap = new MoveStruct({
  name: `${$moduleName}::CreatorCap`,
  fields: {
    id: bcs.Address,
    form_id: bcs.Address,
  },
})
export const AdminCap = new MoveStruct({
  name: `${$moduleName}::AdminCap`,
  fields: {
    id: bcs.Address,
    form_id: bcs.Address,
  },
})
export interface FormIdArguments {
  cap: RawTransactionArgument<string>
}
export interface FormIdOptions {
  package?: string
  arguments: FormIdArguments | [cap: RawTransactionArgument<string>]
}
export function formId(options: FormIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['cap']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'capabilities',
      function: 'form_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface AdminFormIdArguments {
  cap: RawTransactionArgument<string>
}
export interface AdminFormIdOptions {
  package?: string
  arguments: AdminFormIdArguments | [cap: RawTransactionArgument<string>]
}
export function adminFormId(options: AdminFormIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['cap']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'capabilities',
      function: 'admin_form_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
