"use client";

import { useState } from "react";
import { uploadAndPreviewImport } from "@/features/admin/services/bulk-import";
import { ValidatedRow } from "@/features/admin/services/question-bank/bulk-import";
import { ImportPreview } from "@/features/admin/components/question-bank/bulk-import/import-preview";
import { ImportHistory } from "@/features/admin/components/question-bank/bulk-import/import-history";
import { FileUp, FileSpreadsheet, FileText, AlertCircle, Loader2 } from "lucide-react";

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [previewJobId, setPreviewJobId] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<ValidatedRow[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadAndPreviewImport(formData);

    if (res.success && res.jobId && res.previewRows) {
      setPreviewJobId(res.jobId);
      setPreviewRows(res.previewRows);
    } else {
      setUploadError(res.error || "Failed to process file");
    }

    setIsUploading(false);
  };

  const handleCancelPreview = () => {
    setPreviewJobId(null);
    setPreviewRows([]);
    setFile(null);
  };

  const handleImportComplete = () => {
    setPreviewJobId(null);
    setPreviewRows([]);
    setFile(null);
    // The history component will refresh itself, or we can force it by triggering a state if needed
    // But since it's unmounted/remounted when previewJobId changes, it should refresh.
  };

  const downloadCSVTemplate = () => {
    const csvContent =
      'question,optionA,optionB,optionC,optionD,correctOption,explanation,category,subject,difficulty,tags,language\n"What is 2+2?","3","4","5","6","B","Basic math","Math","Arithmetic","BEGINNER","math,basic","en"';
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "quizarena_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Bulk Import Questions</h1>
        <p className="text-muted-foreground mt-2">
          Upload large batches of questions via CSV or XLSX. All imports enter as DRAFT and require
          admin approval.
        </p>
      </div>

      {previewJobId ? (
        <ImportPreview
          jobId={previewJobId}
          rows={previewRows}
          onComplete={handleImportComplete}
          onCancel={handleCancelPreview}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 border-2 border-dashed border-border/60 rounded-2xl bg-card/30 flex flex-col items-center justify-center text-center space-y-4 hover:bg-card/50 transition-colors">
              <div className="p-4 rounded-full bg-primary/10">
                <FileUp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Upload Question File</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Drag and drop your file here, or click to browse. Supported formats: .csv, .xlsx
                </p>
              </div>

              <div className="mt-4 flex flex-col items-center gap-3">
                <label className="cursor-pointer bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Select File
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv, .xlsx"
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <div className="text-sm text-foreground bg-muted/50 px-3 py-1.5 rounded-md flex items-center border border-border/50">
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            {uploadError && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md border border-destructive/20 flex flex-col gap-1">
                <h5 className="font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Upload Failed
                </h5>
                <p className="text-sm">{uploadError}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="px-6 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Preview Import"
                )}
              </button>
            </div>

            <div className="mt-8">
              <ImportHistory />
            </div>
          </div>

          {/* Guidelines & Templates */}
          <div className="space-y-6">
            <div className="p-6 border border-border/50 rounded-2xl bg-card/50">
              <h3 className="text-lg font-medium text-foreground mb-4">Templates</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use our standardized templates to ensure your upload passes validation.
              </p>
              <div className="space-y-3">
                <button
                  onClick={downloadCSVTemplate}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <FileText className="w-4 h-4 mr-3 text-blue-500" />
                    CSV Template
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground">
                    Download
                  </span>
                </button>
                <button
                  disabled
                  title="Coming soon"
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <FileSpreadsheet className="w-4 h-4 mr-3 text-emerald-500" />
                    XLSX Template
                  </div>
                  <span className="text-xs text-muted-foreground">Soon</span>
                </button>
              </div>
            </div>

            <div className="p-6 border border-border/50 rounded-2xl bg-card/50">
              <h3 className="text-lg font-medium text-foreground mb-4">Import Guidelines</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0"></span>
                  <strong>Headers are strict.</strong> Do not modify column names from the template.
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0"></span>
                  <strong>Options format:</strong> Provide A, B, C, and D for each question.
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0"></span>
                  <strong>Correct Option:</strong> Must be EXACTLY A, B, C, or D.
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0"></span>
                  <strong>Difficulty:</strong> Must be BEGINNER, MEDIUM, or HARDCORE.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
