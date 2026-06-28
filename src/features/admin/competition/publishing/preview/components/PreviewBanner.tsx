"use client";

import { X } from "lucide-react";
import { usePublishingStore } from "../../hooks/usePublishingStore";

export function PreviewBanner() {
  const setActiveTab = usePublishingStore((s) => s.setActiveTab);

  return (
    <div className="bg-amber-100 border-b border-amber-200 text-amber-900 px-4 py-2 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 font-semibold">
        <span className="text-lg">🔒</span> PREVIEW MODE — Read Only
      </div>
      <div className="text-sm">This is exactly how users will see the competition.</div>
      <button
        onClick={() => setActiveTab("overview")}
        className="p-1 hover:bg-amber-200 rounded text-amber-700"
      >
        <X size={18} />
      </button>
    </div>
  );
}
