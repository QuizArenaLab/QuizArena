# Launch Countdown — Day 1: Competition API Exposure

## What exactly will be implemented?
We will implement production-ready API endpoints to support the core lifecycle of a `Competition` (CRUD + Publish), alongside a minimal admin UI to verify these APIs.
The scope is strictly limited to basic operations on the `Competition` model.
* Out of scope: Razorpay, Assessment, Leaderboard, Certificates, Analytics.

## Which files will change?
### Backend (Domain Layer - `src/features/competitions/`)
- `types/dto.ts`: Define `CompetitionDTO`, `CreateCompetitionDTO`, `UpdateCompetitionDTO`.
- `validators/competition.schema.ts`: Zod schemas for request validation.
- `shared/mappers.ts`: Functions to map Prisma `Competition` model to `CompetitionDTO`.
- `repositories/competition.repository.ts`: Database access methods (`create`, `findAll`, `findById`, `update`).
- `services/competition.service.ts`: Business logic, enforcing state transitions (e.g., from `DRAFT` to `PUBLISHED`).

### Backend (API Routes - `src/app/api/`)
- `src/app/api/admin/competitions/route.ts`: `GET` (list) and `POST` (create).
- `src/app/api/admin/competitions/[id]/route.ts`: `GET` (detail) and `PUT` (update).
- `src/app/api/admin/competitions/[id]/publish/route.ts`: `POST` (publish action).

### Frontend (Admin UI - `src/app/admin/`)
- `src/app/admin/competitions/page.tsx`: Basic list view of competitions.
- `src/app/admin/competitions/new/page.tsx`: Simple form to create a competition.
- `src/app/admin/competitions/[id]/page.tsx`: Detail view with edit capability and a "Publish" button.

## Which architecture patterns must be followed?
- **Enterprise Core / Layered Architecture**: Strictly isolate responsibilities. API Route -> Service -> Repository.
- **Data Transfer Objects (DTOs)**: Ensure the API contract is cleanly separated from Prisma models.
- **Validation at the Boundary**: Use Zod to parse and validate incoming requests before hitting the service layer.
- **Mappers**: Transform database entities into DTOs before responding.

## What API contract will be exposed?
- `POST /api/admin/competitions`
  - Body: `title`, `slug`, `description`, `competitionType`, `durationMinutes`
  - Response: `CompetitionDTO`
- `GET /api/admin/competitions`
  - Query: `?page=1&limit=10`
  - Response: `{ data: CompetitionDTO[], total: number }`
- `GET /api/admin/competitions/[id]`
  - Response: `CompetitionDTO`
- `PUT /api/admin/competitions/[id]`
  - Body: Partial fields from Create.
  - Response: `CompetitionDTO`
- `POST /api/admin/competitions/[id]/publish`
  - Response: `CompetitionDTO` (with updated `lifecycleState`)

## Which repositories/services/controllers are involved?
- **CompetitionRepository**: Handles Prisma queries. Abstracts away database operations.
- **CompetitionService**: Coordinates repository calls and applies business rules.
- **Next.js Route Handlers**: Act as controllers, managing HTTP requests, validation, invoking the service, and returning standardized HTTP responses.

## What validations are required?
- `slug` must be formatted correctly.
- `title` is required.
- `durationMinutes` must be a positive integer.
- `competitionType` must be a valid enum (`CompetitionType`).
- **Publishing Validation**: A competition cannot be published if it lacks required fields or is already published.

## What tests/evidence are expected?
- TypeScript compilation must pass (`tsc --noEmit`).
- ESLint must pass (`npm run lint` or equivalent).
- The simple Admin UI must successfully perform CRUD and Publish actions against the APIs without 500 errors.
