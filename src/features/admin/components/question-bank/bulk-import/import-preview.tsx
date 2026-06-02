"use client";

import { useState } from "react";
import { ValidatedRow } from "@/features/admin/services/question-bank/bulk-import";
import { executeBulkImport } from "@/features/admin/services/bulk-import";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ImportPreviewProps {
  jobId: string;
  rows: ValidatedRow[];
  onComplete: () => void;
  onCancel: () => void;
}

export function ImportPreview({ jobId, rows, onComplete, onCancel }: ImportPreviewProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validRowsCount = rows.filter((r) => r.isValid).length;
  const invalidRowsCount = rows.filter((r) => !r.isValid).length;
  const duplicateWarnings = rows.filter(
    (r) => r.duplicateCheck?.isNearDuplicate && r.isValid
  ).length;

  const handleExecute = async () => {
    if (validRowsCount === 0) return;
    setIsExecuting(true);
    setError(null);

    const res = await executeBulkImport(jobId, rows);

    if (res.success) {
      onComplete();
    } else {
      setError(res.error || "Failed to execute import");
      setIsExecuting(false);
    }
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
          <button
            onClick={handleExecute}
            disabled={validRowsCount === 0 || isExecuting}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${validRowsCount} Valid Rows`
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border border-border/50 rounded-xl bg-card/50 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
          <div>
            <div className="text-2xl font-semibold text-foreground">{validRowsCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
              Valid Rows
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/50 rounded-xl bg-card/50 flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <div className="text-2xl font-semibold text-foreground">{invalidRowsCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
              Invalid Rows
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/50 rounded-xl bg-card/50 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <div className="text-2xl font-semibold text-foreground">{duplicateWarnings}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
              Near Duplicates
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
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
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${!row.isValid ? "bg-red-500/5" : "hover:bg-muted/30"}`}
                >
                  <td className="px-4 py-3 text-muted-foreground font-mono">{row.rowNumber}</td>
                  <td className="px-4 py-3">
                    {row.isValid ? (
                      <span className="flex items-center text-emerald-500 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Valid
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500 font-medium">
                        <XCircle className="w-4 h-4 mr-1.5" /> Invalid
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
                    {row.errors && row.errors.length > 0 ? (
                      <ul className="list-disc list-inside text-red-500 space-y-1 text-xs">
                        {row.errors.map((err, i) => (
                          <li key={i} title={err} className="line-clamp-1">
                            {err}
                          </li>
                        ))}
                      </ul>
                    ) : row.duplicateCheck?.isNearDuplicate ? (
                      <div className="text-amber-500 text-xs flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Near Duplicate ({row.duplicateCheck.duplicateCode})
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
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
