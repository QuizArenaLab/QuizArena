"use client";
import React from "react";

export function ResultsRegion({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <div className="h-full border-none">{children}</div>
    </div>
  );
}
