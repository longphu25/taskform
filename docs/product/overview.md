# TaskForm — Product Overview

## Vision

TaskForm is a Walrus-native feedback operating system for Walrus Tools Builder, teams, and
communities.

## Positioning

> TaskForm is a Walrus-native feedback operating system where Sessions and decentralized
> teams collect structured feedback, store submissions on Walrus, optionally encrypt private
> data with Seal, and anchor submission metadata on Sui.

## Core User Flow

```text
index.html → dashboard.html → create-form.html → form.html?formId=... → dashboard.html?formId=...
```

## Target Users

**Primary:** Walrus Tools Builder organizers, hackathon organizers, Web3 protocol teams, DAO
communities, open-source projects, product teams.

**Secondary:** Bug bounty teams, grant/application teams, internal anonymous feedback teams,
security reporting teams.

## Core Differentiators

1. Walrus-native storage for schemas, submissions, screenshots, and videos
2. Sui on-chain metadata and events for form ownership, publication, and submission indexing
3. Seal-powered field-level privacy for private feedback
4. Private admin dashboard with filtering, review, prioritization, and CSV export
5. Sessions-ready templates for bug reports, feature requests, surveys, applications, and
   feedback about building on Walrus
6. CDN-first lightweight Walrus Site

## Stretch Differentiators

- Sponsored submissions (Web2 UX, Web3 ownership)
- Storage lifecycle management and renewal/export warnings

## Tools Builder Alignment

TaskForm is built for the Walrus Tools Builder track. It must prove that Walrus is
used meaningfully by storing form schemas, submissions, attachments, and demo artifacts on
Walrus while anchoring ownership, indexing, and review metadata through Sui.

Judging priorities:

- Product Utility & UX: creators can make, edit, share, and review forms without friction.
- Onchain Innovation & Use of Walrus: Walrus and Sui provide storage, verifiability,
  ownership, permissions, and composability beyond a Web2 form clone.
- Technical Execution & Completeness: the MVP is stable, deployed, documented, and complete
  enough for a real feedback collection flow.

## MVP Success Criteria

- Creator can create and publish form
- Submitter can submit feedback via public link
- Schema stored on Walrus
- Submission stored on Walrus
- Submission metadata anchored on Sui
- Sensitive field encryption demonstrated
- Creator can filter, triage, prioritize, and export CSV
- At least one real feedback submission is made using TaskForm
- Demo video under 3 minutes is uploaded on Walrus
- Mainnet submission target is documented and public links are ready
- One-pager, screenshot/demo post, and dedicated Walrus Tools Builder wallet are prepared
- form.html loads quickly
