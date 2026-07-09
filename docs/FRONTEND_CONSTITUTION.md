# QuizArena Frontend Constitution

Version 1.0 (LOCKED)

---

# Purpose

This document defines the permanent frontend engineering standards of QuizArena.

All frontend implementations must comply with this constitution.

No implementation may violate these standards without explicit approval.

This constitution supersedes individual feature implementations.

---

# Product Philosophy

QuizArena is an Enterprise SaaS Platform.

It is NOT

* flashy
* experimental
* entertainment-focused
* consumer-social

QuizArena must feel like

* Stripe
* Linear
* GitHub
* Vercel
* Notion
* Azure Portal
* Microsoft 365 Admin

The experience must communicate

Professionalism
Trust
Speed
Clarity
Scalability
Consistency

---

# Design Principles

Always optimize for

Minimalism
Readability
Predictability
Consistency
Accessibility
Performance

Never optimize for

Decoration
Animation-first design
Complexity
Visual noise
Novelty

---

# Official Design Language

Version
1.0.0 (LOCKED)

Theme
Light Mode ONLY

Personality
Minimal
Focused
Analytical
Performance-driven
Premium SaaS

---

# Typography

Primary Font
Hanken Grotesk

Fallback
sans-serif

Never introduce another font family.
Never mix typography systems.
Use typography hierarchy consistently.

---

# Color System (LOCKED)

Primary Orange
#E6701E

Purpose
Primary CTA
Active
Success progression

Secondary Blue
#2471E7

Purpose
Charts
Analytics
Secondary actions

Soft Accent
#D5DBFD

Purpose
Hover
Containers
Progress tracks

Deep Navy
#0A1C40

Purpose
Headings
Primary text

White
#FFFFFF

Purpose
Background
Surfaces

No additional brand colors are permitted.

---

# Layout Rules

Whitespace first.
Never solve layout problems with borders.

Preferred spacing
gap-6
p-6
rounded-xl

Use
Card Layout
Grid Layout
Responsive Containers

Never use
Nested cards inside nested cards
Crowded toolbars
Dense dashboards

---

# Component Rules

Every component must

Be reusable
Be typed
Support loading
Support empty
Support error
Support success
Support accessibility
Support responsive layouts
Support keyboard interaction

No one-off components.

---

# Dashboard Rules

Dashboard widgets must

Be independent
Support skeletons
Support refresh
Support empty states
Support inspector
Support responsive layout

Widgets must never directly fetch business data.
They consume Read Models only.

---

# CRUD Rules

Every CRUD page must support

Search
Filters
Sorting
Pagination
Bulk Actions
Inspector Drawer
Empty State
Loading State
Error State
Success Feedback
Undo where applicable

---

# Forms

Every form must include

Validation
Required indicators
Helpful messages
Autosave (where appropriate)
Cancel
Submit
Keyboard support
Clear focus states

---

# Tables

Enterprise tables must support

Sorting
Filtering
Pagination
Column visibility
Bulk selection
Row actions
Inspector
Responsive overflow
Virtualization for large datasets

---

# Accessibility

WCAG AA minimum.
Keyboard-first.
Visible focus.
Proper ARIA.
Screen-reader labels.
200% zoom support.

No accessibility regression is acceptable.

---

# Responsive Standards

Supported breakpoints

320
375
390
414
768
1024
1280
1440
1920
Ultra-wide

No horizontal scrolling.

---

# Motion

Animation must communicate state.
Never animate for decoration.

Maximum duration
300ms

Preferred
Opacity
Transform
Scale

Never animate layout unnecessarily.

---

# Performance Budget

LCP
<2.5s

CLS
<0.05

INP
<200ms

Avoid

Large bundles
Repeated renders
Waterfalls
Blocking hydration

---

# Navigation

Navigation must be

Predictable
Consistent
Persistent
Recoverable

Users must never feel lost.

---

# Error Handling

Every screen supports

Loading
Empty
Error
Offline
Unauthorized
Forbidden
Maintenance
Success

---

# Engineering Rules

Never duplicate components.
Never duplicate layouts.
Never duplicate business UI.
Always extend existing patterns.

---

# Architecture Rules

Frontend consumes

Read Models
Facades
Immutable DTOs

Never

Direct Prisma
Business engines
Domain mutations

---

# Testing Standards

Every feature must pass

Accessibility
Responsive
QA
Performance
Journey
Consistency
Release Review

---

# Frontend Agents

Every implementation must satisfy

Agent 01 - Design System
Agent 02 - Workspace
Agent 03 - Components
Agent 04 - Interactions
Agent 05 - CRUD
Agent 06 - Dashboards
Agent 07 - Accessibility
Agent 08 - Motion
Agent 09 - Performance
Agent 10 - QA
Agent 11 - Design Audit
Agent 12 - Journey Review
Agent 13 - Release Approval

---

# Definition of Done

No frontend task is complete until

✓ Build passes
✓ Lint passes
✓ TypeScript passes
✓ Responsive verified
✓ Accessibility verified
✓ Performance verified
✓ QA passed
✓ Design review passed
✓ Journey review passed
✓ Release Guardian approved

---

# Immutable Rules

Never introduce a new design language.
Never bypass the Design System.
Never create duplicate UI patterns.
Never sacrifice accessibility.
Never sacrifice consistency.
Never prioritize speed of development over long-term maintainability.

Every screen must feel like it belongs to the same product.
