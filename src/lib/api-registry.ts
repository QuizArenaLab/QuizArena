/**
 * QuizArena — Protected API Routes Index
 *
 * Centralized documentation and validation for all
 * protected API routes. Each route must use validateApiRequest().
 */

/**
 * Protected API Endpoints Registry
 *
 * Route                          | Method | Auth  | Description
 * ------------------------------ | ------ | ----- | -----------
 * /api/user/me                   | GET    | USER  | Get authenticated user profile
 * /api/me                        | GET    | USER  | Lightweight auth check
 * /api/quizzes                   | GET    | USER  | List available quizzes (future)
 * /api/quizzes/:id/attempt       | POST   | USER  | Submit quiz attempt (future)
 * /api/challenges                | GET    | USER  | List challenges (future)
 * /api/leaderboard               | GET    | USER  | Get leaderboard data (future)
 * /api/subscription              | GET    | USER  | Get subscription status (future)
 * /api/subscription              | POST   | USER  | Manage subscription (future)
 * /api/admin/users               | GET    | ADMIN | List users (future)
 * /api/admin/challenges          | POST   | ADMIN | Create challenge (future)
 *
 * Pattern for new protected routes:
 * 1. Import validateApiRequest from @/lib/auth-utils
 * 2. Call it at the top of your handler
 * 3. If it returns a Response, return it (unauthorized/forbidden)
 * 4. Otherwise, use the returned user object for your logic
 * 5. Always return standardized JSON responses
 */

export const PROTECTED_API_REGISTRY = {
  prefix: "/api",
  routes: [
    { path: "/user/me", method: "GET", minRole: "USER" },
    { path: "/me", method: "GET", minRole: "USER" },
  ],
};
