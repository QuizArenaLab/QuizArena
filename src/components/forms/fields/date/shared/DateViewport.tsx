import React, { ReactNode } from "react";

export interface DateViewportProps {
  children: ReactNode;
  className?: string;
}

export function DateViewport({ children, className = "" }: DateViewportProps) {
  return <div className={`overflow-hidden relative w-full ${className}`}>{children}</div>;
}
