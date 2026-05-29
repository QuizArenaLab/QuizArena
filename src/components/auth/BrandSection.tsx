"use client";

import { TrendingUp, Target, BarChart3, Users } from "lucide-react";
import Image from "next/image";

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
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] max-w-[15ch]">
              Serious preparation for
              <span className="text-primary-light"> serious goals</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              A competitive practice platform designed for aspirants who understand that daily
              discipline beats last-minute cramming.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/20 hover:bg-white/15 hover:border-white/40 hover:translate-y-[-2px] transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-200">
                <feature.icon
                  className="h-5 w-5 text-white group-hover:text-primary-light transition-colors duration-200"
                  strokeWidth={2.5}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-[15px] font-bold text-white tracking-wide">{feature.title}</h3>
                <p className="text-[13px] font-medium text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-8 lg:left-16 xl:left-24 right-8 pt-8 border-t border-white/10"></div>
    </div>
  );
}
