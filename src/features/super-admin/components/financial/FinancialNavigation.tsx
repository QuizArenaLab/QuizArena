"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, CreditCard, Receipt, LineChart } from "lucide-react";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard/super-admin/financial",
    icon: BarChart3,
  },
  {
    name: "Subscriptions",
    href: "/dashboard/super-admin/financial/subscriptions",
    icon: CreditCard,
  },
  {
    name: "Transactions",
    href: "/dashboard/super-admin/financial/transactions",
    icon: Receipt,
  },
  {
    name: "Analytics",
    href: "/dashboard/super-admin/financial/analytics",
    icon: LineChart,
  },
];

export function FinancialNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto scrollbar-hide">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
              isActive
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-emerald-500" : "text-slate-400")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
