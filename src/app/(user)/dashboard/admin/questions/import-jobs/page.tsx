import { Suspense } from "react";
import { getImportHistory } from "@/features/admin/services/bulk-import";
import { ClipboardList, CheckCircle2, XCircle, Clock, Loader2, AlertTriangle } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import Jobs | Question Bank",
  description: "Track all question import operations",
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Loader2 },
  COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  PARTIAL_SUCCESS: { label: "Partial", color: "bg-amber-100 text-amber-800", icon: AlertTriangle },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-800", icon: XCircle },
};

async function ImportJobsContent() {
  const result = await getImportHistory();
  const jobs = result.success ? (result.jobs ?? []) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Import Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track all bulk import operations and their results
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No import jobs found</p>
          <p className="text-xs text-gray-400 mt-1">
            Upload questions via the Import page to see jobs here
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Uploaded By
                </th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Valid
                </th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Failed
                </th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Created
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job: any) => {
                const config = statusConfig[job.status] || statusConfig.PENDING;
                const StatusIcon = config.icon;
                return (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-900 truncate block max-w-[200px]">
                        {job.fileName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {job.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-600">
                        {job.uploadedBy?.name || job.uploadedBy?.email || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-sm font-semibold text-gray-800 tabular-nums">
                        {job.totalRows ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center hidden md:table-cell">
                      <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                        {job.validRows ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center hidden md:table-cell">
                      <span className="text-sm font-semibold text-red-700 tabular-nums">
                        {job.invalidRows ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`${config.color} inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">
                        {new Date(job.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">
                        {job.completedAt
                          ? new Date(job.completedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ImportJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <ImportJobsContent />
    </Suspense>
  );
}
