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
- [ ] Feedback category/template selector (Walrus feedback, bug report, feature request, survey, application)
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

## Day 3 — Walrus Storage ✅

- [x] Walrus aggregator/publisher URL config
- [x] Lightweight download module (`src/lazy/walrus-download.ts`)
- [x] Lazy upload module (`src/lazy/walrus-upload.ts`)
- [x] Upload form schema JSON to Walrus
- [x] Capture blob ID from upload response
- [x] Capture object ID if available
- [x] Capture expiry epoch
- [x] Generate public link: `form.html?formId=<blobId>`
- [ ] Anchor form metadata on Sui with schema blob pointer
- [ ] Load schema in form page (download + JSON parse) — moved to Day 4
- [ ] Error handling for failed uploads/downloads — upload done, download pending Day 4
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
- [ ] Lazy-load Seal encrypt only if sensitive fields exist
- [x] Lazy-load Sui/wallet only if required by form
- [ ] Encrypt sensitive field values before upload
- [x] Upload submission JSON to Walrus
- [x] Upload attachments to Walrus
- [ ] Anchor submission metadata on Sui with submission blob pointer
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

- [ ] Wallet connection (dApp Kit or custom)
- [ ] Load creator's forms from Move (query by CreatorCap)
- [ ] Forms list UI with status indicators
- [ ] Load submissions for selected form
- [ ] Filter submissions by form, feedback type, status, priority, date, attachment presence, encrypted/private fields, and keyword search
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
- [ ] CSV export for filtered submission list
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
