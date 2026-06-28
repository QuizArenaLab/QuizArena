"use client";

import { CompetitionVersionInfo } from "../versioning/types/versioning.types";
import { X, ArrowRightLeft, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: CompetitionVersionInfo[];
  onRollback: (versionNumber: number) => void;
}

export function VersionHistoryDrawer({
  isOpen,
  onClose,
  versions,
  onRollback,
}: VersionHistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col transform transition-transform">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-navy flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" /> Version History
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {versions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-10">No versions published yet.</p>
        ) : (
          <div className="space-y-4">
            {versions.map((v) => (
              <div
                key={v.id}
                className={`border rounded-xl p-4 transition-colors ${v.isActive ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200 bg-white hover:bg-gray-50"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-navy">v{v.versionNumber}</span>
                      {v.isActive && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full">
                          Live Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {v.publishedAt
                        ? formatDistanceToNow(new Date(v.publishedAt), { addSuffix: true })
                        : "Unknown time"}
                      {" by "}
                      <span className="font-medium text-gray-700">
                        {v.publishedBy?.name || "System"}
                      </span>
                    </div>
                  </div>

                  {!v.isActive && (
                    <button
                      onClick={() => onRollback(v.versionNumber)}
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="Rollback to this version"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 italic">
                  {v.changelog || "No changelog provided."}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
