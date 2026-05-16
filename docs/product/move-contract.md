# TaskForm — Move Contract

## Role

Move is the permission layer + lifecycle layer + metadata pointer layer + event indexing layer.

Move is **not** a database. Large data lives on Walrus.

TaskForm submissions are "on-chain" through Sui metadata pointers and structured events, not
by storing raw submission bodies on-chain. Form schemas, submission bodies, screenshots,
videos, and encrypted payloads live on Walrus.

## Objects

| Object | Type | Purpose |
|--------|------|---------|
| TaskFormRegistry | shared | Global registry of all forms |
| Form | shared | Form metadata + blob pointers |
| CreatorCap | owned | Proves form ownership |
| AdminCap | owned | Delegated admin access |
| SubmissionMeta | dynamic object field under Form | Submission pointer, review state, admin note pointer |
| SponsorVault | optional | Holds sponsor funds |

## Entry Functions

- `create_form` — Create form + mint CreatorCap
- `publish_form` — Set form as public
- `unpublish_form` — Remove from public
- `submit_form` — Record submission metadata
- `add_admin` — Delegate AdminCap
- `update_submission_status` — Change status (new/reviewing/planned/in-progress/done/resolved/archived)
- `update_submission_priority` — Change priority (low/medium/high/critical)
- `update_submission_admin_note` — Store Walrus pointer for admin note content
- `update_form_storage_expiry` — Update expiry tracking
- `configure_sponsored_mode` — Toggle sponsored submissions (stretch)

## Events

All state changes emit structured events for indexing.

Events must include only metadata needed for indexing and dashboard filters. Events must not
include raw feedback content, private fields, screenshots, videos, emails, phone numbers, or
other sensitive data.

Dashboard query strategy:

1. Load creator-owned `Form` objects through `CreatorCap`.
2. List dynamic object fields under each `Form` to discover `SubmissionMeta` objects.
3. Fetch `SubmissionMeta` for review status, priority, blob pointers, expiry, and admin note pointer.
4. Download form schema, submission body, attachments, and admin notes from Walrus only when needed.
5. Use events as activity history and fallback indexing proof.

## Errors

Typed error codes for all failure paths.
