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

## Day 2 — Form Builder

- [ ] Form builder layout (2-column: editor + preview)
- [ ] Title and description inputs
- [ ] Field list with drag-to-reorder
- [ ] Add field button + type selector
- [ ] Field editor: label, placeholder, required toggle, sensitive toggle
- [ ] Options editor (for dropdown/checkbox)
- [ ] Upload field settings (max size, allowed types)
- [ ] Storage policy UI (duration selectors)
- [ ] Sponsored submission settings (toggle, budget, max count, max file size)
- [ ] Live preview panel
- [ ] Zod validation on form config before publish
- [ ] Publish button (wired to Walrus in Day 3)
- [ ] Form state management (React state or useReducer)

## Day 3 — Walrus Storage

- [ ] Walrus aggregator/publisher URL config
- [ ] Lightweight download module (`src/lazy/walrus-download.ts`)
- [ ] Lazy upload module (`src/lazy/walrus-upload.ts`)
- [ ] Upload form schema JSON to Walrus
- [ ] Capture blob ID from upload response
- [ ] Capture object ID if available
- [ ] Capture expiry epoch
- [ ] Generate public link: `form.html?formId=<blobId>`
- [ ] Load schema in form page (download + JSON parse)
- [ ] Error handling for failed uploads/downloads
- [ ] Mock mode for offline development

## Day 4 — Public Form

- [ ] Ultra-light form renderer (reads schema, renders fields)
- [ ] Native text input component
- [ ] Native textarea component
- [ ] Native select/dropdown component
- [ ] Checkbox component
- [ ] Star rating component (custom, no deps)
- [ ] File upload component (screenshot + video)
- [ ] URL input component
- [ ] Confirmation checkbox component
- [ ] Required field validation (Zod runtime)
- [ ] Submit progress UI (loading state)
- [ ] Lazy-load Walrus upload client on submit
- [ ] Lazy-load Seal encrypt only if sensitive fields exist
- [ ] Lazy-load Sui/wallet only if required by form
- [ ] Encrypt sensitive field values before upload
- [ ] Upload submission JSON to Walrus
- [ ] Upload attachments to Walrus
- [ ] Success screen with confirmation

## Day 5 — Move Contract

- [ ] Create `taskform_move/` Sui Move package
- [ ] Implement TaskFormRegistry (shared object)
- [ ] Implement Form object (shared)
- [ ] Implement CreatorCap (owned)
- [ ] Implement AdminCap (owned)
- [ ] Implement SubmissionMeta (dynamic field on Form)
- [ ] Implement error module
- [ ] Implement event module
- [ ] Entry: `create_form` — create form + mint CreatorCap
- [ ] Entry: `publish_form` — set form as public
- [ ] Entry: `unpublish_form` — remove from public
- [ ] Entry: `submit_form` — record submission metadata
- [ ] Entry: `add_admin` — delegate AdminCap
- [ ] Entry: `update_submission_status`
- [ ] Entry: `update_submission_priority`
- [ ] Entry: `update_form_storage_expiry`
- [ ] Write unit tests (`sui move test`)
- [ ] Publish to testnet
- [ ] Save package ID and registry object ID

## Day 6 — Dashboard + Seal

- [ ] Wallet connection (dApp Kit or custom)
- [ ] Load creator's forms from Move (query by CreatorCap)
- [ ] Forms list UI with status indicators
- [ ] Load submissions for selected form
- [ ] Download submission data from Walrus
- [ ] Validate submission with Zod
- [ ] Submission list UI
- [ ] Submission detail view
- [ ] Status update (Move transaction)
- [ ] Priority update (Move transaction)
- [ ] Seal encryption adapter (`src/lazy/seal-encrypt.ts`)
- [ ] Integrate encrypt in public form submit flow
- [ ] Seal decryption adapter (`src/lazy/seal-decrypt.ts`)
- [ ] Decrypt button in dashboard for sensitive fields
- [ ] Locked field indicator for encrypted data
- [ ] JSON export (download submissions as JSON)
- [ ] Admin note field (optional)

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
