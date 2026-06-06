"use client";

import { useState } from "react";
import { uploadAndPreviewImport } from "@/features/admin/services/bulk-import";
import { ValidatedRow } from "@/features/admin/services/question-bank/bulk-import";
import { ImportPreview } from "@/features/admin/components/question-bank/bulk-import/import-preview";
import { ImportHistory } from "@/features/admin/components/question-bank/bulk-import/import-history";
import { FileUp, FileSpreadsheet, FileText, AlertCircle, Loader2, CheckCircle2, ArrowRight, Check, Download } from "lucide-react";

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [previewJobId, setPreviewJobId] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<ValidatedRow[]>([]);
  const [stats, setStats] = useState<{ total: number; valid: number; invalid: number } | null>(null);

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
      setStats({
        total: res.totalRows ?? 0,
        valid: res.validRows ?? 0,
        invalid: res.invalidRows ?? 0,
      });
    } else {
      setUploadError(res.error || "Failed to process file");
    }

    setIsUploading(false);
  };

  const handleCancelPreview = () => {
    setPreviewJobId(null);
    setPreviewRows([]);
    setStats(null);
    setFile(null);
  };

  const handleImportComplete = () => {
    setPreviewJobId(null);
    setPreviewRows([]);
    setStats(null);
    setFile(null);
  };

  const downloadCSVTemplate = () => {
    const csvContent =
      'question,optionA,optionB,optionC,optionD,optionE,optionF,correctOption,explanation,category,subject,topic,difficulty,marks,negativeMarks,tags,language\n"What is the capital of France?","London","Berlin","Paris","Madrid","Rome","Lisbon","C","Paris is the capital of France.","General Knowledge","Geography","Capitals","BEGINNER","1","0","geography,europe","en"';
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bulk Import Questions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload large question datasets via CSV. All imports enter as Draft and require admin approval.
        </p>
      </div>

      {/* Draft-First Rule Banner (Horizontal Workflow) */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl overflow-x-auto">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 whitespace-nowrap px-2">
          <span className="text-gray-900">Draft Publishing Workflow:</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-gray-500 whitespace-nowrap">
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">Imported Questions</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">Draft</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">Review</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">Approve</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shadow-sm font-bold">Published</span>
        </div>
      </div>

      {previewJobId ? (
        <>
          {/* Preview Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-gray-800 tabular-nums">{stats.total}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Total Rows</p>
              </div>
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700 tabular-nums">{stats.valid}</p>
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mt-1">Valid Rows</p>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
                <p className="text-2xl font-bold text-red-700 tabular-nums">{stats.invalid}</p>
                <p className="text-xs font-medium text-red-600 uppercase tracking-wider mt-1">Invalid Rows</p>
              </div>
            </div>
          )}
          <ImportPreview
            jobId={previewJobId}
            rows={previewRows}
            onComplete={handleImportComplete}
            onCancel={handleCancelPreview}
          />
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group p-10 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-center hover:bg-white hover:border-primary/50 transition-all duration-300">
              <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
                <FileUp className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload Question Dataset</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mb-6">
                  Drag & drop CSV file or browse below
                </p>
                <label className="cursor-pointer btn btn-primary h-11 px-6 shadow-sm relative z-10 inline-flex items-center">
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload Question File
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </label>
                <div className="flex items-center justify-center gap-3 mt-6 text-xs font-medium text-gray-400">
                  <span className="px-2 py-1 bg-white border border-gray-200 rounded-md">Supported: CSV</span>
                  <span className="px-2 py-1 bg-white border border-gray-200 rounded-md">Maximum Size: 10 MB</span>
                </div>
              </div>

              {/* Absolute hidden file input covering the dropzone for easy click area */}
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".csv"
                onChange={handleFileChange}
                title="Select CSV file"
              />
            </div>

            {/* Selected File Feedback & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex-1 w-full flex items-center gap-3">
                {file ? (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-900 truncate" title={file.name}>{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <FileSpreadsheet className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">No file selected</p>
                      <p className="text-xs text-gray-400">Select a file to preview</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end w-full sm:w-auto">
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="btn btn-outline h-11 px-6 shadow-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:shadow-none transition-all flex-1 sm:flex-none flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Preview Import
                </button>
              </div>
            </div>

            {uploadError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h5 className="font-semibold text-sm">Upload Failed</h5>
                  <p className="text-sm mt-0.5">{uploadError}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <ImportHistory />
            </div>
          </div>

          {/* Guidelines & Templates */}
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Templates</h3>
              <div className="space-y-3">
                <button
                  onClick={downloadCSVTemplate}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center text-sm font-bold text-gray-900">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    CSV Template
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                      <Download className="w-4 h-4" />
                    </span>
                  </div>
                </button>

                <button
                  disabled
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                      <FileSpreadsheet className="w-4 h-4 text-gray-400" />
                    </div>
                    XLSX Template
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 rounded">
                    Coming Soon
                  </span>
                </button>
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                Import Rules
              </h3>
              <ul className="space-y-3">
                {[
                  "Use official template only",
                  "Options must contain A, B, C, D",
                  "Correct answer must match one option",
                  "Difficulty: BEGINNER / MEDIUM / HARDCORE",
                  "Empty rows are ignored",
                  "Duplicate questions are flagged"
                ].map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-tight">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
