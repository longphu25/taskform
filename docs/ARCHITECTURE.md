# Architecture

## Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Runtime | Bun | 1.3.13 |
| Build | Vite | 8.x |
| Language | TypeScript | 6.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Validation | Zod | 4.4.3 |
| Data fetching | TanStack Query | 5.x (dashboard only) |
| Forms | React Hook Form | 7.x (create-form only) |
| Components | Headless UI | 2.x (dashboard/create-form only) |
| Blockchain | Sui Move | — |
| Storage | Walrus | — |
| Encryption | Seal | — |

## Architecture Overview

```text
Static React UI (multi-page)
↓
Zod runtime validation
↓
Seal encryption (when needed)
↓
Walrus upload/download
↓
Sui Move metadata + permissions
↓
Dashboard query and triage
```

## Key Strategy

```text
CDN-first dependencies
+ page-level lazy loading
+ local app logic only
```

Goals:
- Reduce Walrus Site upload size (target < 500 KB)
- Make form.html fastest (minimal initial load)
- Keep dashboard logic isolated
- Load SDKs only when needed

## Static Pages

| Page | Purpose | CDN Deps |
|------|---------|----------|
| index.html | Landing | React |
| dashboard.html | Admin | React, Zod, TanStack Query, Headless UI |
| create-form.html | Builder | React, Zod, React Hook Form, Headless UI |
| form.html | Public submit | React, Zod (minimal) |

## Project Structure

```text
taskform/
├── index.html
├── dashboard.html
├── create-form.html
├── form.html
├── Makefile              # Orchestrates frontend + contract commands
├── sui-codegen.config.ts # Codegen configuration
├── vite.config.ts
├── src/
│   ├── pages/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── create-form/
│   │   └── form/
│   ├── contract/      (generated TS bindings — do not edit)
│   ├── lazy/          (SDK clients, loaded on demand)
│   ├── schemas/       (Zod validation schemas)
│   ├── types/         (TypeScript type definitions)
│   └── styles/        (Page-specific Tailwind CSS)
└── contract/          # Sui Move contract (git submodule)
    ├── Makefile
    ├── Move.toml
    ├── sources/       (taskform, capabilities, events, submission, sponsor)
    └── tests/
```

## Dependency Rule

- Inner modules (schemas, types) must not depend on React or UI.
- Lazy modules must not be imported at top level.
- form.html must not import dashboard code.
- SDKs (Walrus, Seal, Sui) are always lazy-loaded.

## Performance Budget

| Metric | Target |
|--------|--------|
| form.html HTML | < 15 KB |
| form.html CSS | < 30 KB |
| form.html local JS | < 60 KB gzip |
| Total dist (no vendor) | < 500 KB |
| Hard cap MVP | < 1 MB |

## Move Contract Role

Move is not a database. Move is:
- Permission layer
- Lifecycle layer
- Metadata pointer layer
- Event indexing layer

Large data (schemas, submissions, attachments) lives on Walrus blobs.

### Deployed Contract (Testnet)

| Item | ID |
|------|-----|
| Package | `0xa704222949feffa24631d47797c8b15465f7776d412ace0233621e4840eb9dab` |
| TaskFormRegistry (shared) | `0xb6567ce9583cd459297cd724ce11a0b201b9537fcfa3eb0556377493f4ba27be` |

### Entry Functions

| Function | Permission | Purpose |
|----------|-----------|---------|
| `create_form` | any wallet | Create form + mint CreatorCap |
| `publish_form` | CreatorCap | Set form as public |
| `unpublish_form` | CreatorCap | Remove from public |
| `submit_form` | public (if published) | Record submission metadata |
| `add_admin` | CreatorCap | Delegate AdminCap |
| `update_submission_status` | AdminCap | Change status |
| `update_submission_priority` | AdminCap | Change priority |
| `update_submission_admin_note` | AdminCap | Store admin note Walrus pointer |
| `update_form_storage_expiry` | CreatorCap | Update expiry tracking |
| `configure_sponsored_mode` | CreatorCap | Toggle sponsored submissions |

### Codegen Integration

TypeScript bindings are generated from the contract using `@mysten/codegen`:

```
contract/ → sui move summary → package_summaries/ → sui-ts-codegen generate → src/contract/
```

- Config: `sui-codegen.config.ts`
- Output: `src/contract/` (auto-generated, eslint-ignored)
- Run: `make codegen`
- Package alias: `@local-pkg/taskform` (requires MVR override in client)

## Network Strategy

| Component | Network |
|-----------|---------|
| Move contract | Testnet |
| Frontend Sui interaction | Testnet |
| Walrus Site hosting | Mainnet |
| Walrus blob storage | Mainnet |
