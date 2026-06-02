import { ServerCrash, AlertCircle } from "lucide-react";

export function FailureMonitor() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <ServerCrash className="w-4 h-4 text-red-500" />
        <h3 className="text-sm font-bold text-[#0A1C40]">Attempt Failures</h3>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-center">
        <AlertCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-gray-900">No Failures Detected</h4>
        <p className="text-xs text-gray-500 mt-1">Autosave and submission pipelines are stable.</p>
      </div>
    </div>
  );
}
