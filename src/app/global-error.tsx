"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { ROUTES } from '@/constants/routes';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Platform Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Platform Exception</h1>
            <p className="text-slate-500 mb-8">
              A critical error occurred in the platform. Our engineering team has been notified.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="bg-slate-100 p-4 rounded-xl text-left overflow-auto text-xs font-mono text-slate-800 mb-8 max-h-48">
                {error.message}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                Recover Session
              </button>
              <Link
                href={ROUTES.PUBLIC.HOME}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3.5 rounded-xl font-semibold transition-all"
              >
                <Home className="w-4 h-4" />
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
