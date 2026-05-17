# TaskForm — 7-Day Roadmap

## Day 1 — Foundation ✅

- [x] Bun + Vite + React + TypeScript project
- [x] Multi-page Vite config (4 HTML entries)
- [x] CDN import maps per page (pinned versions)
- [x] Vite externals (React, Zod, TanStack Query, RHF, Headless UI)
- [x] Tailwind CSS v4 page-specific CSS
- [x] Project structure: `src/pages/`, `src/schemas/`, `src/types/`, `src/lazy/`, `src/styles/`
- [x] Base TypeScript types (Form, Submission, Storage, etc.)
- [x] Zod schemas (form, submission, storage policy, sponsor)
- [x] Lazy module stubs (walrus-upload/download, seal-encrypt/decrypt, sui-client)
- [x] Landing page shell (hero, features, how-it-works, CTA)
- [x] Dashboard shell (navbar, empty state)
- [x] Create Form shell (navbar, placeholder)
- [x] Public Form shell (reads ?formId, placeholder)
- [x] TypeScript compiles clean
- [x] Build passes, dist ~47 KB

## Day 2 — Form Builder ✅

- [x] Form builder layout (2-column: editor + preview)
- [x] Title and description inputs
- [x] Template selector tab (Walrus feedback, bug report, feature request, survey)
- [ ] Feedback category schema field and remaining templates (application, general feedback)
- [x] Field list with drag-to-reorder
- [x] Add field button + type selector
- [x] Field editor: label, placeholder, required toggle, sensitive toggle
- [x] Options editor (for dropdown/checkbox)
- [x] Upload field settings (max size, allowed types)
- [x] Storage policy UI (duration selectors)
- [x] Sponsored submission settings (toggle, budget, max count, max file size)
- [x] Live preview panel
- [x] Zod validation on form config before publish
- [x] Publish button (wired to Walrus in Day 3)
- [x] Form state management (React state or useReducer)

Create Form implementation status: `create-form.html` now has a product-oriented builder layout
with a default Field library tab, a Templates tab, prepared templates for Walrus feedback, bug
report, feature request, and survey, a central form setup canvas, drag/reorder field list, field
inspector, readiness metrics, storage policy controls, sponsor settings UI, preview mode, and
Walrus + Sui publish flow.

Create Form next steps:

1. Add a confirmation dialog before a template overwrites an existing draft.
2. Add a first-class `category` field to `FormSchema`, template metadata, public form loading, and
   dashboard filtering.
3. Add Application and General Feedback templates.
4. Show inline readiness validation before publish: missing title, no fields, empty options,
   invalid upload limits, and overlong description.
5. Wire local draft autosave/restore and expose the existing saved/unsaved state in the UI.
6. Make Preview behave closer to `form.html` by allowing trial input and required-field validation.
7. Complete or scope down the sponsor flow: sponsor vault funding, budget display, max submissions,
   file size enforcement, and self-paid fallback.
8. Add responsive mobile/tablet drawer behavior for Field library, Templates, and Field inspector.

## Day 3 — Walrus Storage ✅

- [x] Walrus aggregator/publisher URL config
- [x] Lightweight download module (`src/lazy/walrus-download.ts`)
- [x] Lazy upload module (`src/lazy/walrus-upload.ts`)
- [x] Upload form schema JSON to Walrus
- [x] Capture blob ID from upload response
- [x] Capture object ID if available
- [x] Capture expiry epoch
- [x] Generate public link: `form.html?formId=<blobId>`
- [x] Anchor form metadata on Sui with schema blob pointer
- [x] Load schema in form page (download + JSON parse)
- [x] Error handling for failed uploads/downloads
- [ ] Mock mode for offline development — skipped (nice-to-have, not needed for MVP)

## Day 4 — Public Form

- [x] Ultra-light form renderer (reads schema, renders fields)
- [x] Native text input component
- [x] Native textarea component
- [x] Native select/dropdown component
- [x] Checkbox component
- [x] Star rating component (custom, no deps)
- [x] File upload component (screenshot + video) — UI done, upload pending wallet
- [x] URL input component
- [x] Confirmation checkbox component
- [x] Required field validation (Zod runtime)
- [x] Submit progress UI (loading state)
- [x] Lazy-load Walrus upload client on submit
- [x] Lazy-load Seal encrypt only if sensitive fields exist
- [x] Lazy-load Sui/wallet only if required by form
- [x] Encrypt sensitive field values before upload
- [x] Upload submission JSON to Walrus
- [x] Upload attachments to Walrus
- [x] Anchor submission metadata on Sui with submission blob pointer
- [x] Success screen with confirmation

## Day 5 — Move Contract

- [x] Create `taskform_move/` Sui Move package
- [x] Implement TaskFormRegistry (shared object)
- [x] Implement Form object (shared)
- [x] Implement CreatorCap (owned)
- [x] Implement AdminCap (owned)
- [x] Implement SubmissionMeta (dynamic field on Form)
- [x] Implement error module
- [x] Implement event module
- [x] Entry: `create_form` — create form + mint CreatorCap
- [x] Entry: `publish_form` — set form as public
- [x] Entry: `unpublish_form` — remove from public
- [x] Entry: `submit_form` — record submission metadata
- [x] Entry: `add_admin` — delegate AdminCap
- [x] Entry: `update_submission_status`
- [x] Entry: `update_submission_priority`
- [x] Entry: `update_form_storage_expiry`
- [x] Write unit tests (`sui move test`)
- [x] Publish to testnet
- [x] Save package ID and registry object ID

## Day 6 — Dashboard + Seal

- [x] Wallet connection (dApp Kit or custom)
- [x] Load creator's forms from Move (query by CreatorCap)
- [x] Forms list UI with status indicators
- [x] Compact sidebar layout with truncated labels and inline form storage lifecycle
- [x] Load submissions for selected form
- [x] Filter controls UI by form, status, keyword, attachment, encrypted/private fields
- [ ] Implement live filters by feedback type, priority, date, attachment presence, encrypted/private
      fields, and keyword search
- [x] Download submission data from Walrus
- [ ] Validate submission with Zod
- [x] Submission list UI
- [x] Responsive full-width submission inbox UI
- [x] Submission detail / review popup UI
- [ ] Status update (Move transaction)
- [ ] Priority update (Move transaction)
- [x] Storage Health UI shell inside each form card (healthy / renew soon / expiry progress)
- [ ] Fetch current Walrus epoch and real expiry values
- [x] Seal encryption adapter (`src/lazy/seal-encrypt.ts`)
- [x] Integrate encrypt in public form submit flow
- [x] Seal decryption adapter (`src/lazy/seal-decrypt.ts`)
- [x] Decrypt button UI in dashboard for sensitive fields
- [x] Locked/encrypted field indicator UI
- [x] JSON export action UI
- [x] CSV export action UI for filtered submission list
- [x] Proof export popup UI
- [ ] Implement JSON export download
- [ ] Implement CSV export download
- [ ] Admin note field (optional)

Dashboard implementation status: `dashboard.html` now has a complete management UI with wallet,
creator form loading, submission loading, Walrus download, Seal encrypt/decrypt adapters, compact My
Forms sidebar, inline storage lifecycle, full-width responsive submission inbox, status filters,
search/export controls, submission review popup, decrypt/review actions, and proof export popup.
Remaining work is filter completeness, validation, export downloads, storage epoch wiring, and status
/ priority transactions.

Dashboard next steps:

1. Add loading, empty, and error states around wallet, Sui queries, Walrus downloads, and Seal decrypt.
2. Validate downloaded submission bodies with Zod before rendering them in the review popup.
3. Wire full filters for feedback type, priority, date, attachment presence, encrypted/private fields,
   and keyword search.
4. Make CSV, JSON, and proof bundle exports follow the same filtered dataset as the inbox.
5. Submit status and priority updates through generated Move bindings.
6. Fetch current Walrus epoch and compute real storage health inside each form card.
7. Add storage renewal action if feasible for MVP.
8. Add unit/manual proof for filter logic and create -> submit -> review -> export flow.

## Day 7 — Sponsored + Storage Health + Deploy

- [ ] Sponsored submission toggle in create-form
- [ ] Store sponsor settings in form schema
- [ ] Show "Sponsored" badge on public form
- [ ] Demo sponsored submission flow
- [ ] Self-paid fallback when sponsor budget exhausted
- [ ] Validate transaction payload before sponsor
- [ ] File size limit enforcement
- [ ] Fetch current Walrus epoch
- [ ] Show form schema expiry
- [ ] Show submission expiry
- [ ] Storage Health UI (active/expiring/expired badges)
- [ ] Warning banner for expiring resources
- [ ] Export backup (JSON/CSV download)
- [ ] Renew storage action (if possible)
- [ ] Confirm CDN libs not bundled in dist
- [ ] Confirm form.html does not load dashboard code
- [ ] Confirm form.html does not load TanStack Query
- [ ] Confirm SDKs lazy-load correctly
- [ ] Minify CSS (Tailwind v4 handles this)
- [ ] Disable sourcemaps (already done)
- [ ] Measure final dist size
- [ ] Remove console.log statements
- [ ] Prepare `ws-resources.json` for Walrus Site
- [ ] Deploy to Walrus Site with site-builder
- [ ] Preserve Site object ID
- [ ] Test all pages load after deploy
- [ ] Test query params work on form.html
- [ ] Prepare fallback deployment URL
- [ ] Demo rehearsal (end-to-end flow)
- [ ] Create at least one real feedback submission using TaskForm
- [ ] Record under-3-minute demo video using TaskForm
- [ ] Upload demo video to Walrus
- [ ] Prepare app, repository, screenshot thread, public form, demo video, and CSV export links for submission
- [ ] Prepare one-pager explaining product, Walrus usage, UX, architecture, and demo flow
- [ ] Document mainnet deployment target and final deployed URLs
- [ ] Create wallet dedicated to Walrus Tools Builder
- [ ] Post demo, screenshot, or project link on X with hashtag `#Walrus`
- [ ] Join Walrus Discord
- [ ] Prepare DeepSurge registration fields: project name/logo, description, website, primary contact, GitHub repo, and app store link if applicable
- [ ] Register through official Airtable submission form
