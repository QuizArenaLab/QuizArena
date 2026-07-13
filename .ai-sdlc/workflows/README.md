# AI SDLC Enterprise Workflow Specifications

This directory contains the immutable operational workflows governing every engineering activity in the AI SDLC. It formalizes how work progresses across all stages, ensuring no worker skips required validations or reviews its own work.

## Governing Authority
All workflows are strictly governed by the AI SDLC Constitution:
[.ai-sdlc/constitution/AI-SDLC-v1.0.md](../constitution/AI-SDLC-v1.0.md)

## Purpose
Workflows define the execution state machine of the AI SDLC. They enforce strict sequencing of planning, implementation, evidence collection, architecture review, QA, documentation, repository updates, and sprint locking.

## Hierarchy and Orchestration
- **Chief Architect:** Highest technical authority.
- **Engineering Manager:** Operational authority responsible for workflow orchestration. Assigns stages and verifies transitions.
- **AI Workers (Engineers/Reviewers):** Execute their specific stages without overlapping responsibilities.

## Participating Workers
- Chief Architect
- Engineering Manager
- Implementation Engineer
- Evidence Engineer
- Architecture Reviewer
- Quality Assurance Engineer
- Documentation Engineer

## Overview of Workflows
- **SprintLifecycle.md:** The master state machine.
- **ReviewWorkflow.md:** Rules for reviewing implementation and architecture.
- **DocumentationWorkflow.md:** Guidelines for documenting sprint outputs.
- **ArtifactLifecycle.md:** The chronological lifecycle of required artifacts.
- **FailureWorkflow.md:** How the system handles rejections and rework.
- **ReReviewWorkflow.md:** The process for resolving failures.
- **LockWorkflow.md:** Requirements for officially locking a sprint.
- **VersionUpgradeWorkflow.md:** Process for updating SDLC components.
