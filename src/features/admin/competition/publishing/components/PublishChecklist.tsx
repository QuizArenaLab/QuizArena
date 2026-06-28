"use client";

import { ChecklistItem } from "../publishing/types/publishing.types";
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PublishChecklistProps {
  items: ChecklistItem[];
}

export function PublishChecklist({ items }: PublishChecklistProps) {
  const completeCount = items.filter((i) => i.status === "complete").length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-navy">Publish Checklist</h3>
        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
          {completeCount}/{items.length} Ready
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 flex items-start justify-between group hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {item.status === "complete" && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {item.status === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {item.status === "failed" && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                {item.status !== "complete" && item.failedItems && (
                  <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                    {item.failedItems.map((code) => (
                      <span key={code} className="font-mono bg-gray-100 px-1 rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {item.status !== "complete" && item.deepLink && (
              <Link
                href={item.deepLink}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all"
                title="Go to builder to fix"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
