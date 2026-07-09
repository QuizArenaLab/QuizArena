
# QuizArena Workspace Guidelines

**Version:** 1.0.0 (LOCKED)

**Status:** Production Standard

**Owner:** Frontend Architecture

**Applies To**

- Every Workspace
- Every Dashboard
- Every Internal Platform
- Every Super Admin Module
- Every SME Module
- Every Reviewer Module
- Every Future Workspace

---

# Purpose

This document defines the permanent Workspace Architecture for QuizArena.

Every workspace must share the same visual language, layout hierarchy, navigation model, interaction patterns, and information architecture.

Users should never feel like they are switching between different applications.

Every workspace must feel like another section of the same enterprise platform.

---

# Workspace Philosophy

Every workspace should be

Simple

Predictable

Scalable

Professional

Task-focused

Data-driven

Consistent

Enterprise-grade

---

# Workspace Principles

Every workspace must

Follow the same layout

Use the same navigation

Use the same toolbar pattern

Use the same page hierarchy

Use the same CRUD patterns

Use the same dashboard structure

Use the same inspector pattern

Use the same filters

Use the same loading states

Use the same error handling

---

# Official Workspace Hierarchy

Every workspace follows

```
Workspace

↓

Workspace Dashboard

↓

Entity List

↓

Entity Details

↓

Create / Edit

↓

Reports

↓

Settings
```

Never change this order.

---

# Workspace Layout

Every workspace must follow

```
App Shell

↓

Sidebar

↓

Top Navigation

↓

Workspace Header

↓

Breadcrumb

↓

Toolbar

↓

Filters

↓

Content Area

↓

Inspector Drawer

↓

Pagination

↓

Footer
```

This hierarchy is LOCKED.

---

# Sidebar

Every workspace sidebar includes

Workspace Name

Primary Navigation

Grouped Navigation

Quick Access

Collapse Support

Environment Badge

Version Footer

Never place actions inside the sidebar.

---

# Top Navigation

Every workspace top navigation includes

Platform Logo

Workspace Switcher

Global Search

Command Palette

Notifications

User Menu

Platform Status

Never remove these items.

---

# Workspace Header

Every workspace header contains

Title

Description

Primary Action

Secondary Actions

Status

Health Indicator (if applicable)

---

# Breadcrumb

Every page below the workspace dashboard must display

Home

↓

Workspace

↓

Section

↓

Current Page

Breadcrumbs are mandatory.

---

# Toolbar

Every data page includes

Primary Action

Search

Filters

Sort

Bulk Actions

Refresh

Export

Settings (if applicable)

Toolbar actions should always appear in the same order.

---

# Filters

Filters appear below the toolbar.

Supported filter types

Search

Dropdown

Multi Select

Date Range

Status

Owner

Tags

Saved Filters

Filters must never appear inside the content table.

---

# Content Area

Content is the primary focus.

Supported layouts

Dashboard

Table

Grid

Timeline

Kanban

Wizard

Analytics

Split View

Never mix unrelated layouts.

---

# Inspector Drawer

Inspector is the default method for viewing details.

Inspector must

Open without leaving the current page

Be read-only by default

Support tabs

Support history

Support audit

Support related entities

Editing occurs through dedicated actions.

---

# Dashboard Standards

Every workspace dashboard includes

Overview Metrics

Recent Activity

Quick Actions

Health

Insights

Alerts (if applicable)

Recent Changes

Upcoming Tasks

Never overload dashboards.

---

# Entity List Pages

Every entity list includes

Toolbar

Search

Filters

Table

Pagination

Bulk Actions

Inspector

Export

Empty State

Loading State

Error State

---

# Entity Detail Pages

Every detail page follows

Header

↓

Summary

↓

Tabs

↓

Timeline

↓

Related Records

↓

Audit

↓

Footer Actions

---

# Create/Edit Pages

Every create or edit flow uses

Drawer

Wizard

Dedicated Page

depending on complexity.

Large forms should never use modal dialogs.

---

# Wizard Standard

Every wizard follows

Introduction

↓

Configuration

↓

Validation

↓

Review

↓

Confirmation

Support

Next

Back

Cancel

Save Draft

Resume

---

# Tabs

Tabs must be

Persistent

Predictable

Consistently ordered

Avoid nested tabs.

---

# Timelines

Supported timelines

Activity

Audit

Approval

Competition

Payment

Communication

Lifecycle

Timelines must always be chronological.

---

# Empty States

Every empty state includes

Title

Description

Primary Action

Optional Secondary Action

Helpful guidance

Never show blank pages.

---

# Loading States

Always use

Skeletons

Progress Indicators

Optimistic Rendering where appropriate

Never use blank loading screens.

---

# Error States

Every page supports

Retry

Refresh

Help

Support Link (optional)

Errors should be actionable.

---

# Search

Every workspace supports

Search

Recent Searches

Keyboard Shortcut

Search History

Search must remain visible.

---

# Command Palette

Every workspace integrates with

Global Command Palette

Workspace Commands

Quick Navigation

Quick Actions

---

# Notifications

Workspace notifications must

Be contextual

Be actionable

Support navigation

Support read/unread

---

# Page Width

Preferred maximum width

container-base

Dashboards

Full Width

Forms

Medium Width

Reports

Wide Layout

---

# Responsive Behaviour

Desktop

Primary experience

Tablet

Fully supported

Mobile

Simplified but complete

No horizontal scrolling.

---

# Workspace Navigation

Never exceed three navigation levels.

Example

Workspace

↓

Section

↓

Entity

Avoid deeper nesting.

---

# Page Density

Use comfortable spacing.

Preferred

gap-6

p-6

space-y-6

Avoid dense enterprise interfaces.

---

# Workspace Types

Supported

Dashboard Workspace

CRUD Workspace

Analytics Workspace

Reporting Workspace

Operations Workspace

Configuration Workspace

Studio Workspace

Review Workspace

Timeline Workspace

---

# Standard Workspaces

QuizArena officially supports

Super Admin

Competition Studio

Questions

Identity

Revenue

Governance

Analytics

Operations

Communication

Reporting

Certificates

Runtime

Results

Leaderboards

Future workspaces must follow the same structure.

---

# Workspace States

Every workspace supports

Loading

Ready

Partial

Offline

Maintenance

Unauthorized

Forbidden

Empty

Error

Success

---

# Accessibility

Every workspace supports

Keyboard Navigation

Screen Readers

Visible Focus

ARIA

200% Zoom

Reduced Motion

---

# Performance

Every workspace must

Use lazy loading

Use read models

Support virtualization

Avoid unnecessary rendering

Avoid duplicate fetching

---

# Navigation Rules

Users must always know

Where they are

What they can do

How to return

How to complete the task

No page should become a dead end.

---

# Design Consistency

Every workspace must

Use identical spacing

Use identical headers

Use identical toolbars

Use identical tables

Use identical cards

Use identical drawers

Use identical timelines

Consistency is mandatory.

---

# Workspace Review Checklist

Every workspace must pass

✓ Layout Review

✓ Navigation Review

✓ Toolbar Review

✓ CRUD Review

✓ Dashboard Review

✓ Accessibility Review

✓ Responsive Review

✓ Performance Review

✓ Journey Review

✓ QA Review

---

# Definition of Done

A workspace is complete only if

✓ Uses the standard layout

✓ Uses standard navigation

✓ Uses standard components

✓ Uses standard toolbar

✓ Uses standard filters

✓ Uses inspector drawer

✓ Supports loading states

✓ Supports empty states

✓ Supports error states

✓ Responsive

✓ Accessible

✓ Uses immutable read models

✓ Passes QA

✓ Passes Design Review

✓ Approved by Release Guardian

---

# Final Rule

Every QuizArena workspace is part of one unified enterprise platform.

A user should be able to move from Revenue to Operations, Governance, Questions, Reporting, or Analytics without learning a new interface.

Consistency across workspaces is a permanent architectural requirement.
