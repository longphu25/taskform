# ADR-0004: CDN-first Multi-page Architecture

## Status

Accepted

## Context

TaskForm frontend deploys as a Walrus Site. Walrus Sites store static files on
Walrus blobs. Uploading large vendor bundles (React, Zod, TanStack Query) to
Walrus is wasteful and slows down the public form page.

The public form page (`form.html`) must load as fast as possible for submitters
who may not have wallets or technical knowledge.

## Decision

1. **Multi-page static app** — 4 separate HTML entries (`index.html`,
   `dashboard.html`, `create-form.html`, `form.html`) instead of SPA routing.
2. **CDN-first dependencies** — React, ReactDOM, Zod, TanStack Query, React
   Hook Form, and Headless UI loaded via `<script type="importmap">` from
   `esm.sh` with pinned versions.
3. **Vite externals** — These deps are excluded from the bundle via
   `rollupOptions.external`.
4. **Page-specific import maps** — Each page only declares the CDN deps it
   actually uses. `form.html` has the minimal set (React + Zod only).
5. **Lazy-load SDKs** — Walrus upload, Seal encrypt, Sui wallet loaded only on
   user action (submit/publish).

## Consequences

- Walrus Site dist stays under 500 KB (currently ~47 KB).
- `form.html` initial load is minimal — no dashboard code, no TanStack Query.
- CDN availability becomes a dependency — mitigated by pinned versions and
  potential self-host fallback.
- Each page has its own entry point and CSS — no shared SPA shell.

## Alternatives Considered

- **SPA with code splitting** — Still bundles vendor code into Walrus Site.
  Rejected for size reasons.
- **Tailwind Play CDN** — Not suitable for production. Rejected per spec.
- **Self-hosted vendor** — Possible fallback but increases Walrus upload size.
  Kept as contingency.
