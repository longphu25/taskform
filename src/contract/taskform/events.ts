/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
const $moduleName = '@local-pkg/taskform::events';
export const FormCreatedEvent = new MoveStruct({ name: `${$moduleName}::FormCreatedEvent`, fields: {
        form_id: bcs.Address,
        creator: bcs.Address,
        schema_blob_id: bcs.vector(bcs.u8()),
        created_at_ms: bcs.u64()
    } });
export const FormPublishedEvent = new MoveStruct({ name: `${$moduleName}::FormPublishedEvent`, fields: {
        form_id: bcs.Address,
        creator: bcs.Address,
        published_at_ms: bcs.u64()
    } });
export const FormUnpublishedEvent = new MoveStruct({ name: `${$moduleName}::FormUnpublishedEvent`, fields: {
        form_id: bcs.Address,
        creator: bcs.Address,
        unpublished_at_ms: bcs.u64()
    } });
export const SubmissionCreatedEvent = new MoveStruct({ name: `${$moduleName}::SubmissionCreatedEvent`, fields: {
        form_id: bcs.Address,
        submission_id: bcs.Address,
        submission_blob_id: bcs.vector(bcs.u8()),
        submitter: bcs.Address,
        created_at_ms: bcs.u64()
    } });
export const SubmissionUpdatedEvent = new MoveStruct({ name: `${$moduleName}::SubmissionUpdatedEvent`, fields: {
        form_id: bcs.Address,
        submission_id: bcs.Address,
        status: bcs.u8(),
        priority: bcs.u8(),
        updated_at_ms: bcs.u64()
    } });
export const AdminAddedEvent = new MoveStruct({ name: `${$moduleName}::AdminAddedEvent`, fields: {
        form_id: bcs.Address,
        admin: bcs.Address,
        added_at_ms: bcs.u64()
    } });
export const StorageRenewedEvent = new MoveStruct({ name: `${$moduleName}::StorageRenewedEvent`, fields: {
        form_id: bcs.Address,
        blob_id: bcs.vector(bcs.u8()),
        new_expiry_epoch: bcs.u64(),
        renewed_at_ms: bcs.u64()
    } });
export const SponsoredModeUpdatedEvent = new MoveStruct({ name: `${$moduleName}::SponsoredModeUpdatedEvent`, fields: {
        form_id: bcs.Address,
        sponsored_enabled: bcs.bool(),
        updated_at_ms: bcs.u64()
    } });