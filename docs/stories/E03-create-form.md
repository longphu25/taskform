# E03 — Create Form Builder

## Status

In progress. Core builder, templates, preview, storage policy, sponsor settings UI, publish flow,
template overwrite confirmation, category schema, inline validation, and draft autosave are
implemented. Remaining work is interactive preview, sponsor vault, and responsive layout.

## Current Implementation

- Top command bar with undo, redo, preview, dashboard, wallet connect, and save status indicator.
- Left sidebar with tabs:
  - Field library is the default tab.
  - Templates tab includes Walrus Builder Feedback, Bug Report, Feature Request, User Survey,
    Application Form, and General Feedback.
- Template overwrite confirmation modal when applying a template to a non-empty draft.
- Central canvas contains form title, description, and draggable field list.
- Field inspector supports label, placeholder, required, sensitive, options, and upload max size.
- Category selector in the right inspector panel (`feedback`, `bug-report`, `feature-request`,
  `survey`, `application`, `general`). Templates auto-set category on apply.
- Readiness panel shows fields, required fields, encrypted fields, upload fields, and inline
  validation issues (missing title, no fields, empty labels, empty options, invalid upload limits,
  description length). Badge shows "Ready" or "Not ready" in real time.
- Storage policy panel tracks schema, submission, screenshot, and video epochs.
- Sponsored settings UI stores budget, max count, and max file size in the form schema.
- Publish flow uploads the schema to Walrus, creates the Sui Form object, publishes it, and returns a
  public `form.html?id=<formObjectId>` link. Clears local draft on success.
- Local draft autosave to `localStorage` with 1.5 s debounce. Restores on page load. Navbar shows
  Saved/Unsaved indicator.
- Customizable submit button text (optional, max 50 chars). Public form uses it or falls back to
  "Submit".

## Gaps

- ~~Template selection overwrites the current draft immediately.~~ ✅ Confirmation modal added.
- ~~Form category is not stored as a first-class schema field.~~ ✅ Added to FormSchema + Zod.
- ~~Application and General Feedback templates are missing.~~ ✅ Added.
- ~~Validation errors are shown only after publish is attempted.~~ ✅ Inline readiness panel.
- ~~Draft autosave/restore is not wired.~~ ✅ localStorage autosave with restore.
- Preview is static and does not validate trial input.
- Sponsor settings are not fully backed by sponsor vault funding and fallback behavior.
- Mobile layout needs drawer/tabs for sidebar and inspector.
- Dashboard does not yet filter by category (schema field is persisted but UI filter pending).

## Next Steps

1. ~~Add template overwrite confirmation.~~ ✅
2. ~~Add `category` to `FormSchema` and update templates, validator, public form, and dashboard.~~ ✅
3. ~~Add Application and General Feedback templates.~~ ✅
4. ~~Add inline readiness validation for missing title, no fields, empty option labels/values, invalid
   upload limits, and description length.~~ ✅
5. ~~Implement local draft autosave/restore and show saved/unsaved state.~~ ✅
6. Make preview interactive enough to test required fields and sensitive/upload indicators.
7. Decide sponsor MVP scope: either complete vault funding and fallback or simplify UI to a single
   sponsored-mode toggle.
8. Add responsive drawer behavior for small screens.
9. Add manual QA checklist for create → preview → publish → public submit → dashboard review.
10. Add dashboard category filter UI using the persisted `category` field.

## Acceptance Checklist

- [x] Applying a template to a non-empty draft requires confirmation.
- [x] Category is persisted in schema JSON (optional field, defaults to `general`).
- [x] All default categories have templates or a clear blank-start path.
- [x] Publish is blocked with visible, actionable readiness issues.
- [x] Refreshing the page can restore the latest local draft.
- [ ] Category is visible to dashboard filters.
- [ ] Preview catches required-field failures before publish.
- [ ] Mobile users can access field library, templates, canvas, and inspector without horizontal overflow.
