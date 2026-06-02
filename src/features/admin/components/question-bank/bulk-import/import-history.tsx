"use client";

import { useEffect, useState } from "react";
import { getImportHistory } from "@/features/admin/services/bulk-import";
import { format } from "date-fns";
import { FileDown, RefreshCw, AlertCircle } from "lucide-react";

interface ImportJob {
  id: string;
  uploadedBy: { name: string | null; email: string | null };
  fileName: string;
  fileType: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  errorReport: any;
}

export function ImportHistory() {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await getImportHistory();
    if (res.success && res.jobs) {
      setJobs(res.jobs as unknown as ImportJob[]);
      setError(null);
    } else {
      setError(res.error || "Failed to load history");
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const res = await getImportHistory();
      if (!mounted) return;
      if (res.success && res.jobs) {
        setJobs(res.jobs as unknown as ImportJob[]);
        setError(null);
      } else {
        setError(res.error || "Failed to load history");
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const downloadErrorReport = (job: ImportJob) => {
    if (!job.errorReport) return;

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(job.errorReport, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `error-report-${job.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
      case "PARTIAL_SUCCESS":
        return "text-amber-600 bg-amber-500/10 border-amber-500/20";
      case "FAILED":
        return "text-red-600 bg-red-500/10 border-red-500/20";
      case "PROCESSING":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  if (loading && jobs.length === 0) {
    return <div className="text-sm text-muted-foreground animate-pulse">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="bg-destructive/15 text-destructive p-4 rounded-md border border-destructive/20 flex flex-col gap-1">
        <h5 className="font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Error Loading History
        </h5>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Import History</h3>
        <button
          onClick={fetchHistory}
          className="text-sm flex items-center text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No import jobs found.</p>
      ) : (
        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Rows (Valid/Total)</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{job.fileName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-500 font-medium">{job.validRows}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-foreground">{job.totalRows}</span>
                        {job.invalidRows > 0 && (
                          <span className="text-red-500 text-xs ml-2">
                            ({job.invalidRows} invalid)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(job.startedAt), "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {job.uploadedBy?.name || job.uploadedBy?.email || "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      {job.errorReport && (
                        <button
                          onClick={() => downloadErrorReport(job)}
                          className="flex items-center text-amber-500 hover:text-amber-400 text-xs font-medium"
                          title="Download Error Report"
                        >
                          <FileDown className="w-4 h-4 mr-1" /> Errors
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
