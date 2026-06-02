import { requireSuperAdmin } from "@/features/super-admin/services/governance";
import { generateBusinessInsights } from "@/features/super-admin/services/financial";
import { LineChart, Zap, TrendingUp } from "lucide-react";

export default async function FinancialAnalyticsPage() {
  await requireSuperAdmin("/dashboard");

  const insights = await generateBusinessInsights();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Monetization Analytics
        </h2>
        <p className="text-sm text-slate-500">
          Strategic business intelligence and predictive financial modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
              Revenue Trajectory
            </h3>
            <p className="text-sm text-slate-500 mt-1">Current health based on 30-day velocity</p>
          </div>
          <div className="text-lg font-medium text-slate-900 dark:text-white">
            Status:{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {insights.revenueHealth}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
              Churn Risk Profile
            </h3>
            <p className="text-sm text-slate-500 mt-1">Retention stability assessment</p>
          </div>
          <div className="text-lg font-medium text-slate-900 dark:text-white">
            Status:{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {insights.churnHealth}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
              Transaction Flow
            </h3>
            <p className="text-sm text-slate-500 mt-1">Infrastructure payment reliability</p>
          </div>
          <div className="text-lg font-medium text-slate-900 dark:text-white">
            Status:{" "}
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              {insights.transactionReliability}
            </span>
          </div>
        </div>
      </div>

      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Cohort Analysis & Forecasting
        </h3>
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Future integration point for advanced predictive financial modeling and user cohort
              intelligence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
