import { requireSuperAdmin } from "@/lib/super-admin/governance";
import { getTransactionHealth } from "@/lib/super-admin/financial";
import { CheckCircle2, AlertCircle, Clock, RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  await requireSuperAdmin("/dashboard");

  const txHealth = await getTransactionHealth();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Transaction Intelligence
        </h2>
        <p className="text-sm text-slate-500">
          Monitor payment provider health and operational transaction flow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Completed
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-50">
              {txHealth.completed}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Pending</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {txHealth.pending}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-rose-800 dark:text-rose-300">Failed</div>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-50">
              {txHealth.failed}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Refunded</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {txHealth.refunded}
            </div>
          </div>
        </div>
      </div>

      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Transaction Ledger
        </h3>
        <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Future integration point for real-time Stripe/Razorpay webhooks and raw transaction
              logs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
