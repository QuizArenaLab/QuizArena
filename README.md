# QuizArena Foundation

A production-grade Micro SaaS platform for government exam aspirants.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **ORM:** Prisma
- **Database:** Supabase (PostgreSQL)
- **Auth:** Auth.js (v5)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Utilities:** clsx, tailwind-merge

## Getting Started

### 1. Prerequisites

- Node.js (Latest LTS)
- Supabase Project

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### 3. Installation

```bash
npm install
```

### 4. Database Setup

Once environment variables are set, run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Development Workflow

```bash
npm run dev
```

## Folder Structure

```
src/
 ├── app/         # Next.js App Router (pages & layouts)
 ├── components/  # Shared UI components
 ├── features/    # Domain-specific features
 ├── lib/         # Shared libraries (prisma, supabase)
 ├── services/    # External service integrations
 ├── hooks/       # Custom React hooks
 ├── store/       # Zustand store definitions
 ├── types/       # Global TypeScript types
 ├── utils/       # Helper functions
 ├── styles/      # Global styles
 └── config/      # Application configuration
```

## Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npx prisma studio`: Open Prisma GUI
- `npx prisma migrate dev`: Run database migrations
