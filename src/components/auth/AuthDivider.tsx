"use client";

interface AuthDividerProps {
  text?: string;
}

export default function AuthDivider({ text = "or continue with" }: AuthDividerProps) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-t border-accent/40" />
      <span className="mx-4 flex-shrink-0 text-xs font-medium text-navy/40 uppercase tracking-wide">
        {text}
      </span>
      <div className="flex-grow border-t border-accent/40" />
    </div>
  );
}
