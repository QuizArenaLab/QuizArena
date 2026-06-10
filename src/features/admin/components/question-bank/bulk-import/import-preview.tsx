"use client";

import { useState } from "react";
import { ValidatedRow } from "@/features/admin/services/question-bank/bulk-import";
import { executeBulkImport, getImportJobStatus } from "@/features/admin/services/bulk-import";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ImportPreviewProps {
  fileMetadata: { fileName: string; fileType: string; fileSize: number };
  rows: ValidatedRow[];
  onComplete: () => void;
  onCancel: () => void;
}

export function ImportPreview({ fileMetadata, rows, onComplete, onCancel }: ImportPreviewProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    percentage: number;
    processed: number;
    total: number;
    status: string;
  } | null>(null);

  const validRowsCount = rows.filter((r) => r.status === "VALID").length;
  const warningRowsCount = rows.filter((r) => r.status === "WARNING").length;
  const blockedRowsCount = rows.filter((r) => r.status === "BLOCKED").length;

  const totalHealthScore = rows
    .filter((r) => r.status !== "BLOCKED")
    .reduce((sum, r) => sum + (r.healthScore || 0), 0);
  const averageHealth =
    validRowsCount + warningRowsCount > 0
      ? Math.round(totalHealthScore / (validRowsCount + warningRowsCount))
      : 0;

  const [filter, setFilter] = useState<"ALL" | "VALID" | "WARNING" | "BLOCKED" | "DUPLICATES">(
    "ALL"
  );

  const filteredRows = rows.filter((row) => {
    if (filter === "ALL") return true;
    if (filter === "VALID") return row.status === "VALID";
    if (filter === "WARNING") return row.status === "WARNING";
    if (filter === "BLOCKED") return row.status === "BLOCKED";
    if (filter === "DUPLICATES") return row.duplicateCheck && row.duplicateCheck.status !== "NONE";
    return true;
  });

  const handleExecute = async (mode: "VALID_ONLY" | "VALID_AND_WARNINGS") => {
    const rowsToImport = rows.filter(
      (r) => r.status === "VALID" || (mode === "VALID_AND_WARNINGS" && r.status === "WARNING")
    );
    if (rowsToImport.length === 0) return;

    setIsExecuting(true);
    setError(null);

    const res = await executeBulkImport(rowsToImport, fileMetadata);

    if (res.success && res.jobId) {
      setActiveJobId(res.jobId);
      setProgress({ percentage: 0, processed: 0, total: rowsToImport.length, status: "QUEUED" });

      const pollInterval = setInterval(async () => {
        const statusRes = await getImportJobStatus(res.jobId!);
        if (statusRes.success && statusRes.job) {
          setProgress({
            percentage: statusRes.job.progressPercentage,
            processed: statusRes.job.processedRows,
            total: statusRes.job.totalRows,
            status: statusRes.job.status,
          });

          if (["COMPLETED", "FAILED", "CANCELLED"].includes(statusRes.job.status)) {
            clearInterval(pollInterval);
            setIsExecuting(false);
            if (statusRes.job.status === "FAILED") {
              setError(statusRes.job.failureReason || "Import failed during processing.");
            } else {
              onComplete();
            }
          }
        }
      }, 2000);
    } else {
      setError(res.error || "Failed to execute import");
      setIsExecuting(false);
    }
  };

  const handleDownloadErrors = () => {
    const errorRows = rows.filter((r) => r.status === "BLOCKED" || r.status === "WARNING");
    if (errorRows.length === 0) return;

    const csvContent = [
      ["Row Number", "Question", "Category", "Status", "Issues", "Duplicate Code"],
      ...errorRows.map((r) => [
        r.rowNumber,
        `"${(r.parsedData?.question || r.data.question || "").replace(/"/g, '""')}"`,
        r.parsedData?.category || r.data.category || "",
        r.status,
        `"${(r.issues || [])
          .map((i) => `[${i.severity}] ${i.message}`)
          .join("\n")
          .replace(/"/g, '""')}"`,
        r.duplicateCheck?.duplicateCode || "",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `import_report.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Import Preview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review the uploaded data before importing. Only valid rows will be imported.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isExecuting}
            className="px-4 py-2 border border-border/50 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {blockedRowsCount + warningRowsCount > 0 && (
            <button
              onClick={handleDownloadErrors}
              className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Download Error Report
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleExecute("VALID_ONLY")}
              disabled={validRowsCount === 0 || isExecuting}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center"
            >
              {isExecuting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Import Valid Only ({validRowsCount})
            </button>
            <button
              onClick={() => handleExecute("VALID_AND_WARNINGS")}
              disabled={validRowsCount + warningRowsCount === 0 || isExecuting}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center"
            >
              Import Valid + Warnings ({validRowsCount + warningRowsCount})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 border border-border/50 rounded-xl bg-card/50">
          <div className="text-2xl font-semibold text-foreground">{rows.length}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
            Uploaded
          </div>
        </div>
        <div className="p-4 border border-border/50 rounded-xl bg-card/50 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
          <div>
            <div className="text-2xl font-semibold text-foreground">{validRowsCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
              Ready
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/50 rounded-xl bg-card/50 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <div className="text-2xl font-semibold text-foreground">{warningRowsCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
              Warnings
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/50 rounded-xl bg-card/50 flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <div className="text-2xl font-semibold text-foreground">{blockedRowsCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
              Blocked
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/50 rounded-xl bg-card/50">
          <div className="text-2xl font-semibold text-foreground">{averageHealth}%</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
            Avg Health
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border/50 pb-4">
        {["ALL", "VALID", "WARNING", "BLOCKED", "DUPLICATES"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {isExecuting && progress && (
        <div className="p-6 border border-border/50 rounded-xl bg-card/50 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground">
              Importing Questions... ({progress.status})
            </span>
            <span className="text-muted-foreground">
              {progress.processed} / {progress.total} rows
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Row</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-medium min-w-[300px]">Question</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Category</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Difficulty</th>
                <th className="px-4 py-3 font-medium min-w-[300px]">Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${row.status === "BLOCKED" ? "bg-red-500/5" : row.status === "WARNING" ? "bg-amber-500/5" : "hover:bg-muted/30"}`}
                >
                  <td className="px-4 py-3 text-muted-foreground font-mono">{row.rowNumber}</td>
                  <td className="px-4 py-3">
                    {row.status === "VALID" ? (
                      <span className="flex items-center text-emerald-500 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Valid
                      </span>
                    ) : row.status === "WARNING" ? (
                      <span className="flex items-center text-amber-500 font-medium">
                        <AlertTriangle className="w-4 h-4 mr-1.5" /> Warning
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500 font-medium">
                        <XCircle className="w-4 h-4 mr-1.5" /> Blocked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="line-clamp-2 text-foreground"
                      title={row.parsedData?.question || row.data.question || "N/A"}
                    >
                      {row.parsedData?.question || row.data.question || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.parsedData?.category || row.data.category || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-md border border-border/50 bg-background/50 text-muted-foreground">
                      {row.parsedData?.difficulty || row.data.difficulty || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.issues && row.issues.length > 0 ? (
                      <ul className="space-y-1">
                        {row.issues.map((issue, i) => (
                          <li
                            key={i}
                            className={`text-xs flex items-start gap-1 ${issue.severity === "ERROR" ? "text-red-500" : "text-amber-500"}`}
                          >
                            {issue.severity === "ERROR" ? (
                              <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                            )}
                            <span>
                              {issue.message}
                              {issue.suggestedFix && (
                                <span className="block opacity-80 mt-0.5">
                                  Fix: {issue.suggestedFix}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-xs">No Issues</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
