export const dynamic = "force-dynamic";

import { requireSuperAdmin } from "@/features/super-admin/services/governance";
import { getSubscriptionMetrics } from "@/features/super-admin/services/financial";
import { Users, Activity, XCircle, AlertTriangle } from "lucide-react";

export default async function SubscriptionsPage() {
  await requireSuperAdmin("/dashboard");

  const metrics = await getSubscriptionMetrics();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Subscription Governance
        </h2>
        <p className="text-sm text-slate-500">
          Monitor recurring revenue streams and churn patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Active</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics.active}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Past Due</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics.pastDue}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Canceled</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics.canceled}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total Audience</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.total}</div>
          </div>
        </div>
      </div>

      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Subscription Registry
        </h3>
        <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Future integration point for detailed user-by-user subscription tables and cohort
              analysis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
