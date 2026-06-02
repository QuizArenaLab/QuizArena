"use client";

interface AuthDividerProps {
  text?: string;
}

export default function AuthDivider({ text = "or continue with" }: AuthDividerProps) {
  return (
    <div className="relative flex items-center py-2 animate-in fade-in duration-700 delay-500 fill-mode-both">
      <div className="grow border-t border-accent/40" />
      <span className="mx-4 shrink-0 text-xs font-bold text-navy/60 uppercase tracking-widest">
        {text}
      </span>
      <div className="grow border-t border-accent/40" />
    </div>
  );
}
