# Deployment & Production Environment (Sprint 08)

## Goal
Prepare the QuizArena web application for production deployment. This involves creating Dockerfiles, CI/CD pipelines (e.g., GitHub Actions), database migration scripts for production, and environment variable templates for production hosting (like Vercel or AWS).

## Requirements
- Create a `Dockerfile` optimized for Next.js production.
- Create a `docker-compose.yml` for local production-like testing.
- Create a `.github/workflows/deploy.yml` for CI/CD.
- Document environment variables required for production (`.env.production.example`).
- Ensure database migration commands (`npx prisma migrate deploy`) are run during the build/deployment phase.

## Definition of Done
- The project can be successfully built and run using `docker compose up --build`.
- CI/CD workflow is defined and lints/builds on pull requests.
- Deployment instructions are documented.
