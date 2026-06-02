import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SubscriptionPrompt({
  title = "Unlock Your Full Potential",
  description = "Get access to hardcore challenges, deep analytics, and premium tournaments with QuizArena Premium.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-navy via-navy-light to-indigo-900 p-8 text-white shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-300" />
            <span className="text-sm font-semibold tracking-widest text-indigo-300 uppercase">
              QuizArena Premium
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-display mb-3">{title}</h3>
          <p className="text-indigo-100 max-w-xl text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/dashboard/subscription"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-navy bg-white rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Upgrade Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
