# TaskForm — Pages

## index.html (Landing)

- Product intro
- Walrus / Seal / Sui value proposition
- Walrus Tools Builder feedback use case
- Links to app, repository, demo video, and proof artifacts when available
- Launch App CTA

## dashboard.html (Admin)

- Wallet connect
- My Forms list
- Submission inbox
- Filters by form, feedback type, status, priority, date, attachment presence, encrypted/private
  fields, and keyword search
- Status and priority management
- Storage Health indicators
- Export CSV
- Export JSON backup
- Decrypt sensitive fields

## create-form.html (Builder)

- Title and description in the main builder canvas
- Left sidebar with tabs:
  - Field library (default): add/drag supported field types into the canvas
  - Templates: apply prepared schemas for Walrus feedback, bug report, feature request, and survey
- Add/remove/duplicate fields
- Drag-to-reorder fields
- Field inspector for label, placeholder, options, required toggle, sensitive toggle, and upload settings
- Readiness panel for field count, required count, encrypted count, and upload count
- Storage duration selector
- Sponsored submission toggle and sponsor limits (stretch; UI/schema present, full sponsor vault flow pending)
- Preview mode
- Publish form action

### create-form.html Current Gaps

- Applying a template currently overwrites the current draft immediately. Add a confirmation dialog
  when title, description, or fields already exist.
- Feedback category is implied by the selected template but is not yet stored as a first-class
  `FormSchema.category` value.
- Missing prepared templates for Application and General Feedback.
- Validation runs on publish, but the builder should show inline readiness issues before publish.
- Preview is static and should more closely match the public `form.html` validation behavior.
- Draft autosave/restore is not wired even though builder state already tracks save status.
- Sponsor UI stores schema settings and toggles on-chain sponsored mode, but sponsor vault funding and
  fallback behavior are not complete.
- Mobile layout needs a dedicated sidebar/inspector drawer pattern.

### create-form.html Next Steps

1. Add template overwrite confirmation before replacing an existing draft.
2. Add `category` to `FormSchema`, form templates, public form loading, and dashboard filters.
3. Add Application and General Feedback templates.
4. Add inline readiness validation for title, fields, empty options, invalid upload limits, and
   description length.
5. Add local draft autosave/restore with a visible saved/unsaved state.
6. Upgrade preview to support trial input and required-field validation.
7. Complete sponsor vault configuration or hide advanced sponsor fields until the full flow is ready.
8. Add responsive mobile drawer behavior for field library, templates, and inspector.

## form.html (Public Submit)

- Must load fastest (ultra-light)
- Load schema from Walrus
- Render dynamic fields
- Validate with Zod
- Encrypt sensitive fields only when needed
- Upload attachments only on submit
- Submit to Walrus
- Show success confirmation
- Make at least one real submission available for hackathon proof

## Supported Field Types

- Short text
- Rich text (textarea)
- Dropdown
- Checkbox
- Star rating
- Screenshot upload
- Video upload
- URL
- Confirmation checkbox

## Default Feedback Categories

- Best feedback regarding building on Walrus
- Bug report
- Feature request
- Survey
- Application
- General feedback
