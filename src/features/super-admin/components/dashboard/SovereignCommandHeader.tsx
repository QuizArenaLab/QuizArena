import { ShieldAlert } from "lucide-react";

interface SovereignCommandHeaderProps {
  email: string | null;
}

export function SovereignCommandHeader({ email }: SovereignCommandHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/40 border border-red-800/40 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
              Sovereign Authority
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Command Center</h1>
        <p className="text-slate-500 text-sm">Strategic operational oversight — {email}</p>
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 md:max-w-xs">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium uppercase tracking-wider">
          Elevated authority active. Actions are logged and monitored.
        </p>
      </div>
    </div>
  );
}
