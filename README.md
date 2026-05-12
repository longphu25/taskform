# TaskForm

**Walrus-native feedback operating system for decentralized teams.**

Collect private feedback, sponsor user submissions, and manage storage lifecycle — all powered by Walrus storage and Seal encryption on Sui.

## Product Vision

TaskForm lets anyone create a form, publish a public link, collect feedback, store submissions on Walrus, encrypt sensitive responses with Seal, sponsor submitter fees, and manage feedback in a private dashboard.

> Web2 UX, Web3 ownership.

## Core Differentiators

- **Walrus-native storage** — Form schemas and submissions stored on decentralized, epoch-based Walrus blobs
- **Seal-powered field-level privacy** — Sensitive data encrypted before upload, decryptable only by authorized admins
- **Sponsored submissions** — Creators sponsor gas fees so submitters never need a wallet
- **Storage lifecycle management** — Epoch-based expiry tracking with health indicators
- **CDN-first lightweight Walrus Site** — Ultra-fast public form loading

## Target Users

**Primary:** Hackathon organizers, Walrus Sessions organizers, Web3 protocol teams, DAO communities, open-source projects, product teams.

**Secondary:** Bug bounty teams, grant/application teams, internal anonymous feedback teams, security reporting teams.

## Core User Flow

```
Landing → Dashboard → Create Form → Public Form → Dashboard (review)
```

1. Creator connects wallet on Dashboard
2. Creator builds and publishes a form
3. Public link is shared — submitter fills out form (fast, no wallet needed if sponsored)
4. Submission stored on Walrus, sensitive fields encrypted with Seal
5. Creator triages submissions in Dashboard (status, priority, decrypt, export)

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | Product intro, Walrus/Seal/Sui value, Launch App CTA |
| Dashboard | `/dashboard.html` | Wallet connect, My Forms, submissions, triage, export |
| Create Form | `/create-form.html` | Form builder with fields, storage policy, sponsor settings |
| Public Form | `/form.html?formId=...` | Ultra-light submit page (fastest load) |

## Supported Field Types

- Short text
- Rich text (textarea)
- Dropdown
- Checkbox
- Star rating
- Screenshot upload
- Video upload
- URL
- Confirmation checkbox

## Tech Stack

| Layer | Choice |
|-------|--------|
| Runtime | Bun 1.3.13 |
| Build | Vite 8.x |
| Language | TypeScript 6.x |
| UI | React 19.x |
| Styling | Tailwind CSS 4.x |
| Validation | Zod 4.4.3 |
| Data fetching | TanStack Query 5.x (dashboard only) |
| Forms | React Hook Form 7.x (create-form only) |
| Blockchain | Sui Move |
| Storage | Walrus |
| Encryption | Seal |

## Architecture

```
CDN-first dependencies + page-level lazy loading + local app logic only
```

- Third-party libs (React, Zod, etc.) loaded from CDN via import maps — not bundled
- SDKs (Walrus, Seal, Sui) lazy-loaded only on user action
- form.html loads only React + Zod + local JS (no dashboard code)
- Dist target < 500 KB without vendor

See `docs/ARCHITECTURE.md` for full details.

## Live URLs

| Environment | URL |
|-------------|-----|
| GitHub Pages | https://longphu25.github.io/taskform/ |
| Walrus Site | https://taskform.wall.app/ |

## Quick Start

```bash
bun install
bun run dev      # Dev server
bun run build    # Production build
bun run preview  # Preview production build
```

## Project Structure

```
taskform/
├── index.html              # Landing page
├── dashboard.html          # Admin dashboard
├── create-form.html        # Form builder
├── form.html               # Public submit (ultra-light)
├── vite.config.ts          # Multi-page + CDN externals
├── src/
│   ├── pages/              # Page components + entry points
│   ├── lazy/               # SDK clients (loaded on demand)
│   ├── schemas/            # Zod validation schemas
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Page-specific Tailwind CSS
├── contract/               # Sui Move contract (git submodule)
└── docs/                   # Harness docs
```

## Documentation

| Doc | Purpose |
|-----|---------|
| `docs/ARCHITECTURE.md` | Technical architecture and constraints |
| `docs/ROADMAP.md` | 7-day implementation plan with TODO checklist |
| `docs/product/` | Product contracts (overview, pages, storage, move) |
| `docs/stories/` | Story packets and epic backlog |
| `docs/decisions/` | Architecture Decision Records |
| `docs/TEST_MATRIX.md` | Behavior-to-proof mapping |

## MVP Success Criteria

- [ ] Creator can create and publish form
- [ ] Submitter can submit feedback via public link
- [ ] Schema stored on Walrus
- [ ] Submission stored on Walrus
- [ ] Sensitive field encryption demonstrated
- [ ] Creator can triage submissions (status/priority)
- [ ] Storage expiry visible
- [ ] Sponsored submission story demo-ready
- [ ] form.html loads quickly

## Deployment

### GitHub Pages (auto)

Push to `main` → GitHub Actions builds and deploys to https://longphu25.github.io/taskform/

Workflow: `.github/workflows/deploy.yml`

### Walrus Site

```bash
VITE_BASE_PATH=/ bun run build
# Deploy with site-builder to taskform.wall.app
```

## Status

**Day 1 complete** — Foundation, multi-page build, CDN externals, types, schemas, page shells.

See `docs/ROADMAP.md` for full progress.
