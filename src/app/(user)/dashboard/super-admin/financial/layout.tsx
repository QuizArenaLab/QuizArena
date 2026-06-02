import { requireSuperAdmin } from "@/features/super-admin/services/governance";
import { FinancialNavigation } from "@/features/super-admin/components/financial/FinancialNavigation";

export const metadata = {
  title: "Financial Governance | Super Admin",
  description: "Sovereign financial & revenue control center.",
};

export default async function FinancialLayout({ children }: { children: React.ReactNode }) {
  // STRICT ISOLATION: Validate Super Admin authority before rendering ANY child layout
  await requireSuperAdmin("/dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-hanken">
            Financial Governance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Executive revenue operations and monetization control.
          </p>
        </div>
      </div>

      <FinancialNavigation />

      <main>{children}</main>
    </div>
  );
}
