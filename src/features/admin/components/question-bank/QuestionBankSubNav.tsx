"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Upload,
  Eye,
  FileEdit,
  CheckCircle2,
  Archive,
  ClipboardList,
} from "lucide-react";

const tabs = [
  { href: "/dashboard/admin/questions", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/questions/create", label: "Create", icon: Plus },
  { href: "/dashboard/admin/questions/import", label: "Import", icon: Upload },
  { href: "/dashboard/admin/questions/review", label: "Review", icon: Eye },
  { href: "/dashboard/admin/questions/drafts", label: "Drafts", icon: FileEdit },
  { href: "/dashboard/admin/questions/published", label: "Published", icon: CheckCircle2 },
  { href: "/dashboard/admin/questions/archive", label: "Archive", icon: Archive },
  { href: "/dashboard/admin/questions/import-jobs", label: "Import Jobs", icon: ClipboardList },
];

interface QuestionBankSubNavProps {
  reviewCount?: number;
}

export function QuestionBankSubNav({ reviewCount = 0 }: QuestionBankSubNavProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-1 px-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          const showBadge = tab.label === "Review" && reviewCount > 0;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap
                transition-all duration-200 border-b-2
                ${
                  isActive
                    ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50/50"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
              {tab.label}
              {showBadge && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full min-w-[18px] text-center leading-tight">
                  {reviewCount > 99 ? "99+" : reviewCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
