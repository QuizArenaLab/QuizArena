"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Clock, CheckCircle2, XCircle, Flag, Archive } from "lucide-react";

const TABS = [
  { id: "REVIEW", label: "Pending Review", icon: Clock },
  { id: "APPROVED", label: "Recently Approved", icon: CheckCircle2 },
  { id: "REJECTED", label: "Rejected", icon: XCircle },
  { id: "FLAGGED", label: "Flagged", icon: Flag },
  { id: "ARCHIVED", label: "Archived", icon: Archive },
];

export function ReviewQueueTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentTab = searchParams.get("status") || "REVIEW";

  return (
    <div className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.id}
            href={`${pathname}?status=${tab.id}`}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
              ${
                isActive
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-indigo-500" : "text-gray-400"}`} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
