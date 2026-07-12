"use client";
import React from "react";
import { useAuth } from "../providers/AuthProvider";
import { UserRolePresentation } from "../UserRolePresentation";

export const RoleGuard: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRolePresentation[];
}> = ({ children, allowedRoles }) => {
  const { status, user } = useAuth();
  if (status === "INITIAL" || status === "AUTHENTICATING") return <div>Loading...</div>;
  if (status !== "AUTHENTICATED") return null;
  // Future: Check user.role against allowedRoles
  return <>{children}</>;
};
