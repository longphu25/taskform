# TaskForm — Move Contract

## Role

Move is the permission layer + lifecycle layer + metadata pointer layer + event indexing layer.

Move is **not** a database. Large data lives on Walrus.

## Objects

| Object | Type | Purpose |
|--------|------|---------|
| TaskFormRegistry | shared | Global registry of all forms |
| Form | shared | Form metadata + blob pointers |
| CreatorCap | owned | Proves form ownership |
| AdminCap | owned | Delegated admin access |
| SubmissionMeta | dynamic field | Submission pointer + status |
| SponsorVault | optional | Holds sponsor funds |

## Entry Functions

- `create_form` — Create form + mint CreatorCap
- `publish_form` — Set form as public
- `unpublish_form` — Remove from public
- `submit_form` — Record submission metadata
- `add_admin` — Delegate AdminCap
- `update_submission_status` — Change status (new/in-review/accepted/rejected/archived)
- `update_submission_priority` — Change priority (low/medium/high/critical)
- `update_form_storage_expiry` — Update expiry tracking

## Events

All state changes emit structured events for indexing.

## Errors

Typed error codes for all failure paths.
