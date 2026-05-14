# TaskForm - Style Reference
> Technical blueprint on deep ink glass. Lines are crisp, colors are functional, and every element explains the Walrus / Seal / Sui feedback pipeline.

**Theme:** dark

TaskForm adapts a "technical brutalism meets digital precision" aesthetic to a dark Walrus-native product surface. The interface prioritizes informational clarity, directness, and proof-oriented content. A deep teal-black foundation gives the product a serious infrastructure feel, while mint, teal, amber, Sui blue, Walrus off-white, and Seal soft blue are deployed as functional signals rather than decoration. Typography uses Satoshi with Avenir fallbacks for a modern, compact, technical voice. Terminal, proof-table, and dashboard-like surfaces should feel precise and inspectable, with thin lines, restrained glass panels, and minimal visual noise.

## Tokens - Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Ink | `#071011` | `--color-ink` | Primary page background and darkest application surface. Establishes the technical dark foundation. |
| Midnight Surface | `#0d1c1d` | `--color-ink-2` | Secondary dark surface for elevated sections, panels, and subtle page depth. |
| Glass Panel | `rgba(8, 24, 25, 0.82)` | `--color-panel` | Translucent panel background for navigation, cards, terminal blocks, and overlay surfaces. |
| Strong Glass Panel | `rgba(12, 34, 35, 0.94)` | `--color-panel-strong` | Higher-contrast panel fill for dense product UI and proof surfaces. |
| Ethereal Line | `rgba(190, 255, 234, 0.16)` | `--color-line` | Subtle borders, dividers, inactive outlines, and grid lines. |
| Strong Ethereal Line | `rgba(190, 255, 234, 0.34)` | `--color-line-strong` | Emphasized borders, active card outlines, and stronger technical separators. |
| Starlight Text | `#effff8` | `--color-text` | Primary text, headings, critical labels, and high-contrast UI copy. |
| Muted Sage | `#9fb9b1` | `--color-muted` | Secondary text, helper copy, metadata, table descriptions, and inactive links. |
| Neon Mint | `#80ffd5` | `--color-mint` | Primary action color, active states, key highlights, and important technical proof markers. |
| Electric Teal | `#28d8c1` | `--color-teal` | Secondary action accent, gradient partner for mint, hover states, and pipeline emphasis. |
| Proof Amber | `#ffc46b` | `--color-amber` | Status tags, proof labels, section kickers, attention indicators, and hackathon-ready metadata. |
| Sui Blue | `#6fbcf0` | `--color-sui` | Sui-specific metadata, ownership, events, on-chain state, and Sui rail indicators. |
| Walrus Off-White | `#fbffea` | `--color-walrus` | Walrus-specific storage labels, blob proof indicators, and soft contrast highlights. |
| Seal Soft Blue | `#c6d8ff` | `--color-seal` | Seal-specific encryption labels, private field indicators, and privacy rail markers. |

## Tokens - Typography

### Satoshi - Primary typeface for all headings, body text, navigation, and general UI. It gives TaskForm a modern, precise, product-focused voice without feeling generic. Use tight display settings for large hero copy and compact but readable settings for dense dashboard-like surfaces. - `--font-satoshi`
- **Substitute:** Avenir Next, Avenir, system sans-serif
- **Weights:** 400, 650, 750, 850, 860
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 24px, 48px, 60px, 96px
- **Line height:** 1.00, 1.10, 1.20, 1.50, 1.55
- **Letter spacing:** 0 for most UI text; use tight negative tracking only for very large display headings (`-0.03em` to `-0.04em`)
- **Role:** Primary typeface for all UI, navigation, labels, body copy, buttons, cards, and landing page headings.

### UI Mono - Used for terminal traces, blob IDs, command examples, transaction references, and any content requiring a fixed-width technical presentation. - `--font-ui-mono`
- **Substitute:** SFMono-Regular, Menlo, Monaco, Consolas, monospace
- **Weights:** 400, 600
- **Sizes:** 12px, 13px, 14px, 16px
- **Line height:** 1.20, 1.38, 1.50
- **Letter spacing:** 0
- **Role:** Used for pipeline traces, CLI-style command blocks, IDs, technical metadata, and proof tables.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0 | `--text-caption` |
| body-sm | 14px | 1.5 | 0 | `--text-body-sm` |
| body | 16px | 1.5 | 0 | `--text-body` |
| subheading | 18px | 1.2 | 0 | `--text-subheading` |
| heading | 24px | 1.2 | 0 | `--text-heading` |
| heading-lg | 48px | 1.1 | -1.44px | `--text-heading-lg` |
| display | 60px | 1.0 | -1.8px | `--text-display` |
| display-xl | 96px | 0.95 | -3.84px | `--text-display-xl` |

## Tokens - Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable but precise

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px to 16px depending on density |
| header | pill-shaped or 999px for floating landing nav |
| buttons | 999px for landing CTAs, 4px to 8px for dense product controls |
| default | 8px |

### Layout

- **Content max width:** 1200px
- **Section gap:** 72px to 120px depending on viewport
- **Card padding:** 16px to 24px
- **Element gap:** 4px, 8px, 12px, 16px

## Components

### Text Link
**Role:** Navigation, inline links, secondary calls to action.

Use Starlight Text (`#effff8`) for primary links and Muted Sage (`#9fb9b1`) for secondary links. Hover states should shift toward Neon Mint (`#80ffd5`). Do not underline by default; underline or color shift may appear on hover only. Font is Satoshi, 14-16px.

### Navigation Link
**Role:** Top navigation menu items.

Use Muted Sage on a dark glass navigation surface. Active or hovered links transition to Starlight Text or Neon Mint. Keep labels compact, technical, and low-noise. Navigation should feel precise, floating, and functional.

### Ghost Button
**Role:** Secondary actions, grouped options, technical toggles.

Transparent or very low-opacity background with Starlight Text. Use Ethereal Line as a 1px border. Radius can be 4px for dense product UI or pill-shaped in the landing nav. Hover state adds a subtle mint-tinted background.

### Outlined Button
**Role:** Secondary calls to action and proof links.

Transparent or `rgba(239, 255, 248, 0.06)` background with Starlight Text. Border uses `rgba(239, 255, 248, 0.18)` or Ethereal Line. Padding should be compact and balanced. Radius is pill-shaped on landing pages, 4px to 8px in dense UI.

### Filled Button
**Role:** Primary calls to action.

Use Neon Mint and Electric Teal as the primary action treatment. Text should be very dark (`#06231d` or Deep Ink) for contrast. A restrained glow may be used around the button, but avoid heavy decorative effects. Hover can lift slightly and intensify the border or glow.

### List Item Card
**Role:** Content blocks in feature sections, proof rows, and use-case lists.

Use transparent or Glass Panel backgrounds with thin Ethereal Line borders. Text uses Starlight Text for titles and Muted Sage for descriptions. Keep padding disciplined and avoid excessive visual ornament.

### Elevated Content Card
**Role:** Featured content blocks, form surfaces, dashboard previews, terminal blocks, and proof modules.

Use Glass Panel or Strong Glass Panel backgrounds, thin mint-tinted borders, and restrained depth. Radius should stay between 6px and 16px. Shadows are allowed only as soft atmospheric separation on dark backgrounds; avoid heavy card shadows.

### Code Input Block
**Role:** CLI instruction display, transaction trace, blob ID display, and pipeline status examples.

Use Strong Glass Panel or Deep Ink background with Ethereal Line borders. Text uses UI Mono, 12-16px, with Neon Mint for commands, Muted Sage for arguments, and Proof Amber / Sui Blue / Seal Soft Blue for rail-specific status tags.

### Status Badge
**Role:** Highlights proof state, new features, rail identity, or confirmation.

Use transparent or low-opacity backgrounds. Text color should map to the semantic rail: Proof Amber for proof/status, Neon Mint for success/action, Sui Blue for Sui metadata, Walrus Off-White for Walrus storage, Seal Soft Blue for privacy/encryption. Keep badges compact and text-based.

## Do's and Don'ts

### Do
- Prioritize Deep Ink (`#071011`) for the page foundation and Starlight Text (`#effff8`) for primary readable content.
- Use Satoshi consistently for headings, navigation, buttons, labels, and body text.
- Use UI Mono for terminal traces, blob IDs, command snippets, and technical proof details.
- Use Ethereal Line for subtle structure instead of heavy borders.
- Reserve Neon Mint for primary actions and critical highlights.
- Use Proof Amber, Sui Blue, Walrus Off-White, and Seal Soft Blue as semantic rail colors.
- Keep layouts direct, inspectable, and product-oriented.
- Show real interface concepts: form builder, public form, dashboard, proof table, and pipeline trace.

### Don't
- Do not switch to Factory.ai's light theme, Geist font, or orange accent palette.
- Do not introduce generic purple crypto gradients.
- Do not rely on decorative blobs, stock photography, or abstract art that hides the product.
- Do not use excessive border radius on dense cards and controls.
- Do not make the page feel like a generic SaaS template; every visual should support the Walrus / Seal / Sui workflow.
- Do not overuse glow effects. Use glow sparingly for functional emphasis.
- Do not add arbitrary bolding, italics, or inconsistent type scales.

## Imagery

The visual language for imagery is functional and technical. Use product screenshots, stylized UI panels, terminal traces, proof tables, code blocks, and pipeline diagrams. Graphics should explain how a form schema becomes a Walrus blob, how sensitive fields are encrypted through Seal, and how Sui anchors ownership and review metadata. Avoid photography and human lifestyle imagery. Use dotted grids, thin connector lines, and compact interface frames to create a precise engineering feel.

## Layout

The page structure uses a full-width dark canvas with centered content constrained to 1200px. The hero should be a split two-column design: product copy on the left and a dashboard / terminal / proof visual on the right. Sections should alternate between explanatory text, interface screenshots, bento-style feature cards, and table-like proof modules. Navigation is a persistent floating top bar with a clear separation between brand, menu items, and primary CTA. Layout should feel spacious but structured, with no nested cards or decorative clutter.

## Agent Prompt Guide

### Quick Color Reference
- **Text Primary:** `#effff8`
- **Text Muted:** `#9fb9b1`
- **Page Background:** `#071011`
- **Secondary Surface:** `#0d1c1d`
- **Panel Background:** `rgba(8, 24, 25, 0.82)`
- **Border/Divider:** `rgba(190, 255, 234, 0.16)`
- **Primary Accent:** `#80ffd5`
- **Secondary Accent:** `#28d8c1`
- **Status/Proof Accent:** `#ffc46b`
- **Sui Rail:** `#6fbcf0`
- **Walrus Rail:** `#fbffea`
- **Seal Rail:** `#c6d8ff`

### Example Component Prompts
1. **Create a Hero Section:** Set page background to Deep Ink (`#071011`). Left half: headline "Build forms. Store on Walrus. Own on Sui." in Satoshi, 60px to 96px, weight 860, tight line-height, color Starlight Text (`#effff8`). Subheading in Satoshi, 18px, color Muted Sage (`#9fb9b1`). Right half: a realistic dark dashboard / terminal hybrid showing Walrus blob storage, Seal encrypted fields, Sui anchored metadata, and dashboard review status.
2. **Generate an Outlined Button:** Label "View Architecture". Use transparent or low-opacity background, Starlight Text (`#effff8`), Ethereal Line border, pill shape, Satoshi 14-16px, weight 750.
3. **Design a Code Input Block:** Use Strong Glass Panel background and a thin Ethereal Line border. Display `submit --walrus blob_id --seal policy --sui anchor` in UI Mono, 14px, with Neon Mint commands, Muted Sage arguments, and semantic rail colors for Walrus / Seal / Sui labels.
4. **Create an Elevated Content Card:** Use Glass Panel background, 1px Ethereal Line border, 8px to 16px radius, no heavy shadow. Add a compact Proof Amber status badge and a short technical explanation.
5. **Build a Navigation Bar:** Use a floating glass nav over Deep Ink. Brand on the left, links in Muted Sage, primary CTA as a Neon Mint / Electric Teal filled pill button.

## Similar Brands

- **Vercel** - Precise developer-tool layouts, strong technical hierarchy, and restrained color use.
- **Linear** - Dense but readable product surfaces with excellent spacing discipline.
- **Tailwind CSS** - Documentation-heavy clarity, technical examples, and clean interface diagrams.
- **Supabase** - Developer-focused product storytelling with code, database, and infrastructure visuals.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #071011;
  --color-ink-2: #0d1c1d;
  --color-panel: rgba(8, 24, 25, 0.82);
  --color-panel-strong: rgba(12, 34, 35, 0.94);
  --color-line: rgba(190, 255, 234, 0.16);
  --color-line-strong: rgba(190, 255, 234, 0.34);
  --color-text: #effff8;
  --color-muted: #9fb9b1;
  --color-mint: #80ffd5;
  --color-teal: #28d8c1;
  --color-amber: #ffc46b;
  --color-sui: #6fbcf0;
  --color-walrus: #fbffea;
  --color-seal: #c6d8ff;

  /* Typography - Font Families */
  --font-satoshi: 'Satoshi', 'Avenir Next', Avenir, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography - Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.44px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.8px;
  --text-display-xl: 96px;
  --leading-display-xl: 0.95;
  --tracking-display-xl: -3.84px;

  /* Typography - Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 650;
  --font-weight-bold: 750;
  --font-weight-heavy: 850;
  --font-weight-display: 860;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --content-max: 1200px;
  --section-gap: 72px;
  --card-padding: 16px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-header: 999px;
  --radius-buttons: 999px;
  --radius-default: 8px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #071011;
  --color-ink-2: #0d1c1d;
  --color-panel: rgba(8, 24, 25, 0.82);
  --color-panel-strong: rgba(12, 34, 35, 0.94);
  --color-line: rgba(190, 255, 234, 0.16);
  --color-line-strong: rgba(190, 255, 234, 0.34);
  --color-text: #effff8;
  --color-muted: #9fb9b1;
  --color-mint: #80ffd5;
  --color-teal: #28d8c1;
  --color-amber: #ffc46b;
  --color-sui: #6fbcf0;
  --color-walrus: #fbffea;
  --color-seal: #c6d8ff;

  /* Typography */
  --font-satoshi: 'Satoshi', 'Avenir Next', Avenir, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography - Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.44px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.8px;
  --text-display-xl: 96px;
  --leading-display-xl: 0.95;
  --tracking-display-xl: -3.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 999px;
}
```
