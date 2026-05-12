# ADR-0005: Stack Selection

## Status

Accepted

## Context

TaskForm needs a frontend stack that supports:
- Fast public form rendering
- Walrus Site deployment (static files)
- Type safety
- Runtime validation
- Wallet integration

## Decision

| Layer | Choice | Version |
|-------|--------|---------|
| Runtime | Bun | 1.3.13 |
| Build | Vite | 8.x |
| Language | TypeScript | 6.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Validation | Zod | 4.4.3 (CDN: 3.24.4 for esm.sh compat) |
| Data fetching | TanStack Query | 5.x (dashboard only) |
| Forms | React Hook Form | 7.x (create-form only) |
| Components | Headless UI | 2.x (dashboard/create-form only) |
| Blockchain | Sui Move | — |
| Storage | Walrus | — |
| Encryption | Seal | — |

## Consequences

- All third-party UI libs externalized to CDN.
- Only app logic is bundled and deployed to Walrus Site.
- TypeScript provides compile-time safety; Zod provides runtime validation at
  boundaries.
- React 19 enables modern patterns (use, server components if needed later).
