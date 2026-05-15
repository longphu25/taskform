# E07 — Dashboard

## Overview

Build the private admin dashboard where creators manage forms and review feedback collected through
TaskForm.

The dashboard is the creator's operating surface after publishing a form. It must connect the wallet,
load forms owned by the creator, list submissions, filter and triage responses, decrypt private
fields, update review metadata on Sui, monitor Walrus storage health, and export proof artifacts.

## Current Status

In progress.

Completed:

- Dashboard management UI shell in `src/pages/dashboard/DashboardPage.tsx`
- Compact My Forms sidebar with form status, submission counts, and inline Walrus lifecycle indicators
- Full-width responsive Submission inbox UI
- Status filter UI
- Keyword/search control UI
- Submission review popup UI
- Proof export popup UI
- Priority/status badges
- Encrypted/private field indicators
- Decrypt action UI
- Storage Health UI shell integrated into each form card
- CSV / JSON / proof export action UI
- Responsive layout for desktop and smaller screens

Current limitation:

- Dashboard is still backed by mock data.
- Wallet, Move queries, Walrus downloads, Seal decrypt, status/priority transactions, and exports are
  not wired to live data yet.

## Product Contract

Dashboard must support:

- Wallet connect
- My Forms list
- Submission inbox
- Filters by form, feedback type, status, priority, date, attachment presence, encrypted/private
  fields, and keyword search
- Status and priority management
- Storage Health indicators inside each form card, including Walrus lifecycle / expiry state
- Export CSV
- Export JSON backup
- Decrypt sensitive fields

## Next Steps

1. **Stabilize dashboard UI states**
   - Add empty state when a form has no submissions.
   - Add loading skeletons for forms, submissions, selected submission body, and export generation.
   - Add error states for Sui query failure, Walrus download failure, and unauthorized decrypt.
   - Verify sidebar truncation and inbox layout at mobile, tablet, and desktop widths.

2. **Replace mock data with dashboard query state**
   - Create typed dashboard models for form summaries, submission metadata, submission bodies, filters,
     review state, and storage health.
   - Keep mock data behind a local development fixture or remove it once live queries are stable.

3. **Connect wallet in dashboard**
   - Reuse the existing lazy Sui client / dApp Kit setup.
   - Show connected wallet address and balance state.
   - Gate creator-only dashboard data behind connected wallet.

4. **Load creator forms from Sui**
   - Query creator-owned caps or indexed form objects.
   - Resolve form title/category/schema pointer from Walrus schema blobs.
   - Populate the My Forms sidebar from live form objects.
   - Map live storage expiry values into each sidebar form card.

5. **Load submission metadata from Sui**
   - Fetch submission pointers, status, priority, timestamps, encrypted/private flags, attachment flags,
     and form association.
   - Keep metadata lightweight; do not fetch full Walrus bodies until needed.

6. **Download selected submission body from Walrus**
   - Fetch submission JSON only when a row is selected or export requires it.
   - Validate downloaded bodies with Zod before rendering.
   - Render invalid bodies inside the submission review popup without crashing the dashboard.

7. **Implement full filtering**
   - Wire filters for form, feedback type, status, priority, date range, attachment presence,
     encrypted/private fields, and keyword search.
   - Ensure filter state controls the visible submission list and export output.

8. **Wire status and priority updates**
   - Use generated contract bindings for `update_submission_status` and `update_submission_priority`.
   - Update Sui metadata through signed transactions.
   - Optimistically update UI only after transaction success or with clear pending state.

9. **Implement Seal decryption**
   - Finish `src/lazy/seal-decrypt.ts`.
   - Load Seal only when the creator clicks decrypt.
   - Show locked fields until decryption succeeds.
   - Handle unauthorized admin / failed decrypt states.

10. **Implement CSV export**
   - Export the currently filtered submission list.
   - Include form title, submission ID, status, priority, created date, attachment flags, encrypted field
     markers, and review fields.
   - Preserve privacy by exporting masked encrypted values unless decrypted by the authorized creator.
   - Trigger export from the Proof exports popup.

11. **Implement JSON backup export**
   - Export form schema, Sui metadata pointers, submission metadata, and optionally downloaded Walrus
     bodies.
   - Include enough data for hackathon proof and creator backup.
   - Trigger backup / proof bundle generation from the Proof exports popup.

12. **Wire storage health**
   - Fetch current Walrus epoch.
   - Compute schema, submission, screenshot, and video expiry state.
   - Show active / renew soon / expired badges in each form card.
   - Add a compact warning state for the selected form when storage is close to expiry.
   - Add renewal action if feasible for MVP.

13. **Add dashboard tests / proof**
   - Unit-test filter logic.
   - Build-check dashboard bundle isolation.
   - Add manual proof path: create form -> submit response -> open submission popup -> export CSV/proof
     bundle.

## Acceptance Criteria

- Creator can connect wallet and see their forms.
- Creator can select a form and see submissions.
- Creator can filter submissions by the required filter dimensions.
- Creator can open a submission review popup and inspect Walrus / Sui proof metadata.
- Creator can update status and priority on Sui.
- Creator can decrypt authorized sensitive fields through Seal.
- Creator can export filtered submissions as CSV.
- Creator can export JSON backup / proof data.
- Dashboard shows storage health and expiry warnings inside form cards.
- `make build` passes.
- Dashboard code remains isolated from `form.html`.

## Evidence

Current evidence:

- Dashboard UI renders in `dashboard.html`.
- Compact sidebar prevents long form labels from wrapping into broken rows.
- Submission inbox uses responsive cards on small screens and grid table layout on large screens.
- Submission review and Proof exports open as popups.
- `make build` passes with the dashboard UI shell.

Pending evidence:

- Live wallet query screenshot.
- Live form list loaded from Sui.
- Live submission loaded from Walrus.
- Status / priority transaction digest.
- Seal decrypt demo screenshot.
- CSV export containing at least one real TaskForm submission.
