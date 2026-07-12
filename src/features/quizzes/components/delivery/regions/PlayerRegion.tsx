"use client";
import React from "react";
import { QuestionPlayer } from "../../../components/player";

export function PlayerRegion({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  // Purely wraps Question Player
  return (
    <div className={`w-full h-full ${className}`}>
      <QuestionPlayer className="h-full border-none">{children}</QuestionPlayer>
    </div>
  );
}
