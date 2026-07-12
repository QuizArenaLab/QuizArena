"use client";
import React from "react";
import { QuizSession } from "../../../components/session";

export function SessionRegion({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  // Acts as a simple compositional boundary for the Session Platform
  return (
    <div className={`w-full h-full ${className}`}>
      <QuizSession className="h-full border-none">{children}</QuizSession>
    </div>
  );
}
