"use client";

import { TrendingUp, Target, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Daily Competitive Practice",
    description: "Challenge yourself with exam-standard questions every day",
  },
  {
    icon: TrendingUp,
    title: "National Benchmarking",
    description: "See where you stand among aspirants across the country",
  },
  {
    icon: BarChart3,
    title: "Weakness Tracking",
    description: "Identify and improve your problem areas systematically",
  },
  {
    icon: Users,
    title: "Discipline Systems",
    description: "Build consistent preparation habits that compound over time",
  },
];

export default function BrandSection() {
  return (
    <div className="relative flex flex-col justify-center h-full p-8 lg:p-16 xl:p-24 max-w-2xl">
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-md border border-white/10">
              <svg
                className="h-6 w-6 text-primary-light"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">QuizArena</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] max-w-[15ch]">
              Serious preparation for
              <span className="text-primary-light"> serious goals</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              A competitive practice platform designed for aspirants who understand
              that daily discipline beats last-minute cramming.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl bg-white/3 backdrop-blur-md p-4 border border-white/10 hover:bg-white/6 transition-all duration-300 group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                <feature.icon className="h-5 w-5 text-primary-light" strokeWidth={2} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-white/90">{feature.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-8 lg:left-16 xl:left-24 right-8 pt-8 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-navy bg-navy-light flex items-center justify-center text-[10px] text-white/40">
                U
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 font-medium">
            Join 10,000+ serious aspirants today
          </p>
        </div>
      </div>
    </div>
  );
}

