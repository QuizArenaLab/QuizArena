export const AuthConfig = {
  routes: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    callback: "/auth/callback",
    dashboard: "/dashboard",
  },
  protectedGroups: [
    "/dashboard",
    "/question-bank",
    "/quiz-builder",
    "/quiz-delivery",
    "/settings",
    "/profile",
  ],
  publicGroups: ["/login", "/register", "/forgot-password", "/reset-password", "/auth/callback"],
};
