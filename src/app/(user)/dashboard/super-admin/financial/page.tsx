import { requireSuperAdmin } from "@/features/super-admin/services/governance";
import {
  getRevenueOverview,
  getSubscriptionMetrics,
  getFinancialAlerts,
  generateBusinessInsights,
} from "@/features/super-admin/services/financial";
import { RevenueTrendChart } from "@/features/super-admin/components/financial/RevenueTrendChart";
import { FinancialAlertBanner } from "@/features/super-admin/components/financial/FinancialAlertBanner";
import { DollarSign, Users, ArrowUpRight, TrendingUp } from "lucide-react";

export default async function FinancialOverviewPage() {
  await requireSuperAdmin("/dashboard");

  const [revenueOverview, subscriptionMetrics, alerts, insights] = await Promise.all([
    getRevenueOverview(),
    getSubscriptionMetrics(),
    getFinancialAlerts(),
    generateBusinessInsights(),
  ]);

  return (
    <div className="space-y-6">
      {alerts.length > 0 && (
        <section>
          <FinancialAlertBanner alerts={alerts} />
        </section>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
            <h3 className="text-sm font-medium tracking-tight uppercase">Monthly Recurring Rev</h3>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ${revenueOverview.mrr.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />+{revenueOverview.growthRate || 0}% from last
            month
          </div>
          <div className="absolute -bottom-6 -right-6 text-slate-100 dark:text-slate-800 opacity-50 pointer-events-none">
            <DollarSign className="w-32 h-32" />
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
            <h3 className="text-sm font-medium tracking-tight uppercase">Total Lifetime Revenue</h3>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ${revenueOverview.totalRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-sm font-medium text-slate-500">
            Stable historical accumulation
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
            <h3 className="text-sm font-medium tracking-tight uppercase">Active Subscriptions</h3>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {subscriptionMetrics.active.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-sm font-medium text-rose-600 dark:text-rose-400">
            Churn Rate: {subscriptionMetrics.churnRate}%
          </div>
        </div>

        <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-4">
            <h3 className="text-sm font-semibold tracking-tight uppercase">
              Business Intelligence
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Rev Health:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {insights.revenueHealth}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Churn Risk:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {insights.churnHealth}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Tx Reliability:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {insights.transactionReliability}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
              Revenue Trajectory
            </h2>
            <p className="text-sm text-slate-500">Executive view of monetization performance</p>
          </div>

          <RevenueTrendChart growthRate={revenueOverview.growthRate} />
        </section>

        <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight mb-4">
            Strategic Advisory
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-emerald-500 pl-4 py-1 italic">
            &quot;{insights.recommendation}&quot;
          </p>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Server-Authoritative Logs
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Payments
                processed locally
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Financial ledger
                verified
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Subscriptions
                synced
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
