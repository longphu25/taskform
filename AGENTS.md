# Agent Operating Guide

## Project Status

TaskForm is in active implementation (Day 5 of 7-day sprint).
Move contract is deployed to testnet. Frontend pages are scaffolded.
Codegen TypeScript bindings are generated from the contract.

## Source Of Truth

Read in this order:

1. `README.md` for project overview and status.
2. This file (`AGENTS.md`) for agent operating model.
3. `docs/ARCHITECTURE.md` for technical architecture and constraints.
4. `docs/product/` for current product contracts.
5. `docs/ROADMAP.md` for the 7-day implementation plan.
6. `docs/stories/` for story packets and backlog.
7. `docs/decisions/` for why important choices were made.
8. `contract/README.md` for Move contract details and deployed IDs.
9. `contract/docs/SPEC.md` for full contract specification.

## Key Facts

### Contract (Sui Testnet)

| Item | Value |
|------|-------|
| Package ID | `0x168cecda7807f9e20e0a87611834d37583b7e7545a57fe0c92fab5b6477d5eff` |
| TaskFormRegistry | `0x836a4776d73ceea1aeba030e11bd306825e2c2efc06f16bd6f1326bead8ad021` |
| UpgradeCap | `0x60645d9ed5261457b57936ba501527909364161ca78a579c51a10db46fbc2da0` |
| Network | Testnet |
| Modules | `taskform`, `capabilities`, `events`, `submission`, `sponsor`, `seal_policy` |

### Codegen

- Config: `sui-codegen.config.ts`
- Output: `src/contract/` (generated, do not edit manually)
- Package alias: `@local-pkg/taskform`
- Run: `make codegen` or `pnpm codegen`
- Requires: `sui move summary` in `contract/` first (handled by Makefile)
- ESLint ignores `src/contract/` via `globalIgnores` in `eslint.config.js`

### Build Commands

| Command | Purpose |
|---------|---------|
| `make dev` | Start Vite dev server |
| `make build` | Production build |
| `make lint` | ESLint |
| `make format` | Biome format |
| `make codegen` | Generate TS bindings from contract (summary + codegen + format) |
| `make contract-build` | Build Move contract |
| `make contract-test` | Run Move unit tests |
| `make contract-publish` | Deploy contract to current network |

### Frontend Architecture

- Multi-page Vite app (index.html, create-form.html, form.html, dashboard.html)
- CDN-first: React, Zod, TanStack Query externalized via import maps
- form.html is ultra-light (no dashboard code, no TanStack Query)
- SDKs (Walrus, Seal, Sui) lazy-loaded on user action only
- Generated contract bindings in `src/contract/` provide type-safe Move calls
- Use `@local-pkg/taskform` with MVR override in SuiGrpcClient

### Using Contract Bindings

```typescript
import { createForm, publishForm, submitForm } from './contract/taskform/taskform';
import { Transaction } from '@mysten/sui/transactions';

const tx = new Transaction();
tx.add(createForm({
  arguments: {
    registry: REGISTRY_ID,
    title: 'My Form',
    schemaBlobId: Array.from(blobIdBytes),
    schemaBlobObjectId: blobObjectId,
    expiryEpoch: 100n,
  },
}));
```

### SuiGrpcClient Setup

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
  mvr: {
    overrides: {
      packages: {
        '@local-pkg/taskform': '0x657b4145e585ad305ac351170eb78c49ba8ba3099135e64ece43c02da1b69f0f',
      },
    },
  },
});
```

## Task Loop

For every task:

1. Read relevant docs before making changes.
2. Match existing code style and conventions.
3. Run `make contract-test` after contract changes.
4. Run `make codegen` after contract changes that affect entry functions or structs.
5. Run `make build` to verify frontend compiles.
6. Commit with conventional commit messages, split into logical chunks.

## Constraints

- Do not edit files in `src/contract/` — they are generated.
- Do not store large data on-chain — use Walrus blobs.
- form.html must stay ultra-light (no TanStack Query, no Headless UI).
- SDKs must be lazy-loaded, never imported at top level.
- Dist target < 500 KB without vendor, hard cap < 1 MB.
- Contract operates on Sui testnet.
- Walrus blob storage uses mainnet.
- Walrus Site hosting uses mainnet.

## Done Definition

A task is done when:

- The requested change is completed.
- Build passes (`make build`).
- Contract tests pass if contract was modified (`make contract-test`).
- Codegen is re-run if contract entry functions or structs changed.
- Commit messages follow conventional commits.
