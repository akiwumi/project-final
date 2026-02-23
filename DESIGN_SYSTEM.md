# Design System

Derived from the Nutold-style reference: clean, professional agency aesthetic with strong contrast and a vibrant accent.

---

## 1. Color Palette

### Primary

| Token | Hex | Usage |
|-------|-----|--------|
| **Background (light)** | `#FDFCF9` | Header, hero, main content areas |
| **Background (dark)** | `#1A3B49` | Mission/statement blocks, footer, partner sections |
| **Accent** | `#FF7A3D` | Primary CTA buttons, star ratings, key highlights |

### Text

| Token | Hex | Usage |
|-------|-----|--------|
| **Primary text** | `#1E3A4A` | Main headings, important copy |
| **Secondary text** | `#4A6572` | Body text, nav links, descriptions |
| **Text on dark** | `#FFFFFF` | Headlines and copy on dark backgrounds |
| **Muted** | `#6B7C85` | Captions, subtle labels |

### UI

| Token | Hex | Usage |
|-------|-----|--------|
| **Border / divider** | `#E2E8EB` | Cards, sections, subtle separation |
| **Surface (cards)** | `#FFFFFF` | Cards on light background |
| **Hover overlay** | `rgba(0,0,0,0.04)` | Interactive surfaces |

---

## 2. Typography

### Font stack

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
```

Optional display/headline font for stronger character (e.g. Clash Display, Satoshi, or similar).

### Scale

| Name | Size | Weight | Line height | Use case |
|------|------|--------|-------------|----------|
| **Display** | 60–80px | 700–800 | 1.05–1.1 | Hero headline (all caps) |
| **H1** | 36–48px | 700 | 1.1 | Page titles |
| **H2** | 24–32px | 600 | 1.2 | Section titles, agency/subhead |
| **H3** | 20–24px | 600 | 1.3 | Card titles, subsections |
| **Body** | 16–18px | 400 | 1.5–1.6 | Paragraphs, descriptions |
| **Small** | 14px | 400 | 1.5 | Captions, labels, meta |
| **Nav / Button** | 16px | 500 | 1.4 | Navigation links, button text |

### Conventions

- **Hero headline:** All caps, bold (700–800), primary text color, very large (60–80px).
- **Section headlines:** Sentence case or title case, semi-bold (600), primary text color.
- **Body:** Regular (400), secondary text color, comfortable line height.
- **Buttons:** Medium to semi-bold (500–600), white on accent or primary text on outline.

---

## 3. Spacing & Layout

### Scale (rem)

| Token | Value | Use |
|-------|--------|-----|
| `space-1` | 0.25rem (4px) | Tight inline gaps |
| `space-2` | 0.5rem (8px) | Icon–text, small gaps |
| `space-3` | 0.75rem (12px) | Form fields, list items |
| `space-4` | 1rem (16px) | Default gap |
| `space-6` | 1.5rem (24px) | Between related blocks |
| `space-8` | 2rem (32px) | Section padding (mobile) |
| `space-12` | 3rem (48px) | Section padding (desktop) |
| `space-16` | 4rem (64px) | Large section padding |
| `space-20` | 5rem (80px) | Hero/section vertical rhythm |

### Layout

- **Content width:** Max-width ~1280px (e.g. `max-w-7xl`), centered, with horizontal padding 1rem–1.5rem.
- **Sections:** Generous vertical padding (e.g. 5rem–6rem on desktop, 3rem on mobile).
- **Grids:** Use CSS Grid or flexbox; project/showcase sections can use overlapping, dynamic grids with clear alignment.

---

## 4. Components

### Header / Navigation

- **Height:** ~64px (4rem).
- **Background:** Light background (`#FDFCF9`) or transparent over hero; solid when scrolled.
- **Logo:** Wordmark + small icon; primary text color (or white on dark).
- **Nav links:** Medium weight (500), secondary text color, 16px; hover: primary text or underline.
- **Primary CTA button:**
  - Background: Accent (`#FF7A3D`).
  - Text: White, 16–18px, medium/semi-bold.
  - Padding: ~12px 24px.
  - Border-radius: 8–12px (rounded rectangle).
  - Optional: arrow or chevron icon.

### Buttons

**Primary (accent)**

- Background: `#FF7A3D`
- Text: white, 16px, medium/semi-bold
- Padding: 12px 24px
- Border-radius: 8–12px
- Hover: Slightly lighter/darker for feedback

**Secondary (outline)**

- Border: 2px solid primary or secondary text
- Background: transparent
- Text: primary text color
- Same padding and radius as primary

### Hero section

- **Background:** Light (`#FDFCF9`) or full-bleed image/video with overlay.
- **Headline:** Display size, all caps, primary text color, bold.
- **Supporting text:** H2 or body, secondary text color.
- **Optional:** Rating/badge (e.g. stars in accent color, score).
- **CTA:** Primary button + optional secondary.

### Project / content cards

- **Background:** White or light surface.
- **Border:** 1px `#E2E8EB` or subtle shadow.
- **Border-radius:** 12–16px.
- **Padding:** 1.5rem–2rem.
- **Overlapping grid:** Slight rotation (e.g. 2–5°) and layering for depth where appropriate.

### Mission / statement block (dark section)

- **Background:** `#1A3B49`.
- **Text:** White, large (e.g. 24–32px), semi-bold or bold, centered or left-aligned.
- **Full-width:** Edge-to-edge; inner content can be max-width centered.
- **Padding:** 4rem–5rem vertical.

### Footer / partner logos

- **Background:** Same dark teal `#1A3B49`.
- **Logos:** White or light gray, horizontal row, even spacing.
- **Links/legal:** Small text, muted or white at reduced opacity.

---

## 5. Imagery & Visual Style

- **Mockups:** High-quality UI/device mockups; optional slight 3D perspective or rotation.
- **Photography:** Clean, modern; avoid cluttered imagery.
- **Icons:** Simple, clear (e.g. arrow for CTA, stars for ratings); match stroke weight (1.5–2px).
- **Shadows:** Subtle (e.g. `0 4px 20px rgba(0,0,0,0.08)`) for cards; avoid heavy drop shadows.

---

## 6. Accessibility

- Ensure contrast ratios: at least 4.5:1 for body text, 3:1 for large text and UI components.
- Primary text `#1E3A4A` on `#FDFCF9` and white on `#1A3B49` meet WCAG AA for normal text.
- Accent `#FF7A3D`: use for non-text (buttons, icons) or pair with white text; avoid long body text on accent.
- Focus states: visible outline or ring (e.g. 2px offset) for keyboard navigation.

---

## 7. CSS Custom Properties (implementation)

See `frontend/src/design-system/theme.css` for tokens as CSS variables so components can reference this system directly.
