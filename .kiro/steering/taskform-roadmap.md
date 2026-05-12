---
inclusion: manual
---

# TaskForm Roadmap Steering

This steering file contains the 7-day implementation plan for TaskForm.
Reference `docs/ROADMAP.md` for the full TODO checklist.

## Current Status

- Day 1: ✅ Foundation complete
- Day 2: ⏳ Form Builder (next)
- Day 3: Walrus Storage
- Day 4: Public Form
- Day 5: Move Contract
- Day 6: Dashboard + Seal
- Day 7: Sponsored + Storage Health + Deploy

## Key Constraints

- CDN-first: React, Zod, TanStack Query, RHF, Headless UI are externalized via import maps
- form.html must be ultra-light: no TanStack Query, no Headless UI, no dashboard code
- SDKs (Walrus, Seal, Sui) are always lazy-loaded on user action
- Dist target < 500 KB without vendor, hard cap < 1 MB
- Move is permission/metadata layer only — large data on Walrus
- Tailwind CSS v4 built (not Play CDN)
- Pinned CDN versions, no `@latest`
- **Move contract → Sui testnet** (default for all interaction)
- **Walrus Site → mainnet Walrus** (production hosting at taskform.wall.app)
- **Walrus blob storage → mainnet Walrus** (form schemas, submissions, files)

## Day Summaries

### Day 2 — Form Builder
Build the form creation UI in `create-form.html`. Field builder with all 9 types,
storage policy, sponsored settings, live preview, Zod validation.

### Day 3 — Walrus Storage
Implement upload/download adapters. Publish form schema to Walrus, generate public link,
load schema in form page.

### Day 4 — Public Form
Ultra-light renderer. Native inputs, star rating, file upload. Lazy SDK loading.
Encrypt sensitive fields. Submit to Walrus.

### Day 5 — Move Contract
Sui Move package: Registry, Form, Caps, SubmissionMeta, entry functions, events, tests.
Publish to testnet.

### Day 6 — Dashboard + Seal
Wallet connect, forms list, submissions, status/priority updates, Seal encrypt/decrypt,
JSON export.

### Day 7 — Sponsored + Storage Health + Deploy
Sponsored flow demo, storage health UI, optimization checks, Walrus Site deployment,
demo rehearsal.

## Architecture Reference

See `docs/ARCHITECTURE.md` and `docs/decisions/0004-cdn-first-multipage-architecture.md`.
