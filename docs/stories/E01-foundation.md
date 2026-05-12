# E01 — Foundation

## Overview

Set up the multi-page Vite build with CDN-first dependencies, Tailwind CSS v4,
project structure, base types, and Zod schemas.

## Acceptance Criteria

- [x] Multi-page Vite config with 4 HTML entries
- [x] CDN import maps per page (pinned versions)
- [x] Vite externals exclude vendor code from bundle
- [x] Tailwind CSS v4 page-specific CSS files
- [x] Project structure: `src/pages/`, `src/schemas/`, `src/types/`, `src/lazy/`, `src/styles/`
- [x] Base TypeScript types for Form, Submission, Storage
- [x] Zod schemas for form validation, submission validation
- [x] Lazy module stubs for Walrus, Seal, Sui
- [x] TypeScript compiles without errors
- [x] Build produces 4 HTML pages in dist/
- [x] Dist size < 500 KB (actual: ~47 KB)

## Status

Done

## Evidence

- `bun run build` passes
- `tsc -b` passes with zero errors
- dist output: 4 HTML + page-specific JS + shared CSS
- Total dist: ~47 KB (well under 500 KB target)
- form.html JS: 1.36 KB gzip (target < 60 KB)
