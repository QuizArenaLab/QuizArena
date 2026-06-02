import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { OperationalAlert } from "@/types/live-operations";
import { formatDistanceToNow } from "date-fns";

interface OperationalAlertsProps {
  alerts: OperationalAlert[];
}

export function OperationalAlerts({ alerts }: OperationalAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        let containerStyle = "bg-gray-50 border-gray-200";
        let icon = <Info className="w-5 h-5 text-gray-500" />;
        let titleStyle = "text-gray-900";

        if (alert.severity === "CRITICAL") {
          containerStyle = "bg-red-50 border-red-200 ring-1 ring-red-500/20";
          icon = <ShieldAlert className="w-5 h-5 text-red-600" />;
          titleStyle = "text-red-900";
        } else if (alert.severity === "WARNING") {
          containerStyle = "bg-amber-50 border-amber-200 ring-1 ring-amber-500/20";
          icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
          titleStyle = "text-amber-900";
        } else if (alert.title === "System Nominal") {
          containerStyle = "bg-green-50 border-green-200";
          icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
          titleStyle = "text-green-900";
        }

        return (
          <div key={alert.id} className={`p-4 rounded-xl border flex gap-3 ${containerStyle}`}>
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${titleStyle}`}>{alert.title}</h4>
                <span className="text-[10px] font-medium text-gray-500">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
