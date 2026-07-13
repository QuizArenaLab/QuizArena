# Enterprise Automation Specifications

This directory contains the immutable automation rules governing how AI workers coordinate, exchange artifacts, validate dependencies, enforce engineering gates, and progress software sprints from planning to lock within the AI SDLC.

Automation Specifications define process orchestration, not implementation behavior. They govern execution order, dependencies, inputs, outputs, workflow transitions, failure handling, and sprint progression.

## Core Principles
1. **Automation orchestrates, Workers execute:** Automation governs workflow execution, not software implementation. AI workers remain independent specialists.
2. **Event-driven execution:** Automation operates through artifact availability and state transitions.
3. **Immutability:** Automation shall never bypass the Constitution, Engineering Standards, Verification Checklists, Architecture Review, or QA Review.
4. **Platform Neutrality:** Automation rules are agnostic to the underlying orchestration engine.

## Immutable Artifact Identity
Every artifact produced in this SDLC must include the following metadata block for traceability:
- `Sprint ID`
- `Sprint Version`
- `Artifact Version`
- `Worker`
- `Timestamp`
