# TaskForm

**Walrus-native feedback operating system for Walrus Tools Builder, teams, and communities.**

Collect structured feedback, bug reports, feature requests, surveys, and applications with
Walrus storage, optional Seal encryption, and Sui on-chain metadata.

## Product Vision

TaskForm lets anyone create a form, publish a public link, collect structured feedback,
store submissions on Walrus, optionally encrypt sensitive responses with Seal, anchor
submission metadata on Sui, and manage feedback in a private dashboard.

> Web2 UX, Web3 ownership.

## Core Differentiators

- **Walrus-native storage** — Form schemas and submissions stored on decentralized, epoch-based Walrus blobs
- **Seal-powered field-level privacy** — Sensitive data encrypted before upload, decryptable only by authorized admins
- **Sui metadata and events** — Form ownership, publication, submission status, and priority anchored on-chain
- **Admin review workflow** — Filter, prioritize, review, and export feedback as CSV
- **CDN-first lightweight Walrus Site** — Ultra-fast public form loading

Stretch differentiators:

- **Sponsored submissions** — Creators sponsor gas fees so submitters never need a wallet
- **Storage lifecycle management** — Epoch-based expiry tracking with health indicators

## Target Users

**Primary:** Walrus Tools Builder organizers, hackathon organizers, Web3 protocol teams, DAO communities, open-source projects, product teams.

**Secondary:** Bug bounty teams, grant/application teams, internal anonymous feedback teams, security reporting teams.

## Core User Flow

```
Landing → Dashboard → Create Form → Public Form → Dashboard (review)
```

1. Creator connects wallet on Dashboard
2. Creator builds and publishes a form
3. Public link is shared — submitter fills out form (fast, no wallet needed if sponsored)
4. Submission body and attachments stored on Walrus; metadata anchored on Sui
5. Sensitive fields are encrypted with Seal when enabled
6. Creator filters, prioritizes, reviews, decrypts, and exports feedback in Dashboard

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | Product intro, Walrus/Seal/Sui value, Launch App CTA |
| Dashboard | `/dashboard.html` | Wallet connect, My Forms, filtering, review, priority, CSV export |
| Create Form | `/create-form.html` | Form builder with fields, categories, storage policy, sponsor settings |
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

## Default Feedback Categories

- Best feedback regarding building on Walrus
- Bug report
- Feature request
- Survey
- Application
- General feedback

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
- [ ] Submission metadata anchored on Sui
- [ ] Sensitive field encryption demonstrated
- [ ] Creator can filter, triage, prioritize, and export CSV
- [ ] At least one real feedback submission created using TaskForm
- [ ] Demo video under 3 minutes uploaded on Walrus
- [ ] form.html loads quickly

## Hackathon Submission Checklist

- [ ] Public app link
- [ ] Public repository link
- [ ] Short explanation of what was built
- [ ] Screenshot thread or screenshot set
- [ ] Demo video under 3 minutes uploaded on Walrus
- [ ] At least one real feedback submission made using TaskForm
- [ ] Public form link used for the real submission
- [ ] Dashboard proof showing review/filter/priority/export for the real submission
- [ ] CSV export containing the real submission
- [ ] Registered through the official submission form: https://airtable.com/appoDAKpC74UOqoDa/shrN8UbJRdbkd5Lso

Prize alignment:

- Main product: real Walrus-native structured feedback platform
- Special focus: collect "Best Feedback regarding building on Walrus" submissions for Walrus Tools Builder

## Walrus Tools Builder Alignment

TaskForm is built for the Walrus Tools Builder track. The submitted product should
show strong product utility, meaningful Walrus/Sui usage, and complete technical execution.

Judging focus:

- Product Utility & UX: form creation, sharing, submission, dashboard review, filtering, and CSV export should work with low friction.
- Onchain Innovation & Use of Walrus: schemas, submissions, attachments, and demo artifacts use Walrus; Sui metadata/events provide ownership, indexing, and review state.
- Technical Execution & Completeness: the MVP should be stable, deployed, documented, and usable for a real feedback workflow.

Additional event requirements:

- [ ] Mainnet deployment target documented
- [ ] One-pager prepared
- [ ] Wallet dedicated to Walrus Tools Builder created
- [ ] Demo, screenshot, or project link posted on X with hashtag `#Walrus`
- [ ] Walrus Discord joined
- [ ] DeepSurge registration fields ready: project name/logo, description, website, primary contact, public GitHub repo, and app store link if applicable

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

**Day 5 complete** — Move contract deployed to testnet, codegen TypeScript bindings generated.

Completed:
- Day 1: Foundation (multi-page build, CDN externals, types, schemas, page shells)
- Day 5: Move contract (Registry, Form, Caps, SubmissionMeta, events, tests, testnet deploy, codegen)

See `docs/ROADMAP.md` for full progress.
