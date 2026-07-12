"use client";
import React from "react";
import { useAuth } from "../providers/AuthProvider";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth();
  if (status === "INITIAL" || status === "AUTHENTICATING") return <div>Loading...</div>;
  if (status !== "AUTHENTICATED") return null;
  return <>{children}</>;
};
