"use client";

import { useEffect, useState } from "react";
import { getImportHistory, deleteImportHistory } from "@/features/admin/services/bulk-import";
import { format } from "date-fns";
import {
  FileDown,
  RefreshCw,
  AlertCircle,
  Trash2,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface ImportJob {
  id: string;
  uploadedBy: { name: string | null; email: string | null };
  fileName: string;
  fileType: string;
  totalRows: number;
  validRows: number;
  warningRows: number;
  duplicateRows: number;
  healthScore: number | null;
  averageQuality: number | null;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
}

export function ImportHistory() {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    // For now, downloading historical errors is not supported in the new schema without a dedicated endpoint to fetch ImportIssues.
    // We can just alert.
    alert("Historical error reports are coming soon.");
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    const res = await deleteImportHistory(jobToDelete);
    if (res.success) {
      setJobs(jobs.filter((j) => j.id !== jobToDelete));
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } else {
      alert(res.error || "Failed to delete record");
    }
    setIsDeleting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "FAILED":
        return "text-red-700 bg-red-50 border-red-200";
      case "RUNNING":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "QUEUED":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "CANCELLED":
        return "text-gray-700 bg-gray-100 border-gray-300";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading && jobs.length === 0) {
    return <div className="text-sm text-gray-500 animate-pulse">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex flex-col gap-1">
        <h5 className="font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Error Loading History
        </h5>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Import History</h3>
        <button
          onClick={fetchHistory}
          className="text-sm flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <FileSpreadsheet className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Import History Yet</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Upload a CSV template to start importing questions into the platform.
          </p>
          <button
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            className="btn btn-primary shadow-sm"
          >
            Upload Dataset
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">File</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Rows</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">
                    Health
                  </th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{job.fileName}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold tracking-wide ${getStatusColor(job.status)}`}
                      >
                        {job.status === "PARTIAL_SUCCESS" ? "REVIEW REQ." : job.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 text-xs font-medium">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {job.validRows} Imported
                        </div>
                        {job.warningRows > 0 && (
                          <div className="flex items-center gap-1.5 text-amber-600">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            {job.warningRows} Warnings
                          </div>
                        )}
                        {job.duplicateRows > 0 && (
                          <div className="flex items-center gap-1.5 text-blue-600">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {job.duplicateRows} Dupes Prevented
                          </div>
                        )}
                        {job.totalRows - job.validRows > 0 && (
                          <div className="flex items-center gap-1.5 text-red-600">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            {job.totalRows - job.validRows} Failed
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {job.healthScore !== null ? (
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-semibold text-gray-900">
                            Health: {job.healthScore}%
                          </span>
                          <span className="text-gray-500">Avg Qlty: {job.averageQuality}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                      {format(new Date(job.startedAt), "MMM d, yyyy HH:mm")}
                      <div className="mt-1 text-gray-400">
                        {job.uploadedBy?.name || job.uploadedBy?.email || "Unknown"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          className="text-gray-400 hover:text-secondary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadErrorReport(job)}
                          className="text-amber-500 hover:text-amber-600 transition-colors"
                          title="Download Error Report"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setJobToDelete(job.id);
                            setDeleteModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Import Record?</h3>
              <p className="text-sm text-gray-500">
                This action only removes the import history record from this table.{" "}
                <strong>Imported questions remain unchanged</strong> in the database.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setJobToDelete(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
