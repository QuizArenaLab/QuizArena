"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface MaintenanceFallbackProps {
  message?: string;
}

export function MaintenanceFallback({ message }: MaintenanceFallbackProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>

        <h1 className="text-2xl font-bold text-[#0A1C40] mb-3">Platform Maintenance</h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {message ||
            "QuizArena is currently undergoing scheduled maintenance to improve our infrastructure. We'll be back shortly."}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Admin Sign In Bypass
          </Link>
          <span className="text-xs text-gray-400">For operational governance personnel only</span>
        </div>
      </div>
    </div>
  );
}
