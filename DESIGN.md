# Design System: TaskForm
**Project ID:** TaskForm

## 1. Visual Theme & Atmosphere
TaskForm embodies a "Cyber-Dark Web3" aesthetic. It feels immersive, deep, and highly technical yet refined. The atmosphere relies heavily on a pitch-dark, oceanic foundation accented by luminous, high-contrast neon highlights. Glassmorphism (blur filters with semi-transparent dark backgrounds) is used extensively to create depth and a layered, floating interface. The mood is futuristic, utilitarian, and premium, evoking a sense of high-performance decentralized technology.

## 2. Color Palette & Roles
* **Deep Space Ink (#071011):** The absolute primary background color. Creates the infinite, void-like foundation of the application.
* **Midnight Surface (#0d1c1d):** Used for slightly elevated backgrounds or secondary sections to create subtle depth against the primary ink background.
* **Glass Panel (rgba(8, 24, 25, 0.78)):** A translucent, frosted-glass background color used for floating navigation and overlaid cards.
* **Neon Mint (#80ffd5):** The primary brand and action color. Used for high-emphasis highlights, primary buttons (in gradients), active states, and critical data points.
* **Electric Teal (#28d8c1):** The secondary brand color, often paired with Neon Mint in gradients to provide dimension to active elements.
* **Warning Amber (#ffc46b):** Used for kickers, small section labels, and attention-grabbing uppercase tags to break up the monochromatic teal/mint scheme.
* **Starlight White (#effff8):** The primary text color. It has a very slight green-blue tint to harmonize seamlessly with the dark teal background instead of being a harsh pure white.
* **Muted Sage (#9fb9b1):** Secondary text color used for subtitles, metadata, and less emphasized text.
* **Ethereal Line (rgba(190, 255, 234, 0.16) to 0.34):** Semi-transparent mint-tinted borders used to define cards, inputs, and navigation boundaries without heavy solid lines.

## 3. Typography Rules
* **Font Family:** `Satoshi` (fallback to Avenir Next, system-ui). This provides a modern, geometric sans-serif look with clean, crisp legibility.
* **Headers:** Extremely bold weights (ranging from 800 to 860). Display headers are massive (up to 120px) with tight line-heights (0.92 to 1.1) and slight negative letter-spacing (-0.03em to -0.04em) to create dense, impactful typography.
* **Kickers/Labels:** Use Warning Amber, very bold (850 weight), uppercase, and wide letter-spacing (0.08em to 0.1em) for contrast against the dense headers.
* **Body Text:** Uses Starlight White or transparent variants (e.g., 72% to 78% opacity). Weights are standard, but line-height is generous (1.5 to 1.55) to ensure high readability against the dark background.

## 4. Component Stylings
* **Buttons (Primary):** Pill-shaped (fully rounded corners). They use a vibrant linear-gradient from Neon Mint to Electric Teal with dark text (#06231d) for maximum contrast. They feature a glowing, diffuse box-shadow (`box-shadow: 0 16px 44px rgba(40, 216, 193, 0.24)`). On hover, they lift upward (`translateY(-2px)`) and the glow intensifies.
* **Buttons (Secondary):** Pill-shaped. They have a subtle translucent white background (`rgba(239, 255, 248, 0.06)`) and a delicate semi-transparent white border. On hover, the background and border opacity increase slightly.
* **Cards/Containers:** Subtly rounded corners (16px border-radius). They use a very faint translucent fill (`rgba(239, 255, 248, 0.02)`) and are outlined by an Ethereal Line. On hover, they exhibit physical lift (`translateY(-4px)`) and the border color shifts to a more visible, minty translucence (`rgba(128, 255, 213, 0.4)`).
* **Navigation:** Floating, pill-shaped shell detached from the top of the viewport. Utilizes strong glassmorphism (backdrop-blur 22px, semi-transparent background) and a subtle drop shadow to hover above the page content.
* **Icons:** Housed in soft-rounded squares (14px border-radius) with a translucent mint background and border, using the Neon Mint color for the icon stroke itself.

## 5. Layout Principles
* **Max Width & Alignment:** Content is constrained to a maximum width of `1200px` and centered.
* **Section Spacing:** Generous, breathable vertical spacing between sections, using a clamped viewport-relative padding (`clamp(80px, 12vh, 160px)`). This creates a cinematic, airy scroll experience.
* **Grids:** Features and pillars are organized in auto-fitting CSS grids that collapse cleanly into single columns on mobile breakpoints.
* **Motion & Layering:** Elements fade and slide up into view (using GSAP). Parallax and fixed backgrounds are used to create deep layering between the background shell, the glass panels, and the foreground text.
