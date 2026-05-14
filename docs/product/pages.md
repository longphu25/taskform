# TaskForm — Pages

## index.html (Landing)

- Product intro
- Walrus / Seal / Sui value proposition
- Walrus Tools Builder feedback use case
- Links to app, repository, demo video, and proof artifacts when available
- Launch App CTA

## dashboard.html (Admin)

- Wallet connect
- My Forms list
- Submission inbox
- Filters by form, feedback type, status, priority, date, attachment presence, encrypted/private
  fields, and keyword search
- Status and priority management
- Storage Health indicators
- Export CSV
- Export JSON backup
- Decrypt sensitive fields

## create-form.html (Builder)

- Title and description
- Feedback category/template selector
- Add/remove fields
- Required toggle
- Sensitive toggle
- Storage duration selector
- Sponsored submission toggle (stretch)
- Publish form action

## form.html (Public Submit)

- Must load fastest (ultra-light)
- Load schema from Walrus
- Render dynamic fields
- Validate with Zod
- Encrypt sensitive fields only when needed
- Upload attachments only on submit
- Submit to Walrus
- Show success confirmation
- Make at least one real submission available for hackathon proof

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
