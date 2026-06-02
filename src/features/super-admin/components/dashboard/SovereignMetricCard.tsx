import { DivideIcon as LucideIcon } from "lucide-react";

interface SovereignMetricCardProps {
  label: string;
  value: string | number;
  icon: typeof LucideIcon;
  trend?: "UP" | "DOWN" | "STABLE";
  severity?: "CRITICAL" | "WARNING" | "INFO" | "HEALTHY";
  description?: string;
  className?: string;
}

export function SovereignMetricCard({
  label,
  value,
  icon: Icon,
  trend,
  severity,
  description,
  className = "",
}: SovereignMetricCardProps) {
  let severityClasses = "border-slate-800/60 bg-slate-900/60 text-slate-400";
  let iconClasses = "bg-slate-800 text-slate-400";

  if (severity === "CRITICAL") {
    severityClasses = "border-red-900/40 bg-red-950/20";
    iconClasses = "bg-red-950 text-red-400";
  } else if (severity === "WARNING") {
    severityClasses = "border-amber-900/40 bg-amber-950/20";
    iconClasses = "bg-amber-950 text-amber-400";
  } else if (severity === "HEALTHY") {
    severityClasses = "border-emerald-900/40 bg-emerald-950/20";
    iconClasses = "bg-emerald-950 text-emerald-400";
  } else if (severity === "INFO") {
    severityClasses = "border-blue-900/40 bg-blue-950/20";
    iconClasses = "bg-blue-950 text-blue-400";
  }

  return (
    <div className={`p-5 rounded-xl border ${severityClasses} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{value}</h3>
            {trend && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  trend === "UP"
                    ? "bg-emerald-950/50 text-emerald-400"
                    : trend === "DOWN"
                      ? "bg-red-950/50 text-red-400"
                      : "bg-slate-800 text-slate-400"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${iconClasses}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
    </div>
  );
}
