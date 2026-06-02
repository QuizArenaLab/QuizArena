"use client";

import clsx from "clsx";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={clsx(
        "w-full max-w-md rounded-2xl bg-white p-8 sm:p-10",
        "border border-accent/30 shadow-xl shadow-navy/5",
        className
      )}
    >
      {children}
    </div>
  );
}
