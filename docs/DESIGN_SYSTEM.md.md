
# QuizArena Design System

**Version:** 1.0.0 (LOCKED)

**Status:** Production Standard

**Owner:** QuizArena Frontend Architecture

**Applies To:**

- All Frontend Developers
- All Antigravity Frontend Agents
- All Future UI Components
- All Workspaces
- All Public Pages
- All Internal Dashboards

---

# Purpose

This document defines the official visual language of QuizArena.

Every page, component, dashboard, dialog, and interaction must strictly follow this document.

No frontend implementation may introduce its own design language.

This document is subordinate only to `FRONTEND_CONSTITUTION.md`.

---

# Design Philosophy

QuizArena is an Enterprise SaaS Platform.

It is designed to feel

- Professional
- Clean
- Fast
- Analytical
- Premium
- Trustworthy
- Focused

The UI must never feel

- Playful
- Decorative
- Cartoonish
- Flashy
- Experimental
- Overdesigned
- Gaming-oriented

Our inspiration comes from products such as

- Stripe Dashboard
- Linear
- Vercel
- GitHub
- Notion
- Microsoft 365 Admin
- Azure Portal

---

# Design Principles

Every interface should maximize

- Clarity
- Readability
- Predictability
- Consistency
- Accessibility
- Performance
- Simplicity

Always prefer

Whitespace

Over borders

Hierarchy

Over decoration

Structure

Over effects

Consistency

Over novelty

---

# Theme

Theme Mode

Light Mode ONLY

Dark Mode is NOT supported in Version 1.

---

# Brand Personality

Minimal

Analytical

Modern

Professional

Confident

Reliable

Scalable

---

# Typography

## Primary Font

Hanken Grotesk

Loaded using

next/font/google

Fallback

sans-serif

---

## Typography Hierarchy

### Display

Used only for landing pages

Never inside dashboards

---

### Heading 1

Primary page title

One per page

---

### Heading 2

Section title

---

### Heading 3

Card title

---

### Heading 4

Widget title

---

### Body

Primary readable content

---

### Caption

Metadata

Hints

Helper text

---

### Numeric Data

Large KPI values

Financial values

Percentages

Analytics

Always use tabular alignment when possible.

---

# Color System

These colors are LOCKED.

No additional brand colors may be introduced.

---

## Primary Orange

HEX

#E6701E

Purpose

Primary CTA

Primary Actions

Highlights

Progress

Accuracy

Status

Never use for large backgrounds.

---

## Secondary Blue

HEX

#2471E7

Purpose

Analytics

Charts

Links

Secondary Actions

Information

---

## Soft Accent

HEX

#D5DBFD

Purpose

Hover

Containers

Progress Tracks

Soft Backgrounds

Selection

---

## Deep Navy

HEX

#0A1C40

Purpose

Headings

Primary Text

Icons

Navigation

Charts

---

## White

HEX

#FFFFFF

Purpose

Primary Background

Cards

Dialogs

Tables

Panels

---

# Neutral Palette

Use Tailwind neutral scale.

Avoid custom grays.

Use neutrals for

Borders

Dividers

Secondary Text

Disabled States

Skeletons

Backgrounds

---

# Semantic Colors

Use semantic colors only.

Success

Green

Warning

Amber

Error

Red

Information

Blue

Never invent new semantic shades.

---

# Shadows

Use subtle elevation only.

Cards

Small Shadow

Dialogs

Medium Shadow

Dropdowns

Medium Shadow

Never use heavy shadows.

---

# Border Radius

Global Standard

rounded-xl

Small Elements

rounded-lg

Badges

rounded-full

Never mix random radius values.

---

# Borders

Prefer

1px

Subtle

Neutral

Never solve layout problems with borders.

Whitespace is preferred.

---

# Icons

Use one icon library across the application.

Recommended

Lucide React

Rules

Consistent sizes

Consistent stroke widths

Never mix icon libraries.

---

# Spacing System

Use Tailwind spacing scale only.

Preferred

p-6

px-6

py-6

gap-6

space-y-6

space-x-6

Secondary spacing

4

8

12

16

24

32

48

64

Avoid arbitrary spacing values.

---

# Layout

Every workspace follows

Header

↓

Breadcrumb

↓

Toolbar

↓

Filters

↓

Content

↓

Inspector

↓

Footer

Never change this hierarchy.

---

# Grid System

Use CSS Grid whenever possible.

Dashboards

12-column grid

Cards

Responsive Grid

Forms

2-column layout on desktop

1-column on mobile

---

# Cards

Cards are the primary container.

Every card should include

Padding

Rounded corners

Subtle border

Optional shadow

Optional hover state

Never nest cards unnecessarily.

---

# Buttons

Supported Variants

Primary

Secondary

Outline

Ghost

Danger

Link

Loading

Disabled

Sizes

Small

Medium

Large

All buttons must support

Keyboard Focus

Loading

Disabled

Icons

---

# Forms

Every form must support

Validation

Labels

Helper Text

Error Messages

Required Indicators

Loading State

Disabled State

Keyboard Navigation

---

# Tables

Enterprise tables must support

Sorting

Filtering

Search

Pagination

Bulk Selection

Inspector Drawer

Sticky Headers

Responsive Overflow

Large tables must use virtualization.

---

# Dialogs

Every dialog includes

Title

Description

Primary Action

Secondary Action

Close

Keyboard Support

Escape Key

Focus Trap

---

# Drawers

Preferred over dialogs for

CRUD

Editing

Inspector

Large forms

---

# Dashboard Standards

Every dashboard includes

KPIs

Charts

Recent Activity

Quick Actions

Health Indicators

Loading States

Empty States

Error States

---

# Charts

Charts must prioritize readability.

Supported

Line

Bar

Area

Pie

Donut

Stacked Bar

Heatmap

Never use 3D charts.

Never use unnecessary gradients.

---

# Empty States

Every empty state includes

Illustration (optional)

Title

Description

Primary Action

Secondary Action (optional)

---

# Loading States

Always prefer Skeletons.

Never use blank screens.

Loading indicators should preserve layout.

---

# Error States

Every error state includes

Problem

Reason (if appropriate)

Recovery Action

Retry

Support Link (optional)

---

# Motion Principles

Motion communicates state.

Never animate for decoration.

Preferred

Opacity

Transform

Scale

Maximum duration

300ms

Never animate layout unnecessarily.

---

# Responsive Breakpoints

Supported widths

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

Every screen must remain fully usable.

---

# Accessibility

Minimum Standard

WCAG AA

Requirements

Visible Focus

Keyboard Navigation

ARIA Labels

Screen Reader Support

Contrast Compliance

Reduced Motion Support

---

# Design Tokens

All colors

Spacing

Typography

Radius

Shadows

Transitions

must originate from the global design token system.

Never hardcode values inside components.

---

# Design Consistency Rules

Every new UI must

Match typography

Match spacing

Match colors

Match elevation

Match border radius

Match interaction patterns

Match component behaviors

Consistency is mandatory.

---

# Version Control

Current Version

1.0.0

This design system is LOCKED.

Any future modification requires

Design Review

Architecture Review

Release Approval

Before becoming official.

---

# Definition of Done

A UI implementation is complete only if

✓ Uses approved colors

✓ Uses approved typography

✓ Uses approved spacing

✓ Uses approved components

✓ Uses approved layouts

✓ Uses approved interactions

✓ Is responsive

✓ Meets accessibility requirements

✓ Passes design review

✓ Passes release review

---

# Final Rule

QuizArena must always look like a single enterprise platform.

No page should appear as if it was designed independently.

Visual consistency is considered a core product feature.
