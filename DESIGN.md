# QuizArena UI Design System

**Version:** 1.0.0 (Locked Foundation)
**Theme:** Light Mode ONLY
**Personality:** Minimal, Focused, Analytical, Performance-driven, Premium SaaS

## Typography System

- **Primary Font:** Hanken Grotesk (Locked via `next/font/google`)
- **Fallback Font:** sans-serif

_Hanken Grotesk is chosen for its sharp geometry, which commands authority in massive headlines while providing pristine numeric legibility in dense data tables and analytics dashboards._

## Locked Color Palette

- **Primary Orange (`#E6701E`):** Used for CTAs, active states, and progress emphasis (e.g., Accuracy Rate). Triggers action and energy.
- **Secondary Blue (`#2471E7`):** Used for analytical trust factors, charts, and secondary actions.
- **Soft Background Accent (`#D5DBFD`):** Used for soft hover surfaces, subtle containers, and progress bar tracks. Lowers cognitive load.
- **Deep Navy (`#0A1C40`):** Used for headings and primary text. Replaces pure black to feel less harsh and more premium.
- **White (`#FFFFFF`):** The absolute background and surface level color.

## Global UI Foundations (Tailwind v4)

All styles are locked natively into `src/styles/globals.css` under the `@theme` block.

**Reusable Utility Classes:**

- `.card` & `.card-soft`: For elegant, rounded-xl containers with subtle accent borders and hover shadows.
- `.btn`, `.btn-primary`, `.btn-outline`: For accessible, focus-ring-enabled interactive elements.
- `.input`: For standard data entry fields.
- `.container-base`: For maximum-width structural layout alignment.

## Core Rules

1. DO NOT introduce new colors to the theme without design system approval.
2. DO NOT use flashy neon gradients or dark mode overlays.
3. ALWAYS rely on whitespace and padding (`gap-6`, `p-6`) instead of dense borders.
4. ONLY use `rounded-xl` for primary structural elements to maintain the modern SaaS identity.
