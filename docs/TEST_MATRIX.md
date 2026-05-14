# Test Matrix

This file maps product behavior to proof.

## Status Values

| Status | Meaning |
|--------|---------|
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
|-------|----------|------|-------------|-----|----------|--------|----------|
| E01 Foundation | Multi-page build, CDN externals, types, schemas | no | no | no | build passes | implemented | `bun run build` + `tsc -b` pass |
| E02 Landing | Hero, features, CTA, responsive | no | no | no | build passes | implemented | Page renders at /index.html |
| E03 Form Builder | Field builder, preview, validation, publish | no | no | no | build passes | implemented | DnD canvas, 9 field types, publish to Walrus |
| E04 Walrus Storage | Upload/download schema, auto-swap | no | manual | no | no | implemented | Upload tested, download via aggregator verified |
| E05 Public Form | Ultra-light renderer, Zod validation | no | no | manual | no | in_progress | Schema loads from Walrus, fields render, validation works |
| E06 Move Contract | Registry, Form, Caps, entry fns | planned | planned | no | no | implemented | Deployed to testnet, codegen bindings generated |
| E07 Dashboard | Wallet, forms, submissions, triage | no | no | planned | no | planned | none |
| E08 Seal | Encrypt/decrypt sensitive fields | planned | planned | no | no | planned | none |
| E09 Sponsored | Sponsor toggle, demo flow | no | planned | no | no | planned | none |
| E10 Storage Health | Expiry tracking, health UI | no | no | planned | no | planned | none |
| E11 Optimization | Bundle size, no vendor in dist | no | no | no | build check | planned | none |
| E12 Deployment | Walrus Site deploy, smoke test | no | no | planned | planned | planned | none |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers Walrus upload/download, Sui transactions, Seal encrypt/decrypt.
- E2E proof covers user-visible browser flows (create form → submit → view in dashboard).
- Platform proof covers Walrus Site deployment and page loading.
- A story can be implemented without every proof column if the story packet explains why.
