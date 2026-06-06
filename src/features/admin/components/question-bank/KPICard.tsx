import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant?: "primary" | "secondary";
  subtitle?: string;
  trend?: { value: number; label: string; positive: boolean };
}

export function KPICard({ label, value, icon: Icon, variant = "secondary", subtitle, trend }: KPICardProps) {
  const isPrimary = variant === "primary";

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 border
        ${isPrimary 
          ? "bg-white p-6 border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5" 
          : "bg-slate-50 p-5 border-slate-200/40 hover:bg-slate-100/50"
        }
      `}
    >
      {/* Subtle top gradient for primary cards */}
      {isPrimary && (
        <div className="absolute top-0 inset-x-0 h-[3px] bg-linear-to-r from-orange-500 to-orange-400" />
      )}
      
      <div className="flex items-start justify-between mb-4">
        <p className={`font-bold text-slate-500 uppercase tracking-widest ${isPrimary ? "text-xs" : "text-[11px]"}`}>{label}</p>
        <div className="p-1.5 bg-white rounded-lg border border-slate-200/60 shadow-sm text-slate-500 group-hover:text-slate-700 transition-colors">
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <p className={`font-extrabold tracking-tight text-slate-900 tabular-nums ${isPrimary ? "text-4xl" : "text-2xl"}`}>
          {value.toLocaleString()}
        </p>
        {(subtitle || trend) && (
          <div className="mt-3 flex items-center gap-2">
            {trend && (
              <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.positive ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-rose-50 text-rose-700 border border-rose-200/50"}`}>
                {trend.positive ? "+" : "-"}{trend.value}%
              </span>
            )}
            {subtitle && <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
