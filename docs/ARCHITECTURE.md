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
├── vite.config.ts
├── src/
│   ├── pages/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── create-form/
│   │   └── form/
│   ├── lazy/          (SDK clients, loaded on demand)
│   ├── schemas/       (Zod validation schemas)
│   ├── types/         (TypeScript type definitions)
│   └── styles/        (Page-specific Tailwind CSS)
└── contract/          # Sui Move contract (git submodule)
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

## Network Strategy

| Component | Network |
|-----------|---------|
| Move contract | Testnet |
| Frontend Sui interaction | Testnet |
| Walrus Site hosting | Mainnet |
| Walrus blob storage | Mainnet |
