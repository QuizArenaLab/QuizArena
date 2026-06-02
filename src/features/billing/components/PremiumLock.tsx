import React from "react";
import { Lock } from "lucide-react";

export function PremiumLock({
  children,
  isLocked,
  title = "Premium Content",
}: {
  children: React.ReactNode;
  isLocked: boolean;
  title?: string;
}) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-xl border border-navy/10">
      <div className="filter blur-md opacity-40 select-none pointer-events-none transition-all duration-300">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-navy mb-2 font-display">{title}</h3>
        <p className="text-sm text-gray-600 max-w-sm mb-6">
          Upgrade your subscription to unlock this premium challenge and gain a competitive edge.
        </p>
        <a
          href="/dashboard/subscription"
          className="px-6 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light transition-colors"
        >
          View Plans
        </a>
      </div>
    </div>
  );
}
