/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js'
import { bcs } from '@mysten/sui/bcs'
import { type Transaction } from '@mysten/sui/transactions'
const $moduleName = '@local-pkg/taskform::taskform'
export const TaskFormRegistry = new MoveStruct({
  name: `${$moduleName}::TaskFormRegistry`,
  fields: {
    id: bcs.Address,
    form_count: bcs.u64(),
  },
})
export const Form = new MoveStruct({
  name: `${$moduleName}::Form`,
  fields: {
    id: bcs.Address,
    creator: bcs.Address,
    title: bcs.string(),
    schema_blob_id: bcs.vector(bcs.u8()),
    schema_blob_object_id: bcs.Address,
    expiry_epoch: bcs.u64(),
    submission_count: bcs.u64(),
    latest_submission_id: bcs.Address,
    is_published: bcs.bool(),
    sponsored_enabled: bcs.bool(),
  },
})
export interface FormCountArguments {
  registry: RawTransactionArgument<string>
}
export interface FormCountOptions {
  package?: string
  arguments: FormCountArguments | [registry: RawTransactionArgument<string>]
}
export function formCount(options: FormCountOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['registry']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'form_count',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface FormIdArguments {
  form: RawTransactionArgument<string>
}
export interface FormIdOptions {
  package?: string
  arguments: FormIdArguments | [form: RawTransactionArgument<string>]
}
export function formId(options: FormIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'form_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface CreatorArguments {
  form: RawTransactionArgument<string>
}
export interface CreatorOptions {
  package?: string
  arguments: CreatorArguments | [form: RawTransactionArgument<string>]
}
export function creator(options: CreatorOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'creator',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface TitleArguments {
  form: RawTransactionArgument<string>
}
export interface TitleOptions {
  package?: string
  arguments: TitleArguments | [form: RawTransactionArgument<string>]
}
export function title(options: TitleOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'title',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SchemaBlobIdArguments {
  form: RawTransactionArgument<string>
}
export interface SchemaBlobIdOptions {
  package?: string
  arguments: SchemaBlobIdArguments | [form: RawTransactionArgument<string>]
}
export function schemaBlobId(options: SchemaBlobIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'schema_blob_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface IsPublishedArguments {
  form: RawTransactionArgument<string>
}
export interface IsPublishedOptions {
  package?: string
  arguments: IsPublishedArguments | [form: RawTransactionArgument<string>]
}
export function isPublished(options: IsPublishedOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'is_published',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SubmissionCountArguments {
  form: RawTransactionArgument<string>
}
export interface SubmissionCountOptions {
  package?: string
  arguments: SubmissionCountArguments | [form: RawTransactionArgument<string>]
}
export function submissionCount(options: SubmissionCountOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'submission_count',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface LatestSubmissionIdArguments {
  form: RawTransactionArgument<string>
}
export interface LatestSubmissionIdOptions {
  package?: string
  arguments: LatestSubmissionIdArguments | [form: RawTransactionArgument<string>]
}
export function latestSubmissionId(options: LatestSubmissionIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'latest_submission_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SponsoredEnabledArguments {
  form: RawTransactionArgument<string>
}
export interface SponsoredEnabledOptions {
  package?: string
  arguments: SponsoredEnabledArguments | [form: RawTransactionArgument<string>]
}
export function sponsoredEnabled(options: SponsoredEnabledOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null] satisfies (string | null)[]
  const parameterNames = ['form']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'sponsored_enabled',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SubmissionStatusArguments {
  form: RawTransactionArgument<string>
  submissionId: RawTransactionArgument<string>
}
export interface SubmissionStatusOptions {
  package?: string
  arguments:
    | SubmissionStatusArguments
    | [form: RawTransactionArgument<string>, submissionId: RawTransactionArgument<string>]
}
export function submissionStatus(options: SubmissionStatusOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, '0x2::object::ID'] satisfies (string | null)[]
  const parameterNames = ['form', 'submissionId']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'submission_status',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SubmissionPriorityArguments {
  form: RawTransactionArgument<string>
  submissionId: RawTransactionArgument<string>
}
export interface SubmissionPriorityOptions {
  package?: string
  arguments:
    | SubmissionPriorityArguments
    | [form: RawTransactionArgument<string>, submissionId: RawTransactionArgument<string>]
}
export function submissionPriority(options: SubmissionPriorityOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, '0x2::object::ID'] satisfies (string | null)[]
  const parameterNames = ['form', 'submissionId']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'submission_priority',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SubmissionAdminNoteBlobIdArguments {
  form: RawTransactionArgument<string>
  submissionId: RawTransactionArgument<string>
}
export interface SubmissionAdminNoteBlobIdOptions {
  package?: string
  arguments:
    | SubmissionAdminNoteBlobIdArguments
    | [form: RawTransactionArgument<string>, submissionId: RawTransactionArgument<string>]
}
export function submissionAdminNoteBlobId(options: SubmissionAdminNoteBlobIdOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, '0x2::object::ID'] satisfies (string | null)[]
  const parameterNames = ['form', 'submissionId']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'submission_admin_note_blob_id',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface CreateFormArguments {
  registry: RawTransactionArgument<string>
  title: RawTransactionArgument<string>
  schemaBlobId: RawTransactionArgument<Array<number>>
  schemaBlobObjectId: RawTransactionArgument<string>
  expiryEpoch: RawTransactionArgument<number | bigint>
}
export interface CreateFormOptions {
  package?: string
  arguments:
    | CreateFormArguments
    | [
        registry: RawTransactionArgument<string>,
        title: RawTransactionArgument<string>,
        schemaBlobId: RawTransactionArgument<Array<number>>,
        schemaBlobObjectId: RawTransactionArgument<string>,
        expiryEpoch: RawTransactionArgument<number | bigint>,
      ]
}
/** Create a new form. Mints a CreatorCap to the sender. */
export function createForm(options: CreateFormOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [
    null,
    '0x1::string::String',
    'vector<u8>',
    '0x2::object::ID',
    'u64',
    '0x2::clock::Clock',
  ] satisfies (string | null)[]
  const parameterNames = ['registry', 'title', 'schemaBlobId', 'schemaBlobObjectId', 'expiryEpoch']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'create_form',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface PublishFormArguments {
  form: RawTransactionArgument<string>
  cap: RawTransactionArgument<string>
}
export interface PublishFormOptions {
  package?: string
  arguments:
    | PublishFormArguments
    | [form: RawTransactionArgument<string>, cap: RawTransactionArgument<string>]
}
/** Publish a form (make it publicly submittable). */
export function publishForm(options: PublishFormOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, null, '0x2::clock::Clock'] satisfies (string | null)[]
  const parameterNames = ['form', 'cap']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'publish_form',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface UnpublishFormArguments {
  form: RawTransactionArgument<string>
  cap: RawTransactionArgument<string>
}
export interface UnpublishFormOptions {
  package?: string
  arguments:
    | UnpublishFormArguments
    | [form: RawTransactionArgument<string>, cap: RawTransactionArgument<string>]
}
/** Unpublish a form (disable public submissions). */
export function unpublishForm(options: UnpublishFormOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, null, '0x2::clock::Clock'] satisfies (string | null)[]
  const parameterNames = ['form', 'cap']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'unpublish_form',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface SubmitFormArguments {
  form: RawTransactionArgument<string>
  submissionBlobId: RawTransactionArgument<Array<number>>
  submissionBlobObjectId: RawTransactionArgument<string>
  expiryEpoch: RawTransactionArgument<number | bigint>
}
export interface SubmitFormOptions {
  package?: string
  arguments:
    | SubmitFormArguments
    | [
        form: RawTransactionArgument<string>,
        submissionBlobId: RawTransactionArgument<Array<number>>,
        submissionBlobObjectId: RawTransactionArgument<string>,
        expiryEpoch: RawTransactionArgument<number | bigint>,
      ]
}
/**
 * Submit to a published form. Stores SubmissionMeta as a dynamic object field
 * under Form.
 */
export function submitForm(options: SubmitFormOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [
    null,
    'vector<u8>',
    '0x2::object::ID',
    'u64',
    '0x2::clock::Clock',
  ] satisfies (string | null)[]
  const parameterNames = ['form', 'submissionBlobId', 'submissionBlobObjectId', 'expiryEpoch']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'submit_form',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface AddAdminArguments {
  form: RawTransactionArgument<string>
  cap: RawTransactionArgument<string>
  admin: RawTransactionArgument<string>
}
export interface AddAdminOptions {
  package?: string
  arguments:
    | AddAdminArguments
    | [
        form: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        admin: RawTransactionArgument<string>,
      ]
}
/** Add an admin to a form. Mints an AdminCap to the specified address. */
export function addAdmin(options: AddAdminOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, null, 'address', '0x2::clock::Clock'] satisfies (string | null)[]
  const parameterNames = ['form', 'cap', 'admin']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'add_admin',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface UpdateSubmissionStatusArguments {
  form: RawTransactionArgument<string>
  adminCap: RawTransactionArgument<string>
  submissionId: RawTransactionArgument<string>
  status: RawTransactionArgument<number>
}
export interface UpdateSubmissionStatusOptions {
  package?: string
  arguments:
    | UpdateSubmissionStatusArguments
    | [
        form: RawTransactionArgument<string>,
        adminCap: RawTransactionArgument<string>,
        submissionId: RawTransactionArgument<string>,
        status: RawTransactionArgument<number>,
      ]
}
/** Update submission status. Requires AdminCap for the form. */
export function updateSubmissionStatus(options: UpdateSubmissionStatusOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, null, '0x2::object::ID', 'u8', '0x2::clock::Clock'] satisfies (
    | string
    | null
  )[]
  const parameterNames = ['form', 'adminCap', 'submissionId', 'status']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'update_submission_status',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface UpdateSubmissionPriorityArguments {
  form: RawTransactionArgument<string>
  adminCap: RawTransactionArgument<string>
  submissionId: RawTransactionArgument<string>
  priority: RawTransactionArgument<number>
}
export interface UpdateSubmissionPriorityOptions {
  package?: string
  arguments:
    | UpdateSubmissionPriorityArguments
    | [
        form: RawTransactionArgument<string>,
        adminCap: RawTransactionArgument<string>,
        submissionId: RawTransactionArgument<string>,
        priority: RawTransactionArgument<number>,
      ]
}
/** Update submission priority. Requires AdminCap for the form. */
export function updateSubmissionPriority(options: UpdateSubmissionPriorityOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, null, '0x2::object::ID', 'u8', '0x2::clock::Clock'] satisfies (
    | string
    | null
  )[]
  const parameterNames = ['form', 'adminCap', 'submissionId', 'priority']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'update_submission_priority',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface UpdateSubmissionAdminNoteArguments {
  form: RawTransactionArgument<string>
  adminCap: RawTransactionArgument<string>
  submissionId: RawTransactionArgument<string>
  noteBlobId: RawTransactionArgument<Array<number>>
  noteBlobObjectId: RawTransactionArgument<string>
}
export interface UpdateSubmissionAdminNoteOptions {
  package?: string
  arguments:
    | UpdateSubmissionAdminNoteArguments
    | [
        form: RawTransactionArgument<string>,
        adminCap: RawTransactionArgument<string>,
        submissionId: RawTransactionArgument<string>,
        noteBlobId: RawTransactionArgument<Array<number>>,
        noteBlobObjectId: RawTransactionArgument<string>,
      ]
}
/** Update admin note pointer. Requires AdminCap for the form. */
export function updateSubmissionAdminNote(options: UpdateSubmissionAdminNoteOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [
    null,
    null,
    '0x2::object::ID',
    'vector<u8>',
    '0x2::object::ID',
    '0x2::clock::Clock',
  ] satisfies (string | null)[]
  const parameterNames = ['form', 'adminCap', 'submissionId', 'noteBlobId', 'noteBlobObjectId']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'update_submission_admin_note',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface UpdateFormStorageExpiryArguments {
  form: RawTransactionArgument<string>
  cap: RawTransactionArgument<string>
  newExpiryEpoch: RawTransactionArgument<number | bigint>
}
export interface UpdateFormStorageExpiryOptions {
  package?: string
  arguments:
    | UpdateFormStorageExpiryArguments
    | [
        form: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        newExpiryEpoch: RawTransactionArgument<number | bigint>,
      ]
}
/** Update form storage expiry epoch. Requires CreatorCap. */
export function updateFormStorageExpiry(options: UpdateFormStorageExpiryOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, null, 'u64', '0x2::clock::Clock'] satisfies (string | null)[]
  const parameterNames = ['form', 'cap', 'newExpiryEpoch']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'update_form_storage_expiry',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
export interface ConfigureSponsoredModeArguments {
  form: RawTransactionArgument<string>
  cap: RawTransactionArgument<string>
  sponsoredEnabled: RawTransactionArgument<boolean>
}
export interface ConfigureSponsoredModeOptions {
  package?: string
  arguments:
    | ConfigureSponsoredModeArguments
    | [
        form: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        sponsoredEnabled: RawTransactionArgument<boolean>,
      ]
}
/** Configure sponsored mode for a form. Requires CreatorCap. */
export function configureSponsoredMode(options: ConfigureSponsoredModeOptions) {
  const packageAddress = options.package ?? '@local-pkg/taskform'
  const argumentsTypes = [null, null, 'bool', '0x2::clock::Clock'] satisfies (string | null)[]
  const parameterNames = ['form', 'cap', 'sponsoredEnabled']
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: 'taskform',
      function: 'configure_sponsored_mode',
      arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    })
}
