# QuizArena Engineering Agent Instructions

# AGENTS.md

> **Status:** Approved
>
> **Scope:** QuizArena v1.0
>
> **Framework:** HC AI SDLC
>
> **Purpose:** Define the repository-wide operating rules, engineering standards, and mandatory behaviors that every AI agent and engineer must follow while contributing to this repository.

---

# Repository Identity

Project: QuizArena

Framework: HC AI SDLC

Status: Production Development

Repository Purpose:

- Build a production-ready QuizArena SaaS platform.
- Validate the HC AI SDLC through real-world software engineering.

---

# Repository Authority

Before performing any engineering work, always read the repository documentation in the following order.

1. HC AI Constitution
2. RP Engineering Standards
3. QA-001 Product Baseline
4. QA-002 Product Specification
5. QA-003 System Architecture
6. QA-004 Implementation Plan
7. QA-005 Verification Plan
8. QA-006 Deployment Plan
9. QA-007 Engineering Execution Guide
10. Current QA-007-FXX Feature Execution Artifact

If conflicts exist, higher-priority documentation takes precedence.

---

# Engineering Decision Registry

The following engineering decisions are permanent repository standards.

These decisions shall not be re-evaluated during feature implementation.

| Area             | Standard            |
| ---------------- | ------------------- |
| Package Manager  | npm                 |
| Framework        | Next.js App Router  |
| Language         | TypeScript          |
| Styling          | Tailwind CSS        |
| Database         | Supabase PostgreSQL |
| ORM              | Prisma              |
| Authentication   | Auth.js v5          |
| Validation       | Zod                 |
| Password Hashing | bcryptjs            |
| Deployment       | Vercel              |
| Email Service    | Amazon SES          |
| Route Protection | proxy.ts            |

---

# Mandatory Engineering Principles

Every implementation shall:

- Follow approved repository documentation.
- Follow the Engineering Decision Registry.
- Produce production-quality code.
- Maintain consistent architecture.
- Preserve repository standards.
- Avoid unnecessary complexity.
- Keep changes focused on the approved feature.
- Document engineering evidence where required.

---

# AI Agent Responsibilities

Every AI agent working in this repository shall:

- Read repository documentation before implementation.
- Respect approved feature scope.
- Never implement future features.
- Never modify locked engineering standards.
- Never bypass repository workflows.
- Never introduce undocumented behavior.
- Never duplicate existing functionality.
- Prefer consistency over personal preference.

---

## Implementation Planning Rules

Before implementation begins, every feature MUST include an approved Execution Blueprint inside the Implementation Plan.

The Execution Blueprint shall define:

- New Files
- Modified Files
- Folder Structure
- Database Changes
- Dependencies
- Environment Variables
- Naming Convention
- Scope Confirmation

Implementation shall not begin until the Execution Blueprint has been approved.

The engineering workflow itself is governed by **QA-007 Engineering Execution Guide**.

---

# Documentation Standards

Repository documentation is part of the implementation.

When required, update:

- Feature Execution Artifact
- Implementation Plan
- Observation Document
- Deployment Report
- Feature Completion Report
- Validation Report
- Backlog Item (if applicable)

Documentation shall remain synchronized with implementation.

---

# Coding Standards

Engineers and AI agents shall:

- Prefer readability over cleverness.
- Write modular, maintainable code.
- Use meaningful names.
- Avoid dead code.
- Avoid duplicated logic.
- Handle errors gracefully.
- Follow existing project structure.
- Preserve backward compatibility unless explicitly approved.

---

# Verification Standards

Before deployment:

- Ensure implementation is complete.
- Verify local build succeeds.
- Verify TypeScript passes.
- Verify linting passes.
- Verify database changes (if applicable).
- Verify required documentation has been updated.

Do not deploy code that has not been locally verified.

---

# Git Standards

Git is the permanent engineering memory of the repository.

Every feature should produce a clear engineering history.

Commits should:

- Represent one logical feature.
- Be descriptive.
- Include related documentation updates.

---

# Out of Scope

AI agents shall not:

- Change repository architecture without approval.
- Introduce new frameworks.
- Replace approved technologies.
- Modify Engineering Decision Registry.
- Skip required documentation.
- Skip engineering verification.
- Perform unrelated refactoring during feature implementation.

---

# Communication Standards

AI agents shall:

- Communicate clearly.
- State assumptions when necessary.
- Distinguish facts from recommendations.
- Request clarification when requirements are ambiguous.
- Base recommendations on repository standards rather than personal preference.

---

# Repository Goal

Every contribution should improve both:

1. QuizArena as a production SaaS product.
2. HC AI SDLC as a validated engineering methodology.

Neither objective takes precedence over the other.

---

# Workflow Authority

AGENTS.md defines repository operating rules.

QA-007 Engineering Execution Guide defines the engineering execution workflow.

If workflow guidance is required, QA-007 is the authoritative document.

---

# Revision History

| Version | Description                                                                        |
| ------- | ---------------------------------------------------------------------------------- |
| 1.0     | Initial repository operating rules                                                 |
| 2.0     | Standardized repository rules aligned with QA-007 Engineering Execution Guide v2.0 |

---

**End of Documen**

Version: 1.1

---

# Purpose

This repository follows the Human-Centered AI Software Development Lifecycle (HC AI SDLC).

AI coding agents shall operate as engineering collaborators that implement approved specifications.

AI agents shall not redesign the product, introduce undocumented functionality, or modify approved architectural decisions.

This document defines the mandatory engineering behavior for every AI coding session.

---

# Repository Authority

The following documents define implementation authority.

Priority (highest to lowest):

1. HC AI Constitution
2. RP Engineering Standards
3. QA-001 Product Baseline
4. QA-002 Product Specification
5. QA-003 System Architecture
6. QA-004 Implementation Plan
7. QA-005 Verification Plan
8. QA-006 Deployment Plan
9. QA-007 Engineering Execution Guide
10. QA-007 Feature Execution Artifact

If conflicts exist, higher-priority documents take precedence.

---

# Engineering Decision Registry

The following engineering decisions are approved and shall be treated as permanent project standards.

## Package Manager

- npm

---

## Framework

- Next.js App Router

---

## Language

- TypeScript

---

## Database

- Supabase PostgreSQL

---

## ORM

- Prisma ORM

---

## Authentication

- Auth.js v5

---

## Validation

- Zod

---

## Password Hashing

- bcryptjs

---

## Styling

- Tailwind CSS

---

## Deployment

- Vercel

---

## Transactional Email

- Amazon SES

Amazon SES shall be used for:

- Email Verification
- Forgot Password
- Password Reset
- Future transactional emails

Do not recommend alternative providers unless explicitly requested.

---

## Route Protection

Use:

```
proxy.ts
```

Do not create or use:

```
middleware.ts
```

`proxy.ts` is the approved implementation to prevent known build compatibility issues.

---

## Project Structure

Follow the approved repository structure.

Do not create new architectural folders without approval.

---

# Engineering Responsibilities

AI agents shall:

- Implement approved functionality.
- Follow approved architecture.
- Follow approved implementation plans.
- Generate production-ready code.
- Produce reusable components.
- Generate tests.
- Explain engineering decisions when requested.

AI agents shall never:

- Invent new requirements.
- Modify business rules.
- Redesign architecture.
- Implement future features.
- Remove approved functionality.
- Ignore verification requirements.

---

# Mandatory Engineering Workflow

Every implementation shall follow this workflow.

Step 1

Read all required QA documents.

↓

Step 2

Read the active QA-007 Feature Execution Artifact.

↓

Step 3

Read the Engineering Decision Registry.

↓

Step 4

Generate the implementation plan using:

```
docs/06-products/QuizArena/06-execution/templates/Implementation-Plan-Template.md
```

↓

Step 5

Present the implementation plan.

↓

Step 6

Wait for explicit approval.

↓

Step 7

Begin implementation.

Implementation shall never begin before approval.

---

# Implementation Planning Rules

Every implementation plan shall:

- Follow the repository template exactly.
- Preserve every section.
- Ask only unresolved questions.
- Treat Engineering Decision Registry items as approved decisions.
- Respect feature scope.
- Include implementation checkpoints.
- Include risks.
- Include rollback strategy.
- Include Definition of Done.
- Include Acceptance Mapping.

---

# Implementation Rules

Implementation shall:

- Remain within approved feature scope.
- Follow dependency order.
- Be incremental.
- Be production ready.
- Be modular.
- Be strongly typed.
- Include validation.
- Include secure error handling.
- Include tests where applicable.

---

# Engineering Principles

1. Approved documentation is the single source of truth.
2. Engineering implements approved decisions.
3. Every implementation shall be traceable.
4. Every engineering decision shall be explainable.
5. Small incremental implementation is preferred over monolithic implementation.
6. Production quality is mandatory.

---

# Feature Scope

Only the currently approved QA-007-FXX feature may be implemented.

Future features shall not be partially implemented.

If implementation depends on another feature that has not yet been completed, stop and report the dependency instead of implementing around it.

---

# Implementation Strategy

Preferred execution order:

1. Dependencies
2. Database
3. Services
4. Authentication / Business Logic
5. APIs
6. Route Protection
7. User Interface
8. Validation
9. Testing
10. Verification

Do not skip dependency order.

---

# Approval Gates

Approval is mandatory before:

- Database schema changes
- Authentication implementation
- API implementation
- Route protection
- UI implementation
- Deployment changes

If approval has not been granted, stop.

---

# Communication Style

Engineering communication shall be:

- Professional
- Precise
- Evidence-based
- Concise
- Transparent

If required information is missing:

Ask.

Do not assume.

---

# Code Generation Rules

Generate:

- Readable code
- Modular code
- Reusable code
- Strongly typed code
- Well-documented code

Avoid:

- Dead code
- Duplicate code
- Hidden assumptions
- Hardcoded secrets
- Magic values

---

# Verification

Every completed implementation shall satisfy:

- Functional Requirements
- Architecture Compliance
- Verification Plan
- Definition of Done

---

# Completion Criteria

A feature is complete only when:

- Implementation completed.
- Tests pass.
- Verification passes.
- Documentation updated.
- Build succeeds.
- No TypeScript errors.
- No ESLint errors.
- User approves completion.

Until then, the feature remains **In Progres**

# QuizArena Engineering Agent Instructions

Version: 1.0

---

# Purpose

This repository follows the Human-Centered AI Software Development Lifecycle (HC AI SDLC).

AI coding agents shall operate as engineering collaborators that implement approved specifications. AI agents shall not redesign the product, introduce undocumented functionality, or modify approved architectural decisions.

This document defines the mandatory engineering behavior for all AI agents contributing to this repository.

---

# Repository Authority

The following documents define the implementation authority.

Priority (highest to lowest):

1. HC AI Constitution
2. RP Engineering Standards
3. QA-001 Product Baseline
4. QA-002 Product Specification
5. QA-003 System Architecture
6. QA-004 Implementation Plan
7. QA-005 Verification Plan
8. QA-006 Deployment Plan
9. QA-007 Engineering Execution Guide
10. QA-007 Feature Execution Artifact

If conflicts exist, higher-priority documents take precedence.

---

# Engineering Responsibilities

AI agents shall:

- Implement approved functionality.
- Follow the approved architecture.
- Follow approved implementation plans.
- Generate maintainable production-quality code.
- Produce reusable components.
- Generate tests.
- Explain engineering decisions when requested.

AI agents shall never:

- Invent new requirements.
- Modify business rules.
- Redesign architecture.
- Implement future features.
- Remove approved functionality.
- Ignore verification requirements.

---

# Mandatory Engineering Workflow

Before writing code, every implementation shall follow this sequence.

Step 1

Read the relevant QA documents.

↓

Step 2

Read the current Feature Execution Artifact.

↓

Step 3

Generate an Implementation Plan using the repository template.

↓

Step 4

Present the plan for approval.

↓

Step 5

Wait for explicit user approval.

↓

Step 6

Begin implementation.

Implementation shall not begin before approval.

---

# Implementation Rules

Every implementation shall:

- Remain within approved feature scope.
- Follow dependency order.
- Be production ready.
- Be modular.
- Be strongly typed.
- Follow secure coding practices.
- Include validation.
- Include error handling.
- Include tests where applicable.

---

# Engineering Principles

1. Approved documentation is the single source of truth.
2. Every implementation shall be traceable.
3. Every implementation shall remain deterministic.
4. Every engineering decision shall be explainable.
5. Small incremental implementation is preferred over large monolithic changes.
6. Production quality is mandatory.

---

# Feature Scope

The active feature defines implementation boundaries.

Only the currently approved QA-007-FXX feature may be implemented.

Future features shall not be partially implemented.

---

# Implementation Plan

Every feature implementation shall begin by generating an implementation plan.

The implementation plan shall use:

```
docs/06-products/QuizArena/06-execution/templates/Implementation-Plan-Template.md
```

The template structure shall not be modified.

---

# Implementation Strategy

Implementation shall proceed incrementally.

Preferred order:

1. Foundation
2. Database
3. Services
4. APIs
5. Middleware
6. UI
7. Validation
8. Testing
9. Verification

Do not skip dependency order.

---

# Approval Gates

Approval is required before:

- Database schema changes
- Authentication implementation
- API implementation
- UI implementation
- Deployment changes

If approval has not been granted, stop.

---

# Communication Style

Engineering communication shall be:

- Professional
- Precise
- Evidence-based
- Concise
- Transparent

If information is missing:

Ask.

Do not assume.

---

# Code Generation Rules

Generate:

- Readable code
- Modular code
- Reusable code
- Well-documented code

Avoid:

- Dead code
- Duplicate code
- Hidden assumptions
- Magic values
- Hardcoded secrets

---

# Verification

Every completed implementation shall satisfy:

- Functional Requirements
- Architecture Compliance
- Verification Plan
- Definition of Done

---

# Completion Criteria

A feature is complete only when:

- Implementation completed.
- Tests pass.
- Verification passes.
- Documentation updated.
- User approves completion.

Until then, the feature remains In Progress.


## v1.0 Delivery Rule

During the QuizArena v1.0 sprint, optimize for feature completion rather than architectural perfection.

When an existing implementation satisfies the approved feature requirements and production quality standards, it shall be retained.

Refactoring, restructuring, and architectural improvements shall only be performed when they:
- Fix a production defect.
- Enable an approved feature.
- Resolve a security issue.
- Resolve a build or deployment failure.

All other improvements are deferred until QuizArena v2.0.
