import { auth } from "./auth";
import { cache } from "react";
import { redirect } from "next/navigation";

// Memoize the session retrieval so we can call it multiple times per request safely
export const getSession = cache(async () => {
  return await auth();
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

export const requireUser = cache(async (redirectTo: string = "/login") => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
});

export const requireAdmin = cache(async (redirectTo: string = "/") => {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect(redirectTo);
  }
  return user;
});
