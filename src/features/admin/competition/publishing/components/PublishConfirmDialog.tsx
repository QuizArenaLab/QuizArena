"use client";

import { usePublishingStore } from "../hooks/usePublishingStore";
import { ChecklistItem } from "../publishing/types/publishing.types";
import { X, Send, Calendar, AlertTriangle } from "lucide-react";

interface PublishConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  checklist: ChecklistItem[];
}

export function PublishConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  checklist,
}: PublishConfirmDialogProps) {
  const config = usePublishingStore((s) => s.config);
  const setConfig = usePublishingStore((s) => s.setConfig);
  const isSubmitting = usePublishingStore((s) => s.isSubmitting);
  const lock = usePublishingStore((s) => s.publishingLock);

  if (!isOpen) return null;

  const incompleteItems = checklist.filter((i) => i.status !== "complete").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-navy flex items-center gap-2">
            {config.mode === "IMMEDIATE" ? "Confirm Publication" : "Confirm Schedule"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 text-sm">
            <p className="font-medium">
              This action will make the competition available to users{" "}
              {config.mode === "IMMEDIATE" ? "immediately" : `on ${config.scheduledDate}`}.
            </p>
          </div>

          {incompleteItems > 0 && (
            <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 text-sm">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold mb-1">Checklist Warnings Present</p>
                <p>
                  There are {incompleteItems} non-blocking warnings in your checklist. Are you sure
                  you want to proceed without addressing them?
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Version Changelog <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary min-h-[100px]"
              placeholder="Describe what's new or changed in this version..."
              value={config.changelog}
              onChange={(e) => setConfig({ changelog: e.target.value })}
              required
            />
          </div>

          {lock && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded text-center">
              Acquiring publishing lock as {lock.userName}...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting || config.changelog.trim().length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : config.mode === "IMMEDIATE" ? (
              <>
                <Send className="w-4 h-4" /> Publish Now
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" /> Schedule
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
